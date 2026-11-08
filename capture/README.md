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
the scenario again, and rewrites everything in `images/`. `npm run capture-scenarios`
does the same for the step-by-step pictures in [Walkthroughs](../scenarios.md),
by doing each step through the dashboard's own forms.
