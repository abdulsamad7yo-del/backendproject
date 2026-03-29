# 📦 NPM Packages Guide

**Complete Documentation of All Dependencies in This Project**

---

## 🎯 Quick Overview

```
Project Dependencies (16 packages)
├── Core Framework
│   ├── express (5.2.1)
│   └── dotenv (17.2.3)
├── Database
│   ├── mongoose (9.0.1)
│   └── mongoose-aggregate-paginate-v2 (1.1.4)
├── Security
│   ├── bcrypt (6.0.0)
│   └── jsonwebtoken (9.0.3)
├── File Handling
│   ├── multer (2.0.2)
│   └── cloudinary (2.8.0)
├── HTTP & Cookies
│   ├── cors (2.8.5)
│   └── cookie-parser (1.4.7)
└── Development
    ├── nodemon (3.1.11) - Dev only
    └── prettier (3.6.2) - Dev only
```

---

## 📗 Core Framework

### 1. **Express.js** `^5.2.1`

**What:** Web application framework for Node.js

**Why:** 
- Industry standard for building REST APIs
- Minimal, flexible, and fast
- Huge ecosystem of middlewares
- Easy to learn and use

**Where Used:**
- `src/app.js` - Define routes and middleware
- `src/index.js` - Start server

**Installation:**
```bash
npm install express
```

**Usage Example:**
```javascript
import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get('/api/users', (req, res) => {
    res.json({ message: 'Get all users' });
});

app.post('/api/users', (req, res) => {
    res.status(201).json({ id: 1, message: 'User created' });
});

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
});

app.listen(8000, () => console.log('Server running'));
```

**Key Methods:**
| Method | Purpose |
|--------|---------|
| `app.use()` | Register middleware |
| `app.get()`, `app.post()`, etc. | Define routes |
| `app.listen()` | Start server |

---

### 2. **dotenv** `^17.2.3`

**What:** Loads environment variables from `.env` file

**Why:**
- Keep secrets out of code
- Different configurations for dev/prod
- Secure password and API key storage
- Easy configuration management

**Where Used:**
- `src/index.js` - Load env variables before starting server
- `.env` file - Stores sensitive data

**Installation:**
```bash
npm install dotenv
```

**Usage:**
```javascript
import dotenv from 'dotenv';

// Load .env file
dotenv.config({ path: './.env' });

// Access variables
console.log(process.env.PORT);        // 8000
console.log(process.env.MONGODB_URI); // mongodb+srv://...
console.log(process.env.JWT_SECRET);  // secret_key
```

**.env File Structure:**
```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=youtube_clone

# Authentication
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh-secret

# Cloud Storage
CLOUDINARY_NAME=your_cloudinary_account
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Best Practices:**
```javascript
// ✅ Good - Use defaults
const PORT = process.env.PORT || 8000;

// ✅ Good - Validate on start
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI not defined");
}

// ❌ Bad - Direct access without default
const port = process.env.PORT;  // Might be undefined
```

---

## 🗄️ Database

### 3. **Mongoose** `^9.0.1`

**What:** MongoDB object modeling for Node.js

**Why:**
- Schema validation before DB operations
- Automatic type casting
- Middleware hooks (pre/post operations)
- Built-in relationship handling
- Query chaining and aggregation

**Where Used:**
- `src/models/` - Define all data models
- `src/controllers/` - Query database
- `src/db/db.js` - Connect to MongoDB

**Installation:**
```bash
npm install mongoose
```

**Complete Setup:**
```javascript
// src/db/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
        );
        console.log("MongoDB Connected");
        return connection;
    } catch (error) {
        console.error("DB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
```

**Model Definition:**
```javascript
// src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+/, "Invalid email"]
    },
    password: {
        type: String,
        required: true,
        select: false  // Don't include by default
    }
}, { timestamps: true });

// Middleware: Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method: Verify password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
```

**Query Usage:**
```javascript
// Create
const user = await User.create({ userName: 'john', email: 'john@example.com' });

// Read
const user = await User.findById(userId);
const users = await User.find({ active: true });

// Update
await User.findByIdAndUpdate(userId, { email: 'newemail@example.com' });

// Delete
await User.findByIdAndDelete(userId);
```

---

### 4. **mongoose-aggregate-paginate-v2** `^1.1.4`

**What:** Pagination plugin for Mongoose aggregation pipelines

**Why:**
- Handle large datasets efficiently
- Split results into pages
- Reduce server load
- Better user experience (slower pages)

**Where Used:**
- `src/controllers/video.controller.js` - Paginate video lists
- `src/models/video.model.js` - Add pagination to schema

**Installation:**
```bash
npm install mongoose-aggregate-paginate-v2
```

**Setup in Model:**
```javascript
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({ ... });
videoSchema.plugin(mongooseAggregatePaginate);

const Video = mongoose.model('Video', videoSchema);
```

**Usage in Controller:**
```javascript
import Video from '../models/video.model.js';

export const getAllVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
        page: page,
        limit: limit,
        sort: { createdAt: -1 }
    };

    const videos = await Video.aggregatePaginate(
        Video.aggregate([
            { $match: { isPublished: true } }
        ]),
        options
    );

    res.json({
        videos: videos.docs,
        pagination: {
            currentPage: videos.page,
            totalPages: videos.pages,
            totalVideos: videos.totalDocs,
            hasMore: videos.hasNextPage
        }
    });
});
```

---

## 🔐 Security

### 5. **bcrypt** `^6.0.0`

**What:** Library for hashing passwords

**Why:**
- One-way encryption (cannot decrypt)
- Salting prevents rainbow tables
- Slow hashing resists brute force
- Industry standard for password storage

**Where Used:**
- `src/models/user.model.js` - Hash password before saving
- `src/controllers/user.controller.js` - Verify passwords

**Installation:**
```bash
npm install bcrypt
```

**How It Works:**

```
Plain password: "password123"
         ↓
    bcrypt.hash()
         ↓
Hashed: "$2b$10$abcdefghijklmnopqrstuvwxyz..."
         ↓
   Store in DB
```

**Usage:**
```javascript
import bcrypt from 'bcrypt';

// Hash password (BEFORE SAVING)
const hashedPassword = await bcrypt.hash('password123', 10);
// 2nd param = salt rounds (10 is standard, higher = slower = more secure)

// Verify password (LOGIN)
const isMatch = await bcrypt.compare('password123', hashedPassword);
console.log(isMatch);  // true

// Schema middleware example
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});
```

**Security Notes:**
```javascript
// ✅ Good - Hash before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// ❌ Bad - Storing plain text
userSchema.pre('save', async function() {
    // Don't do this!
    // this.password = providedPassword;  // NEVER EVER!
});

// ✅ Good - Select false hides password
password: { type: String, select: false }
const user = await User.findById(id).select('+password');

// ❌ Bad - Password always included
password: { type: String }
```

---

### 6. **jsonwebtoken** `^9.0.3`

**What:** Creates and verifies JSON Web Tokens for authentication

**Why:**
- Stateless authentication (no session storage needed)
- Secure token-based authentication
- Works for APIs and SPAs
- Standard for modern authentication

**Where Used:**
- `src/models/user.model.js` - Generate tokens
- `src/middlewares/auth.middleware.js` - Verify tokens
- `src/controllers/user.controller.js` - Issue tokens on login

**Installation:**
```bash
npm install jsonwebtoken
```

**How JWT Works:**

```
┌─────────────────────────────────────────────┐
│  Login Request                              │
│  POST /login { email, password }            │
└──────────────────┬──────────────────────────┘
                   ↓
         ┌─────────────────────┐
         │ Verify credentials  │
         │ Password is correct │
         └──────────┬──────────┘
                    ↓
        ┌──────────────────────────┐
        │ Generate JWT Token       │
        │ header.payload.signature │
        └──────────────┬───────────┘
                       ↓
         Return token to client
                       ↓
┌─────────────────────────────────────────────┐
│ Client stores token (localStorage/cookie)   │
└──────────────────┬──────────────────────────┘
                   ↓
    ┌──────────────────────────────────┐
    │ Protected route request:         │
    │ GET /profile                     │
    │ Header: Authorization: Bearer X  │
    └──────────────┬───────────────────┘
                   ↓
        ┌─────────────────────┐
        │ Auth middleware     │
        │ Verify token valid  │
        └──────────┬──────────┘
                   ↓
         ✅ Allow / ❌ Reject
```

**Token Structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJfaWQiOiI1ZmQyZTU1YzQ5MDAwMDEyMzQ1Njc4OTAiLCJpYXQiOjE2MDc3MTQzMzB9.
x7QJ8mZk9HqP2lL5vN3sN8uX9yZ2cB8dE9fG2hI3jK
├──────────────────────────────┬──────────────────────────────┬──────────────────────────────┤
│        HEADER                │         PAYLOAD              │       SIGNATURE              │
│ Algorithm + Token Type       │ Data (user ID, issued at)   │ Signed with secret key       │
```

**Usage Example:**
```javascript
import jwt from 'jsonwebtoken';

// 1. GENERATE TOKEN (in login controller)
const token = jwt.sign(
    { _id: user._id, email: user.email },      // Payload
    process.env.JWT_SECRET,                     // Secret key
    { expiresIn: '7d' }                         // Options
);

// 2. SEND TO CLIENT
res.cookie('accessToken', token, {
    httpOnly: true,  // Secure
    secure: true,    // Only HTTPS
    sameSite: 'strict'
});

// 3. VERIFY TOKEN (in auth middleware)
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log(decoded._id);  // User ID

// 4. ERROR HANDLING
try {
    jwt.verify(token, process.env.JWT_SECRET);
} catch (error) {
    if (error.name === 'TokenExpiredError') {
        // Token expired - refresh needed
    } else if (error.name === 'JsonWebTokenError') {
        // Invalid token
    }
}
```

**In Schema:**
```javascript
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};
```

---

## 📁 File Handling

### 7. **Multer** `^2.0.2`

**What:** Middleware for handling file uploads

**Why:**
- Handle multipart/form-data
- File validation (size, type)
- Save files temporarily before cloud upload
- Parse form fields along with files

**Where Used:**
- `src/middlewares/multer.middleware.js` - Configure upload
- Routes that accept file uploads (avatar, cover, video)

**Installation:**
```bash
npm install multer
```

**Setup in Middleware:**
```javascript
// src/middlewares/multer.middleware.js
import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/temp');  // Save to temp folder
    },
    filename: (req, file, cb) => {
        // Unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allow only images and videos
    const allowedMimes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

// Create upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024  // 100MB
    }
});

export { upload };
```

**Usage in Routes:**
```javascript
import { upload } from '../middlewares/multer.middleware.js';

// Single file
router.post('/avatar', upload.single('avatar'), uploadAvatarController);

// Multiple files
router.post('/upload', upload.array('images', 5), uploadController);

// Fields with files
router.post('/video', 
    upload.fields([
        { name: 'videoFile', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 }
    ]),
    uploadVideoController
);
```

**In Controller:**
```javascript
export const uploadVideo = asyncHandler(async (req, res) => {
    // req.files contains uploaded files
    
    const videoPath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    
    if (!videoPath || !thumbnailPath) {
        throw new ApiError(400, "Video and thumbnail required");
    }

    // Upload to Cloudinary
    const videoResult = await uploadToCloudinary(videoPath);
    const thumbnailResult = await uploadToCloudinary(thumbnailPath);

    // Delete temp files
    fs.unlinkSync(videoPath);
    fs.unlinkSync(thumbnailPath);

    // Save to DB
    const video = await Video.create({
        ...req.body,
        videoFile: {
            url: videoResult.url,
            publicId: videoResult.publicId
        },
        thumbnail: {
            url: thumbnailResult.url,
            publicId: thumbnailResult.publicId
        }
    });

    res.status(201).json(new ApiResponse(201, video, "Video uploaded"));
});
```

---

### 8. **Cloudinary** `^2.8.0`

**What:** Cloud storage service for images and videos

**Why:**
- Reliably store media files
- Don't fill up server hard drive
- CDN for faster delivery
- Automatic image optimization
- Easy file deletion

**Where Used:**
- `src/utils/cloudinary.js` - Upload/delete files
- Controllers that handle file uploads

**Installation:**
```bash
npm install cloudinary
```

**Setup:**
```javascript
// src/utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // Delete local temp file
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        // Delete temp file on error
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error("Cloudinary upload error:", error);
        return null;
    }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: 'auto'
        });
        return true;
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        return false;
    }
};
```

**Environment Variables:**
```env
CLOUDINARY_NAME=your_cloudinary_account_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get Credentials:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret
4. Add to `.env`

**Usage in Controller:**
```javascript
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

export const uploadAvatar = asyncHandler(async (req, res) => {
    const avatarPath = req.file?.path;
    
    if (!avatarPath) {
        throw new ApiError(400, "Avatar file required");
    }

    // Delete old avatar if exists
    if (req.user.avatar) {
        const publicId = extractPublicId(req.user.avatar);
        await deleteFromCloudinary(publicId);
    }

    // Upload new avatar
    const result = await uploadOnCloudinary(avatarPath);
    
    if (!result) {
        throw new ApiError(500, "Upload failed");
    }

    // Update user
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: result.url },
        { new: true }
    );

    res.json(new ApiResponse(200, user, "Avatar updated"));
});
```

---

## 🌐 HTTP & Cookies

### 9. **CORS** `^2.8.5`

**What:** Enable Cross-Origin Resource Sharing

**Why:**
- Allow requests from frontend applications
- Prevent CSRF attacks
- Control who can access your API
- Essential for frontend/backend separation

**Where Used:**
- `src/app.js` - Setup CORS middleware

**Installation:**
```bash
npm install cors
```

**Setup & Usage:**
```javascript
import cors from 'cors';

// Allow all origins (development only)
app.use(cors({
    origin: "*",
    credentials: true
}));

// Restrict to specific origins (production)
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Custom CORS options
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://example.com',
            'https://app.example.com'
        ];
        
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
```

**How It Works:**

```
Browser Request:
User clicks "Load data" on example.com
    ↓
Frontend (example.com) sends request to api.example.com
    ↓
Browser adds Origin header:
    Origin: https://example.com
    ↓
Server checks CORS policy
    ↓
If allowed: Returns Access-Control-Allow-Origin header
If blocked: Browser blocks response (user doesn't see data)
```

---

### 10. **cookie-parser** `^1.4.7`

**What:** Parse and manage HTTP cookies

**Why:**
- Read cookies from requests
- Set secure cookies for sessions
- Authentication token storage
- User preferences storage

**Where Used:**
- `src/app.js` - Cookie parsing middleware
- Controllers - Set/read cookies

**Installation:**
```bash
npm install cookie-parser
```

**Setup & Usage:**
```javascript
import cookieParser from 'cookie-parser';

// Parse cookies
app.use(cookieParser());

// Can now access req.cookies
app.get('/', (req, res) => {
    console.log(req.cookies);  // { sessionId: 'abc123' }
});

// Set cookie in response
res.cookie('accessToken', token, {
    httpOnly: true,          // Not accessible via JavaScript (XSS protection)
    secure: true,            // Only sent over HTTPS
    sameSite: 'strict',      // CSRF protection
    maxAge: 15 * 60 * 1000   // Expires in 15 minutes
});

// Clear cookie
res.clearCookie('accessToken');

// Read cookie in request
const token = req.cookies.accessToken;
```

**In Login Controller:**
```javascript
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.isPasswordCorrect(password))) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate token
    const accessToken = user.generateAccessToken();

    // Set cookie
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
    });

    // Return user without password
    const loggedInUser = await User.findById(user._id);

    res.status(200).json(
        new ApiResponse(200, loggedInUser, "Logged in successfully")
    );
});
```

---

## 🛠️ Development Tools

### 11. **Nodemon** `^3.1.11` (Dev Dependency)

**What:** Auto-restart server when files change

**Why:**
- Faster development workflow
- Don't manually restart on every change
- Increases productivity
- Only for development (not production)

**Installation:**
```bash
npm install -D nodemon
```

**Setup in package.json:**
```json
{
  "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js",
    "start": "node src/index.js"
  }
}
```

**Usage:**
```bash
npm run dev    # Start with auto-reload
npm start      # Start without auto-reload
```

**Nodemon Configuration (optional nodemon.json):**
```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["node_modules", "public"],
  "delay": 500,
  "restartable": "rs"
}
```

---

### 12. **Prettier** `^3.6.2` (Dev Dependency)

**What:** Code formatting tool

**Why:**
- Consistent code style across team
- Avoid merge conflicts on formatting
- Less discussion about style
- Auto-format on save

**Installation:**
```bash
npm install -D prettier
```

**Setup Configuration (.prettierrc):**
```json
{
  "singleQuote": true,
  "bracketSpacing": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "semi": true,
  "printWidth": 100
}
```

**Ignore File (.prettierignore):**
```
/.vscode
/node_modules
/dist
*.env
*.log
```

**Usage:**
```bash
# Format a file
npx prettier --write src/app.js

# Format entire project
npx prettier --write src/

# Check if files are formatted
npx prettier --check src/
```

**VS Code Integration:**
1. Install Prettier extension
2. Set as default formatter
3. Enable "Format on Save" in settings

---

## 📊 Dependency Graph

```
Project
│
├─ Server Framework
│  └─ express (handles HTTP)
│
├─ Configuration
│  └─ dotenv (manage env variables)
│
├─ Database Layer
│  ├─ mongoose (ODM)
│  │  └─ mongodb (driver)
│  │  └─ mongoose-aggregate-paginate-v2 (pagination)
│  │
│  └─ Security (for DB passwords)
│     └─ bcrypt (hash passwords)
│
├─ Authentication
│  ├─ jsonwebtoken (JWT tokens)
│  └─ cookie-parser (manage cookies)
│
├─ File Management
│  ├─ multer (handle uploads)
│  └─ cloudinary (cloud storage)
│
├─ HTTP & CORS
│  └─ cors (allow cross-origin)
│
└─ Development (Dev only)
   ├─ nodemon (auto-reload)
   └─ prettier (code formatting)
```

---

## 🎯 Dependency Installation Order

```bash
# 1. Core framework
npm install express

# 2. Environment management
npm install dotenv

# 3. Database & ORM
npm install mongoose mongoose-aggregate-paginate-v2

# 4. Security
npm install bcrypt jsonwebtoken

# 5. File handling
npm install multer cloudinary

# 6. HTTP utilities
npm install cors cookie-parser

# 7. Development dependencies
npm install -D nodemon prettier

# Or install all at once
npm install express dotenv mongoose mongoose-aggregate-paginate-v2 bcrypt jsonwebtoken multer cloudinary cors cookie-parser
npm install -D nodemon prettier
```

---

## 📝 Quick Reference Table

| Package | Version | Type | Purpose | Size |
|---------|---------|------|---------|------|
| express | 5.2.1 | Prod | Web framework | ~50KB |
| mongoose | 9.0.1 | Prod | DB ORM | ~1.5MB |
| dotenv | 17.2.3 | Prod | Env variables | ~12KB |
| bcrypt | 6.0.0 | Prod | Password hashing | ~200KB |
| jsonwebtoken | 9.0.3 | Prod | JWT auth | ~50KB |
| multer | 2.0.2 | Prod | File uploads | ~60KB |
| cloudinary | 2.8.0 | Prod | Cloud storage | ~500KB |
| cors | 2.8.5 | Prod | CORS support | ~35KB |
| cookie-parser | 1.4.7 | Prod | Cookie parsing | ~15KB |
| mongoose-aggregate-paginate | 1.1.4 | Prod | Pagination | ~20KB |
| nodemon | 3.1.11 | Dev | Auto-reload | ~2MB |
| prettier | 3.6.2 | Dev | Code formatter | ~3MB |

---

## 🚨 Common Package Issues & Solutions

### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: "bcrypt build failed"
```bash
# Solution: Install build tools
npm install --build-from-source

# On Windows: May need Python & Visual Studio Build Tools
```

### Issue: "Cloudinary authentication failed"
```bash
# Solution: Verify credentials in .env
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Check if variables are loaded
console.log(process.env.CLOUDINARY_NAME);
```

### Issue: "Mongoose version mismatch"
```bash
# Solution: Update mongoose
npm update mongoose

# Or specify exact version
npm install mongoose@9.0.1
```

---

## 🔄 Update Packages Safely

```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update mongoose

# Update to latest major version (breaking changes possible)
npm install mongoose@latest

# Update package.json and package-lock.json
npm install --save mongoose@10.0.0
```

---

**Now you understand every package in this project! 🎉 Happy coding!**
