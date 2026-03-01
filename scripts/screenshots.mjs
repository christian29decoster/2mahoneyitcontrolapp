#!/usr/bin/env node
/**
 * Erstellt Screenshots der Webapp für den Download.
 * Voraussetzung: App läuft (npm run dev) ODER Basis-URL setzen.
 * Nutzung: npx playwright install chromium && node scripts/screenshots.mjs
 * Oder mit URL: BASE_URL=https://deine-app.vercel.app node scripts/screenshots.mjs
 */

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUT_DIR = join(process.cwd(), 'screenshots')

const PAGES = [
  { path: '/', name: '01-dashboard' },
  { path: '/login', name: '02-login' },
  { path: '/devices', name: '03-devices' },
  { path: '/company', name: '04-company' },
  { path: '/governance', name: '05-governance' },
  { path: '/governance/soc-questionnaire', name: '06-soc-questionnaire' },
  { path: '/incidents', name: '07-incidents' },
  { path: '/financials', name: '08-financials' },
  { path: '/marketplace', name: '09-marketplace' },
  { path: '/settings', name: '10-settings' },
]

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log('Browser starten…')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  })

  for (const { path, name } of PAGES) {
    const url = BASE_URL + path
    console.log('Screenshot:', path, '→', name + '.png')
    try {
      const page = await context.newPage()
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
      await page.waitForTimeout(800)
      const buffer = await page.screenshot({ type: 'png', fullPage: false })
      await writeFile(join(OUT_DIR, name + '.png'), buffer)
      await page.close()
    } catch (e) {
      console.error('  Fehler:', e.message)
    }
  }

  await browser.close()
  console.log('Fertig. Screenshots in:', OUT_DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
