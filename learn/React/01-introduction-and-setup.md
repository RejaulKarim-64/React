# React & Vite - Introduction and Setup

## Table of Contents
1. [What is React?](#what-is-react)
2. [What is Vite?](#what-is-vite)
3. [Prerequisites](#prerequisites)
4. [Creating Your First Project](#creating-your-first-project)
5. [Project Structure](#project-structure)
6. [Understanding package.json](#understanding-packagejson)
7. [Running Your Project](#running-your-project)

---

## What is React?

**React** is a JavaScript library for building user interfaces, created and maintained by Meta (Facebook).

### Key Features:
- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state, and React will efficiently update and render components
- **Learn Once, Write Anywhere**: Use React on the web, mobile (React Native), or desktop

### Why Use React?
- Large ecosystem and community
- Reusable components
- Virtual DOM for better performance
- Strong job market demand
- Used by Facebook, Instagram, Netflix, Airbnb, and thousands of companies

---

## What is Vite?

**Vite** (French word for "fast") is a next-generation frontend tooling that provides a faster and leaner development experience.

### Why Vite over Create React App?
- **Instant Server Start**: Uses native ES modules
- **Lightning Fast HMR**: Hot Module Replacement regardless of app size
- **Rich Features**: TypeScript, JSX, CSS, PostCSS out of the box
- **Optimized Build**: Uses Rollup for production builds
- **Officially Recommended**: React now recommends Vite over CRA

---

## Prerequisites

Before starting, ensure you have:

### 1. Node.js Installed
```bash
# Check if Node.js is installed
node --version
# Should show v18.0.0 or higher

# If not installed, download from:
# https://nodejs.org/
```

### 2. npm (comes with Node.js)
```bash
# Check npm version
npm --version
# Should show 9.0.0 or higher
```

### 3. A Code Editor
- **Visual Studio Code (Recommended)**: https://code.visualstudio.com/

### 4. VS Code Extensions (Recommended)
- ESLint
- Prettier
- ES7+ React/Redux/React-Native snippets (by dsznajder)
- Auto Rename Tag
- Bracket Pair Colorizer

---

## Creating Your First Project

### Method 1: Using Vite (Recommended)

```bash
# Create a new Vite project with React
npm create vite@latest my-first-react-app -- --template react

# Navigate into the project
cd my-first-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Method 2: Using with TypeScript

```bash
# Create React + TypeScript project
npm create vite@latest my-react-ts-app -- --template react-ts

cd my-react-ts-app
npm install
npm run dev
```

### Method 3: Interactive Setup

```bash
# This will prompt you to select framework and variant
npm create vite@latest

# Follow the prompts:
# ✔ Project name: › my-react-app
# ✔ Select a framework: › React
# ✔ Select a variant: › JavaScript / TypeScript
```

### Using yarn (Alternative to npm)

```bash
# Install yarn globally
npm install -g yarn

# Create project
yarn create vite my-react-app --template react
cd my-react-app
yarn
yarn dev
```

### Using pnpm (Faster Alternative)

```bash
# Install pnpm
npm install -g pnpm

# Create project
pnpm create vite my-react-app --template react
cd my-react-app
pnpm install
pnpm dev
```

---

## Project Structure

After creating a project, your folder structure looks like this:

```
my-react-app/
├── node_modules/          # Installed dependencies
├── public/                # Static assets
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── assets/            # Images, fonts, etc.
│   │   └── react.svg
│   ├── App.css            # App component styles
│   ├── App.jsx            # Main App component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── .eslintrc.cjs          # ESLint configuration
├── .gitignore             # Git ignore rules
├── index.html             # HTML template
├── package.json           # Project metadata
├── README.md              # Project documentation
├── vite.config.js         # Vite configuration
└── yarn.lock / package-lock.json  # Dependency lock file
```

---

## Understanding package.json

The `package.json` is the heart of your project. Let's break it down:

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8"
  }
}
```

### Scripts Explained:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (creates `dist` folder) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

### Dependencies Explained:

- **dependencies**: Packages needed for production
  - `react`: Core React library
  - `react-dom`: React DOM renderer

- **devDependencies**: Packages only needed during development
  - `vite`: Build tool
  - `@vitejs/plugin-react`: Vite plugin for React
  - `eslint`: Code linting

---

## Running Your Project

### Development Mode

```bash
npm run dev
```

Output:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.5:5173/
  ➜  press h + enter to show help
```

Open your browser and navigate to `http://localhost:5173/`

### Production Build

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview
```

The build creates a `dist` folder with optimized files ready for deployment.

---

## Understanding the Entry Point

### main.jsx - Entry Point

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**What this does:**
1. Imports React and ReactDOM
2. Imports your main App component
3. Finds the `<div id="root"></div>` in `index.html`
4. Renders your React app into that div

### index.html - HTML Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

## Common First-Time Commands

```bash
# Install a new dependency
npm install package-name

# Install a dev dependency
npm install -D package-name

# Install specific version
npm install package-name@1.2.3

# Uninstall a package
npm uninstall package-name

# Update all dependencies
npm update

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] VS Code installed with extensions
- [ ] Created first Vite + React project
- [ ] Successfully ran `npm run dev`
- [ ] Opened browser at localhost:5173
- [ ] Reviewed project structure
- [ ] Understand package.json scripts

---

## Next Steps

Now that your environment is set up, continue to:
- [React Basics - Components & JSX](./02-react-basics-components-jsx.md)

---

## Useful Resources

- [Official React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React GitHub](https://github.com/facebook/react)
- [Vite GitHub](https://github.com/vitejs/vite)
