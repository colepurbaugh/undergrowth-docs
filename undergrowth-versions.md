# Undergrowth versions

[← Guide](README.md) · [Sharing between computers](sharing.md)

Undergrowth comes in three editions. They are named for what you can open on
them, not for any job they do. One release number covers all three.

| Edition | What you can open | Runs on |
|---|---|---|
| **Undergrowth** | The full dashboard: map, nodes, clusters, missions, scenarios, graphs, logs, data, reports | A PC or a Raspberry Pi |
| **Undergrowth Lite** | A plain status page: its readings, what is plugged into it, when it last shared, and a link to the map | A small board with Wi-Fi, such as an ESP32-S3 |
| **Undergrowth Micro** | No web page at all. It shows up as a node in Undergrowth, with how it's connected. | A microcontroller with no Wi-Fi |

Each one says which it is:

- **Undergrowth** shows its version beside the name in the top bar. Hover it to
  see what it's running on, such as *Undergrowth 3.10.0 · Windows PC*.
- **Undergrowth Lite** shows it at the top of its page, at the bottom right of
  its screen, and full-screen for a moment when it starts. Its page says the
  map is elsewhere, and once a computer running Undergrowth has connected, it
  links to that computer's map.
- **Settings → Sharing** in Undergrowth lists every computer it shares with,
  and which edition and version each one runs.

Computers share with each other as long as they speak the same sharing
protocol (see [Sharing between computers](sharing.md)), whatever their
editions and versions.

## Current version: 3.10.0

*22 November 2026*

| Edition | Version | Status |
|---|---|---|
| Undergrowth | 3.10.0 | In use |
| Undergrowth Lite | 3.9.0 | Built, for the ESP32-S3 Feathers (nothing new for Lite since) |
| Undergrowth Micro | — | Not built yet |

New in 3.10.0:

- **Screens.** A phone, tablet or laptop with nothing installed can use an
  Undergrowth computer's dashboard in its web browser, once it is let in from
  **⚙ → Screens**, either to change things or to look only. A look-only screen
  sees everything and changes nothing. The first screen on a Pi is let in with
  the setup code on its card. Anything changed from a screen is logged with its
  name. See [Letting a screen in](sharing.md#letting-a-screen-in).

<div style="page-break-after: always"></div>

---

## Earlier versions

**3.9.0** · *21 November 2026* · Trust between nodes: every node has its own
key, joins a cluster with authentication turned on by being introduced (over
USB, or over Wi-Fi with the same six-digit number on both screens), and shakes
hands before sharing; anything not introduced gets only the hello.
**+ Add Node** lists everything heard on Wi-Fi, USB and Bluetooth. The
[Android app](install-on-android.md), [installing on Linux](install-on-linux.md)
with one pasted line, Govee Bluetooth thermometers and pool floats, changes to
another node's records passed on to their owner, and a Raspberry Pi card that
installs with no internet. Undergrowth Lite boards got their own keys and
handshakes too.

**3.8.0** · *10 November 2026* · A [Reports](reports.md) page: Letter pages
that fill themselves in from the readings and logs, live, built from tiles you
size by dragging. Print or save as a PDF, in colour or black and white, each
page stamped with when it was printed and the newest reading on it.

**3.7.0** · *10 November 2026* · [Wind and rain radar](map.md#wind-and-rain-radar)
on the map, each with its own button: standard wind barbs across the map from
the National Weather Service forecast, coloured by strength, and NOAA
nowCOAST's latest radar picture. Wind in the top bar in mph, with an arrow
pointing the way it blows.

**3.6.0** · *10 November 2026* · A [Data](data.md) page: how much room
Undergrowth takes and how fast it grows, archiving old data into checked zips
(by button or on a schedule) that Graphs can still read, a Store box for every
reading and log category, and disk space as readings. config.db no longer
keeps every log entry twice.

**3.5.0** · *9 November 2026* · A [Graphs](graphs.md) page: readings as dots
so gaps show, saved graphs, readings stacked on left and right axes or put
against each other, colours in bands, blends or by time, anything from Logs
laid over them, and a range that can be moved, with how long each graph took.
The pages in the order Map, Nodes, Clusters, Missions, Scenarios, Graphs, Logs.

**3.4.0** · *9 November 2026* · Missions can run between two times of day and
set controls, the most urgent mission getting each one. Undergrowth Lite finds
plug-in sensors by itself, each becoming a node, and its page fills itself in
live: parts coming and going, the time and where it came from, recent
activity, calibration offsets and the board's LEDs by hand. Every node shows
how it's connected. The three editions, with name and version on every
screen. A *Greenhouse bench* scenario.

**3.3.0** · *7–8 November 2026* · Navigation and safety alarms became one kind
of mission, with when, do and priority. Every node and cluster got one display,
blank to start. Number commands can ease, and devices can confirm them. The time
zone is shown. Undergrowth Lite ran on its first board, the ESP32-S3 Reverse TFT
Feather, with its light and buttons. A Scenarios page with small built-in
examples.

**3.2.0** · *2–3 November 2026* · Computers share records, readings and logs
with each other, each keeping its own. The first Undergrowth Lite firmware, for
ESP32-S3 boards with a GPS and a motion sensor. Radio connections on the map,
and turning a node into a cluster. The guide moved to its own site.

**3.1.0** · *31 October – 1 November 2026* · Routes, keep-outs and advice on
which way to steer. Manual override for positions and readings. Controls and
commands. Safety alerts. The live tide, wind, temperature and sky bar. The
illustrated guide.

**3.0.0** · *25–31 October 2026* · A fresh start: the map dashboard, nodes and
clusters, and logs that keep everything.

**2** · *February – April 2025* · Greenhouse monitoring with ESP32-S3 boards
and their screens, sending readings over MQTT. Grow-light control with
scheduled events and auto and manual modes, an over-temperature cut-off, and a
dark interface. Retired when 3.0.0 started fresh.

**1** · *December 2024 – January 2025* · A Raspberry Pi web page graphing
temperature and humidity sensors (GY-906, AHT10), switching a USB relay and
logging to SQLite, with ESP32 boards reporting over Wi-Fi and Bluetooth.
Retired.
