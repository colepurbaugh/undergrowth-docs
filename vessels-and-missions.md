# Vessels and missions

[← Guide](README.md)

## A vessel is a cluster of parts

Click a vessel and its panel lists what it is made of. In the demo, *Big Toot*
has a GPS, a motor controller, a latch, a solar panel, a tilt sensor, a computer
and a radio. The vessel's position comes from its GPS, and every other part
follows it.

<img src="images/vessel-panel.png" width="320" alt="Big Toot's panel"> <img src="images/vessel-controls.png" width="320" alt="Big Toot's controls">

The panel shows:

- **Mission advice** in the gold box: which way to head, how far to go, and why
  ("Head 291° toward Oyster basket 4 via route, next Channel 1, steering around
  Old piling").
- **Controls**, one row per value, described in [Tanks and controls](tanks-and-controls.md).

## Routes and keep-outs

- A **route** is a cluster of waypoints. Their order does not matter: Undergrowth
  joins them with the shortest set of connections (the dashed blue lines).
- A **keep-out** is any node with a *keep-out distance*. Hazards, baskets and
  vessels all have one. Missions bend their path around keep-out circles.

## Navigate missions

A navigate mission says "get this vessel to that place", optionally by way of a
route, and how close counts as arrived. Create them on the **Missions** page.

Missions do not remember where a vessel was supposed to be. Every few seconds
the plan is worked out again from **where the vessel is now**, so you can pick a
vessel up, put it down anywhere, and the advice follows:

![Dragging a vessel and watching the plan follow](images/drag-and-replan.gif)

(Dragging needs the vessel's position to be under [manual override](manual-override.md).)

When the decision changes (a new heading, a new next waypoint, a keep-out to
avoid), the reason and the inputs it was based on are written to
[Logs](logs-and-history.md).

![Missions page](images/missions.png)
