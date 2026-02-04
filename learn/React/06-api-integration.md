# React - API Integration

## Table of Contents
1. [Understanding API Integration](#understanding-api-integration)
2. [REST API Basics](#rest-api-basics)
3. [Fetch API](#fetch-api)
4. [Axios](#axios)
5. [React Query (TanStack Query)](#react-query-tanstack-query)
6. [Error Handling](#error-handling)
7. [Loading States](#loading-states)
8. [Custom Hooks for API](#custom-hooks-for-api)
9. [Authentication](#authentication)
10. [Practice Exercises](#practice-exercises)

---

## Understanding API Integration

### What is an API?

**API** (Application Programming Interface) allows your React app to communicate with servers and databases to fetch, create, update, and delete data.

### Common API Types:
- **REST API**: Most common, uses HTTP methods (GET, POST, PUT, DELETE)
- **GraphQL**: Query language for APIs
- **WebSocket**: Real-time, bidirectional communication

### Typical Data Flow:

```
React Component → API Request → Server → Database
                                            ↓
React Component ← API Response ← Server ← Database
```

---

## REST API Basics

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Fetch data | `GET /api/users` |
| POST | Create data | `POST /api/users` |
| PUT | Update data (replace) | `PUT /api/users/1` |
| PATCH | Update data (partial) | `PATCH /api/users/1` |
| DELETE | Remove data | `DELETE /api/users/1` |

### Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Server-side error |

### Common API Response Format

```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "page": 1,
    "totalPages": 10
  }
}
```

---

## Fetch API

### GET Request

```jsx
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.example.com/users')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

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
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### POST Request

```jsx
function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const data = await response.json()
      console.log('User created:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        placeholder="Name"
      />
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      <button type="submit">Create User</button>
    </form>
  )
}
```

### PUT/PATCH Request

```jsx
function UpdateUser({ userId }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://api.example.com/users/${userId}`, {
        method: 'PATCH', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const data = await response.json()
      console.log('User updated:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleUpdate}>Update User</button>
  )
}
```

### DELETE Request

```jsx
function DeleteButton({ userId, onDelete }) {
  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure?')
    if (!confirmed) return

    try {
      const response = await fetch(`https://api.example.com/users/${userId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      onDelete(userId)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <button onClick={handleDelete}>Delete</button>
  )
}
```

### Request with Query Parameters

```jsx
function SearchUsers() {
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    const url = new URL('https://api.example.com/users')
    url.searchParams.append('q', query)
    url.searchParams.append('page', 1)

    const response = await fetch(url.toString())
    const data = await response.json()

    console.log(data)
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
```

### Request with Headers

```jsx
function SecureRequest() {
  const fetchData = async () => {
    const token = localStorage.getItem('token')

    const response = await fetch('https://api.example.com/protected', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    const data = await response.json()
    return data
  }

  return <div>...</div>
}
```

---

## Axios

### Installation

```bash
npm install axios

# or
yarn add axios
```

### Why Use Axios Over Fetch?

- Automatic JSON transformation
- Request/response interceptors
- Request cancellation
- Automatic transforms for JSON data
- Wider browser support
- Better error handling

### Basic GET Request

```jsx
import axios from 'axios'
import { useState, useEffect } from 'react'

function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.example.com/users')
        setUsers(response.data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### POST Request

```jsx
function CreateUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('https://api.example.com/users', formData)
      console.log('User created:', response.data)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Multiple Requests

```jsx
function Dashboard() {
  const [data, setData] = useState({
    users: [],
    posts: [],
    comments: []
  })

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, postsRes, commentsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/posts'),
          axios.get('/api/comments')
        ])

        setData({
          users: usersRes.data,
          posts: postsRes.data,
          comments: commentsRes.data
        })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchAllData()
  }, [])

  return <div>...</div>
}
```

### Creating an Axios Instance

```jsx
// utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Using the API Instance

```jsx
import api from './utils/api'

function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    api.get('/users')
      .then(setUsers)
      .catch(console.error)
  }, [])

  return <ul>...</ul>
}
```

---

## React Query (TanStack Query)

### Installation

```bash
npm install @tanstack/react-query

# or
yarn add @tanstack/react-query
```

### Why React Query?

- Automatic caching and revalidation
- Background updates
- Optimistic updates
- Pagination support
- Better developer experience
- Less boilerplate code

### Basic Setup

```jsx
// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

### Basic Usage

```jsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const {
    data: users,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('https://api.example.com/users')
      return response.json()
    }
  })

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error: {error.message}</p>

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Mutations (POST, PUT, DELETE)

```jsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateUserForm() {
  const queryClient = useQueryClient()

  const createUser = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('https://api.example.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    createUser.mutate(Object.fromEntries(formData))
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" />
      <button type="submit" disabled={createUser.isPending}>
        {createUser.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}
```

### Automatic Refetching

```jsx
function UserProfile({ userId }) {
  const { data } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    // Refetch every 30 seconds
    refetchInterval: 30000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true
  })

  return <div>{data?.name}</div>
}
```

---

## Error Handling

### Try-Catch Pattern

```jsx
function fetchData() {
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('/api/data')

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err.message)
      }
    }

    getData()
  }, [])

  return { data, error }
}
```

### Error Component

```jsx
function ErrorMessage({ error }) {
  if (!error) return null

  const errorMessages = {
    400: 'Invalid request. Please check your input.',
    401: 'Please log in to continue.',
    403: 'You don\'t have permission to do this.',
    404: 'The requested resource was not found.',
    500: 'Server error. Please try again later.'
  }

  const message = errorMessages[error.status] || error.message

  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  )
}
```

---

## Loading States

### Skeleton Loading

```jsx
function UserCardSkeleton() {
  return (
    <div className="user-card skeleton">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
    </div>
  )
}

function UserList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })

  if (isLoading) {
    return (
      <div>
        <UserCardSkeleton />
        <UserCardSkeleton />
        <UserCardSkeleton />
      </div>
    )
  }

  return <div>{users?.map(user => <UserCard key={user.id} user={user} />)}</div>
}
```

### Progress Indicator

```jsx
function FileUpload() {
  const [progress, setProgress] = useState(0)

  const uploadFile = async (file) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100
        setProgress(percentComplete)
      }
    })

    xhr.open('POST', '/api/upload')
    xhr.send(file)
  }

  return (
    <div>
      <progress value={progress} max="100" />
      <span>{Math.round(progress)}%</span>
    </div>
  )
}
```

---

## Custom Hooks for API

### useFetch Hook

```jsx
function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url, {
          signal: abortController.signal
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const json = await response.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    return () => abortController.abort()
  }, [url])

  return { data, loading, error }
}

// Usage
function UserList() {
  const { data: users, loading, error } = useFetch('/api/users')

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return <ul>{users?.map(user => <li key={user.id}>{user.name}</li>)}</ul>
}
```

### useApi Hook (CRUD)

```jsx
function useApi(baseUrl) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const get = async (endpoint) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}${endpoint}`)
      const json = await response.json()
      setData(json)
      return json
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const post = async (endpoint, body) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await response.json()
      setData(prev => [...prev, json])
      return json
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const put = async (endpoint, body) => {
    setLoading(true)
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const json = await response.json()
      setData(prev => prev.map(item => item.id === json.id ? json : item))
      return json
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (endpoint) => {
    setLoading(true)
    try {
      await fetch(`${baseUrl}${endpoint}`, { method: 'DELETE' })
      setData(prev => prev.filter(item => item.id !== id))
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, get, post, put, remove }
}

// Usage
function UserManagement() {
  const { data: users, get, post, remove } = useApi('/api/users')

  useEffect(() => {
    get('')
  }, [])

  const handleAdd = (userData) => {
    post('', userData)
  }

  const handleDelete = (id) => {
    remove(`/${id}`)
  }

  return <div>...</div>
}
```

---

## Authentication

### Login with Token Storage

```jsx
function LoginForm() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const { token, user } = await response.json()

      // Store token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Redirect or update state
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
      />
      <input
        type="password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Auth Provider Context

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const { token, user } = await response.json()

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Protected API Calls

```jsx
import api from './utils/api'

function ProtectedComponent() {
  const { data, error } = useSWR('/api/protected', async (url) => {
    const response = await api.get(url)
    return response.data
  })

  if (error) return <p>Access denied</p>
  if (!data) return <p>Loading...</p>

  return <div>{data}</div>
}
```

---

## Practice Exercises

### Exercise 1: Create a Weather App

Build a weather app that:
- Fetches weather data from an API
- Shows loading state while fetching
- Handles errors gracefully
- Displays temperature, humidity, conditions

```jsx
// Your implementation
```

### Exercise 2: Create a Todo App with CRUD

Build a todo app with:
- GET: Fetch todos on load
- POST: Add new todo
- PATCH: Toggle todo completion
- DELETE: Remove todo

```jsx
// Your implementation
```

### Exercise 3: Create a Search with Debounce

Build a search feature that:
- Fetches results as user types
- Debounces API calls (500ms)
- Shows loading indicator
- Handles empty results

```jsx
// Your implementation
```

---

## Summary

### Key Points:

1. **Fetch API**: Built-in, no dependencies needed
2. **Axios**: More features, better error handling
3. **React Query**: Best for complex apps with caching
4. **Custom Hooks**: Reusable API logic
5. **Error Handling**: Always handle failures gracefully
6. **Loading States**: Improve UX with indicators

### Quick Reference:

```jsx
// Fetch
const response = await fetch(url)
const data = await response.json()

// Axios
const { data } = await axios.get(url)

// React Query
const { data } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFn
})

// Mutation
const mutation = useMutation({
  mutationFn: postData,
  onSuccess: () => queryClient.invalidateQueries(['key'])
})
```

---

## Next Steps

- [Styling and UI](./07-styling-and-ui.md)
- [Real Project Implementation](./08-real-project-implementation.md)
