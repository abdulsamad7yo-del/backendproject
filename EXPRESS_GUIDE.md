# 🚀 Express.js Comprehensive Guide

**Complete Learning Resource for Express.js with Real Project Examples**

---

## 📚 Table of Contents

1. [What is Express.js?](#what-is-expressjs)
2. [Why Use Express.js?](#why-use-expressjs)
3. [Installation & Setup](#installation--setup)
4. [Core Concepts](#core-concepts)
5. [Middleware Deep Dive](#middleware-deep-dive)
6. [Routing System](#routing-system)
7. [Request & Response Handling](#request--response-handling)
8. [Error Handling](#error-handling)
9. [Authentication & Security](#authentication--security)
10. [Best Practices](#best-practices)
11. [Common Patterns](#common-patterns)

---

## What is Express.js?

**Express.js** is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications.

```
┌─────────────────────────────────────────────┐
│           Express.js Framework              │
├─────────────────────────────────────────────┤
│  • Routing                                   │
│  • Middleware                                │
│  • Request/Response handling                 │
│  • Error handling                            │
│  • Static file serving                       │
│  • Template engine support                   │
│  • Cookie & Session management              │
└─────────────────────────────────────────────┘
```

### Quick Statistics

| Feature | Details |
|---------|---------|
| **Current Version** | 5.2.1 |
| **Package Size** | ~50KB (minified) |
| **Dependencies** | ~30 core packages |
| **Download/Month** | 50M+ downloads |
| **Use Cases** | REST APIs, Web Apps, Microservices |

---

## Why Use Express.js?

### ✅ Advantages

| Feature | Benefit |
|---------|---------|
| **Minimal** | Start small, add what you need |
| **Flexible** | Build any architecture you want |
| **Fast** | Lightweight and high performance |
| **Large Ecosystem** | 1000s of middleware packages |
| **Industry Standard** | Used by Uber, IBM, PayPal |
| **Great Documentation** | Official docs + community resources |
| **Middleware Chain** | Easy to add plugins and extensions |
| **RESTful** | Perfect for building REST APIs |

### ❌ When NOT to Use

- Single Page Applications (SPA) - Use frameworks like Next.js, Nuxt.js
- Real-time Applications - Combine with Socket.io or use specialized frameworks
- GraphQL Only - Consider Apollo Server, Hasura
- Static Sites - Use Static Site Generators like Hugo, Jekyll

---

## Installation & Setup

### Step 1: Initialize Node Project

```bash
npm init -y
```

This creates `package.json` with default settings.

### Step 2: Install Express

```bash
npm install express
```

This adds Express to your `node_modules` and updates `package.json`.

### Step 3: Create Entry Point

Create `index.js` or `app.js`:

```javascript
import express from 'express';

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 4: Run Server

```bash
node index.js
```

### Full Setup for Development

```bash
# Install Express
npm install express

# Install dev dependencies
npm install -D nodemon prettier

# Create directory structure
mkdir -p src/{routes,controllers,middlewares,utils}

# Update package.json scripts
# {
#   "scripts": {
#     "dev": "nodemon src/index.js",
#     "start": "node src/index.js"
#   }
# }

# Start development
npm run dev
```

---

## Core Concepts

### 1. Application Object (app)

The Express application instance that handles all HTTP requests.

```javascript
import express from 'express';
const app = express();

// Configure the app
app.use(express.json());      // Middleware
app.get('/', (req, res) => {  // Route handler
    res.send('Hello World');
});

app.listen(3000);              // Start server
```

### 2. Request Object (req)

Contains information about the HTTP request.

```javascript
app.get('/user/:id', (req, res) => {
    // req.params - URL parameters
    console.log(req.params.id);           // "123"
    
    // req.query - Query string parameters
    console.log(req.query.page);          // "1"
    
    // req.body - Request body (needs middleware)
    console.log(req.body);                // { name: "John" }
    
    // req.headers - HTTP headers
    console.log(req.headers['content-type']);
    
    // req.cookies - Parsed cookies
    console.log(req.cookies.sessionId);
    
    // req.user - Attached by auth middleware
    console.log(req.user);
});
```

### 3. Response Object (res)

Used to send response to client.

```javascript
app.get('/example', (req, res) => {
    // Send plain text
    res.send('Simple text response');
    
    // Send JSON
    res.json({ message: 'JSON response', status: 'success' });
    
    // Send with status code
    res.status(201).send('Created');
    
    // Send file
    res.sendFile('/path/to/file.pdf');
    
    // Set headers
    res.set('X-Custom-Header', 'value');
    
    // Redirect
    res.redirect('/new-path');
    
    // Render template
    res.render('index', { name: 'John' });
});
```

### 4. Route Handler

Function that processes a request and sends response.

```javascript
// Basic structure:
app.METHOD(PATH, HANDLER_FUNCTION)

// Examples:
app.get('/users', (req, res) => {
    res.json({ users: [] });
});

app.post('/users', (req, res) => {
    res.status(201).json({ id: 1 });
});

app.put('/users/:id', (req, res) => {
    res.json({ updated: true });
});

app.delete('/users/:id', (req, res) => {
    res.json({ deleted: true });
});
```

---

## Middleware Deep Dive

### What is Middleware?

Middleware are functions that have access to `req`, `res`, and `next`. They can:
- Execute code
- Modify request/response
- End request-response cycle
- Call next middleware

### Middleware Flow Diagram

```
Client Request
     ↓
┌────────────────────────────────────┐
│  Middleware 1 (CORS)              │ → Modify req, call next()
└────────────────────────────────────┘
     ↓
┌────────────────────────────────────┐
│  Middleware 2 (JSON Parser)       │ → Parse body, call next()
└────────────────────────────────────┘
     ↓
┌────────────────────────────────────┐
│  Middleware 3 (Auth)              │ → Verify token, call next()
└────────────────────────────────────┘
     ↓
┌────────────────────────────────────┐
│  Route Handler                     │ → Process request
└────────────────────────────────────┘
     ↓
     Response sent to Client
```

### Types of Middleware

#### 1. **Built-in Middleware**

```javascript
// Parse JSON request body
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Parse cookies
app.use(cookieParser());
```

#### 2. **Third-party Middleware**

```javascript
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

// Enable CORS
app.use(cors());

// Compress responses
app.use(compression());

// Secure HTTP headers
app.use(helmet());
```

#### 3. **Custom Middleware**

```javascript
// Logging middleware
const logger = (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();  // Pass to next middleware
};

app.use(logger);

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: 'No token' });
    }
    // Verify token...
    req.user = { id: 1 };  // Attach user
    next();
};

app.use(authenticate);

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
```

### Middleware Execution Order

```javascript
// Middleware executes in order of definition
app.use(middleware1);  // Executes 1st
app.use(middleware2);  // Executes 2nd
app.get('/', middleware3, handler);  // middleware3, then handler
```

**IMPORTANT:** In this project, middleware is used in `app.js`:

```javascript
// src/app.js
import express from 'express';
import cors from 'cors';
import cookiesParser from 'cookie-parser';

const app = express();

// CORS middleware - allow requests from any origin
app.use(cors({
    origin: "*",
    credentials: true
}));

// JSON parser - limit to 16KB
app.use(express.json({ limit: "16kb" }));

// URL encoder - handle special characters in URLs
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

// Static files - serve files from public folder
app.use(express.static("public"));

// Cookie parser - parse and manage cookies
app.use(cookiesParser());
```

---

## Routing System

### Basic Routing

```javascript
// GET request
app.get('/users', (req, res) => {
    res.json({ message: 'Get all users' });
});

// POST request
app.post('/users', (req, res) => {
    res.json({ message: 'Create user' });
});

// PUT request (full update)
app.put('/users/:id', (req, res) => {
    res.json({ message: `Update user ${req.params.id}` });
});

// PATCH request (partial update)
app.patch('/users/:id', (req, res) => {
    res.json({ message: `Partially update user ${req.params.id}` });
});

// DELETE request
app.delete('/users/:id', (req, res) => {
    res.json({ message: `Delete user ${req.params.id}` });
});
```

### Route Parameters

```javascript
// /:id - captures "123" from /users/123
app.get('/users/:id', (req, res) => {
    console.log(req.params.id);  // "123"
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
    console.log(req.params.userId);   // "123"
    console.log(req.params.postId);   // "456"
});

// Optional parameters (regex)
app.get('/files/:filename?', (req, res) => {
    if (req.params.filename) {
        res.send(`File: ${req.params.filename}`);
    } else {
        res.send('List all files');
    }
});
```

### Query Parameters

```javascript
// /search?query=express&limit=10
app.get('/search', (req, res) => {
    console.log(req.query.query);   // "express"
    console.log(req.query.limit);   // "10"
});
```

### Router Objects

Organize routes into modules:

```javascript
// routes/user.routes.js
import { Router } from 'express';
const router = Router();

router.post('/register', (req, res) => {
    res.json({ message: 'Register user' });
});

router.post('/login', (req, res) => {
    res.json({ message: 'Login user' });
});

router.get('/profile', (req, res) => {
    res.json({ message: 'Get profile' });
});

export default router;

// In app.js
import userRouter from './routes/user.routes.js';
app.use('/api/v1/users', userRouter);

// Routes become:
// POST /api/v1/users/register
// POST /api/v1/users/login
// GET /api/v1/users/profile
```

**This project structure:**

```
src/
├── app.js (imports and registers routers)
│
└── routes/
    ├── user.routes.js
    ├── video.routes.js
    ├── comment.routes.js
    ├── like.routes.js
    ├── playlist.routes.js
    ├── subscription.routes.js
    └── dashboard.routes.js
```

---

## Request & Response Handling

### Parsing Request Data

```javascript
// JSON body (needs middleware)
app.use(express.json());
app.post('/data', (req, res) => {
    console.log(req.body);  // { name: "John" }
});

// Form data (URL encoded)
app.use(express.urlencoded({ extended: true }));
app.post('/form', (req, res) => {
    console.log(req.body);  // { username: "john", password: "123" }
});

// File upload (needs multer middleware)
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
    console.log(req.file);  // File information
    console.log(req.body);  // Other form fields
});

// Cookies
app.use(cookieParser());
app.get('/cookies', (req, res) => {
    console.log(req.cookies);  // { sessionId: "abc123" }
});

// URL parameters
app.get('/users/:id', (req, res) => {
    console.log(req.params.id);  // "123"
});

// Query parameters
app.get('/search', (req, res) => {
    console.log(req.query.page);  // "1"
});
```

### Sending Responses

```javascript
// Send text
app.get('/text', (req, res) => {
    res.send('Plain text response');
});

// Send JSON
app.get('/json', (req, res) => {
    res.json({ name: 'John', age: 30 });
});

// Send with status code
app.post('/create', (req, res) => {
    res.status(201).json({ id: 1, message: 'Created' });
});

// Send file
app.get('/download', (req, res) => {
    res.download('file.pdf');
});

// Send HTML file
app.get('/page', (req, res) => {
    res.sendFile('/path/to/index.html');
});

// Set custom headers
app.get('/headers', (req, res) => {
    res.set('X-Custom', 'value');
    res.set('Cache-Control', 'no-cache');
    res.json({ data: 'value' });
});

// Redirect
app.get('/old-path', (req, res) => {
    res.redirect('/new-path');
});

// Render template (requires template engine)
app.get('/template', (req, res) => {
    res.render('index', { name: 'John' });
});
```

---

## Error Handling

### Error Handling Pattern in This Project

**Goal:** Avoid repetitive try-catch blocks

```javascript
// utils/asyncHandler.js
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err))  // Pass to error middleware
    }
}

// Custom error class
class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
    }
}

// Usage in controller
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(new ApiResponse(200, user, "User found"));
});
```

### Error Handler Middleware

```javascript
// Must be defined LAST, after all other middleware and routes
app.use((err, req, res, next) => {
    // Custom error
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            message: err.message,
            success: err.success,
            data: null
        });
    }
    
    // Generic error
    res.status(500).json({
        statusCode: 500,
        message: err.message || "Internal Server Error",
        success: false,
        data: null
    });
});
```

### Common Error Patterns

```javascript
// 404 - Not Found
if (!resource) {
    throw new ApiError(404, "Resource not found");
}

// 400 - Bad Request (validation)
if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
}

// 401 - Unauthorized
if (!token) {
    throw new ApiError(401, "Unauthorized access");
}

// 403 - Forbidden
if (user.role !== 'admin') {
    throw new ApiError(403, "Admin access required");
}

// 409 - Conflict (duplicate)
const existing = await User.findOne({ email });
if (existing) {
    throw new ApiError(409, "Email already registered");
}

// 500 - Server Error
throw new ApiError(500, "Internal server error");
```

---

## Authentication & Security

### CORS (Cross-Origin Resource Sharing)

Allows requests from different domains:

```javascript
import cors from 'cors';

// Allow all origins (development only)
app.use(cors({
    origin: "*",
    credentials: true
}));

// Restrict to specific origins (production)
app.use(cors({
    origin: ["https://example.com", "https://app.example.com"],
    credentials: true  // Allow cookies
}));

// Custom CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Cookies

Store data on client side:

```javascript
import cookieParser from 'cookie-parser';

app.use(cookieParser());

// Set cookie
res.cookie('sessionId', 'abc123', {
    httpOnly: true,      // Not accessible via JavaScript
    secure: true,        // Only sent over HTTPS
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// Read cookie
const sessionId = req.cookies.sessionId;

// Clear cookie
res.clearCookie('sessionId');
```

### Security Headers

```javascript
import helmet from 'helmet';

// Add security headers
app.use(helmet());

// Custom security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});
```

---

## Best Practices

### ✅ DO

- ✅ Use Router objects to organize routes
- ✅ Implement consistent error handling
- ✅ Use environment variables for configuration
- ✅ Validate all user input
- ✅ Set appropriate HTTP status codes
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Log important events
- ✅ Use authentication on sensitive routes
- ✅ Handle async errors properly

### ❌ DON'T

- ❌ Expose error details in production
- ❌ Trust user input without validation
- ❌ Hardcode secrets in code
- ❌ Use synchronous file operations
- ❌ Send passwords in logs
- ❌ Use `var` (use `const` and `let`)
- ❌ Mix callback and promise patterns
- ❌ Forget error handling middleware
- ❌ Allow CORS for all origins in production
- ❌ Store sensitive data in cookies

---

## Common Patterns

### Request/Response Standardization

```javascript
// utils/ApiResponse.js
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    );
}));

// Response format:
{
    "statusCode": 200,
    "data": { "id": 1, "name": "John" },
    "message": "User fetched successfully",
    "success": true
}
```

### Request Validation

```javascript
// Validate before processing
const validateUserInput = (req, res, next) => {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
        return res.status(400).json({
            statusCode: 400,
            message: "Email, password, and name are required",
            success: false
        });
    }
    
    if (!email.includes('@')) {
        return res.status(400).json({
            statusCode: 400,
            message: "Invalid email format",
            success: false
        });
    }
    
    next();
};

app.post('/register', validateUserInput, (req, res) => {
    // Proceed with registration
});
```

### Chaining Middleware

```javascript
// Apply multiple middleware to a single route
app.delete(
    '/users/:id',
    authenticate,      // Check if user is logged in
    authorize('admin'), // Check if user is admin
    (req, res) => {
        // Delete user
    }
);

// Or globally for a route prefix
const router = Router();
router.use(authenticate);  // All routes below need authentication

router.get('/profile', (req, res) => {
    // User already authenticated
});

router.post('/update', (req, res) => {
    // User already authenticated
});
```

---

## Summary Table

| Concept | Purpose | Example |
|---------|---------|---------|
| **Middleware** | Process request/response | CORS, JSON parser |
| **Router** | Group related routes | User, Video routes |
| **Route Handlers** | Process specific requests | GET /users/:id |
| **Error Handling** | Catch and handle errors | ApiError class |
| **Status Codes** | Indicate request result | 200, 404, 500 |
| **CORS** | Allow cross-origin requests | Allow frontend domains |
| **Cookies** | Store client data | Session tokens |
| **Authentication** | Verify user identity | JWT tokens |

---

## Quick Reference

```javascript
// Complete Express.js setup
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
app.use('/api/v1/users', userRouter);

// Error handling (last)
app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { app };
```

---

**Now you understand Express.js fundamentals! 🎉 Next, learn about MongoDB & Mongoose in MONGOOSE_GUIDE.md**
