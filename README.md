# jobpeek-frontend
# 🚀 JobPeek Deployment Guide

## Overview
This guide will help you deploy JobPeek using:
- **Backend**: Render (Free Tier) - FastAPI
- **Database**: Redis Cloud (Free Tier) - 30MB
- **Frontend**: Netlify (Free Tier) - Next.js

---

## 📋 Prerequisites

1. **GitHub Account** (to store your code)
2. **Render Account** (sign up at render.com)
3. **Redis Cloud Account** (sign up at redis.com/redis-cloud)
4. **Netlify Account** (sign up at netlify.com)

---

## 🔧 Step 1: Setup Redis Cloud

### 1.1 Create Redis Database
1. Go to [Redis Cloud Console](https://app.redislabs.com/)
2. Click **"New Database"**
3. Select **"Free"** plan (30MB, perfect for JobPeek)
4. Choose any cloud provider and region
5. Set database name: `jobpeek-redis`
6. Click **"Create Database"**

### 1.2 Get Connection Details
1. Once created, click on your database
2. Go to **"Configuration"** tab
3. Copy the **connection details**:
   - **Endpoint**: `redis-xxxxx.redislabs.com:port`
   - **Password**: `your_password_here`
4. Your Redis URL format will be:
   ```
   rediss://default:your_password@redis-xxxxx.redislabs.com:port
   ```

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Prepare Your Code
1. Create a new GitHub repository: `jobpeek-backend`
2. Add these files to your repo:
   - `main.py` (the updated FastAPI code)
   - `requirements.txt`
   - `render.yaml` (optional)

### 2.2 Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your `jobpeek-backend` GitHub repository
4. Fill in the details:
   - **Name**: `jobpeek-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

### 2.3 Set Environment Variables
In Render dashboard, add these environment variables:

| Key | Value |
|-----|-------|
| `REDIS_URL` | `rediss://default:your_password@redis-xxxxx.redislabs.com:port` |
| `BASE_URL` | `https://us.careerdays.io` |
| `PYTHON_VERSION` | `3.11.0` |

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://jobpeek-backend-xxxx.onrender.com`

### 2.5 Test Backend
Visit your backend URL and you should see:
```json
{
  "message": "JobPeek API is running",
  "status": "healthy",
  "redis_status": "connected"
}
```

---

## 🌐 Step 3: Deploy Frontend to Netlify

### 3.1 Prepare Frontend Code
1. Create a new GitHub repository: `jobpeek-frontend`
2. Add all the Next.js files from the frontend artifact
3. Make sure your `package.json` includes all dependencies

### 3.2 Deploy to Netlify
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your `jobpeek-frontend` GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### 3.3 Set Environment Variables
In Netlify dashboard → Site settings → Environment variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://jobpeek-backend-xxxx.onrender.com` |

### 3.4 Deploy
1. Click **"Deploy site"**
2. Wait for deployment (3-5 minutes)
3. Your frontend URL will be: `https://amazing-site-name.netlify.app`

---

## ✅ Step 4: Test Complete Application

### 4.1 Test Backend Endpoints
```bash
# Test health endpoint
curl https://jobpeek-backend-xxxx.onrender.com/

# Test next job endpoint (replace USER_ID with any UUID)
curl "https://jobpeek-backend-xxxx.onrender.com/api/next?user=test-user-123"

# Test user stats
curl "https://jobpeek-backend-xxxx.onrender.com/api/stats?user=test-user-123"
```

### 4.2 Test Frontend
1. Visit your Netlify URL
2. Click **"Start Browsing Jobs"**
3. Test navigation (Next/Previous buttons)
4. Test copy functionality
5. Check browser console for any errors

---

## 🔧 Troubleshooting

### Backend Issues

**❌ Redis Connection Failed**
- Check your Redis URL format: `rediss://default:password@host:port`
- Ensure Redis Cloud database is active
- Check Render logs for specific error messages

**❌ Job Scraping Issues**
- Check if the source website (careerdays.io) is accessible
- Monitor Render logs for HTTP errors
- The scraping logic remains unchanged from original PRD

**❌ 503 Service Unavailable**
- This usually means Redis is temporarily unavailable
- The app has retry logic, so wait a moment and try again
- Check Redis Cloud dashboard for service status

### Frontend Issues

**❌ API Connection Failed**
- Verify `NEXT_PUBLIC_BACKEND_URL` is set correctly in Netlify
- Check browser network tab for CORS errors
- Ensure backend is deployed and healthy

**❌ Copy Functionality Not Working**
- This requires HTTPS (which Netlify provides)
- Check browser console for clipboard API errors

---

## 📊 Monitoring & Maintenance

### Backend Monitoring
- **Render Dashboard**: Monitor app performance and logs
- **Redis Cloud Console**: Monitor memory usage (stay under 30MB)
- **Health Check**: Visit your backend URL to check status

### Usage Limits (Free Tiers)
- **Render**: 750 hours/month (enough for 24/7)
- **Redis Cloud**: 30MB storage, 30 connections
- **Netlify**: 100GB bandwidth/month

### Daily Reset
- Jobs reset automatically at midnight (handled by Redis TTL)
- No manual intervention needed
- Users will see fresh jobs each day

---

## 🎯 Performance Tips

1. **Redis Optimization**:
   - Keys automatically expire daily
   - Cache TTL is set to 90 seconds
   - Connection pooling included

2. **Backend Optimization**:
   - Gunicorn with 2 workers
   - Request timeout handling
   - Retry logic for Redis operations

3. **Frontend Optimization**:
   - Static generation with Next.js
   - Automatic code splitting
   - Optimized images and assets

---

## 🔒 Security Notes

- All connections use HTTPS/TLS
- Redis uses SSL (`rediss://`)
- No sensitive data stored in frontend
- Rate limiting built into scraping logic
- CORS properly configured

---

## 📈 Scaling Considerations

When you outgrow free tiers:

1. **Render**: Upgrade to paid plan ($7/month) for better performance
2. **Redis Cloud**: Upgrade for more storage/connections
3. **Netlify**: Pro plan for more bandwidth

The application is designed to handle thousands of users on free tiers!

---

## 🎉 Success!

Your JobPeek application is now live and ready to help users discover amazing job opportunities! 

**Frontend URL**: `https://your-site.netlify.app`  
**Backend URL**: `https://jobpeek-backend-xxxx.onrender.com`

Users can now:
- ✅ Browse jobs one at a time
- ✅ Never see duplicates in the same day  
- ✅ Copy job descriptions and links
- ✅ Get fresh jobs daily
- ✅ Use on mobile and desktop

Happy job hunting! 🚀
