# Blogging API

A RESTful API for a blogging platform built with Node.js, Express, and MongoDB. Features include user authentication with JWT, blog creation and management, and comprehensive search and filtering capabilities.

## Features

- ✅ User authentication (signup/signin) with JWT
- ✅ JWT tokens expire after 1 hour
- ✅ Create, read, update, and delete blog posts
- ✅ Blog states: draft and published
- ✅ Public access to published blogs
- ✅ Private user blog management
- ✅ Automatic reading time calculation
- ✅ Pagination with default 20 items per page
- ✅ Search by author, title, and tags
- ✅ Order by read_count, reading_time, and timestamp
- ✅ Read count tracking
- ✅ Comprehensive test coverage
- ✅ MVC architecture pattern

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest & Supertest** - Testing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn


 server will start on `http://localhost:4800`

## API Documentation

### Base URL
```
http://localhost:4800/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register User
```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

#### Login User
```http
POST /api/auth/signin
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

---

### Blog Endpoints

#### Create Blog (Protected)
```http
POST /api/blogs
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My First Blog",
  "description": "A brief description",
  "body": "The full content of the blog post...",
  "tags": ["nodejs", "javascript"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "data": {
    "_id": "blog_id",
    "title": "My First Blog",
    "description": "A brief description",
    "body": "The full content...",
    "tags": ["nodejs", "javascript"],
    "state": "draft",
    "read_count": 0,
    "reading_time": 2,
    "author": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get All Published Blogs (Public)
```http
GET /api/blogs?page=1&limit=20&search=nodejs&author=John&orderBy=read_count
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `search` (optional) - Search by title or tags
- `author` (optional) - Filter by author name
- `orderBy` (optional) - Sort by: `read_count`, `reading_time`, or `createdAt`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "blog_id",
      "title": "Blog Title",
      "description": "Description",
      "author": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      },
      "state": "published",
      "read_count": 10,
      "reading_time": 5,
      "tags": ["nodejs"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

#### Get Single Blog (Public for published, Protected for drafts)
```http
GET /api/blogs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "blog_id",
    "title": "Blog Title",
    "description": "Description",
    "body": "Full content...",
    "author": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com"
    },
    "state": "published",
    "read_count": 11,
    "reading_time": 5,
    "tags": ["nodejs"],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Get User's Own Blogs (Protected)
```http
GET /api/blogs/user/me?page=1&limit=20&state=draft
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)
- `state` (optional) - Filter by state: `draft` or `published`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "blog_id",
      "title": "My Draft Blog",
      "state": "draft",
      "read_count": 0,
      "reading_time": 3,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

#### Update Blog (Protected - Owner Only)
```http
PUT /api/blogs/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "body": "Updated content...",
  "tags": ["updated", "nodejs"],
  "state": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "_id": "blog_id",
    "title": "Updated Title",
    "description": "Updated description",
    "body": "Updated content...",
    "tags": ["updated", "nodejs"],
    "state": "published",
    "reading_time": 4,
    "author": {...},
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

# Update Blog State (Protected - Owner Only)
```http
PATCH /api/blogs/:id/state
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "state": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Blog state updated to published",
  "data": {
    "_id": "blog_id",
    "title": "Blog Title",
    "state": "published",
    ...
  }
}
```

#### Delete Blog (Protected - Owner Only)
```http
DELETE /api/blogs/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

## Data Models

### User Model
```javascript
{
  first_name: String (required),
  last_name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model
```javascript
{
  title: String (required, unique),
  description: String,
  author: ObjectId (required, ref: User),
  state: String (enum: ['draft', 'published'], default: 'draft'),
  read_count: Number (default: 0),
  reading_time: Number (calculated),
  tags: [String],
  body: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Reading Time Algorithm

The reading time is calculated based on an average reading speed of 200 words per minute:

```javascript
wordCount = body.split(/\s+/).length
reading_time = Math.ceil(wordCount / 200)
```

For example:
- 100 words = 1 minute
- 400 words = 2 minutes
- 1000 words = 5 minutes

---

## Testing

The test suite includes:
- ✅ User authentication tests
- ✅ Blog creation tests
- ✅ Blog listing and pagination tests
- ✅ Search and filter tests
- ✅ Update and delete tests
- ✅ Authorization tests
- ✅ State management tests

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (in development mode)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

```
## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/blogging-api |
| JWT_SECRET | Secret key for JWT | your_secret_key |
| JWT_EXPIRE | JWT expiration time | 1h |
| NODE_ENV | Environment | development/production |
---

## Author
Taiwo Asiyanbi
