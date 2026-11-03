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

1. Press **⚙**, then **Add demo fleet**. You get two boats, a home dock, a
   route, some keep-outs and baskets, and 18 holding tanks.
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

When you're finished, **⚙ → Remove demo fleet** puts it all away. Nothing is
ever really deleted; it stays in **Logs**.

## Where next

- [The guide](README.md) covers every feature, with pictures.
- [Scenarios](scenarios.md) builds a boat and a crab tank from scratch.
- [Sharing between computers](sharing.md) covers running Undergrowth on more
  than one computer, such as a Pi on each boat.
