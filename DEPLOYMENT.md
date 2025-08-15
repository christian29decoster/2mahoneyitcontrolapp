# 🚀 Mahoney Control App - Deployment Guide

## Vercel Deployment

### Option 1: Vercel Dashboard (Recommended - Easiest)

1. **Gehe zu [vercel.com](https://vercel.com)**
2. **Klicke "New Project"**
3. **Importiere das GitHub Repository**:
   - Wähle dein GitHub Account
   - Wähle das Repository `2mahoneyitcontrolapp`
   - Vercel erkennt automatisch Next.js
4. **Deploy**: Klicke "Deploy" - fertig!

### Option 2: GitHub Actions (Advanced)

1. **Fork/Clone** das Repository
2. **Vercel Project erstellen** (wie oben)
3. **GitHub Secrets konfigurieren**:
   ```
   VERCEL_TOKEN=your_vercel_token
   VERCEL_ORG_ID=your_org_id
   VERCEL_PROJECT_ID=your_project_id
   ```

### Option 2: Manual Deployment

1. **Vercel CLI installieren**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 3: Vercel Dashboard

1. **Repository verbinden**:
   - Vercel Dashboard → New Project
   - GitHub Repository auswählen
   - Framework Preset: Next.js
   - Deploy

## Environment Variables

Keine speziellen Environment Variables erforderlich für die Demo-App.

## Build Commands

```bash
# Development
npm run dev

# Production Build
npm run build

# Production Start
npm start
```

## Features

✅ **Device Management**: Detail View mit Health Monitoring  
✅ **Quick Audit**: EDR/XDR Status + Compliance Reports  
✅ **iPhone Optimized**: Dark Mode + Haptic Feedback  
✅ **Executive Dashboard**: Real-time Security Overview  

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **shadcn/ui Components**
- **Zustand State Management**
