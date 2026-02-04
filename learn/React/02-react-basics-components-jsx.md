# React Basics - Components & JSX

## Table of Contents
1. [Understanding Components](#understanding-components)
2. [JSX Syntax](#jsx-syntax)
3. [Your First Component](#your-first-component)
4. [Component Types](#component-types)
5. [Props - Passing Data](#props---passing-data)
6. [Conditional Rendering](#conditional-rendering)
7. [Lists and Keys](#lists-and-keys)
8. [Practice Exercises](#practice-exercises)

---

## Understanding Components

### What is a Component?

A **component** is a reusable, self-contained piece of UI. Think of components like LEGO blocks - you build complex interfaces by combining simple pieces.

### Component Characteristics:
- **Reusable**: Can be used multiple times
- **Self-contained**: Has its own logic and markup
- **Composable**: Components can contain other components
- **Independent**: Changes in one component don't affect others

### Example: Building a Card

```jsx
// A simple card component
function Card() {
  return (
    <div className="card">
      <h2>Card Title</h2>
      <p>Card description goes here</p>
    </div>
  )
}
```

---

## JSX Syntax

### What is JSX?

**JSX** is a syntax extension for JavaScript that lets you write HTML-like code inside JavaScript files. It's not HTML - it gets compiled to regular JavaScript.

### Key JSX Rules:

#### 1. Must Return a Single Element
```jsx
// ❌ WRONG - Multiple elements
function BadComponent() {
  return (
    <h1>Title</h1>
    <p>Description</p>
  )
}

// ✅ CORRECT - Wrapped in fragment
function GoodComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  )
}
```

#### 2. Use className, not class
```jsx
// ❌ WRONG
<div class="container">...</div>

// ✅ CORRECT
<div className="container">...</div>
```

#### 3. Self-Closing Tags Need /
```jsx
// ❌ WRONG
<img src="image.jpg">
<input type="text">
<br>

// ✅ CORRECT
<img src="image.jpg" />
<input type="text" />
<br />
```

#### 4. camelCase for Attributes
```jsx
// ❌ WRONG
<div onclick="handleClick">

// ✅ CORRECT
<div onClick={handleClick}>
```

#### 5. Expressions in Curly Braces {}
```jsx
function Greeting() {
  const name = "John"
  const age = 30

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
      <p>Next year you'll be {age + 1}</p>
    </div>
  )
}
```

---

## Your First Component

### Creating a New Component

```jsx
// src/components/Greeting.jsx

function Greeting() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to React</p>
    </div>
  )
}

export default Greeting
```

### Using the Component

```jsx
// src/App.jsx
import Greeting from './components/Greeting'

function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  )
}

export default App
```

---

## Component Types

### 1. Functional Components (Modern Standard)

```jsx
// Simple functional component
function Welcome() {
  return <h1>Welcome!</h1>
}

// Arrow function component
const Welcome = () => {
  return <h1>Welcome!</h1>
}

// Concise arrow function (implicit return)
const Welcome = () => <h1>Welcome!</h1>
```

### 2. Component with Multiple Elements

```jsx
function UserProfile() {
  return (
    <div className="profile">
      <img src="avatar.jpg" alt="Profile" />
      <h2>John Doe</h2>
      <p>Software Developer</p>
      <button>Contact</button>
    </div>
  )
}
```

### 3. Nested Components

```jsx
// Button component
function Button({ text }) {
  return <button>{text}</button>
}

// Card component using Button
function Card({ title, description }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{description}</p>
      <Button text="Learn More" />
    </div>
  )
}

// App using Card
function App() {
  return (
    <div>
      <Card
        title="React Basics"
        description="Learn React from scratch"
      />
    </div>
  )
}
```

---

## Props - Passing Data

### What are Props?

**Props** (properties) are how you pass data from parent to child components.

### Basic Props

```jsx
// Child component receiving props
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>
}

// Parent component passing props
function App() {
  return <Greeting name="John" />
}
```

### Destructuring Props (Recommended)

```jsx
// Destructuring in parameters
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Age: {age}</p>
    </div>
  )
}

// Usage
function App() {
  return <Greeting name="John" age={30} />
}
```

### Default Props

```jsx
function Greeting({ name = "Guest" }) {
  return <h1>Hello, {name}!</h1>
}

// <Greeting /> → "Hello, Guest!"
// <Greeting name="John" /> → "Hello, John!"
```

### Passing Different Data Types

```jsx
function UserCard({ name, age, isAdmin, skills, onEdit }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Admin: {isAdmin ? "Yes" : "No"}</p>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
      <button onClick={onEdit}>Edit</button>
    </div>
  )
}

// Usage
function App() {
  const handleEdit = () => {
    console.log("Edit clicked")
  }

  return (
    <UserCard
      name="John Doe"
      age={30}
      isAdmin={true}
      skills={["JavaScript", "React", "Node.js"]}
      onEdit={handleEdit}
    />
  )
}
```

### Props with Children

```jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="content">{children}</div>
    </div>
  )
}

// Usage
function App() {
  return (
    <Card title="Welcome">
      <p>This is the card content</p>
      <button>Click me</button>
    </Card>
  )
}
```

---

## Conditional Rendering

### 1. Ternary Operator

```jsx
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please log in</h1>
      )}
    </div>
  )
}
```

### 2. Logical AND (&&)

```jsx
function Notification({ message }) {
  return (
    <div>
      {message && <p className="notification">{message}</p>}
    </div>
  )
}

// If message is empty/null, nothing renders
```

### 3. Early Return

```jsx
function UserPage({ user }) {
  if (!user) {
    return <p>Please log in</p>
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
    </div>
  )
}
```

### 4. Using Variables

```jsx
function Status({ status }) {
  let statusMessage
  let statusClass

  if (status === "loading") {
    statusMessage = "Loading..."
    statusClass = "loading"
  } else if (status === "success") {
    statusMessage = "Success!"
    statusClass = "success"
  } else if (status === "error") {
    statusMessage = "Error!"
    statusClass = "error"
  }

  return <p className={statusClass}>{statusMessage}</p>
}
```

---

## Lists and Keys

### Rendering Lists

```jsx
function TodoList() {
  const todos = [
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build projects" },
    { id: 3, text: "Get hired" }
  ]

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  )
}
```

### Understanding Keys

```jsx
// ❌ WRONG - Using index as key (can cause issues)
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// ✅ CORRECT - Using unique ID
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

### Keys Help React:
- Identify which items changed
- Identify which items were added/removed
- Update the DOM efficiently

### Extracting List Components

```jsx
function TodoItem({ todo }) {
  return (
    <li>
      <span>{todo.text}</span>
      {todo.completed && " ✓"}
    </li>
  )
}

function TodoList() {
  const todos = [
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Build projects", completed: false }
  ]

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  )
}
```

---

## Practice Exercises

### Exercise 1: Create a User Card Component

Create a component that displays:
- User avatar (use an image)
- User name
- User role
- A "Follow" button

```jsx
// Your code here
function UserCard({ name, role, avatar }) {
  return (
    // Implement this
  )
}
```

### Exercise 2: Create a Product List

Create a product list that displays:
- Multiple products with:
  - Product name
  - Price
  - Description
- Use array.map() to render the list

```jsx
// Your code here
const products = [
  { id: 1, name: "Laptop", price: 999, description: "Powerful laptop" },
  { id: 2, name: "Phone", price: 699, description: "Smartphone" },
  { id: 3, name: "Tablet", price: 499, description: "Tablet device" }
]

function ProductList({ products }) {
  return (
    // Implement this
  )
}
```

### Exercise 3: Conditional Alert

Create an Alert component that shows different alerts based on type:

```jsx
// Your code here
function Alert({ type, message }) {
  // type can be: 'success', 'warning', 'error', 'info'
  // Show different styles based on type
}
```

---

## Component Best Practices

1. **One Component, One Responsibility**
   ```jsx
   // Good
   function UserHeader() { ... }
   function UserStats() { ... }
   function UserActions() { ... }

   // Avoid
   function UserEverything() { ... }
   ```

2. **Use Descriptive Names**
   ```jsx
   // Good
   function UserProfileCard() { ... }

   // Avoid
   function Component1() { ... }
   ```

3. **Keep Components Small**
   - Aim for under 200 lines
   - Extract reusable pieces
   - Focus on single purpose

4. **Use Props for Configuration**
   ```jsx
   // Good - Configurable
   <Button variant="primary" size="large">Click</Button>

   // Avoid - Hardcoded
   function Button() {
     return <button className="btn-primary btn-large">Click</button>
   }
   ```

---

## Summary

### Key Points:
- Components are reusable UI building blocks
- JSX looks like HTML but is JavaScript
- Always return a single element (use fragments `<>...</>`)
- Use `className` instead of `class`
- Props pass data from parent to child
- Conditional rendering uses ternary, &&, or if statements
- Lists need unique keys for efficient rendering

### Common Commands:

```bash
# Create a new component file
touch src/components/MyComponent.jsx

# While developing
npm run dev

# Check for errors
npm run lint
```

---

## Next Steps

- [State and Props](./03-state-and-props.md)
- [React Hooks](./04-react-hooks.md)
