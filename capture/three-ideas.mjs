// Draws the pictures for three-ideas.md from three-ideas.html: a looping GIF and a still
// PNG of each figure, in light and dark. Undergrowth does not need to be running.
//   cd capture
//   npm run capture-three-ideas            (all figures)
//   node three-ideas.mjs grow log          (only these)
//
// Each frame is drawn for an exact moment (seek(t) in the page), so the GIFs are smooth
// and come out the same every time. The page's corners are see-through in the PNGs; in
// the GIFs they are see-through too, with their soft edges blended into GitHub's own
// light or dark page colour.

import { chromium } from 'playwright-core'
import gifenc from 'gifenc'
import { PNG } from 'pngjs'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const { GIFEncoder, applyPalette, quantize } = gifenc   // a CommonJS package
const IMAGES = fileURLToPath(new URL('../images/', import.meta.url))
const STAGE = new URL('./three-ideas.html', import.meta.url).href
const FPS = 20
const SCALE = 2   // pixels per CSS pixel, so the pictures stay sharp on phones and high-DPI screens
const MATTE = { light: [255, 255, 255], dark: [13, 17, 23] }   // GitHub's page colour in each theme
const only = process.argv.slice(2)

// Turns a screenshot with see-through corners into solid pixels on the matte, and notes
// which pixels were fully see-through so they can stay that way in the GIF.
function onMatte(png, matte) {
  const { data, width, height } = png
  const rgba = new Uint8Array(data.length)
  const clear = new Uint8Array(width * height)
  for (let p = 0, q = 0; p < data.length; p += 4, q++) {
    const a = data[p + 3] / 255
    if (a < 0.06) clear[q] = 1
    for (let c = 0; c < 3; c++) rgba[p + c] = Math.round(data[p + c] * a + matte[c] * (1 - a))
    rgba[p + 3] = 255
  }
  return { rgba, clear, width, height }
}

// One palette for the whole loop, so colours never shift between frames. Each frame after
// the first only carries the pixels that changed, and frames that change nothing just make
// the one before them last longer.
function encode(shots, matte, fps) {
  const first = onMatte(PNG.sync.read(shots[0]), matte)
  const { width, height } = first
  const pixels = width * height, stride = 3
  const picked = shots.filter((_, i) => i % 3 === 0)
  const sample = new Uint8Array(picked.length * Math.ceil(pixels / stride) * 4)
  let o = 0
  for (const shot of picked) {
    const { rgba } = onMatte(PNG.sync.read(shot), matte)
    for (let q = 0; q < pixels; q += stride, o += 4) sample.set(rgba.subarray(q * 4, q * 4 + 4), o)
  }
  const palette = quantize(sample.subarray(0, o), 255)
  const KEY = palette.length   // the see-through index, just past the real colours
  const table = [...palette]
  while (table.length < 256) table.push([0, 0, 0])

  const gif = GIFEncoder()
  const step = 1000 / fps
  let previous = null, pending = null
  const flush = () => pending && gif.writeFrame(pending.index, width, height, pending.opts)
  for (const shot of shots) {
    const frame = onMatte(PNG.sync.read(shot), matte)
    const index = applyPalette(frame.rgba, palette)
    for (let q = 0; q < pixels; q++) if (frame.clear[q]) index[q] = KEY
    if (!previous) {
      pending = { index, opts: { palette: table, delay: step, transparent: true, transparentIndex: KEY, dispose: 1 } }
      previous = index
      continue
    }
    const changes = new Uint8Array(pixels)
    let changed = false
    for (let q = 0; q < pixels; q++) {
      if (index[q] === previous[q]) changes[q] = KEY
      else { changes[q] = index[q]; changed = true }
    }
    if (!changed) { pending.opts.delay += step; continue }
    flush()
    pending = { index: changes, opts: { delay: step, transparent: true, transparentIndex: KEY, dispose: 1 } }
    previous = index
  }
  flush()
  gif.finish()
  return gif.bytes()
}

const browser = await chromium.launch({ channel: 'msedge', headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 600, height: 400 }, deviceScaleFactor: SCALE })
  const page = await context.newPage()
  for (const theme of ['light', 'dark']) {
    await page.goto(`${STAGE}?theme=${theme}`)
    if (!await page.evaluate(() => window.fontsReady())) throw new Error('The Atkinson Hyperlegible fonts did not load (no internet?)')
    const figures = (await page.evaluate(() => window.figures())).filter(f => !only.length || only.includes(f.name))
    for (const figure of figures) {
      const name = `three-ideas-${figure.name}${theme === 'dark' ? '-dark' : ''}`
      const clip = await page.evaluate(n => window.show(n), figure.name)
      await page.evaluate(t => window.seek(t), figure.still)
      await page.screenshot({ clip, omitBackground: true, path: join(IMAGES, `${name}.png`) })
      const shots = []
      const fps = figure.fps ?? FPS
      const frames = Math.round(figure.duration * fps)
      for (let i = 0; i < frames; i++) {
        await page.evaluate(t => window.seek(t), i / fps)
        shots.push(await page.screenshot({ clip, omitBackground: true }))
      }
      const bytes = encode(shots, MATTE[theme], fps)
      await writeFile(join(IMAGES, `${name}.gif`), bytes)
      console.log(`  ${name}.gif (${frames} frames, ${Math.round(bytes.length / 1024)} KB) and .png`)
    }
  }
} finally {
  await browser.close()
}
