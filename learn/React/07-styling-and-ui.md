# React - Styling and UI

## Table of Contents
1. [Styling Approaches in React](#styling-approaches-in-react)
2. [CSS Modules](#css-modules)
3. [Styled Components](#styled-components)
4. [Tailwind CSS](#tailwind-css)
5. [CSS-in-JS Libraries](#css-in-js-libraries)
6. [Responsive Design](#responsive-design)
7. [UI Component Libraries](#ui-component-libraries)
8. [Theming](#theming)
9. [Animation](#animation)
10. [Practice Exercises](#practice-exercises)

---

## Styling Approaches in React

### Comparison of Approaches

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Plain CSS** | Simple, familiar | Global scope, conflicts | Small projects |
| **CSS Modules** | Scoped, no conflicts | Extra build step | Medium projects |
| **Tailwind CSS** | Fast development, small CSS | Learning curve | Rapid development |
| **Styled Components** | Dynamic, component-scoped | Bundle size | Complex UI |
| **UI Libraries** | Pre-built components | Less customization | Prototyping, enterprise |

---

## CSS Modules

### What are CSS Modules?

CSS Modules automatically scope class names to avoid conflicts.

### Setting Up CSS Modules

```jsx
// No additional setup needed with Vite!
// Just name your file [name].module.css
```

### Basic Usage

```css
/* Button.module.css */
.button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.buttonPrimary {
  background-color: #28a745;
}

.buttonLarge {
  padding: 15px 30px;
  font-size: 18px;
}
```

```jsx
// Button.jsx
import styles from './Button.module.css'

function Button({ variant = 'default', size = 'medium', children }) {
  const buttonClasses = [
    styles.button,
    variant === 'primary' && styles.buttonPrimary,
    size === 'large' && styles.buttonLarge
  ].filter(Boolean).join(' ')

  return <button className={buttonClasses}>{children}</button>
}

export default Button
```

### Using CSS Modules with Props

```jsx
// Card.jsx
import styles from './Card.module.css'

function Card({ variant = 'default', children }) {
  return (
    <div className={`${styles.card} ${styles[variant]}`}>
      {children}
    </div>
  )
}

export default Card
```

```css
/* Card.module.css */
.card {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.default {
  background-color: white;
}

.danger {
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}

.success {
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}
```

### Composing Classes

```jsx
// utils/cn.js - Helper function
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Button.jsx
import { cn } from '../utils/cn'
import styles from './Button.module.css'

function Button({ variant, size, className, children }) {
  return (
    <button className={cn(
      styles.button,
      variant && styles[variant],
      size && styles[size],
      className
    )}>
      {children}
    </button>
  )
}
```

---

## Styled Components

### Installation

```bash
npm install styled-components

# or
yarn add styled-components
```

### Basic Usage

```jsx
// Button.jsx
import styled from 'styled-components'

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default Button
```

### Props in Styled Components

```jsx
const Button = styled.button`
  padding: ${props => props.size === 'large' ? '15px 30px' : '10px 20px'};
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return '#007bff'
      case 'success': return '#28a745'
      case 'danger': return '#dc3545'
      default: return '#6c757d'
    }
  }};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

// Usage
<Button variant="primary" size="large">
  Click me
</Button>
```

### Extending Styles

```jsx
const BaseButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
`

const PrimaryButton = styled(BaseButton)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`

const SecondaryButton = styled(BaseButton)`
  background-color: #6c757d;
  color: white;

  &:hover {
    background-color: #545b62;
  }
`
```

### Global Styles

```jsx
// styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

export default GlobalStyles

// App.jsx
import GlobalStyles from './styles/GlobalStyles'

function App() {
  return (
    <>
      <GlobalStyles />
      {/* Your app content */}
    </>
  )
}
```

---

## Tailwind CSS

### Installation

```bash
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p
```

### Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
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
/* index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Basic Usage

```jsx
// Button.jsx
function Button({ variant = 'blue', children }) {
  const variantClasses = {
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    red: 'bg-red-500 hover:bg-red-600',
  }

  return (
    <button className={`
      px-4 py-2
      text-white font-semibold rounded-lg
      ${variantClasses[variant]}
      transition-colors duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
    `}>
      {children}
    </button>
  )
}

export default Button
```

### Common Tailwind Patterns

```jsx
function Card() {
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          Case study
        </div>
        <h2 className="mt-1 text-xl font-semibold text-gray-900">
          Building a SaaS product
        </h2>
        <p className="mt-2 text-gray-500">
          Getting started with building a SaaS product from scratch.
        </p>
        <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          Learn More
        </button>
      </div>
    </div>
  )
}
```

### Responsive Design with Tailwind

```jsx
function ResponsiveCard() {
  return (
    <div className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-4
      p-4
    ">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Feature 1</h3>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Feature 2</h3>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold">Feature 3</h3>
      </div>
    </div>
  )
}
```

### Custom Classes in Tailwind

```jsx
// Using @apply directive
/* components.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600;
  }

  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
}

// Button.jsx
import './components.css'

function Button({ children }) {
  return <button className="btn-primary">{children}</button>
}
```

---

## CSS-in-JS Libraries

### Emotion

```bash
npm install @emotion/react @emotion/styled
```

```jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const buttonStyle = css`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

function Button({ children }) {
  return <button css={buttonStyle}>{children}</button>
}
```

### Emotion Styled

```jsx
/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

// Usage
<Button primary>Click me</Button>
```

---

## Responsive Design

### Media Queries in CSS

```css
/* Responsive.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Tablet */
@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
}
```

### Media Queries in Styled Components

```jsx
const ResponsiveCard = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`
```

### Custom Breakpoints Hook

```jsx
import { useState, useEffect } from 'react'

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState('desktop')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 480) setBreakpoint('mobile')
      else if (width < 768) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Usage
function ResponsiveComponent() {
  const breakpoint = useBreakpoint()

  return (
    <div>
      {breakpoint === 'mobile' && <MobileView />}
      {breakpoint === 'tablet' && <TableView />}
      {breakpoint === 'desktop' && <DesktopView />}
    </div>
  )
}
```

---

## UI Component Libraries

### Material-UI (MUI)

```bash
npm install @mui/material @emotion/react @emotion/styled
```

```jsx
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

function App() {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Button variant="contained" color="primary">
          Hello World
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Ant Design

```bash
npm install antd
```

```jsx
import { Button, Card, Space } from 'antd'

function App() {
  return (
    <Card title="My Card">
      <Space>
        <Button type="primary">Primary Button</Button>
        <Button>Default Button</Button>
      </Space>
    </Card>
  )
}
```

### Chakra UI

```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

```jsx
import { Button, Card, CardBody } from '@chakra-ui/react'

function App() {
  return (
    <Card maxW='sm'>
      <CardBody>
        <Button colorScheme='blue'>Click me</Button>
      </CardBody>
    </Card>
  )
}
```

### Shadcn/ui

```bash
# Shadcn uses a different approach - copy components into your project
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

function App() {
  return (
    <Card>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Theming

### CSS Variables Theming

```css
/* styles/variables.css */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --background: #ffffff;
  --text-color: #333333;
  --border-color: #dee2e6;
}

[data-theme='dark'] {
  --primary-color: #0d6efd;
  --secondary-color: #6c757d;
  --success-color: #198754;
  --danger-color: #dc3545;
  --background: #1a1a1a;
  --text-color: #f8f9fa;
  --border-color: #495057;
}
```

```jsx
// ThemeProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### Styled Components Theme

```jsx
// styles/theme.js
export const lightTheme = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#ffffff',
    text: '#333333'
  }
}

export const darkTheme = {
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    background: '#1a1a1a',
    text: '#f8f9fa'
  }
}

// App.jsx
import { ThemeProvider } from 'styled-components'
import { lightTheme, darkTheme } from './styles/theme'

function App() {
  const [isDark, setIsDark] = useState(false)

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      {/* Your app */}
      <button onClick={() => setIsDark(!isDark)}>Toggle Theme</button>
    </ThemeProvider>
  )
}
```

### Tailwind Dark Mode

```javascript
// tailwind.config.js
export default {
  darkMode: 'class', // or 'media'
  // ...
}
```

```jsx
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded"
    >
      Toggle Theme
    </button>
  )
}
```

---

## Animation

### CSS Transitions

```jsx
// FadeIn.jsx
import './FadeIn.css'

function FadeIn({ children, show }) {
  return (
    <div className={`fade-in ${show ? 'visible' : ''}`}>
      {children}
    </div>
  )
}
```

```css
/* FadeIn.css */
.fade-in {
  opacity: 0;
  transition: opacity 300ms ease-in;
}

.fade-in.visible {
  opacity: 1;
}
```

### CSS Keyframes

```css
/* animations.css */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 300ms ease-out;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s infinite;
}
```

### Framer Motion

```bash
npm install framer-motion
```

```jsx
import { motion } from 'framer-motion'

function AnimatedCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2>Animated Card</h2>
      <p>This card animates in!</p>
    </motion.div>
  )
}

function StaggeredList() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
    >
      {['Item 1', 'Item 2', 'Item 3'].map(item => (
        <motion.li key={item} variants={item}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

### React Spring

```bash
npm install @react-spring/web
```

```jsx
import { useSpring, animated } from '@react-spring/web'

function AnimatedComponent() {
  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 300, friction: 10 }
  })

  return (
    <animated.div style={props}>
      <h2>Hello, I'm animated!</h2>
    </animated.div>
  )
}
```

---

## Practice Exercises

### Exercise 1: Create a Styled Button Component

Create a button component with:
- Multiple variants (primary, secondary, danger)
- Multiple sizes (small, medium, large)
- Hover and active states
- Disabled state

```jsx
// Your implementation
```

### Exercise 2: Create a Responsive Card Grid

Create a card grid that:
- Shows 1 column on mobile
- Shows 2 columns on tablet
- Shows 3 columns on desktop
- Uses CSS Modules or Tailwind

```jsx
// Your implementation
```

### Exercise 3: Create a Theme Toggle

Create a theme toggle that:
- Switches between light and dark themes
- Uses CSS variables
- Persists theme in localStorage

```jsx
// Your implementation
```

---

## Summary

### Choosing a Styling Approach:

```jsx
// For beginners or small projects:
→ Plain CSS or CSS Modules

// For rapid development:
→ Tailwind CSS

// For dynamic, component-scoped styles:
→ Styled Components or Emotion

// For enterprise or quick prototyping:
→ UI Library (MUI, Ant Design, Chakra UI)

// For design system control:
→ Shadcn/ui
```

### Quick Reference:

```jsx
// CSS Modules
import styles from './Component.module.css'
<div className={styles.container}></div>

// Styled Components
import styled from 'styled-components'
const Div = styled.div`...`
<Div></Div>

// Tailwind
<div className="flex items-center justify-between"></div>

// Framer Motion
import { motion } from 'framer-motion'
<motion.div initial={{opacity:0}} animate={{opacity:1}}></motion.div>
```

---

## Next Steps

- [Real Project Implementation](./08-real-project-implementation.md)
- [Best Practices](./09-best-practices-and-patterns.md)
