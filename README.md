# Undergrowth guide

A short, picture-heavy tour of what the Undergrowth dashboard does today.
Undergrowth is a working prototype. Every picture comes from its built-in
**demo fleet**: the vessels, tanks and readings shown are examples, not live
data.

![The Undergrowth map](images/overview.png)

## The idea in one paragraph

**Everything is a node.** A GPS, a heater plug, an oyster basket, a dock: each
is a node. **Clusters** group nodes (and other clusters) into the things people
talk about: a vessel is a cluster of its parts, a tank is a thermometer plus a
heater plug, a tank house is a cluster of tanks. **Missions** are goals that
Undergrowth keeps checking against what is happening now, and every decision,
command, reading and alert is written down with when and why.

Something can start simple and gain detail later. A dock might be one node
until you add its Wi-Fi and its cameras; then **Make it a cluster** (in its
editor) turns it into a cluster that can hold those parts. It keeps its ID, its
readings, its missions and its history, and anything already mounted on it
becomes its first parts.

## Pages

| Page | What it covers |
|---|---|
| [Getting started](getting-started.md) | The one-page intro: what it is, setting it up, your first five minutes |
| [Scenarios](scenarios.md) | Building a boat and a crab tank from scratch, and the decisions along the way |
| [The map and conditions](map-and-conditions.md) | Reading the map, map styles (satellite, chart, topo), live tide/wind/weather, what the colours mean |
| [Vessels and missions](vessels-and-missions.md) | Vessels as clusters of parts, routes, keep-outs, navigate missions |
| [Radios and connections](radios-and-connections.md) | Which radios can talk to each other, how far each reaches, and showing or hiding them |
| [Manual override](manual-override.md) | Setting a position or reading by hand to test things safely |
| [Tanks and controls](tanks-and-controls.md) | The control column: sensors, readings typed in by hand, switches and buttons |
| [Safety watches](safety-watches.md) | Tipping, proximity, tank temperature and silent-sensor alerts |
| [Logs and history](logs-and-history.md) | The permanent record of everything that happened |

## What the map symbols mean

| Symbol | Meaning |
|---|---|
| <img src="images/icon-vessel.png" height="70" alt="Vessel"> | **A vessel.** The arrow points the way it is heading. The small dashed circle is how far other vessels must keep away. |
| <img src="images/icon-mission-arrow.png" height="70" alt="Mission arrow"> | **Mission advice.** The gold circle shows which way the mission says to go; the gold line is the planned path. |
| <img src="images/icon-port.png" height="70" alt="Port"> | **A port or dock.** |
| <img src="images/icon-waypoint.png" height="70" alt="Waypoint"> | **A route waypoint.** Routes are drawn as dashed blue lines between their waypoints. |
| <img src="images/icon-keepout.png" height="70" alt="Keep-out"> | **A keep-out** (a hazard such as an old piling or a sandbar). Vessels steer around the red circle. |
| <img src="images/icon-basket.png" height="70" alt="Basket"> | **An oyster basket** (a payload). Vessels not collecting it keep a small distance. |
| <img src="images/icon-tank-house.png" height="70" alt="Tank house"> | **A tank house**: a group of holding tanks. The pulsing ring means one of its tanks has an alert. |
| <img src="images/icon-connections.png" height="70" alt="Radio connections"> | **Radio connections.** Solid: connected. Dotted: in range but not connected. The colour is the kind of radio. See [Radios and connections](radios-and-connections.md). |
| <img src="images/hand-set-label.png" height="70" alt="Set by hand"> | **✋ Set by hand.** An orange name with a hand means part of it is under manual override. |

## Not built yet

These are planned but not part of the prototype today:

- vessels steering themselves (missions give advice; a person still drives);
- vessels and shore computers talking to each other directly, and sharing
  missions between them.

---

*This guide is published from the Undergrowth project. The code itself is not
public. Pictures show the built-in demo fleet, not live data.*
