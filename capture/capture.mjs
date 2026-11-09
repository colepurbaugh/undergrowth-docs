// Takes the screenshots, icon crops and GIFs used in the guide.
//
// Run it with the node service (port 3001) and dashboard (port 3000) running:
//   cd capture
//   npm run capture
//
// It starts "The whole farm" scenario first, so the pictures always show the same thing,
// then drives Microsoft Edge (headless) through each feature and writes
// images/*.png and *.gif. Pictures are cropped to what they are about.
//
// Captured browsers do not draw a mouse pointer, so the page gets a visible
// dot (with a ring on every click) while GIFs are being made.

import { chromium } from 'playwright-core'
import gifenc from 'gifenc'
import { PNG } from 'pngjs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DASHBOARD = 'http://localhost:3000'
// Everything happens in the dashboard's scenario, which has its own databases, so the
// farm's real records never appear in the pictures and are never changed.
const API = 'http://127.0.0.1:3001/api/scenario'
const IMAGES = fileURLToPath(new URL('../images/', import.meta.url))
const VIEWPORT = { width: 1440, height: 1000 }

const { GIFEncoder, applyPalette, quantize } = gifenc   // a CommonJS package
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
let page

// --- Cursor drawn into the page (only shown while a GIF is recording) -------
const CURSOR = `(() => {
  const install = () => {
    if (document.getElementById('doc-cursor')) return
    const dot = document.createElement('div')
    dot.id = 'doc-cursor'
    dot.style.cssText = 'position:fixed;left:-50px;top:-50px;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;display:none;' +
      'background:rgba(255,255,255,.95);border:2px solid #111;box-shadow:0 0 0 3px rgba(255,197,61,.6);z-index:2147483647;pointer-events:none'
    document.body.appendChild(dot)
    addEventListener('mousemove', e => { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px' }, true)
    addEventListener('mousedown', e => {
      if (dot.style.display === 'none') return
      const ring = document.createElement('div')
      ring.style.cssText = 'position:fixed;left:' + e.clientX + 'px;top:' + e.clientY + 'px;width:10px;height:10px;margin:-5px 0 0 -5px;' +
        'border-radius:50%;border:3px solid #ffc53d;z-index:2147483646;pointer-events:none;transition:all .45s ease-out'
      document.body.appendChild(ring)
      requestAnimationFrame(() => { ring.style.width = ring.style.height = '50px'; ring.style.margin = '-25px 0 0 -25px'; ring.style.opacity = '0' })
      setTimeout(() => ring.remove(), 500)
    }, true)
  }
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', install)
  else install()
})()`
const showCursor = show => page.evaluate(show => { const dot = document.getElementById('doc-cursor'); if (dot) dot.style.display = show ? 'block' : 'none' }, show)

// --- Pictures -----------------------------------------------------------------
async function box(locator, pad = 0) {
  const b = await locator.boundingBox()
  if (!b) throw new Error(`Not visible: ${locator}`)
  const x = Math.max(0, Math.floor(b.x - pad)), y = Math.max(0, Math.floor(b.y - pad))
  return { x, y, width: Math.min(VIEWPORT.width - x, Math.ceil(b.width + pad * 2)), height: Math.min(VIEWPORT.height - y, Math.ceil(b.height + pad * 2)) }
}
// From the top of one element to the bottom of another, after scrolling the first
// to just below the top bar. For a list row and the display open under it.
async function span(from, to, width = 660) {
  await from.evaluate(el => { const page = el.closest('.ug-page'); page.scrollTop += el.getBoundingClientRect().top - 150 })
  await wait(400)
  const a = await from.boundingBox(), b = await to.boundingBox()
  if (!a || !b) throw new Error(`Not visible: ${from} or ${to}`)
  const x = Math.max(0, Math.floor(a.x)), y = Math.max(0, Math.floor(a.y))
  return { x, y, width: Math.min(VIEWPORT.width - x, width), height: Math.min(VIEWPORT.height - y, Math.ceil(b.y + b.height - a.y)) }
}
async function still(name, clip) {
  await page.screenshot({ path: join(IMAGES, `${name}.png`), clip })
  console.log(`  ${name}.png`)
}
// Records an action as a GIF: screenshots as fast as they come, timed by when they were taken.
// `interval` spaces the frames out (bigger = smaller file, for scenes that mostly wait).
async function gif(name, clip, action, { tail = 1500, interval = 90 } = {}) {
  await showCursor(true)
  const frames = []
  let recording = true
  const loop = (async () => {
    while (recording) {
      const at = Date.now()
      frames.push({ at, png: await page.screenshot({ clip }) })
      await wait(Math.max(0, interval - (Date.now() - at)))
    }
  })()
  await wait(400)
  await action()
  await wait(tail)
  recording = false
  await loop
  await showCursor(false)
  const encoder = GIFEncoder()
  frames.forEach((frame, i) => {
    const { data, width, height } = PNG.sync.read(frame.png)
    const palette = quantize(data, 256)
    // Hold the last frame a little longer before the GIF loops.
    const delay = i + 1 < frames.length ? frames[i + 1].at - frame.at : 2000
    encoder.writeFrame(applyPalette(data, palette), width, height, { palette, delay })
  })
  encoder.finish()
  await writeFile(join(IMAGES, `${name}.gif`), encoder.bytes())
  console.log(`  ${name}.gif (${frames.length} frames)`)
}

// --- Moving around ------------------------------------------------------------------
async function centre(locator) {
  const onMap = await locator.evaluate(el => !!el.closest('.maplibregl-marker'))
  if (!onMap) { await locator.evaluate(el => el.scrollIntoView({ block: 'nearest' })); await wait(200) }
  const b = await locator.boundingBox()
  if (!b) throw new Error(`Not visible: ${locator}`)
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 }
}
async function click(locator, pause = 600) {
  const p = await centre(locator)
  await page.mouse.move(p.x, p.y, { steps: 18 })
  await wait(150)
  await page.mouse.down()
  await page.mouse.up()
  await wait(pause)
}
async function typeInto(locator, text) {
  await click(locator, 150)
  await page.keyboard.press('Control+A')
  await page.keyboard.type(text, { delay: 110 })
  await wait(300)
}
async function drag(from, to, steps = 35) {
  await page.mouse.move(from.x, from.y, { steps: 15 })
  await wait(200)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps })
  await wait(150)
  await page.mouse.up()
  await wait(900)
}
// Puts the map somewhere (the dashboard's development server exposes it as window.ugMap).
async function jumpTo(center, zoom, settle = 1800) {
  await page.evaluate(({ center, zoom }) => window.ugMap.jumpTo({ center, zoom }), { center, zoom })
  await wait(settle)
}
async function closePanel() {
  const close = page.locator('.ug-selection .ug-panel-heading button')
  if (await close.count()) await close.click()
  await wait(300)
}
// Opens a record's panel by clicking its marker (choosing it if markers overlap).
async function open(name) {
  await click(marker(name), 900)
  const choose = page.locator('.ug-overlap-picker button', { hasText: name })
  if (await choose.count()) await click(choose.first(), 900)
  await wait(600)
}

const marker = name => page.locator('.ug-map-marker').filter({
  has: page.locator('.ug-map-marker-label', { hasText: new RegExp(`(^|✋ )${name}$`) })
})
const panel = () => page.locator('.ug-selection')
function control(label, owner) {
  let row = panel().locator('.ug-control').filter({ has: page.locator('.ug-control-label', { hasText: new RegExp(`^${label}`) }) })
  if (owner) row = row.filter({ has: page.locator('.ug-control-owner', { hasText: owner }) })
  return row.first()
}
const tick = row => row.locator('.ug-override-tick input')
const button = (scope, text) => scope.locator('button', { hasText: text }).first()

async function api(path, method = 'GET') {
  const response = await fetch(`${API}${path}`, { method, headers: { 'Content-Type': 'application/json' } })
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`)
  return response.json()
}
const where = async name => {
  const all = [...await api('/nodes'), ...await api('/clusters')]
  const record = all.find(r => r.map_name === name)
  if (!record) throw new Error(`No record named ${name}`)
  return [record.resolved_longitude, record.resolved_latitude]
}

// --- Off camera: a fresh demo ---------------------------------------------------------
// The scenario banner is left out of the pictures, so they look like an ordinary farm.
const NO_BANNER = `addEventListener('DOMContentLoaded', () => document.head.append(Object.assign(document.createElement('style'), {
  textContent: '.ug-scenario-banner { display: none !important } .ug-topbar-scenario { border-color: #ffffff25 !important }' })))`

async function resetDemo() {
  console.log('Starting The whole farm scenario...')
  await page.goto(DASHBOARD)
  await page.locator('.ug-nav button', { hasText: 'Scenarios' }).click()
  const notice = page.locator('.ug-notice')
  await page.locator('.ug-scenario-card', { hasText: 'The whole farm' }).getByRole('button', { name: /^Start/ }).click()
  // The page reloads into the scenario once it is set up.
  await Promise.race([
    page.locator('.ug-topbar-scenario').waitFor({ timeout: 120000 }),
    notice.waitFor({ timeout: 120000 }).then(async () => { throw new Error(await notice.innerText()) })
  ])
  await wait(6000)   // the first mission check raises tank 7's alert
  await page.goto(DASHBOARD)
  await page.locator('.ug-map-marker').first().waitFor()
  await page.waitForFunction(() => window.ugMap?.loaded())
  // No base-map place or street names either, so nothing ties the pictures to a real place.
  await page.evaluate(() => {
    const hide = () => window.ugMap.getStyle().layers
      .filter(layer => layer.type === 'symbol' && !layer.id.startsWith('ug-'))
      .forEach(layer => window.ugMap.setLayoutProperty(layer.id, 'visibility', 'none'))
    hide()
    window.ugMap.on('style.load', hide)
  })
}

// --- The pictures --------------------------------------------------------------------------
async function chooseStyle(label) {
  if (await page.locator('.ug-basemap-menu').isHidden()) await page.locator('.ug-basemap > button').click()
  await page.locator('.ug-basemap-menu button', { hasText: label }).click()
}

// The farm on NOAA's nautical chart, for the guide's front page. The chart's own
// names are printed into it and can't be hidden; they are public chart names.
async function charts() {
  console.log('Nautical chart')
  await chooseStyle('Nautical chart')
  if (await page.locator('.ug-basemap-menu').isVisible()) await page.locator('.ug-basemap > button').click()
  await jumpTo([-123.968, 46.6485], 13.0, 7000)
  await still('chart-farm', { x: 0, y: 130, width: VIEWPORT.width, height: 870 })
  await jumpTo([-123.9660, 46.6418], 14.6, 7000)
  await still('chart-channel', { x: 0, y: 130, width: VIEWPORT.width, height: 870 })
  await chooseStyle('Map')
  await wait(2500)
}

async function capture() {
  console.log('Map and conditions')
  await jumpTo([-123.955, 46.668], 11.6, 3500)
  await still('overview')
  await still('conditions-bar', await box(page.locator('.ug-topbar')))
  // Satellite (it has no place names), with the style menu open, then back to the normal map.
  await jumpTo([-123.968, 46.6485], 13.6, 500)
  await chooseStyle('Satellite')
  await wait(5000)
  await page.locator('.ug-basemap > button').click()
  await wait(400)
  await still('map-styles', { x: 560, y: 120, width: 880, height: 640 })
  await charts()

  console.log('Radios')
  await page.keyboard.press('Escape')
  await jumpTo([-123.9745, 46.6475], 13.7, 1500)
  await still('connections', { x: 0, y: 130, width: 1100, height: 870 })
  // A short stretch of line between the dock and Big Toot, for the guide's table of symbols.
  const between = [-123.9615, 46.6387]
  await jumpTo(between, 15.2, 1500)
  const mid = await pixel(between)
  await still('icon-connections', { x: Math.round(mid.x - 90), y: Math.round(mid.y - 55), width: 180, height: 110 })
  // The dock selected: the Wi-Fi beam and LoRa circle around it, and its radios' rows.
  await open('Home dock')
  await jumpTo([-123.9700, 46.6440], 13.7, 1500)
  await still('radio-coverage', { x: 0, y: 130, width: VIEWPORT.width, height: 870 })
  await closePanel()
  // The map's buttons: zoom, map style, routes, connections.
  await still('map-buttons', await box(page.locator('.maplibregl-ctrl-top-right'), 8))
  // The editor's radio section, filled in but not saved.
  await page.locator('.ug-add-header').click()
  await dialog().waitFor()
  await dialog().locator('.ug-radio-block select').selectOption('wifi')
  await dialog().locator('.ug-radio-block label.ug-check-line input').check()
  await dialog().locator('.ug-radio-block label', { hasText: 'Points toward' }).locator('input').fill('315')
  await dialog().locator('.ug-radio-block').scrollIntoViewIfNeeded()
  await wait(400)
  await still('radio-editor', await box(dialog().locator('.ug-radio-block'), 10))
  await dialog().locator('button', { hasText: 'Close' }).last().click()
  await wait(500)

  console.log('Icons')
  const icon = async (file, name, zoom, pad = 34) => {
    await jumpTo(await where(name), zoom, 1600)
    await still(file, await box(marker(name), pad))
  }
  await icon('icon-vessel', 'Big Toot', 15.5)
  await icon('icon-port', 'Home dock', 15)
  await icon('icon-waypoint', 'Channel 3', 15.5)
  await icon('icon-keepout', 'Old piling', 16.5, 70)
  await icon('icon-basket', 'Oyster basket 1', 17)
  await icon('icon-tank-house', 'Crab tanks', 16)
  await jumpTo(await where('Lil Toot'), 15.5, 1600)
  // The mission arrow on screen (others belong to vessels out of view).
  for (const arrow of await page.locator('.ug-heading').all()) {
    const b = await arrow.boundingBox()
    if (b && b.x > 0 && b.y > 0 && b.x + b.width < VIEWPORT.width && b.y + b.height < VIEWPORT.height) {
      await still('icon-mission-arrow', await box(arrow, 26))
      break
    }
  }

  console.log('A vessel and its parts')
  await jumpTo([-123.9655, 46.6418], 15, 1500)
  await open('Big Toot')
  await still('vessel-panel', await box(panel()))
  await page.evaluate(() => document.querySelector('.ug-selection').scrollTo({ top: 520 }))
  await wait(500)
  await still('vessel-controls', await box(panel()))

  console.log('Dragging a vessel')
  await click(tick(control('Position', 'Big Toot GPS')), 1200)
  const mapArea = { x: 120, y: 260, width: 900, height: 640 }
  const from = await centre(marker('Big Toot'))
  await gif('drag-and-replan', mapArea, async () => {
    await drag(from, { x: from.x - 240, y: from.y + 60 })
    await wait(1600)
  })
  await still('hand-set-label', await box(marker('Big Toot'), 30))
  await still('keep-here', await box(control('Position', 'Big Toot GPS'), 6))

  console.log('Tip alert')
  // Bring the roll row to the top of the panel so the GIF needs only the top of the screen.
  const roll = control('Roll', 'Big Toot tilt sensor')
  await roll.evaluate(el => {
    const panelEl = el.closest('.ug-selection')
    panelEl.scrollTop += el.getBoundingClientRect().top - panelEl.getBoundingClientRect().top - 16
  })
  await wait(400)
  const rollBox = await box(roll, 0)
  await gif('tip-alert', { x: 940, y: 0, width: 500, height: Math.min(VIEWPORT.height, Math.ceil(rollBox.y + rollBox.height + 70)) }, async () => {
    await click(tick(roll), 900)
    await typeInto(roll.locator('input[type=number]'), '60')
    await click(button(roll, 'Send'), 300)
    await page.locator('.ug-alert', { hasText: 'Roll' }).first().waitFor({ timeout: 15000 })
  }, { tail: 1800, interval: 220 })
  await click(button(panel(), 'Release all'), 1500)
  await closePanel()

  console.log('Proximity alert')
  await jumpTo([-123.9879, 46.65525], 16, 1500)
  await open('Lil Toot')
  await click(tick(control('Position', 'Lil Toot GPS')), 1200)
  const boat = await centre(marker('Lil Toot')), bar = await centre(marker('Shallow bar A'))
  const gap = Math.hypot(bar.x - boat.x, bar.y - boat.y)
  await drag(boat, { x: bar.x - (bar.x - boat.x) / gap * 32, y: bar.y - (bar.y - boat.y) / gap * 32 })
  await page.locator('.ug-alert', { hasText: 'Shallow bar' }).first().waitFor({ timeout: 15000 })
  await wait(1200)
  await still('proximity-alert', { x: 640, y: 130, width: 800, height: 870 })
  await click(page.locator('.ug-alerts-button'), 900)
  await still('alerts-list', await box(page.locator('.ug-alerts-list'), 8))
  await click(button(page.locator('.ug-alerts-list .ug-panel-heading'), '×'), 400)
  // Untick: the boat jumps back to where its GPS says it is.
  await gif('release-override', { x: 300, y: 260, width: 760, height: 560 }, async () => {
    await click(button(panel(), 'Release all'), 300)
  }, { tail: 2200 })
  await page.locator('.ug-alert-cleared', { hasText: 'Shallow bar' }).first().waitFor({ timeout: 15000 })
  for (const text of ['Shallow bar', 'Roll']) {
    await api(`/alerts/${(await api('/alerts')).find(a => a.summary.includes(text)).alert_id}/acknowledge`, 'POST')
  }
  await closePanel()

  console.log('Tanks')
  await jumpTo(await where('Crab tanks'), 15.5, 1800)
  await open('Crab tanks')
  await page.evaluate(() => document.querySelector('.ug-selection').scrollTo({ top: 380 }))
  await wait(500)
  await still('tank-house', await box(panel()))
  await click(button(panel().locator('.ug-control-member', { hasText: 'Crab tank 7' }), 'Open'), 1200)
  await still('tank-panel', await box(panel()))
  const heater = control('Heater'), salinity = control('Salinity')
  await gif('heater-and-reading', await box(panel()), async () => {
    await click(heater.locator('.ug-switch'), 1200)
    await typeInto(salinity.locator('input[type=number]'), '28.4')
    await click(button(salinity, 'Record'), 300)
  }, { tail: 1800 })

  console.log('Adding to a display')
  await click(panel().locator('.ug-controls:not(.ug-controls-nested) > .ug-add-row'), 900)
  await click(panel().locator('.ug-new-value summary'), 500)
  const form = panel().locator('.ug-new-value')
  await form.locator('label', { hasText: 'Name' }).locator('input').fill('Dissolved oxygen')
  await form.locator('label', { hasText: 'Unit' }).locator('input').fill('mg/L')
  await form.locator('label', { hasText: 'Min' }).locator('input').fill('0')
  await form.locator('label', { hasText: 'Max' }).locator('input').fill('20')
  await page.evaluate(() => document.querySelector('.ug-selection').scrollTo({ top: 99999 }))
  await wait(500)
  await still('customize', await box(panel()))
  await click(button(form, 'Add value'), 1200)
  await click(button(panel(), 'Done'), 600)
  await closePanel()

  console.log('Archive dialog')
  await jumpTo(await where('Home dock'), 14.5, 1500)
  await click(marker('Home dock'), 600)
  const pick = page.locator('.ug-overlap-picker button', { hasText: 'Home dock' })
  if (await pick.count()) await click(pick.first(), 600)
  await closePanel()
  await marker('Home dock').click({ button: 'right' })
  await wait(500)
  const contextPick = page.locator('.ug-overlap-picker button', { hasText: 'Home dock' })
  if (await contextPick.count()) { await contextPick.first().click(); await wait(500) }
  await page.locator('.ug-context button', { hasText: 'Archive' }).click()
  await page.locator('.ug-confirm-refs, .ug-confirm .ug-dialog-actions').first().waitFor()
  await wait(800)
  await still('archive-dialog', await box(page.locator('.ug-confirm'), 10))
  await page.locator('.ug-confirm button', { hasText: 'Cancel' }).click()

  console.log('Missions and logs')
  await page.locator('.ug-nav button', { hasText: 'Missions' }).click()
  await wait(1500)
  // The form, then the first missions: alerts at priority 1 come first.
  await still('missions', { x: 0, y: 140, width: VIEWPORT.width, height: 820 })
  await page.locator('.ug-nav button', { hasText: 'Logs' }).click()
  await wait(1500)
  await page.locator('.ug-log-filters select').selectOption('safety')
  await wait(1500)
  await still('logs', { x: 0, y: 200, width: VIEWPORT.width, height: 800 })
  await page.locator('.ug-log-table tbody tr', { hasText: '⚠ Lil Toot' }).first().locator('button', { hasText: 'Details' }).click()
  await wait(800)
  await still('log-details', await box(page.locator('.ug-log-detail'), 10))
  await page.locator('.ug-log-detail button', { hasText: 'Close' }).click()
  await listPages()
}

// The Nodes and Clusters pages, and a node's editor.
async function listPages() {
  console.log('Nodes and Clusters pages')
  const search = () => page.locator('.ug-list-toolbar input[aria-label^="Search"]')
  await page.locator('.ug-nav button', { hasText: 'Nodes' }).click()
  await wait(1200)
  // Big Toot's parts: one boat, many nodes.
  await search().fill('Big Toot')
  await wait(600)
  await still('nodes-page', { x: 0, y: 0, width: VIEWPORT.width, height: 640 })
  await search().fill('Old piling')
  await wait(600)
  await page.locator('.ug-table tbody tr', { hasText: 'Old piling' }).locator('button', { hasText: 'Edit' }).click()
  await dialog().waitFor()
  await wait(800)
  await still('node-editor', await box(dialog(), 6))
  await dialog().locator('button', { hasText: 'Close' }).click()
  await page.locator('.ug-nav button', { hasText: 'Clusters' }).click()
  await wait(1200)
  await still('clusters-page', { x: 0, y: 0, width: VIEWPORT.width, height: 640 })
  // A display open under its row, with a tank opened inside it.
  await search().fill('Crab tanks')
  await wait(600)
  const house = page.locator('.ug-table tbody tr:not(.ug-display-row)', { hasText: 'Crab tanks' }).first()
  await click(house.locator('.ug-expand-list'), 600)
  const display = house.locator('xpath=following-sibling::tr[1]')
  const tank7 = display.locator('.ug-control-member', { hasText: 'Crab tank 7' }).first()
  await click(tank7.locator('.ug-expand').first(), 600)
  await still('list-display', await span(house, tank7, 760))
  await click(tank7.locator('.ug-expand').first(), 300)
  await click(house.locator('.ug-expand-list'), 300)
  await search().fill('')
  await page.locator('.ug-nav button', { hasText: 'Map' }).click()
  await wait(1200)
}

// --- Scenarios: done for real through the dashboard's own forms -------------------------------------
// Everything made here goes into the scenario, so starting it again cleans it up.

const SKIFF = {
  start: [-123.9620, 46.6395],
  waypoints: [[-123.9615, 46.6445], [-123.9655, 46.6515], [-123.9705, 46.6570]],
  between: [-123.9680, 46.6545],   // past waypoint 2, on the way to 3
  view: { center: [-123.9700, 46.6500], zoom: 13.9 }
}
const pixel = ([lon, lat]) => page.evaluate(p => window.ugMap.project(p), [lon, lat])
const dialog = () => page.locator('.ug-dialog')
const field = label => dialog().locator('label', { hasText: label }).locator('input, textarea, select').first()
async function fillEditor({ name, type, description, icon, keepout }) {
  await field('Map Name').fill(name)
  if (type) await field(/Node Type|Cluster Type/).fill(type)
  await field('Description').fill(`Demo: ${description}`)
  if (icon) await field('Map Icon').selectOption(icon)
  if (keepout !== undefined) await field('Keep-out distance').fill(String(keepout))
}
// Ticks a checkbox in the editor whose label starts with the given name (exactly, so "Crab tank 1" is not "Crab tank 11").
async function tickLabel(scope, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  await scope.locator('label.ug-check-line', { hasText: new RegExp(`^\\s*${escaped}\\s*(·|\\()`) }).first().locator('input').check()
}
async function chooseSource(name) {
  if (!(await dialog().locator('.ug-source-picker').count())) await dialog().locator('button[title="Choose position sources"]').click()
  await tickLabel(dialog().locator('.ug-source-picker'), name)
}
const setShowOnMap = on => dialog().locator('label.ug-check-line', { hasText: 'Show on Map' }).locator('input').setChecked(on)
async function saveEditor() {
  await dialog().locator('button[type=submit]').click()
  await dialog().locator('button[type=submit]', { hasText: 'Saved at' }).waitFor({ timeout: 10000 })
  await dialog().locator('button', { hasText: 'Close' }).click()
  await wait(700)
}
async function rightClickAt(lonLat, menuItem) {
  const p = await pixel(lonLat)
  await page.mouse.click(p.x, p.y, { button: 'right' })
  await page.locator('.ug-context button', { hasText: menuItem }).click()
  await dialog().waitFor()
}
const goTo = async tab => { await page.locator('.ug-nav button', { hasText: tab }).click(); await wait(900) }
const plan = async name => (await api('/missions')).find(m => m.name === name)?.plan
// Moves a hand-set marker to a place by dragging it there on the map.
// A drag lands within a few pixels (tens of metres at this zoom), so the exact
// spot is then set through the same override the drag uses.
async function dragTo(name, lonLat, current, gpsName) {
  const at = await centre(marker(name)), from = await pixel(current), to = await pixel(lonLat)
  await drag(at, { x: at.x + to.x - from.x, y: at.y + to.y - from.y })
  const gps = (await api('/nodes')).find(n => n.map_name === gpsName)
  await fetch(`${API}/overrides/${gps.node_id}/position/value`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: lonLat[1], longitude: lonLat[0] }) })
  await wait(3500)
}

async function walkthroughs() {
  console.log('Scenario 1: a test vessel, a route, and a trip')
  await jumpTo(SKIFF.view.center, SKIFF.view.zoom, 2000)

  // 1. The GPS node, placed by right-clicking the map.
  await rightClickAt(SKIFF.start, 'Add Node Here')
  await fillEditor({ name: 'Test Skiff GPS', type: 'gps', icon: 'gps', description: 'GPS on the test skiff.' })
  await setShowOnMap(false)
  await still('walkthrough-1-gps', await box(dialog(), 6))
  await saveEditor()

  // 2. The vessel: a cluster that takes its position from the GPS and contains it.
  await goTo('Clusters')
  await page.locator('.ug-page-top button', { hasText: '+ Add Cluster' }).click()
  await fillEditor({ name: 'Test Skiff', type: 'vessel', icon: 'triangle', description: 'A test vessel built from scratch.', keepout: 40 })
  await chooseSource('Test Skiff GPS')
  await tickLabel(dialog().locator('.ug-membership-options'), 'Test Skiff GPS')
  await setShowOnMap(true)
  await dialog().locator('.ug-dialog-scroll').evaluate(el => el.scrollTo({ top: 260 }))
  await wait(300)
  await still('walkthrough-1-vessel', await box(dialog(), 6))
  await saveEditor()

  // 3. Three waypoints, right-clicked onto the map.
  await goTo('Map')
  await jumpTo(SKIFF.view.center, SKIFF.view.zoom, 1200)
  for (const [i, at] of SKIFF.waypoints.entries()) {
    await rightClickAt(at, 'Add Waypoint Here')
    await fillEditor({ name: `Test WP ${i + 1}`, description: 'Waypoint on the test route.' })
    if (i === 0) await still('walkthrough-1-waypoint', await box(dialog(), 6))
    await saveEditor()
  }

  // 4. The route: a cluster of the waypoints. Order does not matter.
  await goTo('Clusters')
  await page.locator('.ug-page-top button', { hasText: '+ Add Cluster' }).click()
  await fillEditor({ name: 'Test Route', type: 'route', description: 'Route for the test skiff.' })
  for (let i = 1; i <= 3; i++) await tickLabel(dialog().locator('.ug-membership-options'), `Test WP ${i}`)
  await dialog().locator('.ug-dialog-scroll').evaluate(el => el.scrollTo({ top: 99999 }))
  await wait(300)
  await still('walkthrough-1-route', await box(dialog(), 6))
  await saveEditor()

  // 5. The mission.
  await goTo('Missions')
  // When stays on Always, and "Advise a vessel the way somewhere" is ticked to start with.
  const form = page.locator('.ug-mission-form').first()
  const formField = start => form.locator('label').filter({ hasText: new RegExp(`^${start}`) }).locator('select, input').first()
  await formField('Vessel').selectOption({ label: 'Test Skiff (vessel)' })
  await formField('Go to').selectOption({ label: 'Oyster basket 2 (payload)' })
  await formField('Using route').selectOption({ label: 'Test Route (route)' })
  await formField('Name').fill('Demo: Test Skiff to basket 2')
  await still('walkthrough-1-mission-form', await box(form, 8))
  await form.locator('button', { hasText: 'Add mission' }).click()
  await wait(1500)

  // 6. The trip: take over the GPS position and move the skiff along, one step at a time.
  await goTo('Map')
  await jumpTo(SKIFF.view.center, SKIFF.view.zoom, 1800)
  await open('Test Skiff')
  // A new vessel's display starts blank: put the GPS position on it first.
  await click(panel().locator('.ug-controls:not(.ug-controls-nested) > .ug-add-row'), 500)
  await panel().locator('.ug-panel-editor select').first().selectOption({ label: 'Test Skiff GPS · Position' })
  await click(button(panel().locator('.ug-panel-editor'), 'Add'), 1200)
  await click(button(panel().locator('.ug-panel-editor'), 'Done'), 500)
  await click(tick(control('Position', 'Test Skiff GPS')), 1500)
  await jumpTo(SKIFF.view.center, SKIFF.view.zoom, 1500)
  const basket = await where('Oyster basket 2')
  const steps = [
    ['walkthrough-1-trip-1-start', null],
    ['walkthrough-1-trip-2-waypoint-1', SKIFF.waypoints[0]],
    ['walkthrough-1-trip-3-past-waypoint-2', SKIFF.between],
    ['walkthrough-1-trip-4-arrived', basket]
  ]
  let here = SKIFF.start
  for (const [file, to] of steps) {
    if (to) { await dragTo('Test Skiff', to, here, 'Test Skiff GPS'); here = to }
    await page.evaluate(() => document.querySelector('.ug-selection')?.scrollTo({ top: 0 }))
    await wait(1200)
    const p = await plan('Demo: Test Skiff to basket 2')
    console.log(`   ${file}: ${p?.reason}`)
    await still(file)
  }
  await goTo('Logs')
  await page.locator('.ug-log-filters select').selectOption('mission')
  await page.locator('.ug-log-filters label', { hasText: 'Search' }).locator('input').fill('Test Skiff')
  await wait(1500)
  await still('walkthrough-1-decisions', { x: 0, y: 200, width: VIEWPORT.width, height: 560 })
  await page.locator('.ug-log-filters label', { hasText: 'Search' }).locator('input').fill('')
  await page.locator('.ug-log-filters select').selectOption('activity')

  console.log('Scenario 2: a new crab tank')
  // 1. The tank itself: a cluster that takes its position from the tank house.
  await goTo('Clusters')
  await page.locator('.ug-page-top button', { hasText: '+ Add Cluster' }).click()
  await fillEditor({ name: 'Crab tank 11', type: 'tank', icon: 'package', description: 'Holding tank in Crab tanks.' })
  await chooseSource('Crab tanks')
  await setShowOnMap(false)
  await still('walkthrough-2-tank', await box(dialog(), 6))
  await saveEditor()

  // 2. Its parts: a floating thermometer and a heater plug, both inside the tank.
  await goTo('Nodes')
  for (const [part, type, icon, description] of [
    ['thermometer', 'sensor', 'sensor', 'Floating pool thermometer (Bluetooth/Zigbee).'],
    ['heater plug', 'relay', 'radio', 'Remote plug relay feeding the tank heater.']]) {
    await page.locator('.ug-page-top button', { hasText: '+ Add Node' }).click()
    await fillEditor({ name: `Crab tank 11 ${part}`, type, icon, description })
    await chooseSource('Crab tank 11')
    await setShowOnMap(false)
    await tickLabel(dialog().locator('.ug-membership-options'), 'Crab tank 11')
    if (part === 'thermometer') {
      await dialog().locator('.ug-dialog-scroll').evaluate(el => el.scrollTo({ top: 99999 }))
      await wait(300)
      await still('walkthrough-2-thermometer', await box(dialog(), 6))
    }
    await saveEditor()
  }

  // 3. Put the tank in the tank house.
  await goTo('Clusters')
  await page.locator('tr', { hasText: 'Crab tanks' }).locator('button', { hasText: 'Edit' }).click()
  await dialog().waitFor()
  await tickLabel(dialog().locator('.ug-membership-options'), 'Crab tank 11')
  await dialog().locator('label.ug-check-line', { hasText: /^\s*Crab tank 11 \(/ }).first().scrollIntoViewIfNeeded()
  await still('walkthrough-2-tank-house', await box(dialog(), 6))
  await saveEditor()

  // 4. Open the tank's display on the Clusters page (it starts blank), and give
  //    the parts their values from there. Each new value lands on the display.
  const clusterRow = name => page.locator('.ug-table tbody tr:not(.ug-display-row)').filter({ has: page.locator('strong', { hasText: new RegExp(`^${name}$`) }) })
  const displayOf = name => clusterRow(name).locator('xpath=following-sibling::tr[1]')
  await page.locator('input[aria-label="Search clusters"]').fill('Crab tank')
  await wait(500)
  await click(clusterRow('Crab tank 11').locator('.ug-expand-list'), 600)
  const tankDisplay = () => displayOf('Crab tank 11')
  await click(tankDisplay().locator('.ug-add-row'), 600)
  const values = [
    ['Crab tank 11 thermometer', 'Water temperature', 'sensor', 'number', '°F', '28', '90'],
    ['Crab tank 11 heater plug', 'Heater', 'command', 'on_off'],
    ['Crab tank 11', 'Salinity', 'hand', 'number', 'ppt', '0', '40']
  ]
  for (const [owner, name, source, kind, unit, min, max] of values) {
    const form = tankDisplay().locator('.ug-new-value')
    if ((await form.getAttribute('open')) === null) await tankDisplay().locator('.ug-new-value summary').click()
    // Labels are matched by how they start ("On" also appears inside "On / off").
    const input = start => form.locator('label').filter({ hasText: new RegExp(`^${start}`) }).locator('select, input').first()
    await input('On').selectOption({ label: owner })
    await input('Name').fill(name)
    await input('Comes from').selectOption(source)
    await input('Kind').selectOption(kind)
    if (unit) {
      await input('Unit').fill(unit)
      await input('Min').fill(min)
      await input('Max').fill(max)
    }
    if (name === 'Water temperature') {
      await tankDisplay().locator('.ug-panel-editor').scrollIntoViewIfNeeded()
      await wait(300)
      await still('walkthrough-2-new-value', await span(clusterRow('Crab tank 11'), tankDisplay(), 620))
    }
    await button(form, 'Add value').click()
    await wait(1200)
  }
  await click(button(tankDisplay(), 'Done'), 600)
  // The thermometer's first report arrives (as a real device would send it).
  const thermometer = (await api('/nodes')).find(n => n.map_name === 'Crab tank 11 thermometer')
  await fetch(`${API}/values/${thermometer.node_id}/water_temperature/readings`, { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: 46.5 }) })
  await wait(3500)
  // Close the "saved" notices first, so they don't sit over the picture.
  for (const close of await page.locator('.ug-notice button').all()) await close.click().catch(() => {})
  await still('walkthrough-2-tank-panel', await span(clusterRow('Crab tank 11'), tankDisplay(), 620))
  await click(clusterRow('Crab tank 11').locator('.ug-expand-list'), 400)

  // 5. Put the new tank on the tank house's display too.
  await click(clusterRow('Crab tanks').locator('.ug-expand-list'), 600)
  await click(displayOf('Crab tanks').locator('.ug-controls:not(.ug-controls-nested) > .ug-add-row'), 500)
  const picker = displayOf('Crab tanks').locator('.ug-panel-editor select').first()
  await picker.selectOption({ label: 'Crab tank 11 · its own display, opening underneath' })
  await click(button(displayOf('Crab tanks').locator('.ug-panel-editor'), 'Add'), 1200)
  await click(button(displayOf('Crab tanks').locator('.ug-panel-editor'), 'Done'), 500)
  // The last few tanks, ending with the new one.
  await still('walkthrough-2-in-the-house', await span(displayOf('Crab tanks').locator('.ug-control-member').nth(7),
    displayOf('Crab tanks').locator('.ug-control-member', { hasText: 'Crab tank 11' }), 600))
}

// --- Run ----------------------------------------------------------------------------------------
// `node capture.mjs` takes the guide's pictures; `node capture.mjs walkthroughs` the
// walkthroughs; `node capture.mjs charts` the nautical chart pictures; `node capture.mjs pages`
// the Nodes and Clusters pages.
const mode = { walkthroughs, charts, pages: listPages }[process.argv[2]] ?? capture
await mkdir(IMAGES, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: VIEWPORT })
  await context.addInitScript(CURSOR)
  await context.addInitScript(NO_BANNER)
  page = await context.newPage()
  page.on('pageerror', error => console.log('PAGE ERROR', error.message))
  await resetDemo()
  try {
    await mode()
  } catch (error) {
    await page.screenshot({ path: join(IMAGES, '_failure.png') }).catch(() => {})
    throw error
  }
  console.log(`Done: ${IMAGES}`)
} finally {
  await browser.close()
}
