// Takes the pictures of tile displays for the guide (nodes.md, clusters.md).
//
// They come from a throwaway node service with its own empty database, so no
// real records appear in them. From the Undergrowth repository, build the
// dashboard and start one on port 3011:
//   cd dashboard && npm run build
//   cd node-service && UG_PORT=3011 UG_RUNTIME=runtime-tiles UG_DISCOVERY=off npm run dev
// then here:
//   npm run capture-tiles
// It adds a made-up Raspberry Pi, a thermometer, a Bedroom cluster and a
// mission the first time, then writes images/tiles-*.png. Delete runtime-tiles
// afterwards to start clean next time.

import { chromium } from 'playwright-core'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = process.env.UG_TILES ?? 'http://127.0.0.1:3011'
const IMAGES = fileURLToPath(new URL('../images/', import.meta.url))
const VIEWPORT = { width: 1440, height: 1000 }
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function call(path, method = 'GET', body) {
  const r = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${JSON.stringify(j)}`)
  return j
}

// ---- The made-up records, added once ----
async function seed() {
  const nodes = await call('/api/nodes')
  const found = nodes.find(n => n.map_name === 'Bench Pi')
  if (found) return { pi: found.node_id, thermo: nodes.find(n => n.map_name === 'Bedroom thermometer').node_id }
  const node = (map_name, node_type) => call('/api/nodes', 'POST', { map_name, node_type, description: '', latitude: null, longitude: null,
    show_on_map: false, icon: 'auto', position_mode: 'manual' })
  const pi = (await node('Bench Pi', 'Raspberry Pi')).node_id
  const thermo = (await node('Bedroom thermometer', 'thermometer')).node_id
  const value = (id, key, def) => call(`/api/values/${id}/${key}`, 'PUT', { unit: '', min: null, max: null, ...def })
  await value(pi, 'gpio17', { label: 'Heater relay', value_type: 'on_off', source: 'command' })
  await value(pi, 'gpio27', { label: 'Float switch', value_type: 'on_off', source: 'sensor' })
  await value(pi, 'gpio22', { label: 'Door', value_type: 'on_off', source: 'sensor' })
  await value(pi, 'gpio12', { label: 'Grow light', value_type: 'number', source: 'command', unit: '%', min: 0, max: 100 })
  await value(pi, 'gpio23', { label: 'Pump', value_type: 'on_off', source: 'command' })
  await value(pi, 'gpio24', { label: 'Dump cargo', value_type: 'button', source: 'command' })
  await value(thermo, 'temperature', { label: 'Temperature', value_type: 'number', source: 'sensor', unit: '°F' })
  await call(`/api/values/${pi}/gpio27/readings`, 'POST', { value: true })
  await call(`/api/values/${pi}/gpio22/readings`, 'POST', { value: false })
  for (let i = 0; i <= 48; i++) await call(`/api/values/${thermo}/temperature/readings`, 'POST',
    { value: Math.round((62 + Math.sin(i / 5) * 2.5 - (i > 30 && i < 38 ? 1.5 : 0)) * 10) / 10, sampled_at: new Date(Date.now() - (48 - i) * 900_000).toISOString() })
  const room = (await call('/api/clusters', 'POST', { map_name: 'Bedroom', cluster_type: 'room', description: '', latitude: null, longitude: null,
    show_on_map: false, icon: 'auto', position_mode: 'manual' })).cluster_id
  await call(`/api/clusters/${room}/members`, 'POST', { member_type: 'node', member_id: pi })
  await call(`/api/clusters/${room}/members`, 'POST', { member_type: 'node', member_id: thermo })
  await call('/api/missions', 'POST', { name: 'Keep the bedroom warm', when: { kind: 'always' },
    do: [{ kind: 'set', target_id: pi, value_key: 'gpio17', value: true }] })
  // The Pi's display, arranged and styled as someone might.
  const tile = (value_key, x, y, w, h, style = {}) => ({ row_kind: 'value', owner_id: pi, value_key, x, y, w, h, style })
  await call(`/api/panels/${pi}`, 'PUT', { rows: [
    { row_kind: 'info', owner_id: pi, value_key: '', x: 0, y: 0, w: 2, h: 2, style: { name: 'This Pi' } },
    tile('gpio17', 2, 0, 2, 2),
    tile('gpio12', 4, 0, 3, 1, { on_colour: '#ffb020' }),
    tile('gpio27', 4, 1, 2, 1, { on_words: 'Water up', off_words: 'Water down' }),
    tile('gpio22', 6, 1, 2, 1, { on_words: 'Open', off_words: 'Closed', colour: '#16302a' }),
    tile('gpio23', 0, 2, 2, 1, { look: 'hold' }),
    tile('gpio24', 2, 2, 2, 1, { glass: true, glass_close: 5 }),
    { row_kind: 'graph', owner_id: thermo, value_key: 'temperature', x: 4, y: 2, w: 4, h: 1, style: { hours: 12 } },
  ] })
  return { pi, thermo }
}

// ---- Pictures ----
let page
async function still(name, clip) {
  await page.screenshot({ path: join(IMAGES, `${name}.png`), clip })
  console.log(`  ${name}.png`)
}
// One box around several elements, with a little room.
async function around(locators, pad = 6) {
  const boxes = []
  for (const l of locators) { const b = await l.boundingBox(); if (b) boxes.push(b) }
  const x = Math.max(0, Math.min(...boxes.map(b => b.x)) - pad), y = Math.max(0, Math.min(...boxes.map(b => b.y)) - pad)
  const right = Math.max(...boxes.map(b => b.x + b.width)) + pad, bottom = Math.max(...boxes.map(b => b.y + b.height)) + pad
  return { x: Math.floor(x), y: Math.floor(y), width: Math.ceil(Math.min(VIEWPORT.width, right) - x), height: Math.ceil(Math.min(VIEWPORT.height, bottom) - y) }
}
const row = name => page.locator('tr', { has: page.locator('strong', { hasText: new RegExp(`^${name}$`) }) }).first()
async function openDisplay(page_, name) {
  // Back to the top, where the page buttons are.
  await page.evaluate(() => { scrollTo(0, 0); document.querySelectorAll('.ug-page').forEach(p => { p.scrollTop = 0 }) })
  await wait(300)
  await page.getByRole('button', { name: page_, exact: true }).click()
  await wait(800)
  await row(name).locator('button.ug-expand-list').click()
  await wait(1500)
  await row(name).evaluate(el => { const p = el.closest('.ug-page'); p.scrollTop += el.getBoundingClientRect().top - 140 })
  await wait(500)
}
const display = () => page.locator('tr.ug-display-row .ug-dt').first()

const { pi } = await seed()
// Give the mission a moment to switch the heater on.
await wait(3000)
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: VIEWPORT })
  page = await context.newPage()
  await page.goto(BASE.replace('127.0.0.1', 'localhost'))
  await page.waitForSelector('.ug-top, header, nav', { timeout: 15000 })
  await wait(1500)

  await openDisplay('Nodes', 'Bench Pi')
  await page.mouse.move(5, 995)
  await wait(500)
  await still('tiles-pi', await around([row('Bench Pi'), display()]))

  // A free pin's menu.
  await page.getByRole('button', { name: /^Pin 7, / }).click()
  await wait(500)
  await still('tiles-pin-menu', await around([page.locator('.ug-dt-strip').first(), page.locator('.ug-dt-menu').first()]))
  await page.getByRole('menuitem', { name: 'Close' }).click()
  await wait(300)

  // Taking the heater over by hand: lift the glass, flip the switch, and it asks first.
  const heater = page.locator('.ug-dt-tile', { has: page.locator('.ug-dt-name', { hasText: 'Heater relay' }) })
  await heater.getByRole('button', { name: /^Lift the glass/ }).click()
  await wait(400)
  await heater.getByRole('button', { name: /^Turn Heater relay/ }).click()
  await wait(500)
  await still('tiles-take-over', await around([heater, heater.locator('.ug-dt-ask')], 14))
  await heater.getByRole('button', { name: 'Leave it' }).click()
  await wait(300)

  // A tile's settings.
  const door = page.locator('.ug-dt-tile', { has: page.locator('.ug-dt-name', { hasText: 'Door' }) })
  const b = await door.boundingBox()
  await page.mouse.click(b.x + 40, b.y + b.height / 2, { button: 'right' })
  await wait(500)
  await still('tiles-settings', await around([page.locator('.ug-dt-settings')], 10))
  await page.getByRole('button', { name: 'Done' }).click()
  await wait(300)

  // A cluster's display, with its members on top.
  await openDisplay('Clusters', 'Bedroom')
  await page.mouse.move(5, 995)
  await wait(800)
  await still('tiles-cluster', await around([row('Bedroom'), display()]))
} finally {
  await browser.close()
}
console.log(`Done. The Pi is ${pi} on ${BASE}.`)
