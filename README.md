# Real Estate Property Listing Platform
A full-stack web application for listing and managing real estate properties. Built using the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: JWT-based login and registration. Role-based access (Admin/User).
- **Property Listings**: Users can view all available properties or filter them.
- **Admin Dashboard**: Admins can Create, Read, Update, and Delete property listings.
- **Contact Form**: Users can submit inquiries which are stored in the database.
- **Modern UI**: Clean and responsive React interface.

## Project Structure

- `/client` - React frontend application
- `/server` - Node.js + Express backend API

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or Atlas)

## Setup Instructions

### 1. Database Configuration
Create a `.env` file in the `/server` directory based on `/server/.env.example` and add your MongoDB connection string and JWT secret.

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/real-estate
JWT_SECRET=your_jwt_secret_here
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Technologies

**Frontend**: React, React Router, Vite, Axios
**Backend**: Node.js, Express.js, MongoDB, Mongoose, JSON Web Tokens
