import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

/**
 * GET /api/agent/download?tenantId=XXX&appUrl=YYY
 * Returns a ZIP with the device agent and .env.example pre-filled for this tenant.
 * appUrl optional (default: NEXT_PUBLIC_APP_URL or empty in .env.example).
 */
export async function GET(req: NextRequest) {
  const tenantId = req.nextUrl.searchParams.get('tenantId')?.trim()
  if (!tenantId) {
    return NextResponse.json({ error: 'tenantId required' }, { status: 400 })
  }

  const appUrl = req.nextUrl.searchParams.get('appUrl')?.trim() || process.env.NEXT_PUBLIC_APP_URL || ''
  const baseDir = path.join(process.cwd(), 'agent')
  const agentPath = path.join(baseDir, 'agent.js')
  const pkgPath = path.join(baseDir, 'package.json')

  if (!fs.existsSync(agentPath) || !fs.existsSync(pkgPath)) {
    return NextResponse.json({ error: 'Agent files not found' }, { status: 500 })
  }

  const archive = archiver('zip', { zlib: { level: 9 } })
  const chunks: Buffer[] = []
  archive.on('data', (chunk: Buffer) => chunks.push(chunk))

  const envExample = `# Mahoney Device Agent – pre-filled for tenant ${tenantId}
# Copy to .env or set these in your environment.

MAHONEY_APP_URL=${appUrl || 'https://your-app.vercel.app'}
MAHONEY_TENANT_ID=${tenantId}

# Optional: only if the app has MAHONEY_AGENT_SECRET set
# MAHONEY_AGENT_KEY=your-secret

# Optional: device identifier (default: hostname)
# MAHONEY_DEVICE_ID=my-server-01

# Optional: heartbeat interval in seconds (default: 60)
# MAHONEY_HEARTBEAT_INTERVAL_SEC=60
`

  const readme = `# Mahoney Device Agent – Tenant ${tenantId}

This package is pre-configured for tenant **${tenantId}**.

## Quick start

1. Copy \`.env.example\` to \`.env\` and adjust if needed (MAHONEY_APP_URL is already set).
2. Run: \`node agent.js\`
3. Events will be sent to the Control App for this tenant.

## Requirements

- Node.js 18+

## Variables

- MAHONEY_APP_URL – already set for this tenant
- MAHONEY_TENANT_ID – already set to ${tenantId}
- Optional: MAHONEY_AGENT_KEY, MAHONEY_DEVICE_ID, MAHONEY_HEARTBEAT_INTERVAL_SEC
`

  archive.append(fs.createReadStream(agentPath), { name: 'agent.js' })
  archive.append(fs.createReadStream(pkgPath), { name: 'package.json' })
  archive.append(envExample, { name: '.env.example' })
  archive.append(readme, { name: 'README.md' })
  archive.finalize()

  await new Promise<void>((resolve, reject) => {
    archive.once('error', reject)
    archive.once('end', () => resolve())
  })
  const zipBuffer = Buffer.concat(chunks)
  const filename = `mahoney-agent-${tenantId.replace(/[^a-zA-Z0-9-_]/g, '-')}.zip`
  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(zipBuffer.length),
    },
  })
}
