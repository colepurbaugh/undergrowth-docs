# The map and conditions

[← Guide](README.md)

The map is the main screen. Everything with a position and *Show on map* ticked
appears on it: ports, vessels, waypoints, keep-outs, baskets and tank houses.

![The map](images/overview.png)

## Conditions along the top

![Conditions bar](images/conditions-bar.png)

The bar shows the conditions **at the centre of the map**. Pan the map and they
follow.

| Reading | Where it comes from |
|---|---|
| **Tide** | NOAA tide predictions for the nearest tide station, with the next high or low. |
| **Wind** | Measured at the nearest NOAA station when there is one within 50 km, otherwise the National Weather Service forecast. |
| **Temp** | Same as wind: measured if possible, forecast if not. |
| **Sky** | National Weather Service hourly forecast. |

Each reading says whether it is a **prediction**, a **measurement** or a
**forecast**, and how old it is. Hover over a reading for the exact station and
times.

### The colours mean "how fresh"

Every value fades from **bright green** (just arrived) to **dull brown** (old).
A brown reading is still shown, but you can see at a glance not to trust it as
much. If the service cannot reach NOAA or the Weather Service, the bar says
*Conditions offline* and the last values keep fading.

## Map styles

The layers button under the zoom buttons switches the background map. Your
choice is remembered on each device.

| Style | Good for | Source |
|---|---|---|
| **Map** | Everyday use: roads, place names, shoreline. | OpenFreeMap (OpenStreetMap) |
| **Satellite** | Seeing beds, channels and mudflats as they look from the air. | USGS aerial imagery |
| **Nautical chart** | Depths, channel markers and navigation aids. | NOAA charts (not for navigation) |
| **Topographic** | Elevation contours and terrain around the shore. | USGS topo maps |

Markers, routes, keep-outs and mission paths stay on top whichever style is
chosen. The satellite and topographic maps cover the United States only and
become slightly blurry at the closest zoom levels.

## Map buttons

<img src="images/map-buttons.png" height="230" align="right" alt="The map buttons">

Under the zoom buttons, from the top:

- **Map style**: the menu above.
- **Routes**: show or hide every route, with its waypoints.
- **Connections**: show or hide radio connections and how far each radio
  reaches (see [Radios and connections](radios-and-connections.md)).

A lit button means that layer is showing. Each device remembers its choices.

<img src="images/map-styles.png" width="560" alt="The demo fleet on satellite imagery, with the map style menu open">

## Clicking things

- **Click** a marker to open its panel on the right (its details, its mission
  advice and its controls).
- **Right-click** the map to add a node, a keep-out or a waypoint at that spot,
  or to copy the coordinates.
- **Right-click** a marker to edit or archive it.
- When markers sit on top of each other, a small list asks which one you meant.
- The ⧉ button next to any ID or coordinates copies it.

Archiving always asks first and lists anything that depends on the record, such
as a mission heading there:

![Archive confirmation](images/archive-dialog.png)

Archived records disappear from the map but nothing is deleted; they can be
restored from the Nodes, Clusters or Logs pages.
