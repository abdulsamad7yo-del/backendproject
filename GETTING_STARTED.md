# 🚀 Getting Started Guide

**Quick Start Guide to Running & Understanding This Project**

---

## ⚡ 5-Minute Quick Start

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create `.env` File
```bash
# Copy this to .env file in project root
PORT=8000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=youtube_clone
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:3000
```

### 3️⃣ Start Server
```bash
npm run dev
```

### 4️⃣ Test Endpoint
```bash
curl http://localhost:8000/api/v1/users
```

✅ **Done!** Server is running.

---

## 📚 Which Document Should I Read?

```
What do you want to learn?

├─ "How do I run this project?"
│  └─ 👉 You're reading it! Keep going...
│
├─ "How does Express.js work?"
│  └─ 👉 READ: EXPRESS_GUIDE.md
│
├─ "How do I design databases?"
│  └─ 👉 READ: MONGOOSE_GUIDE.md
│
├─ "What are all these packages?"
│  └─ 👉 READ: PACKAGES.md
│
├─ "Give me an overview of the project"
│  └─ 👉 READ: README.md
│
└─ "Show me original notes"
   └─ 👉 READ: Notes.txt
```

---

## 🎯 Setup Instructions (Detailed)

### Step 1: Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- A text editor (VS Code recommended)
- [Postman](https://www.postman.com/) or [Thunder Client](https://www.thunderclient.com/) (for testing)

Verify installation:
```bash
node --version    # Should show v16+
npm --version     # Should show v8+
```

### Step 2: Clone/Setup Project

```bash
# Navigate to project directory
cd PracticeProject

# Or if cloning from GitHub:
git clone <your-repo>
cd <project-name>
```

### Step 3: Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`:
- Express.js (web framework)
- Mongoose (database)
- Multer (file uploads)
- Cloudinary (cloud storage)
- JWT (authentication)
- bcrypt (password hashing)
- And more...

**What gets installed:**
```
node_modules/
├── express/
├── mongoose/
├── multer/
├── cloudinary/
├── jsonwebtoken/
├── bcrypt/
├── cors/
├── dotenv/
└── ... (300+ total packages)
```

### Step 4: Set Up MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Click "Create a Cluster"
   - Choose "Free" tier
   - Select region closest to you
   - Wait for cluster to be created (~10 minutes)

3. **Network Access**
   - Go to **Security** → **Network Access**
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (development only)
   - Click "Confirm"

4. **Database User**
   - Go to **Security** → **Database Access**
   - Click "Add New Database User"
   - Create username and password
   - **Important:** Avoid special characters in password
   - Grant "Read and write to any database"
   - Click "Create User"

5. **Get Connection String**
   - Click "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true`

#### Option B: Local MongoDB (Advanced)

Skip if using MongoDB Atlas.

```bash
# Install MongoDB Community Edition
# Windows: Download from mongodb.com
# Mac: brew install mongodb-community
# Linux: Follow official docs

# Start MongoDB service
mongod
```

### Step 5: Create `.env` File

In project root, create `.env` file:

```env
# ==================
# Server Configuration
# ==================
PORT=8000
NODE_ENV=development

# ==================
# Database
# ==================
# If using MongoDB Atlas (recommended):
MONGODB_URI=mongodb+srv://your_username:your_password@cluster-name.mongodb.net

# If using local MongoDB:
# MONGODB_URI=mongodb://localhost:27017

DB_NAME=youtube_clone

# ==================
# Authentication
# ==================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=30d

# ==================
# File Upload (Cloudinary)
# ==================
CLOUDINARY_NAME=your_cloudinary_account_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ==================
# CORS Configuration
# ==================
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
```

**⚠️ Important:**
- Never commit `.env` to git
- It's already in `.gitignore`
- Keep secrets safe!

### Step 6: Get Cloudinary Credentials (Optional)

For file uploads to work:

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, API Secret
5. Add to `.env` file

### Step 7: Verify Setup

Test that everything is connected:

```bash
# Start development server
npm run dev
```

You should see:
```
Server is running on port: 8000
MongoDB Connected Successfully!
```

### Step 8: Test an Endpoint

Open Postman or Terminal:

```bash
# Test with curl
curl http://localhost:8000/api/v1/users

# Or use Postman:
# 1. New Request
# 2. GET
# 3. http://localhost:8000/api/v1/users
# 4. Send
```

✅ **Setup Complete!**

---

## 🧪 Testing API Endpoints

### Using Postman

1. **Open Postman**
2. **Create New Request**
3. **Test Endpoints:**

#### Register User
```
Method: POST
URL: http://localhost:8000/api/v1/users/register
Headers: Content-Type: application/json
Body (JSON):
{
    "userName": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "password": "password123",
    "avatar": "https://example.com/avatar.jpg"
}
```

#### Login User
```
Method: POST
URL: http://localhost:8000/api/v1/users/login
Headers: Content-Type: application/json
Body (JSON):
{
    "email": "john@example.com",
    "password": "password123"
}
```

#### Get Current User Profile (Protected)
```
Method: GET
URL: http://localhost:8000/api/v1/users/profile
Headers: 
  - Authorization: Bearer <token_from_login_response>
  - Content-Type: application/json
```

### Using cURL (Terminal)

```bash
# Register
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "password": "password123",
    "avatar": "https://example.com/avatar.jpg"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Profile (replace TOKEN with actual token)
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🔧 Development Commands

```bash
# Start development server (with auto-reload)
npm run dev

# Start production server
npm start

# Format code with Prettier
npx prettier --write src/

# Check for formatting issues
npx prettier --check src/

# List installed packages
npm list

# Update all packages
npm update

# Check for outdated packages
npm outdated
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'express'"
```bash
# Solution: Reinstall dependencies
npm install
```

### Issue: "MongoDB connection failed"
**Check:**
- Is `.env` file created?
- Is connection string correct?
- Is MongoDB cluster running?
- Are credentials correct?
- Is IP whitelisted in MongoDB Atlas?

```bash
# Test connection string in .env:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
# Make sure:
# - username is correct
# - password is correct (no special characters unless URL-encoded)
# - cluster name is correct
```

### Issue: "Port 8000 already in use"
```bash
# Change port in .env:
PORT=8001

# Or kill process using port:
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :8000
kill -9 <PID>
```

### Issue: "Cannot upload file" (Multer error)
- Check if `public/temp/` folder exists
- Create folder if missing: `mkdir -p public/temp`
- Check file size limits
- Verify Cloudinary credentials

### Issue: "dotenv not loading environment variables"
```javascript
// Make sure this is at the TOP of index.js:
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
```

### Issue: "JWT verification failed"
- Token might be expired
- Check if JWT_SECRET in `.env` matches
- Check Authorization header format: `Bearer <token>`

---

## 📖 Next Steps

Once setup is complete:

### 1. Explore the Code
```bash
# Start server
npm run dev

# Read source code
# Start with: src/index.js → src/app.js → src/controllers/
```

### 2. Learn Express.js
```bash
# Check: EXPRESS_GUIDE.md
# Topics: Routing, Middleware, Error Handling, Authentication
```

### 3. Learn Database Design
```bash
# Check: MONGOOSE_GUIDE.md
# Topics: Schemas, Models, Relationships, Aggregation
```

### 4. Understand Dependencies
```bash
# Check: PACKAGES.md
# Topics: All npm packages explained with examples
```

### 5. Modify & Experiment
```bash
# Try:
# 1. Change route names
# 2. Add new fields to schemas
# 3. Create new endpoints
# 4. Test everything with Postman
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `.env` | Secrets & configuration |
| `src/index.js` | Server entry point |
| `src/app.js` | Express setup |
| `src/db/db.js` | MongoDB connection |
| `src/models/` | Database schemas |
| `src/controllers/` | Business logic |
| `src/routes/` | API endpoints |
| `src/middlewares/` | Custom middleware |
| `src/utils/` | Helper functions |

---

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Project folder ready
- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] MongoDB Atlas/Local setup
- [ ] `npm run dev` runs successfully
- [ ] Server shows "MongoDB Connected"
- [ ] Can hit `/api/v1/users` endpoint
- [ ] Express_GUIDE.md bookmarked
- [ ] Mongoose_GUIDE.md bookmarked

---

## 🎓 Learning Resources

| Resource | Best For |
|----------|----------|
| [README.md](README.md) | Project overview |
| [EXPRESS_GUIDE.md](EXPRESS_GUIDE.md) | Learning Express.js |
| [MONGOOSE_GUIDE.md](MONGOOSE_GUIDE.md) | Learning Mongoose |
| [PACKAGES.md](PACKAGES.md) | Understanding npm packages |
| [Notes.txt](Notes.txt) | Quick reference |

---

## 🚀 You're Ready!

```
✅ Server is running
✅ Database is connected
✅ You understand the structure
✅ You've tested endpoints
✅ You're ready to code!

Start exploring the source code.
Start building features.
Start learning!

Questions? Read the guides!
Issues? Check troubleshooting!
Ready to code? Let's go! 🚀
```

---

**Happy coding! 💻 Feel free to explore, experiment, and learn!**
