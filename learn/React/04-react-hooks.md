# React Hooks - Complete Guide

## Table of Contents
1. [What are Hooks?](#what-are-hooks)
2. [Rules of Hooks](#rules-of-hooks)
3. [useState](#usestate)
4. [useEffect](#useeffect)
5. [useContext](#usecontext)
6. [useRef](#useref)
7. [useMemo](#usememo)
8. [useCallback](#usecallback)
9. [Custom Hooks](#custom-hooks)
10. [Practice Exercises](#practice-exercises)

---

## What are Hooks?

**Hooks** are functions that let you "hook into" React state and lifecycle features from function components.

### Why Hooks?

- **Before Hooks**: Stateful logic required class components
- **With Hooks**: Use state and other features without classes
- **Reusable**: Share stateful logic between components

### Available Hooks:

| Hook | Purpose |
|------|---------|
| `useState` | Manage component state |
| `useEffect` | Handle side effects |
| `useContext` | Access context values |
| `useRef` | Persist values across renders |
| `useMemo` | Memoize expensive calculations |
| `useCallback` | Memoize functions |
| `useReducer` | Manage complex state logic |
| `useTransition` | Mark non-urgent updates |
| `useDeferredValue` | Defer updating less important parts |

---

## Rules of Hooks

### Rule 1: Only Call Hooks at the Top Level

```jsx
// ✅ CORRECT
function GoodComponent() {
  const [count, setCount] = useState(0)
  useEffect(() => { ... })
  return <div>{count}</div>
}

// ❌ WRONG - Inside condition
function BadComponent() {
  if (someCondition) {
    const [count, setCount] = useState(0)
  }
  return <div></div>
}

// ❌ WRONG - Inside loop
function BadComponent() {
  for (let i = 0; i < 5; i++) {
    useEffect(() => { ... })
  }
  return <div></div>
}
```

### Rule 2: Only Call Hooks from React Functions

```jsx
// ✅ CORRECT - In React component
function MyComponent() {
  const [state, setState] = useState(0)
  return <div>{state}</div>
}

// ✅ CORRECT - In custom hook
function useCustomHook() {
  const [state, setState] = useState(0)
  return state
}

// ❌ WRONG - In regular JavaScript function
function regularFunction() {
  const [state, setState] = useState(0) // Error!
}
```

---

## useState

Quick recap of useState:

```jsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

**See [State and Props](./03-state-and-props.md) for more details.**

---

## useEffect

### What are Side Effects?

**Side effects** are operations that affect something outside the component:
- API calls
- DOM manipulation
- Subscriptions
- Timers
- Logging

### Basic Syntax

```jsx
useEffect(() => {
  // Effect code here

  return () => {
    // Cleanup code (optional)
  }
}, [dependencies])
```

### No Dependencies (Runs Every Render)

```jsx
function Example() {
  useEffect(() => {
    console.log("Component rendered!")
  })
  // Runs after every render
}
```

### Empty Dependency Array (Runs Once)

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, []) // Only runs on mount

  return user ? <div>{user.name}</div> : <p>Loading...</p>
}
```

### With Dependencies (Runs When Changed)

```jsx
function DocumentTitle() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    document.title = `Count: ${count}`
  }, [count]) // Runs when count changes

  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Cleanup Function

```jsx
function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)

    window.addEventListener('resize', handleResize)

    // Cleanup - remove listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <p>Width: {width}</p>
}
```

### Multiple Effects

```jsx
function Profile() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])

  // Fetch user
  useEffect(() => {
    fetchUser().then(setUser)
  }, [])

  // Fetch posts
  useEffect(() => {
    fetchPosts().then(setPosts)
  }, [])

  // Update document title
  useEffect(() => {
    if (user) {
      document.title = `${user.name}'s Profile`
    }
  }, [user])

  return <div>...</div>
}
```

### Common useEffect Patterns

#### API Data Fetching

```jsx
function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.example.com/users')
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

#### Intervals and Timers

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <p>Seconds: {seconds}</p>
}
```

#### WebSocket Connection

```jsx
function Chat() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data])
    }

    return () => ws.close()
  }, [])

  return (
    <ul>
      {messages.map((msg, i) => <li key={i}>{msg}</li>)}
    </ul>
  )
}
```

---

## useContext

### What is Context?

**Context** provides a way to pass data through the component tree without manually passing props at every level.

### Creating Context

```jsx
// ThemeContext.jsx
import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

### Using Context

```jsx
// App.jsx
import { ThemeProvider } from './ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  )
}

// Header.jsx - Any nested component can access theme
import { useTheme } from './ThemeContext'

function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  )
}
```

### Multiple Contexts

```jsx
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SettingsProvider>
          <Main />
        </SettingsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function Main() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { settings } = useSettings()

  return <div>...</div>
}
```

---

## useRef

### What is useRef?

**useRef** returns a mutable ref object that persists for the full lifetime of the component. Unlike state, changing a ref doesn't trigger a re-render.

### Common Use Cases

#### 1. DOM References

```jsx
function FocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    // Focus input on mount
    inputRef.current.focus()
  }, [])

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={() => inputRef.current.focus()}>
        Focus Input
      </button>
    </div>
  )
}
```

#### 2. Storing Previous Value

```jsx
function PreviousValue() {
  const [count, setCount] = useState(0)
  const prevCountRef = useRef()

  useEffect(() => {
    prevCountRef.current = count
  }, [count])

  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCountRef.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

#### 3. Storing Interval ID

```jsx
function Timer() {
  const [seconds, setSeconds] = useState(0)
  const intervalRef = useRef()

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  return <p>{seconds}</p>
}
```

#### 4. Tracking Component Mount Status

```jsx
function DataFetcher() {
  const isMounted = useRef(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/data')
      const json = await result.json()

      // Only update if component is still mounted
      if (isMounted.current) {
        setData(json)
      }
    }

    fetchData()

    return () => {
      isMounted.current = false
    }
  }, [])

  return data ? <div>{data}</div> : <p>Loading...</p>
}
```

---

## useMemo

### What is useMemo?

**useMemo** memoizes (caches) the result of expensive calculations, only recomputing when dependencies change.

### Basic Usage

```jsx
function ExpensiveComponent({ items, filter }) {
  const expensiveValue = useMemo(() => {
    console.log("Computing expensive value...")
    return items.filter(item => item.type === filter).length
  }, [items, filter])

  return <p>Count: {expensiveValue}</p>
}
```

### When to Use useMemo

```jsx
// ✅ GOOD - For expensive calculations
function SortedList({ items }) {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a.value - b.value)
  }, [items])

  return sortedItems.map(item => <div key={item.id}>{item.name}</div>)
}

// ❌ BAD - For simple operations (overkill)
function Double({ value }) {
  const doubled = useMemo(() => value * 2, [value])
  return <p>{doubled}</p>
}
```

### Preventing Unnecessary Re-renders

```jsx
function Parent() {
  const [count, setCount] = useState(0)
  const [items] = useState([1, 2, 3, 4, 5])

  // Only recreate when items changes, not when count changes
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item, 0)
  }, [items])

  return (
    <div>
      <Child value={expensiveValue} />
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  )
}
```

---

## useCallback

### What is useCallback?

**useCallback** returns a memoized callback that only changes when dependencies change. Useful for passing callbacks to child components.

### Basic Usage

```jsx
function Parent() {
  const [count, setCount] = useState(0)

  // Function only recreated when count changes
  const handleClick = useCallback(() => {
    console.log(`Clicked ${count} times`)
  }, [count])

  return <Child onClick={handleClick} />
}
```

### Preventing Child Re-renders

```jsx
// Child with React.memo
const Child = React.memo(function Child({ onClick }) {
  console.log("Child rendered")
  return <button onClick={onClick}>Click me</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [other, setOther] = useState(0)

  // Without useCallback, Child re-renders when 'other' changes
  const handleClick = useCallback(() => {
    setCount(count + 1)
  }, [count])

  return (
    <div>
      <Child onClick={handleClick} />
      <button onClick={() => setOther(other + 1)}>Other: {other}</button>
    </div>
  )
}
```

### useCallback vs useMemo

```jsx
// useMemo - caches a VALUE
const value = useMemo(() => expensiveCalculation(a, b), [a, b])

// useCallback - caches a FUNCTION
const fn = useCallback(() => expensiveCalculation(a, b), [a, b])
```

---

## Custom Hooks

### What are Custom Hooks?

**Custom hooks** let you extract component logic into reusable functions.

### Creating a Custom Hook

```jsx
// useWindowSize.js
import { useState, useEffect } from 'react'

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

export default useWindowSize
```

### Using a Custom Hook

```jsx
import useWindowSize from './useWindowSize'

function ResponsiveComponent() {
  const { width, height } = useWindowSize()

  return (
    <div>
      <p>Width: {width}</p>
      <p>Height: {height}</p>
      {width < 600 ? <p>Mobile view</p> : <p>Desktop view</p>}
    </div>
  )
}
```

### More Custom Hook Examples

#### useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

// Usage
function App() {
  const [name, setName] = useLocalStorage('name', '')

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  )
}
```

#### useFetch

```jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

// Usage
function Users() {
  const { data: users, loading, error } = useFetch('https://api.example.com/users')

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

#### useToggle

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])

  return { value, toggle, setTrue, setFalse, setValue }
}

// Usage
function Modal() {
  const { value: isOpen, toggle, setFalse: close } = useToggle(false)

  return (
    <>
      <button onClick={toggle}>Open Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={close}>Close</button>
        </div>
      )}
    </>
  )
}
```

#### useForm

```jsx
function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validate(values)[name]
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  }
}

// Usage
function LoginForm() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    reset
  } = useForm(
    { email: '', password: '' },
    (values) => {
      const errors = {}
      if (!values.email) errors.email = 'Required'
      if (!values.password) errors.password = 'Required'
      return errors
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted:', values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.email && errors.email && <span>{errors.email}</span>}

      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {touched.password && errors.password && <span>{errors.password}</span>}

      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## Practice Exercises

### Exercise 1: useCounter Hook

Create a custom useCounter hook with increment, decrement, reset functionality.

```jsx
function useCounter(initialValue = 0) {
  // Your code here
}

// Usage:
// const { count, increment, decrement, reset } = useCounter(10)
```

### Exercise 2: useInput Hook

Create a hook that handles input state and changes.

```jsx
function useInput(initialValue) {
  // Your code here
}

// Usage:
// const username = useInput("")
// <input {...username} />
```

### Exercise 3: useDebounce Hook

Create a hook that debounces a value.

```jsx
function useDebounce(value, delay) {
  // Your code here
}

// Usage:
// const debouncedSearchTerm = useDebounce(searchTerm, 500)
```

---

## Summary

### Hook Quick Reference:

```jsx
// State management
useState(initialValue)

// Side effects
useEffect(() => { ... }, [deps])

// Context
const value = useContext(MyContext)

// Refs
const ref = useRef(initialValue)

// Memoization
const memoizedValue = useMemo(() => compute(a, b), [a, b])
const memoizedFn = useCallback(() => {...}, [deps])
```

### Best Practices:
1. Follow the Rules of Hooks
2. Use custom hooks to reuse logic
3. Clean up side effects in useEffect
4. Only optimize with useMemo/useCallback when needed
5. Keep hooks simple and focused

---

## Next Steps

- [Routing and Navigation](./05-routing-and-navigation.md)
- [API Integration](./06-api-integration.md)
