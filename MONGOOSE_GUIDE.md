# 📊 Mongoose Comprehensive Guide

**Master MongoDB Database Modeling and Queries with Mongoose**

---

## 📚 Table of Contents

1. [What is Mongoose?](#what-is-mongoose)
2. [Why Use Mongoose?](#why-use-mongoose)
3. [Installation & Setup](#installation--setup)
4. [Core Concepts](#core-concepts)
5. [Schema Design](#schema-design)
6. [Data Types](#data-types)
7. [Model Operations](#model-operations)
8. [Relationships](#relationships)
9. [Advanced Features](#advanced-features)
10. [Best Practices](#best-practices)
11. [Project Implementation](#project-implementation)

---

## What is Mongoose?

**Mongoose** is a MongoDB object modeler for Node.js that provides a schema-based solution to model application data.

### Architecture

```
┌──────────────────────────────────────────┐
│      Mongoose ODM (Object Layer)         │
├──────────────────────────────────────────┤
│  • Schemas         (define structure)    │
│  • Models          (interact with DB)    │
│  • Validation      (data integrity)      │
│  • Middleware      (hooks, pre, post)    │
│  • Relationships   (references/embed)    │
├──────────────────────────────────────────┤
│    MongoDB Driver (Network Layer)        │
├──────────────────────────────────────────┤
│      MongoDB Database (Storage)          │
└──────────────────────────────────────────┘
```

| Layer | Responsibility |
|-------|-----------------|
| **Mongoose** | Define rules, relationships, validation |
| **Driver** | Connect to MongoDB, send queries |
| **MongoDB** | Store and retrieve data |

---

## Why Use Mongoose?

### ✅ Advantages

| Feature | Benefit | Example |
|---------|---------|---------|
| **Schemas** | Define data structure & validation | Email must be unique & valid |
| **Type Casting** | Auto convert data types | "123" → 123 (number) |
| **Validation** | Enforce data integrity | Prevent empty usernames |
| **Middleware** | Run code before/after operations | Hash password before saving |
| **Relationships** | Model data connections | User → many Videos |
| **Query Building** | Chainable query syntax | `.find().select().limit()` |
| **Aggregation** | Complex data analysis | Group videos by category |
| **Population** | Fill referenced fields | Load user data with video |

### ⚠️ Trade-offs

| Aspect | Comment |
|--------|---------|
| **Performance** | Slightly slower than raw MongoDB driver (negligible for most apps) |
| **Learning Curve** | More concepts than raw MongoDB |
| **Flexibility** | Some advanced MongoDB features require raw driver |

**Bottom Line:** Mongoose makes development faster and safer by enforcing structure.

---

## Installation & Setup

### 1. Install Mongoose

```bash
npm install mongoose
```

**Package Details:**
- **Version:** ^9.0.1 (in this project)
- **Size:** ~1.5MB
- **Dependencies:** mongoze-legacy-pluralize, mongodb driver

### 2. Create Database Connection

**File:** `src/db/db.js`

```javascript
import mongoose from 'mongoose';

const DB_NAME = "youtube_clone";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
            {
                // Connection options
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        
        console.log("MongoDB Connected Successfully!");
        console.log(`Database: ${connectionInstance.connection.db.databaseName}`);
        return connectionInstance;
        
    } catch (error) {
        console.error("MONGODB Connection FAILED:", error);
        process.exit(1);  // Stop server if DB connection fails
    }
}

export default connectDB;
```

### 3. Call Connection in Entry Point

**File:** `src/index.js`

```javascript
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/db.js";

dotenv.config({ path: "./.env" });

// Connect to MongoDB, then start server
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGODB connection Failed", err);
        process.exit(1);
    });
```

### 4. Environment Variables

**File:** `.env`

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=youtube_clone
PORT=8000
```

---

## Core Concepts

### 1. Schema

Template defining document structure.

```javascript
import { Schema } from 'mongoose';

// Define schema
const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        fullName: {
            type: String,
            required: true
        },
        avatar: {
            type: String,  // URL to image
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    { timestamps: true }  // Auto-add createdAt, updatedAt
);

// Schema is just definition, not connected to DB yet
```

### 2. Model

Class for querying and manipulating data in database.

```javascript
import mongoose from 'mongoose';

// Create model from schema
const User = mongoose.model("User", userSchema);

// Now you can query the database
const users = await User.find();              // Get all users
const user = await User.findById(id);         // Get one user
const newUser = await User.create(data);      // Create user
```

### 3. Document

Individual record in MongoDB collection.

```javascript
// Schema defines structure, Model creates documents
const userSchema = new Schema({
    name: String,
    email: String
});

const User = mongoose.model("User", userSchema);

// Create a document (instance of User model)
const doc = await User.create({
    name: "John",
    email: "john@example.com"
});

console.log(doc._id);       // MongoDB auto-generated ID
console.log(doc.name);      // "John"
console.log(doc.email);     // "john@example.com"
console.log(doc.createdAt); // Timestamp
```

---

## Schema Design

### Basic Schema

```javascript
import { Schema } from 'mongoose';

const basicSchema = new Schema({
    // Field name and type
    name: String,
    age: Number,
    active: Boolean,
    joinDate: Date,
    tags: [String]  // Array of strings
});
```

### Schema with Validation

```javascript
const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, "Username is required"],  // Custom error message
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [20, "Username cannot exceed 20 characters"],
        match: [/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please provide a valid email address"]
    },
    age: {
        type: Number,
        min: [18, "Must be 18 or older"],
        max: [120, "Invalid age"]
    },
    score: {
        type: Number,
        default: 0  // Default value if not provided
    },
    role: {
        type: String,
        enum: {
            values: ["user", "admin", "moderator"],
            message: "Role must be user, admin, or moderator"
        },
        default: "user"
    }
});
```

---

## Data Types

### Supported Types

```javascript
const schema = new Schema({
    // Primitive types
    string: String,
    number: Number,
    boolean: Boolean,
    date: Date,
    
    // Complex types
    array: [String],           // Array of strings
    object: {                  // Nested object
        name: String,
        age: Number
    },
    objectId: Schema.Types.ObjectId,  // Reference to another document
    
    // Special types
    mixed: Schema.Types.Mixed,  // Any data type
    map: Map,                   // Key-value pairs
    decimal: Schema.Types.Decimal128,  // For precise numbers
    buffer: Buffer,             // Binary data
    bigint: BigInt              // Large integers
});
```

### Example: Comprehensive Schema

```javascript
const videoSchema = new Schema({
    // Basic info
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    
    // Owner
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"  // Reference to User model
    },
    
    // Content
    videoFile: {
        url: String,
        publicId: String
    },
    thumbnail: {
        url: String,
        publicId: String
    },
    
    // Stats
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    
    // Arrays
    tags: [String],
    
    // Nested object
    metadata: {
        duration: Number,
        resolution: String,
        format: String
    },
    
    // Timestamps (auto-added by timestamps: true)
    // createdAt: Date
    // updatedAt: Date
}, { timestamps: true });
```

---

## Model Operations

### Create Operations

```javascript
// 1. Single document
const user = await User.create({
    userName: "john_doe",
    email: "john@example.com",
    password: "hashedpassword"
});

// 2. Multiple documents
const users = await User.create([
    { userName: "user1", email: "user1@example.com" },
    { userName: "user2", email: "user2@example.com" }
]);

// 3. Using model constructor + save()
const user = new User({
    userName: "jane_doe",
    email: "jane@example.com"
});
await user.save();

// 4. With default values
const post = await Post.create({
    title: "My Post"
    // views defaults to 0, isPublished defaults to false
});
```

### Read Operations

```javascript
// Find all
const users = await User.find();

// Find with filter
const activeUsers = await User.find({ active: true });

// Find one document
const user = await User.findOne({ email: "john@example.com" });

// Find by ID
const user = await User.findById("user-id-here");

// Find multiple by IDs
const users = await User.find({ _id: { $in: ["id1", "id2", "id3"] } });

// Count documents
const count = await User.countDocuments({ role: "admin" });

// Check existence
const exists = await User.exists({ email: "john@example.com" });

// Find with conditions
const recentUsers = await User.find({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
});
```

### Update Operations

```javascript
// Update one document
await User.updateOne(
    { _id: userId },  // Filter
    { $set: { email: "newemail@example.com" } }  // Update
);

// Update many
await User.updateMany(
    { role: "user" },
    { role: "member" }
);

// Find and update (returns updated document)
const user = await User.findByIdAndUpdate(
    userId,
    { $set: { userName: "newname" } },
    { new: true }  // Return updated document
);

// Increment field
await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } },  // Increment views by 1
    { new: true }
);

// Push to array
await User.findByIdAndUpdate(
    userId,
    { $push: { watchHistory: videoId } },  // Add video to array
    { new: true }
);

// Pull from array
await User.findByIdAndUpdate(
    userId,
    { $pull: { watchHistory: videoId } },  // Remove video from array
    { new: true }
);
```

### Delete Operations

```javascript
// Delete one
await User.deleteOne({ _id: userId });

// Delete many
await Video.deleteMany({ isPublished: false });

// Find and delete (returns deleted document)
const deletedUser = await User.findByIdAndDelete(userId);
```

---

## Relationships

### 1. One-to-Many (Most Common)

User has many videos:

```javascript
// User has many videos
const userSchema = new Schema({
    name: String,
    email: String
    // No need to store video IDs here
});

// Video belongs to one user
const videoSchema = new Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"  // Reference to User
    }
});

const User = mongoose.model("User", userSchema);
const Video = mongoose.model("Video", videoSchema);

// Query with populate (fill the reference)
const userWithVideos = await User.findById(userId)
    .populate("videos")  // This only works if User has videos array
    .exec();

// Better: Query from Video side
const videosWithOwner = await Video.find()
    .populate("owner", "name email")  // Get owner details
    .exec();
```

### 2. One-to-One

User has one profile:

```javascript
const userSchema = new Schema({
    username: String
});

const profileSchema = new Schema({
    bio: String,
    avatar: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true  // Ensures one-to-one relationship
    }
});

// Query profile with user
const profile = await Profile.findById(profileId)
    .populate("user")
    .exec();
```

### 3. Many-to-Many

Students and courses (student in multiple courses, course has multiple students):

```javascript
// Option 1: Array of references
const courseSchema = new Schema({
    name: String,
    students: [{
        type: Schema.Types.ObjectId,
        ref: "Student"
    }]
});

// Option 2: Junction collection (more flexible)
const enrollmentSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "Student"
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    enrolledAt: Date
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
```

### 4. Embedded Documents (Denormalization)

For frequently accessed related data:

```javascript
// User with embedded address (not separate collection)
const userSchema = new Schema({
    name: String,
    email: String,
    address: {
        street: String,
        city: String,
        zipCode: String
    },
    // Array of embedded documents
    comments: [{
        text: String,
        createdAt: Date
    }]
});

// Usage
const user = await User.create({
    name: "John",
    email: "john@example.com",
    address: {
        street: "123 Main St",
        city: "NYC",
        zipCode: "10001"
    },
    comments: [
        { text: "First comment", createdAt: new Date() },
        { text: "Second comment", createdAt: new Date() }
    ]
});

// Add comment to array
await User.findByIdAndUpdate(
    userId,
    { $push: { comments: { text: "New comment", createdAt: new Date() } } }
);
```

---

## Advanced Features

### Middleware (Hooks)

Code that runs before/after operations:

```javascript
userSchema.pre("save", async function() {
    // Runs BEFORE saving document
    // 'this' refers to document being saved
    
    if (!this.isModified("password")) {
        return;  // Skip if password not changed
    }
    
    // Hash password before saving
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.post("save", function(doc) {
    // Runs AFTER saving document
    console.log(`User ${doc.name} saved!`);
});

userSchema.pre("findByIdAndUpdate", async function() {
    // Runs before update
    const data = this.getUpdate();
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
});

// Error handling middleware
userSchema.post("save", function(error, doc, next) {
    if (error.name === "MongoServerError" && error.code === 11000) {
        next(new Error("Email already exists"));
    } else {
        next(error);
    }
});
```

**Common Middleware Hooks:**
- `pre("save")` - Before saving
- `post("save")` - After saving
- `pre("find")` - Before find queries
- `post("find")` - After find queries
- `pre("findByIdAndUpdate")` - Before update
- `post("findByIdAndDelete")` - After delete

### Schema Methods

Add custom methods to documents:

```javascript
userSchema.methods.isPasswordCorrect = async function(password) {
    // Compare provided password with stored hash
    return await bcrypt.compare(password, this.password);
};

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

// Usage in controller
const user = await User.findById(userId);
if (await user.isPasswordCorrect(providedPassword)) {
    // Password is correct
    const token = user.generateAccessToken();
}
```

### Static Methods

Add utility methods to model:

```javascript
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function() {
    return this.find({ active: true });
};

// Usage
const user = await User.findByEmail("john@example.com");
const activeUsers = await User.findActiveUsers();
```

### Virtual Fields

Computed fields not stored in DB:

```javascript
userSchema.virtual("fullProfile").get(function() {
    return {
        id: this._id,
        name: this.fullName,
        email: this.email,
        username: this.userName,
        avatar: this.avatar
    };
});

// Usage
const user = await User.findById(userId);
console.log(user.fullProfile);  // Computed dynamically
```

### Aggregation Pipeline

Complex data analysis:

```javascript
// Get video stats by category
const stats = await Video.aggregate([
    // Stage 1: Filter published videos
    {
        $match: { isPublished: true }
    },
    // Stage 2: Group by category
    {
        $group: {
            _id: "$category",
            totalViews: { $sum: "$views" },
            videoCount: { $sum: 1 },
            avgViews: { $avg: "$views" }
        }
    },
    // Stage 3: Sort by views
    {
        $sort: { totalViews: -1 }
    },
    // Stage 4: Limit results
    {
        $limit: 10
    }
]);

// Get user's latest 5 videos with comment count
const userVideos = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "video",
            as: "comments"
        }
    },
    {
        $addFields: {
            commentCount: { $size: "$comments" }
        }
    },
    {
        $project: {
            title: 1,
            views: 1,
            commentCount: 1,
            createdAt: 1
        }
    }
]);
```

### Pagination

Handle large datasets efficiently:

```javascript
// Mongoose plugin: mongoose-aggregate-paginate-v2
videoSchema.plugin(require("mongoose-aggregate-paginate-v2"));

// Usage
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

const videos = await Video.aggregate([
    { $match: { isPublished: true } },
    { $sort: { createdAt: -1 } }
])
.skip(skip)
.limit(limit)
.exec();

const total = await Video.countDocuments({ isPublished: true });
const pages = Math.ceil(total / limit);

res.json({
    videos,
    pagination: {
        currentPage: page,
        totalPages: pages,
        totalVideos: total
    }
});
```

---

## Best Practices

### ✅ DO

- ✅ Define schemas with validation
- ✅ Use indexes on frequently queried fields
- ✅ Hash passwords before saving
- ✅ Use references for large data
- ✅ Validate data before going to DB
- ✅ Use async/await for queries
- ✅ Handle connection errors gracefully
- ✅ Use proper MongoDB operators for complex queries
- ✅ Create logical database names
- ✅ Document schema purposes

### ❌ DON'T

- ❌ Embed large arrays (use references)
- ❌ Store sensitive data directly
- ❌ Skip validation
- ❌ Forget indexes on query fields
- ❌ Use blocking synchronous calls
- ❌ Expose internal MongoDB errors
- ❌ Store unencrypted passwords
- ❌ Forget to close DB connections
- ❌ Mix synchronous and asynchronous code
- ❌ Use `var` (use `const` and `let`)

### Schema Naming Conventions

```javascript
// ✅ Good
const userSchema = new Schema({
    userName: String,           // camelCase
    firstName: String,
    lastLogin: Date,
    isActive: Boolean
});

// ❌ Avoid
const userSchema = new Schema({
    user_name: String,          // snake_case
    first_name: String,
    dob: Date,                  // Unclear abbreviation
    active: Boolean             // Ambiguous
});
```

### Index Best Practices

```javascript
userSchema.index({ email: 1 });              // Ascending index
userSchema.index({ createdAt: -1 });        // Descending index
userSchema.index({ userName: 1, email: 1 }); // Compound index

// Unique index
userSchema.index({ email: 1 }, { unique: true });

// Text search index
userSchema.index({ description: "text" });

// TTL index (auto-delete after time)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

---

## Project Implementation

### Project Models

```
src/models/
├── user.model.js          # User account and profile
├── video.model.js         # Video content
├── comment.model.js       # Video comments
├── like.model.js          # Likes on videos/comments
├── playlist.model.js      # User playlists
└── subscription.model.js  # Channel subscriptions
```

### User Model Example

```javascript
// src/models/user.model.js
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: [true, "User name is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, "Invalid email format"]
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            index: true
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: String,
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
            select: false  // Don't include in queries by default
        },
        refreshToken: {
            type: String,
            select: false
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },
    { timestamps: true }
);

// Middleware: Hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Remove password from output
userSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

// Method: Check password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Method: Generate tokens
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// Index for faster email lookups
userSchema.index({ email: 1, userName: 1 });

const User = mongoose.model("User", userSchema);
export default User;
```

### Video Model Example

```javascript
// src/models/video.model.js
import mongoose, { Schema } from "mongoose";

const videoSchema = new Schema(
    {
        videoFile: {
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            }
        },
        thumbnail: {
            url: String,
            publicId: String
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

// Index for owner queries
videoSchema.index({ owner: 1, isPublished: 1 });
// Index for searching
videoSchema.index({ title: "text", description: "text" });

const Video = mongoose.model("Video", videoSchema);
export default Video;
```

### Usage in Controller

```javascript
// src/controllers/user.controller.js
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;

    // Validation
    if (!userName || !email || !fullName || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user exists
    const existingUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create user (password auto-hashed by middleware)
    const user = await User.create({
        userName,
        email,
        fullName,
        password,
        avatar: ""
    });

    // Fetch created user (password excluded by default)
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Error creating user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password required");
    }

    // Find user (explicitly include password)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();

    // Return user without password
    const logginginUser = await User.findById(user._id);

    // Set secure cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000  // 15 minutes
    });

    return res.status(200).json(
        new ApiResponse(200, logginginUser, "User logged in successfully")
    );
});
```

---

## Summary Table

| Concept | Purpose | Use Case |
|---------|---------|----------|
| **Schema** | Define structure | User, Video models |
| **Model** | Query database | User.find(), Video.create() |
| **Middleware** | Hook into operations | Hash password, auto-update |
| **Methods** | Custom functions on docs | `user.isPasswordCorrect()` |
| **Statics** | Model-level helpers | `User.findByEmail()` |
| **Relationships** | Connect collections | User → Videos |
| **Aggregation** | Complex queries | Analytics, stats |
| **Pagination** | Handle large data | Limit results |

---

## Quick Reference

```javascript
// Complete Mongoose setup
import mongoose from "mongoose";

// 1. Connect
await mongoose.connect(process.env.MONGODB_URI);

// 2. Define schema
const schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true }
}, { timestamps: true });

// 3. Add middleware
schema.pre("save", async function() {
    // Code before save
});

// 4. Add methods
schema.methods.customMethod = function() {
    // Custom function
};

// 5. Create model
const Model = mongoose.model("Model", schema);

// 6. Use model
const doc = await Model.create({ name: "John", email: "john@example.com" });
const found = await Model.findById(doc._id);
await Model.findByIdAndUpdate(doc._id, { name: "Jane" });
await Model.findByIdAndDelete(doc._id);

export default Model;
```

---

**Master Mongoose and build powerful database-driven applications! 🎉**
