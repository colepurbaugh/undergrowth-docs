# Undergrowth versions

[← Guide](README.md) · [Sharing between computers](sharing.md)

Undergrowth comes in three editions. They are named for what you can open on
them, not for any job they do. One release number covers all three.

| Edition | What you can open | Runs on |
|---|---|---|
| **Undergrowth** | The full dashboard: map, nodes, clusters, missions, logs, history | A PC or a Raspberry Pi |
| **Undergrowth Lite** | A plain status page: its readings, what is plugged into it, when it last shared, and a link to the map | A small board with Wi-Fi, such as an ESP32-S3 |
| **Undergrowth Micro** | No web page at all. It shows up as a node in Undergrowth, with how it's connected. | A microcontroller with no Wi-Fi |

Each one says which it is:

- **Undergrowth** shows its version beside the name in the top bar. Hover it to
  see what it's running on, such as *Undergrowth 3.4.0 · Windows PC*.
- **Undergrowth Lite** shows it at the top of its page, at the bottom right of
  its screen, and full-screen for a moment when it starts. Its page says the
  map is elsewhere, and once a computer running Undergrowth has connected, it
  links to that computer's map.
- **Settings → Sharing** in Undergrowth lists every computer it shares with,
  and which edition and version each one runs.

Computers share with each other as long as they speak the same sharing
protocol (see [Sharing between computers](sharing.md)), whatever their
editions and versions.

## Current version: 3.4.0

*9 November 2026*

| Edition | Version | Status |
|---|---|---|
| Undergrowth | 3.4.0 | In use |
| Undergrowth Lite | 3.4.0 | In use on the bench board |
| Undergrowth Micro | — | Not built yet |

New in 3.4.0:

- Missions can run between two times of day, and set controls (a light's
  brightness, a fan) with the most urgent mission getting each one.
- A reading, keep-out or silent sensor can be limited to a time of day, such as
  "between 06:00 and 18:00, the light is below 50 lux".
- Undergrowth Lite finds sensors plugged into its I2C port by itself (a
  VEML7700 light sensor, an AHT10 or AHT20, a u-blox GPS, a BNO085), and each
  becomes a node.
- Every node can show how it's connected, hop by hop, all the way to the
  computer you're looking at.
- The three editions, with the name and version shown on every screen.
- Undergrowth Lite's page fills itself in live: parts appear and disappear as
  they are plugged in and unplugged, on the page and the screen. It shows the
  time and where it came from, recent activity, calibration offsets, and
  controls for testing the board's own LEDs by hand.
- A *Greenhouse bench* scenario.

<div style="page-break-after: always"></div>

---

## Earlier versions

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
