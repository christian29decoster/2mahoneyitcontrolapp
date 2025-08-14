# Mahoney Control App - Web Preview

A production-ready Next.js 14 security management and monitoring platform with dark mode UI, designed for cloud-only development and Vercel deployment.

## Features

- **Dark Mode UI** with cool blue accent and subtle green for "all good" states
- **Next.js 14 App Router** for modern React development
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive Design** for all devices
- **Mock Data** with ~25 devices for web preview
- **Proactive Recommendations** system
- **Health Check API** endpoint

## Quick Start (Vercel GitHub Import)

1. **Sign in to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Repository**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose this repository

3. **Deploy**
   - Framework will be auto-detected as Next.js
   - Click "Deploy"
   - Get your live URL: `*.vercel.app`

## Alternative: Deploy via GitHub Action (with token)

1. **Get Vercel Tokens**
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token
   - Note your Organization ID and Project ID

2. **Add Repository Secrets**
   - Go to your GitHub repository settings
   - Navigate to "Secrets and variables" → "Actions"
   - Add these secrets:
     - `VERCEL_TOKEN` - Your Vercel authentication token
     - `VERCEL_ORG_ID` - Your Vercel organization ID
     - `VERCEL_PROJECT_ID` - Your Vercel project ID

3. **Deploy**
   - Push to `main` branch
   - GitHub Action will automatically build and deploy

## Optional: GitHub Codespaces

For cloud development without local setup:

1. **Open in Codespaces**
   - Click the green "Code" button on GitHub
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Development**
   - Container will automatically install dependencies
   - Run `pnpm dev` to start development server
   - Preview via forwarded port 3000

## Environment Variables

Set these in your Vercel project settings:

- `NODE_ENV` - Set to `production` for production builds
- Add any additional environment variables as needed

## Custom Domain

To add a custom domain:

1. **In Vercel Dashboard**
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain

2. **DNS Configuration**
   - Follow Vercel's DNS setup instructions
   - Point your domain to Vercel's nameservers

## Development

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with dark mode
│   ├── page.tsx           # Dashboard landing page
│   ├── devices/           # Devices & Staff page
│   ├── company/           # Company settings page
│   ├── profile/           # User profile page
│   ├── marketplace/       # Marketplace page
│   └── api/health/        # Health check API
├── components/            # Reusable UI components
│   ├── Nav.tsx           # Navigation component
│   ├── Card.tsx          # Card wrapper component
│   ├── Stat.tsx          # Statistics component
│   └── Badge.tsx         # Status badge component
├── lib/                   # Utility functions
│   ├── copy.ts           # UI strings (en-US)
│   └── data.ts           # Mock data for preview
├── .github/workflows/     # GitHub Actions
│   ├── ci.yml            # CI workflow
│   └── vercel-deploy.yml # Vercel deployment
└── .devcontainer/        # GitHub Codespaces config
```

## API Endpoints

- `GET /api/health` - Health check endpoint
  - Returns: `{ ok: true, time: "2024-01-15T10:30:00.000Z" }`

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vercel** - Deployment platform
- **GitHub Actions** - CI/CD automation

## License

This project is for demonstration purposes.

## Support

For questions or issues, please refer to the deployment documentation above or contact the development team. 