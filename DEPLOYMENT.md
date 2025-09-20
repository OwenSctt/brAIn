# 🚀 Deployment Guide for brAIn

This guide covers multiple hosting options for your Next.js AI Learning App.

## 🌟 Option 1: Vercel (Recommended)

Vercel is the easiest and most optimized for Next.js apps.

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)

### Steps

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `OwenSctt/brAIn` repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Set Environment Variables** (in Vercel dashboard):
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key

4. **Redeploy** after adding environment variables

### Automatic Deployments
- Every push to `main` branch = production deployment
- Every pull request = preview deployment

---

## 🔥 Option 2: Netlify

### Steps

1. **Build the app**:
   ```bash
   npm run build
   npm run export  # If you want static export
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repo

---

## ☁️ Option 3: Railway

### Steps

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

---

## 🐳 Option 4: Docker (Any VPS)

### Create Dockerfile

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Deploy
```bash
docker build -t brain-ai-app .
docker run -p 3000:3000 brain-ai-app
```

---

## 🔧 Environment Variables

Create these in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📊 Performance Optimization

The app is already optimized with:
- ✅ Static generation where possible
- ✅ Image optimization
- ✅ Code splitting
- ✅ Tree shaking
- ✅ CSS optimization

---

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**: Check all imports and dependencies
2. **CSS not loading**: Ensure Tailwind CSS is properly configured
3. **API routes not working**: Check environment variables
4. **Hydration errors**: Fixed with static dates in dashboard

### Debug Commands:
```bash
npm run build    # Test production build
npm run start    # Test production server
npm run lint     # Check for errors
```

---

## 🎯 Recommended: Vercel

**Why Vercel?**
- ✅ Made by Next.js creators
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Free tier available
- ✅ Easy environment variable management

**Your app will be live at**: `https://your-app-name.vercel.app`
