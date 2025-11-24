# Vercel Deployment Guide

## Quick Deploy (3 Steps)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: One-Click Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rajshah9305/AIcodingassistant)

**Option B: Manual Deploy**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import `rajshah9305/AIcodingassistant`
4. Click "Deploy"

### 3. Add Environment Variable

After deployment:
1. Go to Project Settings → Environment Variables
2. Add: `GROQ_API_KEY` = `your_groq_api_key_here`
3. Click "Redeploy" to apply

## Configuration

The project is pre-configured with `vercel.json`:
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist/client`
- ✅ API routes: `/api/trpc/*`
- ✅ Runtime: Node.js 20.x

## Verify Deployment

Your app will be live at: `https://your-project.vercel.app`

Test endpoints:
- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/trpc`

## Troubleshooting

**Build fails:**
```bash
# Test build locally first
npm run build
```

**API not working:**
- Verify `GROQ_API_KEY` is set in Vercel dashboard
- Check Function Logs in Vercel dashboard

**Streaming not working:**
- Vercel supports streaming via Edge Functions
- Current setup uses serverless functions (works for most cases)

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as shown

---

**That's it!** Your AI Coding Assistant is now live.
