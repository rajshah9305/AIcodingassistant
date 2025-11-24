# Vercel Deployment Guide

This guide will help you deploy the AI Coding Assistant to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A Groq API key (get one at [console.groq.com](https://console.groq.com))

## Deployment Steps

### 1. Push to GitHub

Make sure your code is pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `rajshah9305/AIcodingassistant`
4. Vercel will auto-detect the project settings

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variable:

- **Key**: `GROQ_API_KEY`
- **Value**: Your Groq API key from [console.groq.com](https://console.groq.com)

**Steps:**
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `GROQ_API_KEY` with your API key value
4. Make sure it's available for all environments (Production, Preview, Development)

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Project Configuration

The project is configured with:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/client`
- **Install Command**: `npm install`
- **Node.js Version**: 20.x

## API Routes

The API is automatically configured at:
- `/api/trpc/*` - All tRPC endpoints

## Troubleshooting

### Build Fails

If the build fails:
1. Check the build logs in Vercel
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version is 20.x

### API Not Working

If the API endpoints don't work:
1. Verify `GROQ_API_KEY` is set in environment variables
2. Check function logs in Vercel dashboard
3. Ensure the API route is at `/api/trpc/[...].ts`

### Environment Variables Not Loading

1. Make sure variables are set for the correct environment
2. Redeploy after adding new environment variables
3. Check variable names match exactly (case-sensitive)

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Monitoring

- View function logs in Vercel Dashboard → Functions
- Monitor API usage in Vercel Analytics
- Check error rates in Vercel Dashboard

## Support

For issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review build logs in Vercel dashboard
3. Check GitHub issues for known problems

