# Undergrowth guide

Undergrowth keeps track of an oyster farm's boats, baskets, tanks and sensors
on one map. It works out where boats should go, switches equipment, and raises
an alarm when something goes wrong. These pages show what it does today. It is
a prototype, and every picture comes from *The whole farm*, one of its built-in
scenarios, not a real farm.

![The Undergrowth map](images/overview.png)

## On the nautical chart

The map can also be NOAA's nautical chart, with depth soundings, channels,
buoys and lights. Boats, routes, keep-outs and mission paths sit on top of it.
Here the boats are working the channel out from the home dock:

![The farm on the nautical chart](images/chart-farm.png)

Closer in, Big Toot's planned path (gold) follows the channel waypoints past
the old piling, and the dock's Wi-Fi beam and LoRa link reach out to it:

![Big Toot leaving the dock on the nautical chart](images/chart-channel.png)

Charts are shown for reference only, not for navigation. See
[map styles](map.md#map-styles) for the satellite and topographic maps too.

## How it fits together

- A **[node](nodes.md)** is one thing: a GPS, a heater plug, an oyster
  basket, a dock. Everything starts as a node.
- A **[cluster](clusters.md)** is a group. A vessel is a cluster of its parts,
  a tank is a thermometer and a heater plug, and a tank house is a cluster of
  tanks.
- A **[mission](missions.md)** is a goal, such as "take Big Toot to basket 4"
  or "keep the crab tanks between 42 and 60 °F". Undergrowth keeps checking it
  against what is happening now.
- **[Logs](logs.md)** write down every reading, command and decision, with when
  and why.

## The guide

Start with **[Getting started](getting-started.md)**: setting it up and a first
look around.

Then one page for each section in the top bar, in the same order:

| Section | What it covers |
|---|---|
| [Map](map.md) | The map and its symbols, live tide, wind and weather, map styles and the nautical chart |
| [Nodes](nodes.md) | What a node is and why everything starts as one; positions, values, displays, keep-outs and the editor |
| [Clusters](clusters.md) | Groups of things: vessels, tank houses, routes; displays that open inside each other; taking a boat in tow |
| [Missions](missions.md) | One kind of mission (when, do, priority): advising a vessel the way, routes and keep-outs, and alerts |
| [Logs](logs.md) | The record of everything that happened, and how to read it |
| [Scenarios](scenarios.md) | Small ready-made examples to try, apart from your real records |

Also:

| Page | What it covers |
|---|---|
| [Fundamental logic](fundamental-logic.md) | The rules every feature has to fit: nodes, clusters, missions with priorities, commands, displays |
| [Walkthroughs](walkthroughs.md) | Building a boat and a crab tank from scratch, step by step |
| [Manual override](manual-override.md) | Setting a position or reading by hand to test things |
| [Radios and connections](radios-and-connections.md) | Which radios can reach each other, and which are connected |
| [Sharing between computers](sharing.md) | Each boat's own computer, read-only copies, and the ESP32 boards |
| [Undergrowth versions](undergrowth-versions.md) | Undergrowth, Undergrowth Lite and Undergrowth Micro; the current version and earlier ones |

## Not built yet

- Boats steering themselves. Missions give advice and a person still drives.
- A single button for taking a boat in tow. Today it takes
  [two edits](clusters.md#taking-a-boat-in-tow).
- Sharing missions between computers. Records, readings and logs are already
  shared; [Sharing between computers](sharing.md) lists what else is missing.

---

*Undergrowth's code is not public. Pictures show a built-in scenario, not live
data.*
