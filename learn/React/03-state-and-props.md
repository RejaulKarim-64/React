# React State and Props

## Table of Contents
1. [Understanding State](#understanding-state)
2. [useState Hook](#usestate-hook)
3. [Props vs State](#props-vs-state)
4. [Lifting State Up](#lifting-state-up)
5. [State Best Practices](#state-best-practices)
6. [Forms and State](#forms-and-state)
7. [Practice Exercises](#practice-exercises)

---

## Understanding State

### What is State?

**State** is data that changes over time within a component. Unlike props (which are passed in), state is managed internally by the component.

### State Characteristics:
- Managed within component
- Changes trigger re-renders
- Private to the component (by default)
- Should be simple/minimal

### When to Use State:

```jsx
// ✅ Use state for:
// - Form inputs
// - Toggles (show/hide)
// - Data from API
// - Current selection
// - Counters, timers

// ❌ Don't use state for:
// - Derived data (can be computed)
// - Props (already have them)
// - Static content
```

---

## useState Hook

### Basic Syntax

```jsx
import { useState } from 'react'

function Counter() {
  // state variable, setter function
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### useState Breakdown:

```jsx
const [state, setState] = useState(initialValue)

// state        → Current value
// setState     → Function to update value
// initialValue → Starting value
```

### Different Initial Values

```jsx
function Example() {
  // Number
  const [count, setCount] = useState(0)

  // String
  const [name, setName] = useState("")

  // Boolean
  const [isVisible, setIsVisible] = useState(true)

  // Array
  const [items, setItems] = useState([])

  // Object
  const [user, setUser] = useState({
    name: "",
    email: ""
  })

  // Null
  const [data, setData] = useState(null)

  return <div>...</div>
}
```

### Updating State

```jsx
function Counter() {
  const [count, setCount] = useState(0)

  // Direct update
  const increment = () => {
    setCount(count + 1)
  }

  // Functional update (better for multiple updates)
  const incrementThree = () => {
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={incrementThree}>+3</button>
    </div>
  )
}
```

### State with Objects

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: "John",
    age: 30,
    email: "john@example.com"
  })

  // ❌ WRONG - This removes other properties
  const updateNameWrong = () => {
    setUser({ name: "Jane" })
  }

  // ✅ CORRECT - Spread existing properties
  const updateName = () => {
    setUser({
      ...user,
      name: "Jane"
    })
  }

  // ✅ CORRECT - Functional update
  const updateAge = () => {
    setUser(prev => ({
      ...prev,
      age: prev.age + 1
    }))
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={updateName}>Change Name</button>
    </div>
  )
}
```

### State with Arrays

```jsx
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Learn React" }
  ])

  // Add item
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }])
  }

  // Remove item
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Update item
  const updateTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
```

---

## Props vs State

### Comparison:

| Feature | Props | State |
|---------|-------|-------|
| Source | Passed from parent | Managed within component |
| Mutability | Read-only (don't modify!) | Can be changed |
| Changes | Triggers re-render | Triggers re-render |
| Scope | Child component | Component itself |

### Example:

```jsx
// Parent component - has state
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      {/* Pass state as prop */}
      <Counter value={count} onIncrement={() => setCount(count + 1)} />
    </div>
  )
}

// Child component - receives props
function Counter({ value, onIncrement }) {
  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  )
}
```

---

## Lifting State Up

### What is Lifting State Up?

When multiple components need the same state, move it to their nearest common ancestor.

### Before (State in Child):

```jsx
// ❌ State stuck in child - parent can't access it
function Child() {
  const [value, setValue] = useState("")
  return <input value={value} onChange={(e) => setValue(e.target.value)} />
}

function Parent() {
  return (
    <div>
      <Child />
      <p>Can't access child's value here</p>
    </div>
  )
}
```

### After (Lifted to Parent):

```jsx
// ✅ State in parent - shared between components
function Child({ value, onChange }) {
  return <input value={value} onChange={onChange} />
}

function Display({ value }) {
  return <p>You typed: {value}</p>
}

function Parent() {
  const [value, setValue] = useState("")

  return (
    <div>
      <Child value={value} onChange={(e) => setValue(e.target.value)} />
      <Display value={value} />
    </div>
  )
}
```

### Real Example: Temperature Converter

```jsx
function TemperatureInput({ scale, temperature, onTemperatureChange }) {
  return (
    <fieldset>
      <legend>Enter temperature in {scale}:</legend>
      <input
        value={temperature}
        onChange={(e) => onTemperatureChange(e.target.value)}
      />
    </fieldset>
  )
}

function BoilingVerdict({ celsius }) {
  if (celsius >= 100) {
    return <p>The water would boil.</p>
  }
  return <p>The water would not boil.</p>
}

function Calculator() {
  const [temperature, setTemperature] = useState("")
  const [scale, setScale] = useState("c")

  const handleCelsiusChange = (temperature) => {
    setTemperature(temperature)
    setScale("c")
  }

  const handleFahrenheitChange = (temperature) => {
    setTemperature(temperature)
    setScale("f")
  }

  const toCelsius = () => {
    if (scale === "c") return temperature
    return (temperature - 32) * 5 / 9
  }

  return (
    <div>
      <TemperatureInput
        scale="c"
        temperature={scale === "c" ? temperature : toCelsius()}
        onTemperatureChange={handleCelsiusChange}
      />
      <TemperatureInput
        scale="f"
        temperature={scale === "f" ? temperature : (temperature * 9 / 5 + 32)}
        onTemperatureChange={handleFahrenheitChange}
      />
      <BoilingVerdict celsius={toCelsius()} />
    </div>
  )
}
```

---

## State Best Practices

### 1. Keep State Simple

```jsx
// ❌ BAD - Too much state
function UserForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  return <form>...</form>
}

// ✅ GOOD - Grouped state
function UserForm() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form>
      <input name="firstName" value={user.firstName} onChange={handleChange} />
      <input name="lastName" value={user.lastName} onChange={handleChange} />
      <input name="email" value={user.email} onChange={handleChange} />
      <input name="phone" value={user.phone} onChange={handleChange} />
    </form>
  )
}
```

### 2. Avoid Duplicate State

```jsx
// ❌ BAD - Duplicate state
function ProductList() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0) // Can be computed!

  return <p>Total: {total}</p>
}

// ✅ GOOD - Derived from state
function ProductList() {
  const [products, setProducts] = useState([])

  const total = products.reduce((sum, p) => sum + p.price, 0)

  return <p>Total: {total}</p>
}
```

### 3. Avoid Props in State

```jsx
// ❌ BAD - Copying props to state
function Avatar({ userId }) {
  const [id, setId] = useState(userId)

  if (userId !== id) {
    setId(userId)
  }

  return <img src={`/avatar/${id}`} />
}

// ✅ GOOD - Use props directly
function Avatar({ userId }) {
  return <img src={`/avatar/${userId}`} />
}
```

### 4. Update State Immutably

```jsx
// ❌ BAD - Mutating state directly
function addItem() {
  items.push(newItem)
  setItems(items)
}

// ✅ GOOD - Creating new array
function addItem() {
  setItems([...items, newItem])
}
```

---

## Forms and State

### Controlled Components

```jsx
function Form() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted:", formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />

      <button type="submit">Submit</button>
    </form>
  )
}
```

### Select Dropdown

```jsx
function SelectForm() {
  const [selectedOption, setSelectedOption] = useState("")

  return (
    <select
      value={selectedOption}
      onChange={(e) => setSelectedOption(e.target.value)}
    >
      <option value="">Choose...</option>
      <option value="option1">Option 1</option>
      <option value="option2">Option 2</option>
      <option value="option3">Option 3</option>
    </select>
  )
}
```

### Checkbox

```jsx
function CheckboxForm() {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      I agree to the terms
    </label>
  )
}
```

### Multiple Checkboxes

```jsx
function CheckboxGroup() {
  const [selected, setSelected] = useState([])

  const handleChange = (value) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    )
  }

  return (
    <div>
      {["Option 1", "Option 2", "Option 3"].map(option => (
        <label key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => handleChange(option)}
          />
          {option}
        </label>
      ))}
      <p>Selected: {selected.join(", ")}</p>
    </div>
  )
}
```

### Radio Buttons

```jsx
function RadioGroup() {
  const [selected, setSelected] = useState("option1")

  return (
    <div>
      <label>
        <input
          type="radio"
          value="option1"
          checked={selected === "option1"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Option 1
      </label>

      <label>
        <input
          type="radio"
          value="option2"
          checked={selected === "option2"}
          onChange={(e) => setSelected(e.target.value)}
        />
        Option 2
      </label>
    </div>
  )
}
```

---

## Practice Exercises

### Exercise 1: Counter App

Create a counter with:
- Increment button
- Decrement button
- Reset button
- Display current count

```jsx
function Counter() {
  // Your code here
}
```

### Exercise 2: Todo App

Create a todo app with:
- Input to add new todos
- List of todos
- Delete button for each todo
- Checkbox to mark complete

```jsx
function TodoApp() {
  // Your code here
}
```

### Exercise 3: Form Validation

Create a form with:
- Name field (required)
- Email field (must be valid email)
- Submit button (disabled until valid)
- Show errors

```jsx
function ValidatedForm() {
  // Your code here
}
```

---

## Summary

### Key Concepts:
- **State**: Component's internal data that can change
- **useState**: Hook to add state to functional components
- **Props**: Data passed from parent to child (read-only)
- **Lifting State Up**: Moving state to common ancestor for sharing
- **Controlled Components**: Form inputs controlled by React state

### Common Patterns:

```jsx
// Basic state
const [value, setValue] = useState(initial)

// Object state
const [obj, setObj] = useState({ key: value })

// Update object
setObj(prev => ({ ...prev, key: newValue }))

// Array state
const [arr, setArr] = useState([])

// Add to array
setArr([...arr, newItem])

// Remove from array
setArr(arr.filter(item => item.id !== id))

// Update array item
setArr(arr.map(item =>
  item.id === targetId ? { ...item, key: newValue } : item
))
```

---

## Next Steps

- [React Hooks](./04-react-hooks.md) - Learn more hooks for complex state
- [React Router](./05-routing-and-navigation.md) - Add navigation
