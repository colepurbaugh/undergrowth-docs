# Taking the pictures

The pictures in `images/` are taken automatically from a fresh demo fleet, so
they can be retaken after the dashboard changes.

Start Undergrowth's node service (port 3001) and dashboard (port 3000) from the
Undergrowth repository, then here:

```bash
cd capture
npm install
npm run capture
```

It takes about three minutes, uses Microsoft Edge in the background, resets
the demo fleet, and rewrites everything in `images/`. `npm run capture-scenarios`
does the same for the step-by-step pictures in [Scenarios](../scenarios.md), by
doing each step through the dashboard's own forms.
