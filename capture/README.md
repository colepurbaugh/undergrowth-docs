# Taking the pictures

The pictures in `images/` are taken automatically in a fresh copy of *The
whole farm* scenario, so they can be retaken after the dashboard changes, and
the farm's real records never appear in them.

Start Undergrowth's node service (port 3001) and dashboard (port 3000) from the
Undergrowth repository, then here:

```bash
cd capture
npm install
npm run capture
```

It takes about three minutes, uses Microsoft Edge in the background, starts
the scenario again, and rewrites everything in `images/`. `npm run capture-walkthroughs`
does the same for the step-by-step pictures in [Walkthroughs](../walkthroughs.md),
by doing each step through the dashboard's own forms.

`npm run capture-charts` retakes only the two nautical chart pictures. The
chart has real place names printed into it, which, unlike the ordinary map's
names, cannot be hidden.

`npm run capture-pages` retakes only the pictures of the Nodes and Clusters
pages and the node editor.

`npm run capture-tiles` takes the pictures of tile displays (`images/tiles-*.png`)
for [Nodes](../nodes.md#displays) and [Clusters](../clusters.md#a-clusters-display).
They come from a throwaway node service with an empty database of its own, which
the script fills with a made-up Raspberry Pi, thermometer, Bedroom cluster and
mission. From the Undergrowth repository, build the dashboard
(`cd dashboard && npm run build`) and start one on port 3011
(`cd node-service && UG_PORT=3011 UG_RUNTIME=runtime-tiles UG_DISCOVERY=off npm run dev`),
then run it here. Delete `runtime-tiles` afterwards.

The steps in `capture.mjs` that add rows to a display (`customize`,
`list-display`, and the walkthroughs' tank displays) were written for the
displays before tiles, and need updating before `npm run capture` runs right
through again.

`npm run capture-three-ideas` redraws the pictures for
[Three ideas](../three-ideas.md): a looping GIF and a still PNG of each, in
light and dark. They are drawn in `three-ideas.html`, not taken from the
dashboard, so Undergrowth doesn't need to be running. To watch one play, open
`three-ideas.html#grow` (or another figure's name) in a browser.
