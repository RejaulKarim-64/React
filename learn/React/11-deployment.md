# React - Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Building for Production](#building-for-production)
3. [Deploying to Vercel](#deploying-to-vercel)
4. [Deploying to Netlify](#deploying-to-netlify)
5. [Deploying to GitHub Pages](#deploying-to-github-pages)
6. [Deploying to AWS S3](#deploying-to-aws-s3)
7. [Deploying to Docker](#deploying-to-docker)
8. [Environment Variables](#environment-variables)
9. [Post-Deployment](#post-deployment)
10. [CI/CD Pipelines](#cicd-pipelines)

---

## Pre-Deployment Checklist

### 1. Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Run type check (if using TypeScript)
npm run type-check

# Run tests
npm run test
```

### 2. Environment Setup

```bash
# Create production environment file
# .env.production
VITE_API_URL=https://api.example.com
VITE_APP_NAME=MyApp
VITE_ANALYTICS_ID=UA-XXXXXXXXX
```

### 3. .gitignore

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build output
dist/
build/

# Environment files
.env
.env.local
.env.production
.env.development

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Misc
*.swp
*.swo
```

### 4. Optimize Assets

```bash
# Check bundle size
npm run build

# Analyze bundle
npm install -D rollup-plugin-visualizer
```

---

## Building for Production

### Standard Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build with report
npm run build -- --mode production
```

### Vite Build Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Output directory
    outDir: 'dist',

    // Generate source maps
    sourcemap: false, // true for debugging

    // Minify
    minify: 'terser',

    // Target browsers
    target: 'es2015',

    // Chunk size warning limit (KB)
    chunkSizeWarningLimit: 1000,

    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunking
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react']
        }
      }
    }
  },

  // Server configuration
  server: {
    port: 3000,
    open: true
  }
})
```

### Advanced Build Options

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // CSS code split
    cssCodeSplit: true,

    // Assets inline limit
    assetsInlineLimit: 4096,

    // Terser options
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log
        drop_debugger: true
      }
    }
  }
})
```

---

## Deploying to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click "Deploy"

### vercel.json Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Environment Variables in Vercel

1. Go to Project Settings → Environment Variables
2. Add variables:
   - `VITE_API_URL`
   - `VITE_APP_NAME`
3. Select environments (Production, Preview, Development)

---

## Deploying to Netlify

### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### Method 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Connect GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click "Deploy site"

### netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[context.production.environment]
  VITE_API_URL = "https://api.example.com"
```

---

## Deploying to GitHub Pages

### Method 1: gh-pages Package

```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
```

```json
// package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist",
    "deploy:force": "gh-pages -d dist --force"
  }
}
```

```bash
# Deploy to GitHub Pages
npm run deploy
```

### Method 2: GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vite Config for GitHub Pages

```javascript
// vite.config.js
export default defineConfig({
  base: '/your-repo-name/', // Add this
  plugins: [react()]
})
```

---

## Deploying to AWS S3

### Prerequisites

```bash
# Install AWS CLI
# https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
```

### Manual Deploy

```bash
# Build the project
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Set bucket policy for website hosting
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

### Deploy Script

```javascript
// scripts/deploy-s3.js
import { execSync } from 'child_process'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { createRequire } from 'module'
const require = createRequire(import.meta.meta)
const fs = require('fs')
const path = require('path')

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

async function uploadFile(filePath, bucketName) {
  const fileContent = fs.readFileSync(filePath)
  const key = filePath.replace('dist/', '')

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    ContentType: getContentType(filePath)
  })

  await s3.send(command)
  console.log(`Uploaded: ${key}`)
}

function getContentType(filePath) {
  const ext = path.extname(filePath)
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  }
  return types[ext] || 'application/octet-stream'
}

async function deploy() {
  const bucketName = process.env.S3_BUCKET_NAME

  console.log('Building project...')
  execSync('npm run build')

  console.log('Uploading to S3...')
  const files = getAllFiles('dist')
  for (const file of files) {
    await uploadFile(file, bucketName)
  }

  console.log('Deploy complete!')
}

function getAllFiles(dirPath) {
  const files = []
  const items = fs.readdirSync(dirPath)

  for (const item of items) {
    const fullPath = path.join(dirPath, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath))
    } else {
      files.push(fullPath)
    }
  }

  return files
}

deploy()
```

---

## Deploying with Docker

### Dockerfile

```dockerfile
# Multi-stage build for smaller image

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### Docker Commands

```bash
# Build image
docker build -t my-react-app .

# Run container
docker run -p 80:80 my-react-app

# Tag for registry
docker tag my-react-app username/my-react-app:latest

# Push to Docker Hub
docker push username/my-react-app:latest
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=https://api.example.com
    restart: unless-stopped
```

---

## Environment Variables

### Creating Environment Files

```bash
# .env - Shared variables
VITE_APP_NAME=MyApp

# .env.local - Local overrides (gitignored)
VITE_API_URL=http://localhost:3000

# .env.production - Production
VITE_API_URL=https://api.example.com
VITE_APP_URL=https://myapp.com

# .env.development - Development
VITE_API_URL=http://localhost:3001
```

### Accessing Variables in Code

```jsx
// VITE_ prefix is required for variables to be available in client code
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME

console.log(apiUrl) // https://api.example.com
console.log(appName) // MyApp
```

### Type Safety for Environment Variables

```typescript
// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ANALYTICS_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check site is accessible
curl https://myapp.com

# Check for console errors
# Open browser DevTools

# Test all features
# - Navigation
# - Forms
# - API calls
# - Authentication
```

### 2. Set Up Monitoring

```jsx
// Error tracking with Sentry
npm install @sentry/react

import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0
})
```

### 3. Analytics

```jsx
// Google Analytics
npm install @analytics/google-analytics

import Analytics from 'analytics'
import googleAnalytics from '@analytics/google-analytics'

const analytics = Analytics({
  app: 'MyApp',
  plugins: [
    googleAnalytics({
      measurementId: import.meta.env.VITE_GA_ID
    })
  ]
})
```

---

## CI/CD Pipelines

### GitHub Actions - Full Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test

      - name: Build
        run: npm run build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm run test

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  image: node:18
  script:
    - npm install -g netlify-cli
    - netlify deploy --prod --dir=dist
  only:
    - main
```

---

## Performance Checklist

### Before Deploying

```bash
# 1. Check bundle size
npm run build

# 2. Analyze bundle
# Add to vite.config.js:
import { visualizer } from 'rollup-plugin-visualizer'
plugins: [
  react(),
  visualizer({ open: true })
]

# 3. Check Lighthouse score
# Open DevTools → Lighthouse → Run audit

# 4. Test on slow 3G
# Open DevTools → Network → Slow 3G
```

### Optimization Tips

```javascript
// 1. Code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))

// 2. Tree shaking
// Import only what you need
import { Button } from '@mui/material'

// 3. Compression
// Vite does this automatically

// 4. Image optimization
// Use WebP format, compress images

// 5. Remove unused code
// Purge CSS, remove unused dependencies
```

---

## Summary

### Deployment Platforms Comparison

| Platform | Best For | Price | Features |
|----------|----------|-------|----------|
| **Vercel** | React apps | Free tier | Automatic HTTPS, Preview deployments |
| **Netlify** | JAMstack | Free tier | Forms, Functions, Edge |
| **GitHub Pages** | Open source | Free | Simple, GitHub integrated |
| **AWS S3** | Custom setup | Pay per use | Full control, scalable |
| **Docker** | Enterprise | Varies | Containerized, portable |

### Quick Deploy Commands

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run deploy

# AWS S3
aws s3 sync dist/ s3://bucket-name --delete
```

---

## Learning Complete!

You've now completed the comprehensive React and Vite learning guide. Here's what you've covered:

1. ✅ Introduction and Setup
2. ✅ React Basics (Components & JSX)
3. ✅ State and Props
4. ✅ React Hooks
5. ✅ Routing and Navigation
6. ✅ API Integration
7. ✅ Styling and UI
8. ✅ Real Project Implementation
9. ✅ Best Practices and Patterns
10. ✅ Common Dependencies
11. ✅ Deployment

### Next Steps for Your Learning Journey:

1. **Build Projects**: Apply what you've learned to real projects
2. **Read Documentation**: Check [react.dev](https://react.dev/) and [vitejs.dev](https://vitejs.dev/)
3. **Join Community**: Stack Overflow, Reddit r/reactjs, Discord servers
4. **Stay Updated**: Follow React blog, subscribe to newsletters
5. **Contribute**: Open source projects, share knowledge

### Recommended Project Ideas:

- Task management app
- Weather application
- E-commerce store
- Social media dashboard
- Real-time chat application
- Blog platform
- Portfolio website

Good luck with your React journey!
