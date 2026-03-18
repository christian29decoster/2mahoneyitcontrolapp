# Mahoney Device Agent

Lightweight agent to send events from a device (dev machine, server, or PC) to the Mahoney Control App. Use it to feed device heartbeats or custom events into the platform for MDU and monitoring.

## Requirements

- Node.js 18 or later (for native `fetch`)

## Install on the device

1. Copy the `agent` folder to the device (e.g. clone the repo or copy only the `agent` directory with `agent.js` and `package.json`).

2. No `npm install` is required; the script uses only Node built-ins.

## Configure

Set environment variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `MAHONEY_APP_URL` | Yes | Base URL of the Control App (e.g. `https://your-app.vercel.app`) |
| `MAHONEY_TENANT_ID` | Yes | Tenant ID this device belongs to (e.g. `O-25-001`) |
| `MAHONEY_AGENT_KEY` | No | Secret key; set if the app has `MAHONEY_AGENT_SECRET` configured |
| `MAHONEY_DEVICE_ID` | No | Device identifier (default: hostname) |
| `MAHONEY_HEARTBEAT_INTERVAL_SEC` | No | Seconds between heartbeats (default: 60, min: 30) |

### Example (Linux / macOS)

```bash
export MAHONEY_APP_URL=https://your-app.vercel.app
export MAHONEY_TENANT_ID=O-25-001
export MAHONEY_AGENT_KEY=your-secret-if-required
node agent.js
```

### Example (Windows PowerShell)

```powershell
$env:MAHONEY_APP_URL = "https://your-app.vercel.app"
$env:MAHONEY_TENANT_ID = "O-25-001"
node agent.js
```

## Run

- **Foreground:** `node agent.js` or `npm start`
- **Background (Linux/macOS):** `nohup node agent.js > agent.log 2>&1 &`
- **As a service:** Use systemd, launchd, or Windows Service to run `node agent.js` and set the env vars in the service config.

## What the agent sends

- **Heartbeat:** Every N seconds (see `MAHONEY_HEARTBEAT_INTERVAL_SEC`) the agent sends one event of type `heartbeat` to `POST /api/agent/events`. The app stores these events and they can be used for MDU counting and device presence.

## App configuration

- **Optional:** In your deployment (e.g. Vercel), set `MAHONEY_AGENT_SECRET` to a shared secret. Then set the same value as `MAHONEY_AGENT_KEY` on each agent. Requests without the correct `X-Agent-Key` header will receive 401 Unauthorized.
