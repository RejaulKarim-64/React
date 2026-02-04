# React - Best Practices and Patterns

## Table of Contents
1. [Component Design Patterns](#component-design-patterns)
2. [State Management Patterns](#state-management-patterns)
3. [Performance Best Practices](#performance-best-practices)
4. [Code Organization](#code-organization)
5. [Naming Conventions](#naming-conventions)
6. [Error Handling](#error-handling)
7. [Security Best Practices](#security-best-practices)
8. [Accessibility](#accessibility)
9. [Testing Best Practices](#testing-best-practices)
10. [Common Anti-Patterns](#common-anti-patterns)

---

## Component Design Patterns

### 1. Single Responsibility Principle

```jsx
// ❌ BAD - Component does too much
function UserCard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUser().then(setUser)
  }, [])

  if (loading) return <Spinner />
  if (error) return <Error message={error} />

  return (
    <div className="card">
      <Avatar src={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
      <UserStats posts={user.posts} followers={user.followers} />
      <ActionButton onFollow={() => {}} />
    </div>
  )
}

// ✅ GOOD - Separated concerns
function UserCard() {
  const { user, loading, error } = useUser()

  if (loading) return <Spinner />
  if (error) return <Error message={error} />

  return (
    <div className="card">
      <Avatar src={user.avatar} />
      <UserInfo name={user.name} email={user.email} />
      <UserStats posts={user.posts} followers={user.followers} />
      <FollowButton userId={user.id} />
    </div>
  )
}

// Custom hook for data fetching
function useUser() {
  const [state, setState] = useState({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchUser()
      .then(user => setState({ user, loading: false, error: null }))
      .catch(error => setState({ user: null, loading: false, error }))
  }, [])

  return state
}
```

### 2. Compound Components Pattern

```jsx
// ✅ GOOD - Compound components
import { useContext } from 'react'

const ListContext = createContext()

function List({ children, items }) {
  return (
    <ListContext.Provider value={{ items }}>
      <ul>{children}</ul>
    </ListContext.Provider>
  )
}

function ListItem({ index, render }) {
  const { items } = useContext(ListContext)
  const item = items[index]

  if (!item) return null

  return <li>{render(item)}</li>
}

// Usage
<List items={users}>
  <ListItem index={0} render={(user) => <strong>{user.name}</strong>} />
  <ListItem index={1} render={(user) => <em>{user.name}</em>} />
</List>
```

### 3. Render Props Pattern

```jsx
// ✅ GOOD - Render props for flexibility
function DataFetcher({ url, render, loadingRender, errorRender }) {
  const { data, loading, error } = useFetch(url)

  if (loading) return loadingRender?.()
  if (error) return errorRender?.(error)

  return render(data)
}

// Usage
<DataFetcher
  url="/api/users"
  loadingRender={() => <Spinner />}
  errorRender={(err) => <Error message={err.message} />}
  render={(users) => <UserList users={users} />}
/>
```

### 4. Higher-Order Components (HOC)

```jsx
// ✅ GOOD - HOC for cross-cutting concerns
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
      return <Navigate to="/login" />
    }

    return <WrappedComponent {...props} />
  }
}

// Usage
const ProtectedDashboard = withAuth(Dashboard)
```

### 5. Container/Presentational Pattern

```jsx
// Presentational Component (UI only)
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
          />
          <span className={todo.completed ? 'line-through' : ''}>
            {todo.text}
          </span>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}

// Container Component (logic & data)
function TodoListContainer() {
  const { data: todos } = useQuery(['todos'], fetchTodos)
  const toggleMutation = useMutation(toggleTodo)
  const deleteMutation = useMutation(deleteTodo)

  const handleToggle = (id) => {
    toggleMutation.mutate(id)
  }

  const handleDelete = (id) => {
    deleteMutation.mutate(id)
  }

  return (
    <TodoList
      todos={todos}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  )
}
```

---

## State Management Patterns

### 1. Lift State Up

```jsx
// ✅ GOOD - State in parent
function Parent() {
  const [value, setValue] = useState('')

  return (
    <>
      <ChildA value={value} onChange={setValue} />
      <ChildB value={value} />
    </>
  )
}

// ❌ BAD - Duplicated state
function Parent() {
  return (
    <>
      <ChildA />
      <ChildB />
    </>
  )
}
```

### 2. Colocate Related State

```jsx
// ✅ GOOD - Related state together
function UserForm() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: 'user',
  })

  const handleChange = (field) => (value) => {
    setUser(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form>
      <Input value={user.name} onChange={handleChange('name')} />
      <Input value={user.email} onChange={handleChange('email')} />
      <Select value={user.role} onChange={handleChange('role')} />
    </form>
  )
}
```

### 3. Use Reducer for Complex State

```jsx
// ✅ GOOD - useReducer for complex state logic
function todoReducer(state, action) {
  switch (action.type) {
    case 'add':
      return { ...state, todos: [...state.todos, action.todo] }
    case 'toggle':
      return {
        ...state,
        todos: state.todos.map(t =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        )
      }
    case 'filter':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all'
  })

  const filteredTodos = useMemo(() => {
    switch (state.filter) {
      case 'active': return state.todos.filter(t => !t.completed)
      case 'completed': return state.todos.filter(t => t.completed)
      default: return state.todos
    }
  }, [state.todos, state.filter])

  return (
    <div>
      <button onClick={() => dispatch({ type: 'filter', filter: 'active' })}>
        Active
      </button>
      <TodoList todos={filteredTodos} onToggle={(id) =>
        dispatch({ type: 'toggle', id })
      } />
    </div>
  )
}
```

---

## Performance Best Practices

### 1. Memoize Expensive Calculations

```jsx
// ✅ GOOD - useMemo for expensive operations
function ExpensiveComponent({ items, filter }) {
  const filteredItems = useMemo(() => {
    console.log('Filtering items...')
    return items.filter(item => item.category === filter)
  }, [items, filter])

  const sortedItems = useMemo(() => {
    console.log('Sorting items...')
    return [...filteredItems].sort((a, b) => a.price - b.price)
  }, [filteredItems])

  return <ul>{sortedItems.map(item => <li key={item.id}>{item.name}</li>)}</ul>
}
```

### 2. Memoize Callbacks

```jsx
// ✅ GOOD - useCallback to prevent child re-renders
const Parent = () => {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    console.log('Clicked')
  }, []) // Only created once

  return <Child onClick={handleClick} />
}

const Child = memo(function Child({ onClick }) {
  console.log('Child rendered')
  return <button onClick={onClick}>Click</button>
})
```

### 3. Virtualize Long Lists

```jsx
// ✅ GOOD - Use react-window for long lists
import { FixedSizeList } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  )
}
```

### 4. Lazy Load Components

```jsx
// ✅ GOOD - Lazy load routes
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  )
}
```

---

## Code Organization

### 1. Barrel Exports

```jsx
// components/ui/index.js
export { Button } from './Button'
export { Input } from './Input'
export { Card } from './Card'
export { Modal } from './Modal'

// Usage
import { Button, Input, Card } from '@/components/ui'
```

### 2. Feature-Based Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   ├── todos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

### 3. Absolute Imports

```javascript
// vite.config.js
export default {
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@services': '/src/services',
    }
  }
}

// Usage
import Button from '@components/ui/Button'
import { useAuth } from '@hooks/useAuth'
import { formatDate } from '@utils/formatters'
```

---

## Naming Conventions

### 1. Component Naming

```jsx
// ✅ GOOD - PascalCase for components
function UserProfileCard() { ... }
const APIKeyInput = () => { ... }

// ✅ GOOD - Descriptive names
function UserAuthenticationForm() { ... }
// ❌ BAD - Abbreviated
function UserAuthForm() { ... }
```

### 2. File Naming

```
// ✅ GOOD - Component files
UserProfileCard.jsx
userProfileCard.module.css
useUserProfile.js

// ✅ GOOD - Consistent casing
components/
├── UserProfileCard.jsx
├── TodoList.jsx
└── apiClient.js
```

### 3. Event Handler Naming

```jsx
// ✅ GOOD - Clear action names
const handleSubmit = () => { ... }
const handleUserClick = () => { ... }
const handleInputChange = () => { ... }

// ❌ BAD - Vague names
const submit = () => { ... }
const click = () => { ... }
const onChange = () => { ... }
```

### 4. Boolean Props

```jsx
// ✅ GOOD - Prefix with is/has/show
<Button isLoading={true} />
<Modal hasCloseButton={true} />
<Dropdown showMenu={false} />

// ❌ BAD - Unclear booleans
<Button loading={true} />
<Modal closeButton={true} />
<Dropdown menu={false} />
```

---

## Error Handling

### 1. Error Boundaries

```jsx
// ✅ GOOD - Catch component errors
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### 2. API Error Handling

```jsx
// ✅ GOOD - Consistent error handling
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }

    return await response.json()
  } catch (error) {
    // Log error
    console.error('API Error:', error)

    // Re-throw for component to handle
    throw error
  }
}

// In component
const { data, error } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetchWithErrorHandling('/api/data'),
  retry: (failureCount, error) => {
    // Don't retry on 4xx errors
    if (error.status >= 400 && error.status < 500) return false
    return failureCount < 3
  }
})
```

### 3. Form Validation Errors

```jsx
// ✅ GOOD - Clear error messages
function useForm(fields) {
  const [values, setValues] = useState(fields)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}

    if (!values.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!values.password) {
      newErrors.password = 'Password is required'
    } else if (values.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { values, errors, validate, setValues }
}
```

---

## Security Best Practices

### 1. Sanitize User Input

```jsx
// ✅ GOOD - Sanitize HTML
import DOMPurify from 'dompurify'

function UserContent({ html }) {
  const cleanHtml = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
}
```

### 2. Secure Authentication

```jsx
// ✅ GOOD - Secure token storage
// Use httpOnly cookies (server-side)
// If using localStorage, encrypt tokens

function setSecureToken(token) {
  // Store in memory (most secure)
  // or httpOnly cookie (server set)
  // Never in localStorage without encryption
}
```

### 3. Prevent XSS Attacks

```jsx
// ❌ BAD - Vulnerable to XSS
function Comment({ text }) {
  return <div>{text}</div> // If text contains <script>, it will execute
}

// ✅ GOOD - React escapes by default
function Comment({ text }) {
  return <div>{text}</div> // React automatically escapes
}

// ✅ GOOD - When using dangerouslySetInnerHTML
import DOMPurify from 'dompurify'

function Comment({ html }) {
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

---

## Accessibility

### 1. Semantic HTML

```jsx
// ✅ GOOD - Semantic elements
function Page() {
  return (
    <>
      <header>
        <nav>
          <a href="/">Home</a>
        </nav>
      </header>
      <main>
        <article>
          <h1>Article Title</h1>
          <p>Content...</p>
        </article>
      </main>
      <footer>
        <p>&copy; 2024</p>
      </footer>
    </>
  )
}
```

### 2. ARIA Labels

```jsx
// ✅ GOOD - Accessible buttons
function IconButton({ icon, label, ...props }) {
  return (
    <button aria-label={label} {...props}>
      {icon}
    </button>
  )
}

// Usage
<IconButton icon={<CloseIcon />} label="Close dialog" />
```

### 3. Keyboard Navigation

```jsx
// ✅ GOOD - Keyboard accessible
function Modal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose()
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <h2 id="dialog-title">Dialog Title</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}
```

---

## Testing Best Practices

### 1. Test User Behavior

```jsx
// ✅ GOOD - Test what users see/do
test('user can add a todo', () => {
  render(<TodoApp />)

  const input = screen.getByLabelText(/add todo/i)
  const button = screen.getByRole('button', { name: /add/i })

  fireEvent.change(input, { target: { value: 'Buy milk' } })
  fireEvent.click(button)

  expect(screen.getByText('Buy milk')).toBeInTheDocument()
})
```

### 2. Test Loading/Error States

```jsx
// ✅ GOOD - Test different states
test('shows loading state while fetching', () => {
  render(<UserProfile userId="1" />)

  expect(screen.getByTestId('loader')).toBeInTheDocument()
})

test('shows error message on fetch failure', async () => {
  server.use(
    rest.get('/api/users/1', (req, res, ctx) => {
      return res(ctx.status(500))
    })
  )

  render(<UserProfile userId="1" />)

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
```

---

## Common Anti-Patterns

### 1. Don't Mutate State Directly

```jsx
// ❌ BAD - Direct mutation
const [items, setItems] = useState([])
items.push(newItem) // Wrong!

// ✅ GOOD - Create new array
const [items, setItems] = useState([])
setItems([...items, newItem]) // Correct!
```

### 2. Don't Use useEffect for Everything

```jsx
// ❌ BAD - Unnecessary useEffect
function Form() {
  const [name, setName] = useState('')

  useEffect(() => {
    if (name) {
      localStorage.setItem('name', name)
    }
  }, [name])

  return <input value={name} onChange={(e) => setName(e.target.value)} />
}

// ✅ GOOD - Use event handler
function Form() {
  const [name, setName] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setName(value)
    localStorage.setItem('name', value)
  }

  return <input value={name} onChange={handleChange} />
}
```

### 3. Don't Create Components Inside render

```jsx
// ❌ BAD - Component created on every render
function List({ items }) {
  const Item = ({ item }) => <li>{item.name}</li>
  return <ul>{items.map(item => <Item key={item.id} item={item} />)}</ul>
}

// ✅ GOOD - Component defined outside
function Item({ item }) {
  return <li>{item.name}</li>
}

function List({ items }) {
  return <ul>{items.map(item => <Item key={item.id} item={item} />)}</ul>
}
```

### 4. Don't Over-optimize

```jsx
// ❌ BAD - Unnecessary optimization
function SimpleButton({ onClick, children }) {
  const handleClick = useCallback(() => {
    onClick()
  }, [onClick]) // Not needed!

  return <button onClick={handleClick}>{children}</button>
}

// ✅ GOOD - Keep it simple
function SimpleButton({ onClick, children }) {
  return <button onClick={onClick}>{children}</button>
}
```

---

## Summary

### Key Best Practices:

1. **Keep components small and focused**
2. **Use custom hooks for reusable logic**
3. **Colocate related code**
4. **Follow naming conventions consistently**
5. **Handle errors gracefully**
6. **Write tests for user behavior**
7. **Optimize only when needed**
8. **Prioritize accessibility**
9. **Sanitize user input**
10. **Use TypeScript when possible**

---

## Next Steps

- [Common Dependencies](./10-common-dependencies.md)
- [Deployment](./11-deployment.md)
