# Deployment Guide for Real Estate Platform

This guide explains how to deploy the Real Estate Platform to production using free/modern hosting providers.

## Recommended Stack
- **Database**: MongoDB Atlas
- **Backend (Node.js/Express)**: Render or Railway
- **Frontend (React/Vite)**: Vercel or Netlify



## 1. Database (MongoDB Atlas)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (M0 Sandbox is free).
3. Under **Database Access**, create a database user and copy the secure password.
4. Under **Network Access**, click "Add IP Address" and select "Allow Access From Anywhere" (`0.0.0.0/0`) since Render/Vercel have dynamic IPs.
5. Click **Connect** on your cluster, select "Connect your application", and copy the connection string. Replace `<password>` with the password from step 3.

---

## 2. Backend Deployment (Render)

1. Push your entire project to a GitHub repository.
2. Sign up on [Render](https://render.com/).
3. Click **New +** and select **Web Service**.
4. Connect your GitHub account and select your repository.
5. Configure the deployment:
   - **Name**: `real-estate-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **Advanced** to add Environment Variables:
   - `PORT` = `10000`
   - `MONGODB_URI` = `mongodb+srv://...` (from Atlas)
   - `JWT_SECRET` = `(generate a secure random string)`
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = `(Leave blank for now, update once frontend is deployed)`
7. Click **Create Web Service**. Wait for the build to finish. Copy the assigned URL (e.g., `https://real-estate-api-xyz.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Sign up on [Vercel](https://vercel.com).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Project Name**: `real-estate-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Environment Variables**:
   - Add `VITE_API_URL` = `https://real-estate-api-xyz.onrender.com/api` (The Render URL from above + `/api`).
6. Click **Deploy**.

---

## 4. Finalizing

1. Once Vercel provides your frontend URL (e.g., `https://real-estate-alpha.vercel.app`), go back to your Render backend configuration.
2. Add/update the `FRONTEND_URL` environment variable on Render to your new Vercel URL. This configures standard production CORS locking down API access exclusively to your frontend.
3. Your app is now live!
