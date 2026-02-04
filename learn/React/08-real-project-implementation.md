# React - Real Project Implementation Guide

## Table of Contents
1. [Project Planning](#project-planning)
2. [Project Structure](#project-structure)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [Complete Project Example: Task Management App](#complete-project-example-task-management-app)
5. [State Management for Scale](#state-management-for-scale)
6. [Testing](#testing)
7. [Performance Optimization](#performance-optimization)
8. [Production Checklist](#production-checklist)

---

## Project Planning

### Before You Start Coding

#### 1. Define Requirements

```
What are you building?
- Core features
- User roles
- Data requirements
- Integration needs
```

#### 2. Choose Your Tech Stack

```bash
# Project Setup Checklist
✓ React + Vite
✓ TypeScript (optional but recommended)
✓ Router: React Router v6
✓ State: React Query + Context/Zustand
✓ UI: Tailwind CSS / UI Library
✓ Forms: React Hook Form
✓ Validation: Zod
✓ HTTP: Axios / React Query
✓ Testing: Vitest + React Testing Library
```

#### 3. Create Project

```bash
# Create new project
npm create vite@latest my-project -- --template react-ts

cd my-project
npm install

# Install additional dependencies
npm install react-router-dom @tanstack/react-query
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Project Structure

### Recommended Folder Structure

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   └── features/       # Feature-specific components
├── pages/              # Page components
│   ├── HomePage.jsx
│   ├── DashboardPage.jsx
│   └── NotFoundPage.jsx
├── hooks/              # Custom hooks
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/           # API services
│   ├── api.js         # Axios instance
│   ├── authService.js
│   └── userService.js
├── utils/              # Utility functions
│   ├── cn.js          # Class name helper
│   ├── formatters.js  # Date, number formatters
│   └── validators.js  # Validation functions
├── constants/          # Constants and enums
│   └── endpoints.js
├── types/              # TypeScript types (if using TS)
│   └── index.d.ts
├── App.jsx             # Root component
└── main.jsx            # Entry point
```

---

## Step-by-Step Implementation

### Step 1: Setup Core Infrastructure

#### Configure Tailwind

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Setup Router

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
```

#### Setup API Service

```jsx
// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
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
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### Step 2: Create Layout Components

```jsx
// src/components/layout/Header.jsx
import { Link, NavLink } from 'react-router-dom'

const navClasses = ({ isActive }) =>
  isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600'

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
            MyApp
          </Link>
          <nav className="flex space-x-8">
            <NavLink to="/" className={navClasses}>Home</NavLink>
            <NavLink to="/dashboard" className={navClasses}>Dashboard</NavLink>
            <NavLink to="/about" className={navClasses}>About</NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
```

```jsx
// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          &copy; 2024 MyApp. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Layout
```

### Step 3: Create UI Components

```jsx
// src/components/ui/Button.jsx
import { cn } from '../../utils/cn'

function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  disabled,
  ...props
}) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  }

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
```

```jsx
// src/components/ui/Input.jsx
import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

const Input = forwardRef(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

export default Input
```

```jsx
// src/components/ui/Card.jsx
import { cn } from '../../utils/cn'

function Card({ children, className, ...props }) {
  return (
    <div
      className={cn('bg-white rounded-lg shadow-md p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
```

### Step 4: Create Authentication

```jsx
// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/auth/me')
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const register = async (data) => {
    const response = await api.post('/auth/register', data)
    const { token, user } = response.data
    localStorage.setItem('token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

```jsx
// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
```

### Step 5: Create Pages

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(formData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  )
}

export default LoginPage
```

```jsx
// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query'
import { Card } from '../components/ui/Card'
import api from '../services/api'

async function getStats() {
  return api.get('/stats')
}

function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">Error loading stats</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          change="+12%"
          positive
        />
        <StatCard
          title="Active Tasks"
          value={stats?.activeTasks || 0}
          change="+5%"
          positive
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks || 0}
          change="-3%"
          positive={false}
        />
      </div>
    </div>
  )
}

function StatCard({ title, value, change, positive }) {
  return (
    <Card>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className={`text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </Card>
  )
}

export default DashboardPage
```

### Step 6: Setup Routes

```jsx
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
```

---

## Complete Project Example: Task Management App

### Project Overview

A full-featured task management application with:
- User authentication
- Task CRUD operations
- Categories and filters
- Search functionality
- Responsive design

### Complete File Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   └── Badge.jsx
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── Sidebar.jsx
│   └── tasks/
│       ├── TaskList.jsx
│       ├── TaskItem.jsx
│       ├── TaskForm.jsx
│       └── TaskFilters.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── TaskContext.jsx
├── hooks/
│   ├── useTasks.js
│   └── useModal.js
├── pages/
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── TasksPage.jsx
│   └── NotFoundPage.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── taskService.js
└── utils/
    ├── cn.js
    └── formatters.js
```

### Key Components

```jsx
// src/components/tasks/TaskList.jsx
import { useQuery } from '@tanstack/react-query'
import { useTasks } from '../../hooks/useTasks'
import { TaskItem } from './TaskItem'
import { TaskFilters } from './TaskFilters'

function TaskList() {
  const { filters } = useTasks()

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
  })

  if (isLoading) return <div>Loading tasks...</div>

  return (
    <div className="space-y-4">
      <TaskFilters />
      <div className="space-y-2">
        {tasks?.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}

export default TaskList
```

---

## State Management for Scale

### When to Use State Management

```jsx
// Small projects: useState + Context is fine
// Medium projects: useState + React Query
// Large projects: Zustand or Redux Toolkit

// Example: Zustand for global state
```

```bash
npm install zustand
```

```jsx
// src/store/taskStore.js
import create from 'zustand'

export const useTaskStore = create((set) => ({
  tasks: [],
  filter: 'all',
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  setFilter: (filter) => set({ filter }),
}))

// Usage
function TaskList() {
  const { tasks, filter, setFilter } = useTaskStore()

  return (
    <div>
      <button onClick={() => setFilter('active')}>Active</button>
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </div>
  )
}
```

---

## Testing

### Setting Up Tests

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```javascript
// vite.config.js
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
```

```jsx
// src/components/__tests__/Button.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from '../Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="danger">Delete</Button>)
    expect(container.firstChild).toHaveClass('bg-red-600')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

---

## Performance Optimization

### Code Splitting

```jsx
import { lazy, Suspense } from 'react'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  )
}
```

### Memoization

```jsx
import { memo, useMemo } from 'react'

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveCalculation(item))
  }, [data])

  return <div>{processedData.map(...)}</div>
})
```

---

## Production Checklist

### Before Deploying

```bash
# 1. Remove console.logs
npm install -D terser

# 2. Run linter
npm run lint

# 3. Run tests
npm run test

# 4. Type check (if using TypeScript)
npm run type-check

# 5. Build production bundle
npm run build

# 6. Preview production build
npm run preview
```

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyApp
```

### .gitignore

```
node_modules/
dist/
.env
.env.local
.env.production
```

---

## Summary

### Real Project Workflow:

1. **Planning**: Define requirements and tech stack
2. **Setup**: Create project with Vite, install dependencies
3. **Structure**: Organize folders for components, pages, services
4. **Core**: Build layout, authentication, routing
5. **Components**: Create reusable UI components
6. **Features**: Implement core features with proper state management
7. **Testing**: Write tests for components
8. **Optimize**: Code split, memoize, lazy load
9. **Deploy**: Build and deploy to hosting platform

---

## Next Steps

- [Best Practices](./09-best-practices-and-patterns.md)
- [Common Dependencies](./10-common-dependencies.md)
- [Deployment](./11-deployment.md)
