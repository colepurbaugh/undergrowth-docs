# Getting started

Undergrowth keeps track of the farm's boats, baskets, tanks and sensors on one
map. It says where boats should go and raises an alarm when something is
wrong, and it writes down every decision, command and reading with when and
why.

Three words come up everywhere:

- A **node** is one thing: a GPS, a heater plug, a basket, a dock.
- A **cluster** is a group. A boat is a cluster of its parts, and a tank house
  is a cluster of tanks.
- A **mission** is a goal, like "take Big Toot to basket 4" or "keep the crab
  tanks between 42 and 60 °F". Undergrowth keeps checking it against what is
  happening right now.

## Setting it up

New to terminals, or setting up a Linux computer? Follow
[Installing on Linux](install-on-linux.md) instead; it goes one step at a
time.

You need Node.js (the LTS version from nodejs.org) and a copy of the
Undergrowth code. Open two terminal windows. In the first, start the node
service:

```bash
cd node-service
npm install
npm run dev
```

In the second, start the dashboard:

```bash
cd dashboard
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Then open http://localhost:3000. Other computers and phones on the same
network can use `http://<this computer's address>:3000`.

## A first look around

1. Open **Scenarios** and press **Start** on *The whole farm*. You get two
   boats, a home dock, a route, some keep-outs and baskets, and 18 holding
   tanks. A scenario has its own records, apart from your real ones, and a
   yellow bar across the top shows you're in one.
2. The bar along the top shows the tide, wind, temperature and sky for the
   middle of the map. Each reading fades from green to brown as it gets older.
3. Click **Big Toot**. Its panel lists its parts, the mission's advice
   ("Head 291°…") and its controls.
4. Tick **Override** next to its GPS position and drag the boat somewhere
   else. The plan follows it.
5. Press the red **⚠ alerts** button. One of the crab tanks has gone cold, and
   **Show on map** takes you to it.

To make an alert of your own, drag the boat into a sandbar's red circle. The
alert shows up within a few seconds, marked *set by hand*.

When you're finished, press **Leave** on the yellow bar to go back to your own
records. The scenario stays where you left it until you start another one or
press **End it** on the Scenarios page. Nothing you did in it touched your real
records.

## Where next

- [The guide](README.md) covers every feature, with pictures.
- [Scenarios](scenarios.md) are small examples, such as a
  capsize or a cold crab tank, each with steps to try.
- [Walkthroughs](walkthroughs.md) build a boat and a crab tank from scratch.
- [Sharing between computers](sharing.md) covers running Undergrowth on more
  than one computer, such as a Pi on each boat.
