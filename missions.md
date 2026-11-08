# Missions

[← Guide](README.md) · [Map](map.md) · [Nodes](nodes.md) · [Clusters](clusters.md) · **Missions** · [Logs](logs.md) · [Scenarios](scenarios.md)

A mission is **a goal**, not a list of steps. "Take Big Toot to basket 4."
"Keep the crab tanks between 42 and 60 °F." Every few seconds, Undergrowth
checks each goal against what is happening right now and decides what to do
about it, and it writes down each decision and why.

There are two kinds, both on the **Missions** page:

- **Navigate missions** get a vessel somewhere.
- **Safety watches** never finish: they keep checking for trouble and raise an
  alarm.

## Navigate missions

A navigate mission says "get this vessel to that place", optionally by way of a
route, and how close counts as arrived. Create one at the top of the Missions
page.

![Missions page](images/missions.png)

The advice shows in the vessel's panel and on the map: a gold circle pointing
the way to go and a gold line for the planned path.

### Routes and keep-outs

- A **route** is a [cluster](clusters.md) of waypoints. Their order does not
  matter: Undergrowth joins them with the shortest set of connections (the
  dashed blue lines).
- A **keep-out** is any [node](nodes.md) with a *keep-out distance*. Hazards,
  baskets and vessels all have one. Missions bend their path around keep-out
  circles.

A route is only used when it helps. Near the route, the plan joins it and
follows it. Out in open water, far from it, the plan heads straight for the
target instead.

### Worked out fresh from where the boat is now

Missions do not remember where a vessel was supposed to be. Every few seconds
the plan is worked out again from **where the vessel is now**, so you can pick a
vessel up, put it down anywhere, and the advice follows:

![Dragging a vessel and watching the plan follow](images/drag-and-replan.gif)

(Dragging needs the vessel's position to be under [manual override](manual-override.md).)

When the vessel is close enough, the advice changes to **Arrived — hold
position**. The mission doesn't finish by itself: press **Mark complete** when
the job is done. **Cancel** stops it, and finished missions can be
reactivated.

When the decision changes (a new heading, a new next waypoint, a keep-out to
avoid, arriving), the reason and the inputs it was based on are written to
[Logs](logs.md).

The *Boat to a basket* [scenario](scenarios.md) has one boat, one route and one
keep-out to try all of this on.

## Safety watches

A safety watch is a mission that never finishes. Every 5 seconds, whether or not
anyone has the dashboard open, it checks one condition and raises an alert for
each thing that breaks it.

| Watch | Raises an alert when | Example in *The whole farm* |
|---|---|---|
| **A reading goes out of range** | a number goes below a low limit or above a high limit. Pointed at a cluster, it covers every part inside that has that reading. | Water temperature outside 42–60 °F in every crab tank; roll beyond ±35° on each vessel. |
| **Too close** | a vessel comes inside any keep-out distance: hazards, baskets, and other vessels. It ignores the vessel's own parts and wherever its mission is sending it. | Lil Toot too close to a sandbar. |
| **A sensor stops reporting** | real readings stop arriving for a number of minutes (a dead thermometer battery). An override never hides a silent sensor. | Tank thermometers silent for 3 hours. |

**Only if it lasts** makes a watch wait a few seconds before alerting, so a wave
rocking the boat for a moment is not a capsize.

![Safety watches on the Missions page](images/safety-watches.png)

### What an alert looks like

- **Top bar:** a red **⚠ alerts** button. It flashes until someone acknowledges
  the alert, stays red while the problem continues, and turns amber once it has
  cleared but still needs acknowledging.
- **Map:** a pulsing ring at the spot.
- **Panels:** the alert at the top of the panel, and the tank or vessel flagged
  in red in the panel of whatever contains it (a tank in its tank house).

![The alerts list](images/alerts-list.png)

**Show on map** goes to the thing the alert is about. For a hidden part such as
a tank's thermometer, it opens the tank.

An alert stays until a person presses **Acknowledge**, even after the problem
has gone away, so nothing is missed because it fixed itself.

<img src="images/proximity-alert.png" width="560" alt="Lil Toot inside a sandbar's keep-out circle">

### Testing a watch

Use [manual override](manual-override.md): drag a vessel into a keep-out, set a
roll of 60°, or set a tank's water temperature to 38 °F, and watch the alert
appear, marked *(set by hand)*. Set it back, or release the override, and the
alert turns amber until someone acknowledges it. The *Capsize test*, *Crab tank
goes cold* and *Rescue* [scenarios](scenarios.md) each set one up to try.

Every alert, clearing and acknowledgement is written to [Logs](logs.md) under
*safety* with the readings that caused it. Watches can be paused or removed
from the Missions page.
