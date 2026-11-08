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
