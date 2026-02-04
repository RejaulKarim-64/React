# React Router - Routing and Navigation

## Table of Contents
1. [What is React Router?](#what-is-react-router)
2. [Installation](#installation)
3. [Basic Setup](#basic-setup)
4. [Route Components](#route-components)
5. [Navigation](#navigation)
6. [Route Parameters](#route-parameters)
7. [Nested Routes](#nested-routes)
8. [Protected Routes](#protected-routes)
9. [Query Parameters](#query-parameters)
10. [Practice Exercises](#practice-exercises)

---

## What is React Router?

**React Router** is the standard routing library for React. It enables navigation between different components in a React application, allowing each URL to display a specific view.

### Key Features:
- Declarative routing
- Dynamic routing
- Nested routes
- Code splitting
- Query parameter handling
- Hash-based or browser history routing

### Why Use Client-Side Routing?

```jsx
// Traditional (Server-side routing)
// Each URL loads a new page from the server

// SPA (Client-side routing with React Router)
// Navigation happens without page reload
// Faster, smoother experience
```

---

## Installation

### Installing React Router v6

```bash
# npm
npm install react-router-dom

# yarn
yarn add react-router-dom

# pnpm
pnpm add react-router-dom
```

### Version Check

```bash
# Check installed version
npm list react-router-dom

# Should show v6.x.x
```

---

## Basic Setup

### 1. Wrap App with BrowserRouter

```jsx
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

### 2. Define Routes

```jsx
// App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
```

### 3. Create Page Components

```jsx
// pages/Home.jsx
function Home() {
  return <h1>Home Page</h1>
}

export default Home

// pages/About.jsx
function About() {
  return <h1>About Page</h1>
}

export default About

// pages/Contact.jsx
function Contact() {
  return <h1>Contact Page</h1>
}

export default Contact

// pages/NotFound.jsx
function NotFound() {
  return <h1>404 - Page Not Found</h1>
}

export default NotFound
```

---

## Route Components

### Routes and Route

```jsx
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      {/* Exact match for home */}
      <Route path="/" element={<Home />} />

      {/* Dynamic routes */}
      <Route path="/users/:id" element={<UserDetail />} />

      {/* Nested routes */}
      <Route path="/products" element={<Products />}>
        <Route path=":id" element={<ProductDetail />} />
      </Route>

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

### Route Matching Priority

```jsx
<Routes>
  {/* Specific routes first */}
  <Route path="/users/new" element={<NewUser />} />
  <Route path="/users/:id" element={<UserDetail />} />

  {/* Catch-all last */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

## Navigation

### Link Component

```jsx
import { Link } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  )
}
```

### NavLink Component (Active Styling)

```jsx
import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav>
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Home
      </NavLink>

      <NavLink
        to="/about"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        About
      </NavLink>
    </nav>
  )
}
```

### Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Perform login...

    // Navigate to dashboard
    navigate('/dashboard')
  }

  const handleCancel = () => {
    // Go back
    navigate(-1)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
      <button type="button" onClick={handleCancel}>Cancel</button>
    </form>
  )
}
```

### Navigate Component

```jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute isAuthenticated={user}>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Navigation with State

```jsx
// Passing state during navigation
function UserList() {
  const navigate = useNavigate()

  const handleUserClick = (user) => {
    navigate(`/users/${user.id}`, {
      state: { fromList: true, timestamp: Date.now() }
    })
  }

  return <div>...</div>
}

// Accessing navigation state
function UserDetail() {
  const location = useLocation()
  const state = location.state

  console.log(state?.fromList) // true or undefined
}
```

---

## Route Parameters

### URL Parameters

```jsx
// Define route with parameter
<Route path="/users/:userId" element={<UserDetail />} />

// Access parameter
import { useParams } from 'react-router-dom'

function UserDetail() {
  const { userId } = useParams()

  useEffect(() => {
    fetchUser(userId)
  }, [userId])

  return <div>User ID: {userId}</div>
}
```

### Multiple Parameters

```jsx
// Route definition
<Route path="/posts/:postId/comments/:commentId" element={<CommentDetail />} />

// Component
function CommentDetail() {
  const { postId, commentId } = useParams()

  return (
    <div>
      <p>Post: {postId}</p>
      <p>Comment: {commentId}</p>
    </div>
  )
}
```

### Optional Parameters

```jsx
// React Router doesn't support optional parameters directly
// Use multiple routes instead:

<Routes>
  <Route path="/users/:id" element={<UserDetail />} />
  <Route path="/users" element={<UserList />} />
</Routes>
```

### Optional Segment Pattern

```jsx
// Use :lang? for optional segments
<Route path="/:lang?/about" element={<About />} />

// Matches both:
// /about
// /en/about
```

---

## Nested Routes

### Basic Nested Routes

```jsx
// pages/Products.jsx
import { Outlet, Link } from 'react-router-dom'

function Products() {
  return (
    <div>
      <h1>Products</h1>

      {/* Outlet renders child routes here */}
      <Outlet />

      <nav>
        <Link to="electronics">Electronics</Link>
        <Link to="clothing">Clothing</Link>
      </nav>
    </div>
  )
}

// App.jsx
<Routes>
  <Route path="/products" element={<Products />}>
    <Route path="electronics" element={<Electronics />} />
    <Route path="clothing" element={<Clothing />} />
  </Route>
</Routes>
```

### Nested Routes with Layout

```jsx
// Layout.jsx
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="layout">
      <header>
        <h1>My App</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </header>

      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>

      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  )
}

// App.jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="contact" element={<Contact />} />
  </Route>
</Routes>
```

### Index Routes

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    {/* Index route renders at parent path */}
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
  </Route>
</Routes>
```

### Deep Nesting

```jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="profile" element={<Profile />} />
      <Route path="settings" element={<Settings />}>
        <Route index element={<GeneralSettings />} />
        <Route path="security" element={<SecuritySettings />} />
      </Route>
    </Route>
  </Route>
</Routes>
```

---

## Protected Routes

### Basic Protected Route

```jsx
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

// Usage
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
```

### Protected Route with Redirect

```jsx
function ProtectedRoute({ isAuthenticated, children }) {
  const location = useLocation()

  if (!isAuthenticated) {
    // Save current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// In Login component
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const handleLogin = () => {
    // Perform login...
    navigate(from, { replace: true })
  }

  return <button onClick={handleLogin}>Login</button>
}
```

### Role-Based Protected Routes

```jsx
function RoleRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// Usage
<Route
  path="/admin"
  element={
    <RoleRoute user={user} allowedRoles={['admin', 'moderator']}>
      <AdminPanel />
    </RoleRoute>
  }
/>
```

---

## Query Parameters

### Reading Query Params

```jsx
import { useSearchParams } from 'react-router-dom'

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get('category')
  const page = searchParams.get('page')
  const sort = searchParams.get('sort')

  return (
    <div>
      <p>Category: {category}</p>
      <p>Page: {page}</p>
      <p>Sort: {sort}</p>
    </div>
  )
}
```

### Setting Query Params

```jsx
function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const handleFilterChange = (category) => {
    setSearchParams({ category })
  }

  const handlePageChange = (page) => {
    // Keep existing params, update page
    const newParams = Object.fromEntries(searchParams)
    newParams.page = page
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  return (
    <div>
      <button onClick={() => handleFilterChange('electronics')}>
        Electronics
      </button>
      <button onClick={() => handlePageChange(2)}>
        Page 2
      </button>
      <button onClick={clearFilters}>Clear</button>
    </div>
  )
}
```

### Multiple Query Parameters

```jsx
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateQuery = (updates) => {
    const params = Object.fromEntries(searchParams)
    const newParams = { ...params, ...updates }
    setSearchParams(newParams)
  }

  const removeQuery = (key) => {
    const params = Object.fromEntries(searchParams)
    delete params[key]
    setSearchParams(params)
  }

  return (
    <div>
      {/* ?q=react&category=tutorial&page=1 */}
      <p>Query: {searchParams.get('q')}</p>
      <p>Category: {searchParams.get('category')}</p>
      <p>Page: {searchParams.get('page')}</p>

      <button onClick={() => updateQuery({ page: '2' })}>
        Next Page
      </button>
      <button onClick={() => removeQuery('category')}>
        Remove Category
      </button>
    </div>
  )
}
```

---

## Location and History

### useLocation Hook

```jsx
import { useLocation } from 'react-router-dom'

function Component() {
  const location = useLocation()

  console.log(location.pathname)     // '/users/123'
  console.log(location.search)       // '?tab=profile'
  console.log(location.hash)         // '#section'
  console.log(location.state)        // { from: '/dashboard' }
  console.log(location.key)          // Unique key for location

  return <div>...</div>
}
```

### Track Route Changes

```jsx
function App() {
  const location = useLocation()

  useEffect(() => {
    // Log page view for analytics
    console.log('Page view:', location.pathname)

    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location])

  return <Routes>...</Routes>
}
```

---

## Practice Exercises

### Exercise 1: Create a Blog Application

Create a blog with:
- Home page listing all posts
- Individual post pages (`/posts/:id`)
- About page
- Navigation bar

```jsx
// Your implementation
```

### Exercise 2: Create an E-commerce Store

Create a store with:
- Product listing (`/products`)
- Product detail (`/products/:id`)
- Category filter (`/products?category=electronics`)
- Cart page (`/cart`)

```jsx
// Your implementation
```

### Exercise 3: Create Protected Admin Panel

Create an admin panel with:
- Login page
- Protected dashboard
- Role-based access (admin only)

```jsx
// Your implementation
```

---

## Summary

### Key Components:

| Component | Purpose |
|-----------|---------|
| `BrowserRouter` | Router using HTML5 history API |
| `Routes` | Container for route definitions |
| `Route` | Defines path-element mapping |
| `Link` | Declarative navigation |
| `NavLink` | Link with active state |
| `Navigate` | Programmatic redirect |
| `Outlet` | Renders child routes |

### Key Hooks:

| Hook | Purpose |
|------|---------|
| `useNavigate` | Programmatic navigation |
| `useLocation` | Get current location |
| `useParams` | Get route parameters |
| `useSearchParams` | Get/set query params |

### Common Patterns:

```jsx
// Basic routing
<Link to="/path">Text</Link>

// Navigate programmatically
const navigate = useNavigate()
navigate('/path', { state: { key: value } })

// Get params
const { id } = useParams()

// Get query params
const [searchParams] = useSearchParams()
const value = searchParams.get('key')

// Protected route
{isAuthenticated ? <Component /> : <Navigate to="/login" />}
```

---

## Next Steps

- [API Integration](./06-api-integration.md)
- [Styling and UI](./07-styling-and-ui.md)
