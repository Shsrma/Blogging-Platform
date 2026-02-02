# BlogHub - MERN Blogging Platform

A complete, production-ready blogging platform built with the MERN stack (MongoDB, Express, React, Node.js). This project includes full authentication, CRUD operations, comments, pagination, search functionality, and a modern UI.

## Features

✅ **User Authentication**
- JWT-based authentication
- Secure password hashing with bcrypt
- Registration and login functionality
- Protected routes for authenticated users
- Form validation with real-time feedback
- Password strength requirements

✅ **Blog Post Management**
- Create, read, update, delete (CRUD) operations
- Rich post content with categories and tags
- Post search functionality
- Category filtering
- View count tracking
- Like functionality

✅ **Comments System**
- Add comments to posts
- Edit and delete comments
- Nested comment support ready
- Comment pagination
- Like comments

✅ **Advanced Features**
- Pagination for posts and comments
- Search across blog posts
- Category-based filtering
- Fully responsive design (mobile, tablet, desktop)
- Clean and intuitive UI with dark/light theme support
- Comprehensive error handling and validation
- Secure token-based API calls
- Loading states and spinners
- Confirmation dialogs for destructive actions
- Empty state messages

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing enabled

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with responsive design

### Database
- **MongoDB**: Document-based NoSQL database
- **Collections**: Users, Posts, Comments

## Project Structure

```
blog-platform/
├── backend/
│   ├── server.js                  # Express server entry point
│   ├── package.json               # Backend dependencies
│   ├── .env                       # Environment variables
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js                # User schema with password hashing
│   │   ├── Post.js                # Blog post schema
│   │   └── Comment.js             # Comment schema
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── postRoutes.js          # Post CRUD endpoints
│   │   └── commentRoutes.js       # Comment endpoints
│   └── controllers/
│       ├── authController.js      # Auth logic (register, login)
│       ├── postController.js      # Post logic (CRUD, like, search)
│       └── commentController.js   # Comment logic (CRUD, like)
│
├── frontend/
│   ├── index.html                 # HTML entry point
│   ├── vite.config.js             # Vite configuration
│   ├── package.json               # Frontend dependencies
│   └── src/
│       ├── main.jsx               # React app entry
│       ├── App.jsx                # Main app component with routes
│       ├── index.css              # Global styles
│       ├── api/
│       │   └── axios.js           # Axios instance with interceptors
│       ├── pages/
│       │   ├── Login.jsx          # Login page
│       │   ├── Register.jsx       # Registration page
│       │   ├── Home.jsx           # Blog listing with search/filter
│       │   ├── CreatePost.jsx     # Post creation page
│       │   └── PostDetails.jsx    # Single post with comments
│       ├── components/
│       │   ├── Navbar.jsx         # Navigation bar
│       │   └── ProtectedRoute.jsx # Route protection component
│       └── styles/
│           ├── Navbar.css
│           ├── Login.css
│           ├── Register.css
│           ├── Home.css
│           ├── CreatePost.css
│           └── PostDetails.css
│
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

## Environment Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd blog-platform/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file with the following variables:**
   ```
   MONGODB_URI=mongodb://localhost:27017/blogging_platform
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

4. **For MongoDB Atlas (cloud):**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blogging_platform
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd blog-platform/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Frontend runs on http://localhost:3000 by default (configured in vite.config.js)**

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on: **http://localhost:5000**

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

### Production Build (Frontend)

```bash
cd frontend
npm run build
```

Output will be in `dist/` folder.

## API Overview

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Body: { username, email, password, confirmPassword }
Response: { token, user }
```

**Login User**
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

**Get Profile (Protected)**
```
GET /api/auth/profile
Headers: Authorization: Bearer <token>
Response: { user }
```

### Post Endpoints

**Get All Posts (with search & pagination)**
```
GET /api/posts?page=1&limit=10&search=keyword&category=General
Response: { posts, totalPosts, pages, currentPage }
```

**Get Single Post**
```
GET /api/posts/:id
Response: { post }
```

**Create Post (Protected)**
```
POST /api/posts
Headers: Authorization: Bearer <token>
Body: { title, content, category, tags }
Response: { post }
```

**Update Post (Protected, Author Only)**
```
PUT /api/posts/:id
Headers: Authorization: Bearer <token>
Body: { title, content, category, tags }
Response: { post }
```

**Delete Post (Protected, Author Only)**
```
DELETE /api/posts/:id
Headers: Authorization: Bearer <token>
Response: { success }
```

**Like Post (Protected)**
```
POST /api/posts/:id/like
Headers: Authorization: Bearer <token>
Response: { post }
```

### Comment Endpoints

**Get Post Comments**
```
GET /api/comments/post/:postId?page=1&limit=10
Response: { comments, totalComments, pages, currentPage }
```

**Create Comment (Protected)**
```
POST /api/comments/post/:postId
Headers: Authorization: Bearer <token>
Body: { content }
Response: { comment }
```

**Update Comment (Protected, Author Only)**
```
PUT /api/comments/:id
Headers: Authorization: Bearer <token>
Body: { content }
Response: { comment }
```

**Delete Comment (Protected, Author Only)**
```
DELETE /api/comments/:id
Headers: Authorization: Bearer <token>
Response: { success }
```

**Like Comment (Protected)**
```
POST /api/comments/:id/like
Headers: Authorization: Bearer <token>
Response: { comment }
```

## Authentication Flow

1. **Registration**
   - User provides username, email, password
   - Password is hashed using bcryptjs (10 salt rounds)
   - User is created in MongoDB
   - JWT token is generated and returned
   - Token is stored in browser's localStorage

2. **Login**
   - User provides email and password
   - Password is compared with stored hash
   - JWT token is generated and returned
   - Token is stored in browser's localStorage

3. **Protected Routes**
   - Token is included in Authorization header for each request
   - Middleware validates token on backend
   - Expired tokens redirect to login page

4. **Token Structure**
   ```javascript
   {
     id: user._id,
     iat: timestamp,
     exp: timestamp + 7 days
   }
   ```

## Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs (10 rounds)
- Never stored in plain text
- Secure comparison during login

✅ **API Security**
- JWT-based authentication
- Protected routes require valid token
- CORS enabled for secure cross-origin requests
- Environment variables for sensitive data

✅ **Frontend Security**
- Token stored in localStorage (accessible from JS)
- HTTP-only cookies recommended for production
- Secure token refresh on 401 responses

## Database Schema

### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  title: String (required),
  content: String (required),
  author: ObjectId (reference to User),
  category: String,
  tags: [String],
  likes: [ObjectId] (references to Users),
  comments: [ObjectId] (references to Comments),
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  content: String (required),
  author: ObjectId (reference to User),
  post: ObjectId (reference to Post),
  likes: [ObjectId] (references to Users),
  createdAt: Date,
  updatedAt: Date
}
```

## Key Features Explained

### Pagination
- Posts: 10 per page by default
- Comments: 5 per page by default
- Configurable via query parameters

### Search
- Full-text search across title and content
- Case-insensitive matching
- Real-time search results

### Categories
- Pre-defined categories: General, Technology, Lifestyle, Business
- Filter posts by category
- Custom categories can be added

### Like System
- Users can like posts and comments
- Like count displayed
- Toggle like on/off
- Prevents double-counting

### View Tracking
- Incremented on each post view
- Provides engagement metrics

## Error Handling

All endpoints return consistent error responses:
```javascript
{
  success: false,
  message: "Error description"
}
```

## Common Errors & Solutions

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, check network access and IP whitelist

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Modify port in vite.config.js

### CORS Errors
- Backend CORS is configured for all origins
- Check if backend is running on correct port

### Token Expired
- User is automatically redirected to login
- New token required for protected operations

## Development Tips

1. **Use Postman/Insomnia for API testing**
   - Base URL: http://localhost:5000/api
   - Set Authorization header for protected routes

2. **MongoDB Compass**
   - Visual MongoDB client for database inspection
   - Monitor collections and documents in real-time

3. **React DevTools**
   - Browser extension for React debugging
   - Track component state and props

4. **Network Tab**
   - Use browser DevTools Network tab to inspect API calls
   - Verify request/response payloads

## Performance Optimizations

- Pagination reduces data transfer
- Mongoose population controls data fetching
- JWT stateless authentication (no session storage)
- Vite for fast frontend development
- CSS modules ready for implementation

## Production Deployment

### Backend (Node.js)
1. Set NODE_ENV=production in .env
2. Use strong JWT_SECRET
3. Configure MongoDB Atlas for production
4. Use services like Heroku, AWS, DigitalOcean
5. Implement rate limiting
6. Add logging and monitoring

### Frontend (React)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Use services like Vercel, Netlify, AWS S3
4. Configure environment variables
5. Set up CDN for static assets

## Recent Improvements & Polish

### ✅ Enhanced User Experience
- **Comprehensive Form Validation**: Real-time validation with helpful error messages for all forms
- **Loading States**: Visual feedback with spinners during API requests
- **Error Handling**: User-friendly error messages throughout the application
- **Confirmation Dialogs**: Elegant modal dialogs for destructive actions (delete post/comment)
- **Empty States**: Beautiful empty state messages when no content is available
- **Character Counters**: Real-time character count for post titles and comments

### ✅ Responsive Design
- **Mobile-First Approach**: Fully responsive across mobile, tablet, and desktop
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen sizes
- **Touch-Friendly**: Optimized button sizes and spacing for mobile devices
- **Responsive Navigation**: Mobile-optimized navbar with hamburger menu support

### ✅ Security & Authentication
- **Enhanced Validation**: Server-side validation for all inputs (email format, password strength, content length)
- **Better Error Messages**: Clear, actionable error messages for authentication failures
- **Protected Routes**: Improved redirect handling with return path support
- **Token Management**: Secure token storage and automatic cleanup on expiration

### ✅ Comments System
- **Author Population**: Comments now properly display author information
- **Timestamp Display**: Clear date/time formatting for all comments
- **Empty Comment Prevention**: Validation to prevent empty comment submissions
- **Improved UI**: Better comment card layout with proper spacing and styling

### ✅ Code Quality
- **Error Handling**: Comprehensive try-catch blocks with proper error logging
- **Input Validation**: Both client-side and server-side validation
- **Edge Case Handling**: Proper handling of invalid IDs, unauthorized access, and empty results
- **Consistent Styling**: Unified design system with CSS variables for theming

## Future Enhancements

- Social features (follow users, notifications)
- Rich text editor for posts
- Image/media uploads
- Draft posts
- User profiles with bio
- Post scheduling
- Analytics dashboard
- Rate limiting
- Email verification
- 2FA authentication
- i18n internationalization

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues, questions, or improvements, please create an issue in the repository.

---

**Built with ❤️ using MERN Stack**
