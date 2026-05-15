# 🎬 Practice Video Platform Backend

A complete YouTube-like video streaming platform backend built with **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary**. This project demonstrates professional backend development practices with JWT authentication, file uploads, aggregation pipelines, and comprehensive API endpoints.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Models](#-database-models)
- [Authentication](#-authentication)
- [Error Handling](#-error-handling)
- [Best Practices Used](#-best-practices-used)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### User Management
- ✅ User registration with profile image and cover photo
- ✅ Secure login/logout with JWT tokens
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token refresh mechanism (7-day access, 30-day refresh)
- ✅ Profile management (update details, avatar, cover)
- ✅ Channel profiles with subscriber counts
- ✅ Watch history tracking

### Video Management
- ✅ Video upload with automatic Cloudinary processing
- ✅ Video details management (title, description, thumbnail)
- ✅ Publish/unpublish toggle
- ✅ Video pagination and filtering
- ✅ Search by title
- ✅ Sort by various criteria
- ✅ Multi-owner support

### Social Features
- ✅ Comment system on videos
- ✅ Comment CRUD operations
- ✅ Like/Unlike videos
- ✅ Like/Unlike comments
- ✅ Subscribe/Unsubscribe to channels
- ✅ Get liked videos
- ✅ Get subscriber lists
- ✅ Get subscribed channels

### Playlist Management
- ✅ Create/Update/Delete playlists
- ✅ Add/Remove videos from playlists
- ✅ Get user playlists
- ✅ Get playlist contents with video details

### Analytics & Dashboard
- ✅ Channel statistics (total videos, views, likes, subscribers)
- ✅ Get channel videos
- ✅ View aggregated metrics

---

## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 16+ |
| **Framework** | Express.js | 5.2.1 |
| **Database** | MongoDB | 7.0+ |
| **ODM** | Mongoose | 9.0.1 |
| **Authentication** | JSON Web Tokens (JWT) | 9.0.3 |
| **Password Hashing** | bcrypt | 6.0.0 |
| **File Storage** | Cloudinary | 2.8.0 |
| **File Upload** | Multer | 2.0.2 |
| **Middleware** | Cookie Parser, CORS | Latest |
| **Development** | Nodemon | 3.1.11 |

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - comes with Node.js
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### External Services Required:
- **Cloudinary Account** - for image/video storage - [Sign Up](https://cloudinary.com/)

---

## 📥 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PracticeProject
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
Create a `.env` file in the project root:
```bash
touch .env
```

### 4. Configure Environment Variables
Add the following to your `.env` file:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net

# JWT Secrets & Expiry
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_make_it_long
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here_make_it_different
REFRESH_TOKEN_EXPIRY=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:3000
```

### 5. Start the Server

**Development Mode** (with hot reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Server will start on `http://localhost:8000`

---

## ⚙️ Configuration

### MongoDB Setup

#### Using MongoDB Atlas (Recommended for Production):
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Add your IP address to network access
5. Create a database user
6. Get your connection string
7. Add to `.env` as `MONGODB_URI`

#### Using Local MongoDB:
```bash
# Start MongoDB service
# On Windows
net start MongoDB

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

Connection string: `mongodb://localhost:27017/practice_project_videotube`

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret
4. Add to `.env` file

### Temporary File Storage

The project stores uploaded files temporarily in `public/temp/` before uploading to Cloudinary:
- Files are automatically cleaned up after successful upload
- Ensure `public/temp` directory exists
- Has write permissions for the Node.js process

---

## 📂 Project Structure

```
PracticeProject/
│
├── src/
│   ├── app.js                      # Express application setup
│   ├── index.js                    # Application entry point
│   ├── constants.js                # Application constants
│   │
│   ├── controllers/                # Business logic layer
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── models/                     # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   └── subscription.model.js
│   │
│   ├── routes/                     # API route definitions
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── middlewares/                # Custom middleware
│   │   ├── auth.middleware.js      # JWT verification
│   │   └── multer.middleware.js    # File upload handling
│   │
│   ├── utils/                      # Utility functions
│   │   ├── ApiError.js             # Custom error class
│   │   ├── ApiResponse.js          # Standard response class
│   │   ├── asyncHandler.js         # Async error wrapper
│   │   └── cloudinary.js           # Cloudinary upload utility
│   │
│   └── db/
│       └── db.js                   # MongoDB connection
│
├── public/
│   └── temp/                       # Temporary file storage
│
├── .env                            # Environment variables
├── .gitignore                      # Git ignore rules
├── package.json                    # Project metadata & scripts
├── package-lock.json               # Dependency lock file
└── README.md                       # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Response Format

**Success Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

**Error Response:**
```json
{
  "statusCode": 400,
  "message": "Error message",
  "errors": [],
  "success": false
}
```

---

### User Endpoints

#### Register User
```http
POST /users/register
Content-Type: multipart/form-data

avatar: <file>              (required, image)
coverImage: <file>          (optional, image)
userName: string            (required, unique)
email: string               (required, unique)
password: string            (required, min 8 chars recommended)
fullName: string            (required)
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "userName": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://...",
    "coverImage": "https://..."
  },
  "message": "User registered successfully",
  "success": true
}
```

#### Login User
```http
POST /users/login
Content-Type: application/json

{
  "userName": "john_doe",      (or email)
  "email": "john@example.com", (or userName)
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  },
  "message": "User logged in successfully"
}
```

Sets httpOnly cookies for both tokens.

#### Logout User
```http
POST /users/logout
Authorization: Bearer <accessToken>
```

#### Refresh Access Token
```http
POST /users/refreshToken
```

Uses refreshToken from cookies.

#### Change Password
```http
POST /users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "oldPassword": "current_password",
  "newPassword": "new_password"
}
```

#### Get Current User
```http
GET /users/current-user
Authorization: Bearer <accessToken>
```

#### Update Account Details
```http
PATCH /users/update-account
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "fullName": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Update Avatar
```http
PATCH /users/update-avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

avatar: <file>  (required)
```

#### Update Cover Image
```http
PATCH /users/update-cover-image
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

coverImage: <file>  (required)
```

#### Get Channel Profile
```http
GET /users/c/:userName
Authorization: Bearer <accessToken>
```

Returns channel with subscriber count and subscription status.

#### Get Watch History
```http
GET /users/watch-history
Authorization: Bearer <accessToken>
```

---

### Video Endpoints

#### Get All Videos
```http
GET /videos?page=1&limit=10&query=search&sortBy=createdAt&sortType=desc&userId=<id>
Authorization: Bearer <accessToken>
```

#### Publish Video
```http
POST /videos
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

videoFile: <file>      (required, .mp4, .mkv, etc.)
thumbnail: <file>      (required, image)
title: string          (required)
description: string    (required)
```

#### Get Video by ID
```http
GET /videos/:videoId
Authorization: Bearer <accessToken>
```

#### Update Video
```http
PATCH /videos/:videoId
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

title: string          (optional)
description: string    (optional)
thumbnail: <file>      (optional)
```

#### Delete Video
```http
DELETE /videos/:videoId
Authorization: Bearer <accessToken>
```

#### Toggle Publish Status
```http
PATCH /videos/toggle/publish/:videoId
Authorization: Bearer <accessToken>
```

---

### Comment Endpoints

#### Get Video Comments
```http
GET /comments/:videoId?page=1&limit=10
Authorization: Bearer <accessToken>
```

#### Add Comment
```http
POST /comments/:videoId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "content": "Great video!"
}
```

#### Update Comment
```http
PATCH /comments/c/:commentId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "content": "Updated comment"
}
```

#### Delete Comment
```http
DELETE /comments/c/:commentId
Authorization: Bearer <accessToken>
```

---

### Like Endpoints

#### Toggle Video Like
```http
POST /likes/toggle/v/:videoId
Authorization: Bearer <accessToken>
```

#### Toggle Comment Like
```http
POST /likes/toggle/c/:commentId
Authorization: Bearer <accessToken>
```

#### Get Liked Videos
```http
GET /likes/videos
Authorization: Bearer <accessToken>
```

---

### Subscription Endpoints

#### Toggle Subscription
```http
POST /subscriptions/c/:channelId
Authorization: Bearer <accessToken>
```

#### Get Channel Subscribers
```http
GET /subscriptions/u/:subscriberId
Authorization: Bearer <accessToken>
```

#### Get Subscribed Channels
```http
GET /subscriptions/c/:channelId
Authorization: Bearer <accessToken>
```

---

### Playlist Endpoints

#### Create Playlist
```http
POST /playlist
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "My Favorites",
  "description": "Collection of my favorite videos"
}
```

#### Get User Playlists
```http
GET /playlist/user/:userId
Authorization: Bearer <accessToken>
```

#### Get Playlist by ID
```http
GET /playlist/:playlistId
Authorization: Bearer <accessToken>
```

#### Update Playlist
```http
PATCH /playlist/:playlistId
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### Add Video to Playlist
```http
PATCH /playlist/add/:videoId/:playlistId
Authorization: Bearer <accessToken>
```

#### Remove Video from Playlist
```http
PATCH /playlist/remove/:videoId/:playlistId
Authorization: Bearer <accessToken>
```

#### Delete Playlist
```http
DELETE /playlist/:playlistId
Authorization: Bearer <accessToken>
```

---

### Dashboard Endpoints

#### Get Channel Statistics
```http
GET /dashboard/stats
Authorization: Bearer <accessToken>
```

Returns:
```json
{
  "totalVideos": 15,
  "totalViews": 5000,
  "totalLikes": 250,
  "totalSubscribers": 100
}
```

#### Get Channel Videos
```http
GET /dashboard/videos
Authorization: Bearer <accessToken>
```

---

## 🗄️ Database Models

### User Schema
```javascript
{
  userName: String,         // unique, lowercase, indexed
  email: String,            // unique, lowercase
  fullName: String,         // indexed
  avatar: String,           // cloudinary URL
  coverImage: String,       // cloudinary URL (optional)
  password: String,         // hashed with bcrypt
  refreshToken: String,     // stored for token refresh
  watchHistory: ObjectId[], // video references
  timestamps: true
}
```

**Methods:**
- `isPasswordCorrect(password)` - Compare password
- `generateAccessToken()` - Create JWT
- `generateRefreshToken()` - Create refresh token

### Video Schema
```javascript
{
  videoFile: String,        // cloudinary URL
  thumbnail: String,        // cloudinary URL
  title: String,
  description: String,
  duration: Number,
  views: Number,           // default: 0
  isPublished: Boolean,    // default: true
  owner: ObjectId,         // user reference
  timestamps: true
}
```

**Plugins:**
- `mongooseAggregatePaginate` - for pagination

### Comment Schema
```javascript
{
  content: String,
  video: ObjectId,         // video reference
  owner: ObjectId,         // user reference
  timestamps: true
}
```

### Like Schema
```javascript
{
  video: ObjectId,         // optional
  comment: ObjectId,       // optional
  likedBy: ObjectId,       // user reference
  timestamps: true
}
```

### Playlist Schema
```javascript
{
  name: String,
  description: String,
  videos: ObjectId[],      // video references
  owner: ObjectId,         // user reference
  timestamps: true
}
```

### Subscription Schema
```javascript
{
  subscriber: ObjectId,    // user reference
  channel: ObjectId,       // user reference
  timestamps: true,
  unique index: [subscriber, channel]
}
```

---

## 🔐 Authentication

### JWT Strategy

1. **Access Token**
   - Lifetime: 7 days
   - Contains: userId, email, username, fullName
   - Stored in: HTTP-only cookie + response
   - Used for: Request authentication

2. **Refresh Token**
   - Lifetime: 30 days
   - Contains: userId only
   - Stored in: HTTP-only cookie + database
   - Used for: Getting new access token

### Protected Routes

All protected routes require:
```
Authorization: Bearer <accessToken>
```

Or automatically use cookie if present.

### Auth Middleware

```javascript
// src/middlewares/auth.middleware.js
verifyJWT middleware:
1. Extracts token from cookies or header
2. Verifies token signature
3. Finds user in database
4. Attaches user to req.user
5. Passes to next middleware
```

---

## ❌ Error Handling

### ApiError Class

```javascript
throw new ApiError(
  statusCode,           // HTTP status
  message,              // Error message
  errors,               // Detailed errors (optional)
  stack                 // Stack trace (optional)
)
```

### Built-in Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request (validation) |
| 401 | Unauthorized (auth required) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate entry) |
| 500 | Server Error |

### Error Response Example
```json
{
  "statusCode": 400,
  "message": "All fields are required",
  "errors": [],
  "success": false
}
```

---

## ✅ Best Practices Used

### Code Organization
- ✅ MVC architecture (Models, Views/Routes, Controllers)
- ✅ Separation of concerns
- ✅ Reusable utility functions
- ✅ Consistent naming conventions

### Security
- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ HTTP-only cookies
- ✅ CORS configuration
- ✅ Input validation
- ✅ Protected routes

### Database
- ✅ Schema validation
- ✅ Indexes for performance
- ✅ References between models
- ✅ Aggregation pipelines
- ✅ Pagination support

### Error Handling
- ✅ Custom error class
- ✅ Async error wrapper
- ✅ Comprehensive error messages
- ✅ Stack traces for debugging

### API Design
- ✅ RESTful conventions
- ✅ Consistent response format
- ✅ Proper HTTP status codes
- ✅ Versioned endpoints (/api/v1/)

---

## 🧪 Testing

### Manual Testing with Postman

1. **Import Collection**
   - Create environment with base URL
   - Create requests for each endpoint

2. **Test Flow**
   - Register user
   - Login (capture tokens)
   - Upload video (use token)
   - Get videos
   - Add comment
   - Like video
   - Subscribe to channel
   - Get dashboard stats

### Integration Testing

Add Jest or Mocha for automated testing:

```bash
npm install --save-dev jest supertest
```

Example test:
```javascript
test('Register user', async () => {
  const response = await request(app)
    .post('/api/v1/users/register')
    .field('userName', 'testuser')
    .field('email', 'test@example.com')
    .attach('avatar', 'path/to/image.jpg');
  
  expect(response.status).toBe(201);
});
```

---

## 🚀 Deployment

### Heroku Deployment

1. **Add Procfile:**
```
web: npm start
```

2. **Set Environment Variables:**
```bash
heroku config:set MONGODB_URI=...
heroku config:set ACCESS_TOKEN_SECRET=...
```

3. **Deploy:**
```bash
git push heroku main
```

### Railway Deployment

1. Push code to GitHub
2. Connect repository to Railway
3. Add environment variables
4. Deploy automatically

### AWS/Google Cloud

1. Create compute instance
2. Clone repository
3. Install Node.js and dependencies
4. Set environment variables
5. Use PM2 for process management

```bash
npm install -g pm2
pm2 start src/index.js --name "videotube"
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
- Check MongoDB is running
- Verify connection string in .env
- Check network access (Atlas)
```

#### 2. Cloudinary Upload Error
```
Error: ENOENT: no such file or directory

Solution:
- Ensure public/temp directory exists
- Check file permissions
- Verify Cloudinary credentials
```

#### 3. JWT Token Expired
```
Error: jwt expired

Solution:
- Use /refreshToken endpoint
- Check token expiry in .env
```

#### 4. File Upload Size Limit
```
Error: PayloadTooLargeError

Solution:
Modify multer middleware:
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))
```

#### 5. CORS Errors
```
Error: Access to XMLHttpRequest blocked by CORS policy

Solution:
Update CORS config in app.js:
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
```

---

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the ISC License - see `package.json` for details.

---

## 👨‍💻 Author

**Abdul Samad**  
Backend Developer | Node.js Enthusiast

---

## 📞 Support

For issues and questions, please:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

---

## 🗺️ Roadmap

- [ ] Add real-time notifications with Socket.io
- [ ] Implement video streaming with HLS
- [ ] Add user followers system
- [ ] Implement recommendation algorithm
- [ ] Add full-text search
- [ ] Add video quality selection
- [ ] Implement payment integration
- [ ] Add analytics dashboard
- [ ] Mobile app API enhancements
- [ ] GraphQL API support

---

**Happy Coding! 🎉**

