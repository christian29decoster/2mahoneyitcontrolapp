#!/usr/bin/env node
/**
 * Mahoney Device Agent – sends events from this device to the Control App.
 * Install on a dev machine or server; configure via environment variables.
 *
 * Required: MAHONEY_APP_URL, MAHONEY_TENANT_ID
 * Optional: MAHONEY_AGENT_KEY (if server uses MAHONEY_AGENT_SECRET), MAHONEY_HEARTBEAT_INTERVAL_SEC (default 60)
 */

import os from 'os'

const APP_URL = process.env.MAHONEY_APP_URL || ''
const TENANT_ID = process.env.MAHONEY_TENANT_ID || ''
const AGENT_KEY = process.env.MAHONEY_AGENT_KEY || ''
const HEARTBEAT_INTERVAL_SEC = Math.max(30, parseInt(process.env.MAHONEY_HEARTBEAT_INTERVAL_SEC || '60', 10) || 60)
const DEVICE_ID = process.env.MAHONEY_DEVICE_ID || os.hostname()

function log(msg) {
  const ts = new Date().toISOString()
  console.log(`[${ts}] ${msg}`)
}

async function sendEvents(events) {
  if (!APP_URL || !TENANT_ID) {
    log('Missing MAHONEY_APP_URL or MAHONEY_TENANT_ID – skipping send')
    return
  }
  const url = `${APP_URL.replace(/\/$/, '')}/api/agent/events`
  const body = {
    tenantId: TENANT_ID,
    deviceId: DEVICE_ID,
    events: events.map((e) => ({ at: e.at, type: e.type, message: e.message })),
  }
  const headers = {
    'Content-Type': 'application/json',
    ...(AGENT_KEY && { 'X-Agent-Key': AGENT_KEY }),
  }
  try {
    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    if (!res.ok) {
      const text = await res.text()
      log(`Send failed ${res.status}: ${text}`)
      return
    }
    const data = await res.json().catch(() => ({}))
    log(`Sent ${data.accepted ?? events.length} events`)
  } catch (err) {
    log(`Send error: ${err.message}`)
  }
}

function heartbeat() {
  const at = new Date().toISOString()
  sendEvents([
    { at, type: 'heartbeat', message: `agent ${DEVICE_ID} heartbeat` },
  ])
}

function main() {
  if (!APP_URL || !TENANT_ID) {
    log('Set MAHONEY_APP_URL and MAHONEY_TENANT_ID. Example:')
    log('  export MAHONEY_APP_URL=https://your-app.vercel.app')
    log('  export MAHONEY_TENANT_ID=O-25-001')
    log('  node agent.js')
    process.exitCode = 1
    return
  }
  log(`Agent starting – tenant=${TENANT_ID} device=${DEVICE_ID} interval=${HEARTBEAT_INTERVAL_SEC}s`)
  heartbeat()
  setInterval(heartbeat, HEARTBEAT_INTERVAL_SEC * 1000)
}

main()
