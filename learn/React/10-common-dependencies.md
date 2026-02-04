# React - Common Dependencies and Libraries

## Table of Contents
1. [Essential Libraries](#essential-libraries)
2. [State Management](#state-management)
3. [Forms and Validation](#forms-and-validation)
4. [Data Fetching](#data-fetching)
5. [UI Component Libraries](#ui-component-libraries)
6. [Styling Solutions](#styling-solutions)
7. [Utilities](#utilities)
8. [Development Tools](#development-tools)
9. [Testing Libraries](#testing-libraries)
10. [Animation Libraries](#animation-libraries)

---

## Essential Libraries

### React Router

```bash
npm install react-router-dom
```

**Purpose**: Client-side routing

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>
```

### Axios

```bash
npm install axios
```

**Purpose**: HTTP client with interceptors

```jsx
import axios from 'axios'

axios.get('/api/users')
  .then(response => console.log(response.data))
```

---

## State Management

### Zustand

```bash
npm install zustand
```

**Purpose**: Lightweight state management

```jsx
import create from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}))

// Usage
function Counter() {
  const { count, increment } = useStore()
  return <button onClick={increment}>{count}</button>
}
```

### Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

**Purpose**: Predictable state container for large apps

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 }
  }
})

const store = configureStore({
  reducer: { counter: counterSlice.reducer }
})
```

### Jotai

```bash
npm install jotai
```

**Purpose**: Primitive and flexible state management

```jsx
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function Counter() {
  const [count, setCount] = useAtom(countAtom)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## Forms and Validation

### React Hook Form

```bash
npm install react-hook-form
```

**Purpose**: Performant form handling

```jsx
import { useForm } from 'react-hook-form'

function LoginForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Zod

```bash
npm install zod
```

**Purpose**: TypeScript-first schema validation

```jsx
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
})

// With React Hook Form
import { zodResolver } from '@hookform/resolvers/zod'

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema)
})
```

### Formik

```bash
npm install formik
```

**Purpose**: Alternative form library

```jsx
import { Formik, Form, Field } from 'formik'

function MyForm() {
  return (
    <Formik
      initialValues={{ email: '' }}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Field name="email" type="email" />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  )
}
```

---

## Data Fetching

### TanStack Query (React Query)

```bash
npm install @tanstack/react-query
```

**Purpose**: Powerful data synchronization

```jsx
import { useQuery, useMutation } from '@tanstack/react-query'

function Users() {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  })

  const mutation = useMutation({
    mutationFn: (user) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user)
    })
  })

  return <div>{/* ... */}</div>
}
```

### SWR

```bash
npm install swr
```

**Purpose**: Data fetching with caching

```jsx
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then(r => r.json())

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}</div>
}
```

---

## UI Component Libraries

### Material-UI (MUI)

```bash
npm install @mui/material @emotion/react @emotion/styled
```

**Features**: Comprehensive component library, Material Design

```jsx
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'

<Button variant="contained">Click me</Button>
```

### Chakra UI

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

**Features**: Simple, accessible, composable

```jsx
import { Button, Card } from '@chakra-ui/react'

<Button colorScheme="blue">Click me</Button>
```

### Ant Design

```bash
npm install antd
```

**Features**: Enterprise-class UI design

```jsx
import { Button, Card } from 'antd'

<Button type="primary">Click me</Button>
```

### Radix UI

```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
```

**Features**: Unstyled, accessible components

```jsx
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <p>Content</p>
  </Dialog.Content>
</Dialog.Root>
```

### Headless UI

```bash
npm install @headlessui/react
```

**Features**: Unstyled, fully accessible UI primitives

```jsx
import { Dialog } from '@headlessui/react'

<Dialog open={isOpen} onClose={setIsOpen}>
  <Dialog.Panel>
    <p>Content</p>
  </Dialog.Panel>
</Dialog>
```

---

## Styling Solutions

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

**Features**: Utility-first CSS framework

```jsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h1 className="text-xl font-bold">Title</h1>
</div>
```

### Styled Components

```bash
npm install styled-components
```

**Features**: CSS-in-JS with component-scoped styles

```jsx
import styled from 'styled-components'

const Button = styled.button`
  background: blue;
  color: white;
  padding: 10px 20px;
`
```

### Emotion

```bash
npm install @emotion/react @emotion/styled
```

**Features**: Performant CSS-in-JS

```jsx
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'

const Button = styled.button`
  background: blue;
  color: white;
`
```

### clsx / classnames

```bash
npm install clsx
# or
npm install classnames
```

**Features**: Utility for constructing className strings

```jsx
import clsx from 'clsx'

function Button({ variant, className }) {
  return (
    <button className={clsx(
      'btn',
      variant === 'primary' && 'btn-primary',
      className
    )}>
      Click
    </button>
  )
}
```

---

## Utilities

### Date-fns

```bash
npm install date-fns
```

**Purpose**: Modern date utility library

```jsx
import { format, formatDistanceToNow } from 'date-fns'

format(new Date(), 'yyyy-MM-dd')
formatDistanceToNow(new Date(), { addSuffix: true })
```

### Lodash-es

```bash
npm install lodash-es
```

**Purpose**: Modern utility library

```jsx
import { debounce, throttle, cloneDeep } from 'lodash-es'

const debouncedSearch = debounce((value) => console.log(value), 300)
```

### UUID

```bash
npm install uuid
```

**Purpose**: Generate UUIDs

```jsx
import { v4 as uuidv4 } from 'uuid'

const id = uuidv4()
```

### Axios Mock Adapter

```bash
npm install axios-mock-adapter
```

**Purpose**: Mock Axios requests for testing

```jsx
import MockAdapter from 'axios-mock-adapter'
import api from './api'

const mock = new MockAdapter(api)

mock.onGet('/users').reply(200, [
  { id: 1, name: 'John' }
])
```

---

## Development Tools

### ESLint

```bash
npm install -D eslint
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D eslint-plugin-react eslint-plugin-react-hooks
```

**Purpose**: Code linting

```javascript
// .eslintrc.cjs
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ]
}
```

### Prettier

```bash
npm install -D prettier eslint-config-prettier
```

**Purpose**: Code formatting

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

### React DevTools

```bash
# Browser extension
# Chrome: https://chrome.google.com/webstore
# Firefox: https://addons.mozilla.org
```

**Purpose**: Debug React components

---

## Testing Libraries

### Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Purpose**: Fast unit testing

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### React Testing Library

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Purpose**: Test React components

```jsx
import { render, screen, fireEvent } from '@testing-library/react'

test('calls onClick when clicked', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)

  fireEvent.click(screen.getByText('Click'))
  expect(handleClick).toHaveBeenCalled()
})
```

### Playwright

```bash
npm install -D @playwright/test
```

**Purpose**: End-to-end testing

```jsx
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.click('text=Login')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
})
```

---

## Animation Libraries

### Framer Motion

```bash
npm install framer-motion
```

**Purpose**: Production-ready motion library

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Hello
</motion.div>
```

### React Spring

```bash
npm install @react-spring/web
```

**Purpose**: Spring-physics based animation

```jsx
import { useSpring, animated } from '@react-spring/web'

function Component() {
  const props = useSpring({ opacity: 1, from: { opacity: 0 } })
  return <animated.div style={props}>Hello</animated.div>
}
```

### Auto Animate

```bash
npm install @formkit/auto-animate
```

**Purpose**: Automatic animations

```jsx
import { useAutoAnimate } from '@formkit/auto-animate/react'

function List() {
  const [parent] = useAutoAnimate()
  return (
    <ul ref={parent}>
      {items.map(item => <li key={item.id}>{item.name}</li>)})
    </ul>
  )
}
```

---

## Icons

### Lucide React

```bash
npm install lucide-react
```

**Purpose**: Beautiful & consistent icons

```jsx
import { Search, User, Settings } from 'lucide-react'

<Search />
<User color="red" size={24} />
```

### React Icons

```bash
npm install react-icons
```

**Purpose**: Include popular icon libraries

```jsx
import { FaBeer } from 'react-icons/fa'
import { MdAccessAlarm } from 'react-icons/md'

<FaBeer />
<MdAccessAlarm />
```

---

## Additional Useful Libraries

### React Hot Toast

```bash
npm install react-hot-toast
```

**Purpose**: Toast notifications

```jsx
import toast from 'react-hot-toast'

toast.success('Successfully saved!')
toast.error('This is an error!')
```

### React Dropzone

```bash
npm install react-dropzone
```

**Purpose**: File upload with drag & drop

```jsx
import { useDropzone } from 'react-dropzone'

function Dropzone() {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => console.log(files)
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop files here</p>
    </div>
  )
}
```

### React Table (TanStack Table)

```bash
npm install @tanstack/react-table
```

**Purpose**: Headless UI for building tables

```jsx
import { useReactTable } from '@tanstack/react-table'

function Table() {
  const table = useReactTable({ columns, data })
  return <table>{/* ... */}</table>
}
```

---

## Quick Start Templates

### Minimal Stack

```bash
npm create vite@latest my-app -- --template react
npm install react-router-dom
npm install axios
npm install -D tailwindcss
```

### Full-Stack Ready

```bash
npm create vite@latest my-app -- --template react-ts
npm install react-router-dom
npm install @tanstack/react-query
npm install axios
npm install react-hook-form zod
npm install -D tailwindcss
npm install -D vitest @testing-library/react
```

### Enterprise Stack

```bash
npm create vite@latest my-app -- --template react-ts
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form zod
npm install @mui/material @emotion/react
npm install axios
npm install -D tailwindcss
npm install -D vitest @playwright/test
npm install -D eslint prettier
```

---

## Summary

| Category | Recommended Library |
|----------|---------------------|
| **Routing** | react-router-dom |
| **State** | Zustand (small), Redux Toolkit (large) |
| **Data Fetching** | TanStack Query |
| **Forms** | React Hook Form + Zod |
| **Styling** | Tailwind CSS |
| **UI Library** | Radix UI, Shadcn/ui |
| **Date** | date-fns |
| **Icons** | Lucide React |
| **Notifications** | react-hot-toast |
| **Testing** | Vitest + React Testing Library |
| **E2E** | Playwright |

---

## Next Steps

- [Deployment](./11-deployment.md)
