# Environment Variables for Real Estate Platform

This project requires environment variables for both the backend and frontend.

## Backend (`server/.env`)

Create a `.env` file in the `/server` directory:

```env
# Application Port
PORT=5000

# MongoDB Connection String
# Use your MongoDB Atlas URI for production
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/realestate?retryWrites=true&w=majority

# JWT Secret Key for Authentication
# Generate a secure random string for production
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL for CORS configuration (optional, defaults to * or local dev)
FRONTEND_URL=https://your-frontend-domain.vercel.app

# Environment
NODE_ENV=development # Change to 'production' on Render/Railway
```

## Frontend (`client/.env`)

Vite requires environment variables to be prefixed with `VITE_`.

Create a `.env` file in the `/client` directory:

```env
# URL for the backend API
# Local dev: http://localhost:5000/api
# Production: https://your-backend.onrender.com/api
VITE_API_URL=http://localhost:5000/api
```
