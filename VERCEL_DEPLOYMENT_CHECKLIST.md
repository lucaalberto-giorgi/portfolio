# Vercel Deployment Troubleshooting Checklist

## Current Status
- **Repository**: `https://github.com/lucaalberto-giorgi/portfolio.git`
- **Latest Commit**: `84da5bc` - "Resolve merge conflicts: keep all fixes"
- **Branch**: `main`

## Steps to Fix Deployment Issues

### 1. Verify Vercel-GitHub Connection

**In Vercel Dashboard:**
1. Go to your project → **Settings** → **Git**
2. Verify it shows:
   - **Repository**: `lucaalberto-giorgi/portfolio`
   - **Production Branch**: `main`
   - **Git Provider**: GitHub

**If NOT connected:**
1. Click **Disconnect** (if connected to wrong repo)
2. Click **Connect Git Repository**
3. Select `lucaalberto-giorgi/portfolio`
4. Select branch: `main`
5. Click **Deploy**

### 2. Check Deployment Settings

**In Vercel Dashboard → Settings → General:**
- **Framework Preset**: Should be `Next.js`
- **Build Command**: Should be `pnpm run build` (or auto-detected)
- **Install Command**: Should be `pnpm install` (or auto-detected)
- **Root Directory**: Should be `.` (root)

**In Settings → Git:**
- **Production Branch**: Must be `main`
- **Auto-deploy**: Should be enabled

### 3. Manual Deployment Trigger

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or click **Create Deployment** → Select `main` branch → Deploy

**Option B: Via Vercel CLI**
```bash
cd "/Users/lucaalbertogiorgi/Desktop/CS_PORTFOLIO/portfolio website/chanhdai.com-main"
npx vercel --prod
```

### 4. Check Webhook Status

**In Vercel Dashboard → Settings → Git:**
- Check if webhook is active
- If not, click **Reconnect** or **Refresh**

### 5. Verify Build Configuration

Your `vercel.json` should have:
```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm approve-builds && pnpm install --frozen-lockfile",
  "framework": "nextjs",
  "nodeVersion": "22.x"
}
```

### 6. Check Build Logs

**In Vercel Dashboard → Deployments:**
1. Click on the latest deployment
2. Check **Build Logs** for errors
3. Common issues:
   - Build script warnings (should be fixed with `pnpm approve-builds`)
   - Missing dependencies
   - Build errors

### 7. Force New Deployment

If automatic deployment isn't working:
1. Make a small change (we just added `.vercel-trigger`)
2. Commit and push
3. Or manually trigger in Vercel dashboard

## Quick Test

Run this to verify everything is connected:
```bash
cd "/Users/lucaalbertogiorgi/Desktop/CS_PORTFOLIO/portfolio website/chanhdai.com-main"
git log --oneline -1
git remote -v
```

Both should show `portfolio` repository.

## Still Not Working?

1. **Disconnect and reconnect** the GitHub repository in Vercel
2. **Check GitHub permissions** - Vercel needs access to your repository
3. **Verify branch name** - Make sure it's `main` not `master`
4. **Check Vercel project settings** - Ensure auto-deploy is enabled
