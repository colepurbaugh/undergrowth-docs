# Sharing between computers

[← Guide](README.md)

There is no central server. Every computer running Undergrowth, whether a PC
at the shop, a Raspberry Pi on a boat or a small ESP32 board, keeps its own
records and serves its own dashboard. A boat with no signal still records its
position, checks its missions and shows its map. When two computers can reach
each other, they share what they know.

## Who can change what

Whoever creates a record owns it. If the boat's Pi made the boat's GPS node,
only the boat's Pi can change it. Every other computer holds a copy.

A copy looks like everything else on the map, but its panel says where it
came from, its controls are greyed out, and it can't be dragged. To change it,
open the dashboard on the computer that owns it. That way two computers can
never disagree about what a record says.

Readings and log entries are shared the same way. Each one stays with the time
it was taken, so a copy of a two-hour-old position fades just like the
original does.

If a boat's crew overrides its roll to test the capsize alarm, the shop sees
the same roll, marked *set by hand*. The test can only be turned off on the
boat.

## Catching up

Every 10 seconds each computer asks the others what is new since last time.
A boat that was out of range all morning catches up when it gets back, from
where it left off.

A computer also passes on the copies it holds. If one boat hears another out
on the water, it brings that boat's readings back to the shop. A reading that
arrives by two routes is only stored once.

## Adding a computer

Open **⚙** and look under **Sharing**. Computers on the same network announce
themselves and appear there by themselves, marked *found on the network*. That
matters on a phone hotspot, where addresses change every time.

To add one by hand, type its address and port (such as `192.168.0.3:3001`) and
press **Add**. Each computer in the list shows whether it is up to date or why
it can't be reached. **Remove** stops pulling from it.

A computer only shares with others if it is listening on the network: start
its node service with `UG_HOST=0.0.0.0`. There is no password yet, so only do
that on a network you trust.

While a screen is in a [scenario](scenarios.md), **⚙** says sharing
is off. Nothing in a scenario is shared, but the real records on that same
computer keep sharing as usual underneath.

## The computers on a boat

A boat carries a Raspberry Pi 4 on a battery pack. The crew's phone is the
hotspot and the screen: it browses to the Pi and gets the full dashboard.

The GPS and motion sensor can be wired two ways, and either works:

```
GPS ─I2C─ Pi

GPS ──────┐
          ├─ ESP32 ─USB or Wi-Fi─ Pi
BNO085 ───┘
```

Wired to the Pi, the Pi reads them itself. Wired to an ESP32-S3 Feather, the
board is a small Undergrowth computer of its own: it owns its records, keeps a
few hours of readings in memory, and shares them like any other computer. The
Pi keeps the long history. If the Pi restarts, the board still has the
readings from while it was down.

What is soldered onto the Feather is part of the board, so the board is one
node with its RGB LED (a dimmable light), its red LED (on/off) and its three
buttons. What plugs into its I2C port is found on its own within a few
seconds, and each part becomes a node wired to the board:

| Address | Part | Readings |
|---|---|---|
| 0x10 | VEML7700 light sensor | light (lux) |
| 0x38 | AHT10 or AHT20 | temperature (°F), humidity (%) |
| 0x42 | u-blox GPS | position, speed, satellites, and the time |
| 0x4A | BNO085 motion sensor | heading, roll, pitch |

The board and its parts make a cluster named after the board. Parts can be
plugged in and unplugged while it runs: within a second or two they appear on
its page and screen, and disappear again. In Undergrowth an unplugged part
goes quiet rather than vanishing, so a mission can notice a sensor that fell
off; **Forget them** on the board's page removes it for good.

### The board's own page

The board runs **Undergrowth Lite** (see
[Undergrowth versions](undergrowth-versions.md)). Browse to the address on its
screen for a page in the dashboard's colours. There is no map on it. Once a
computer running Undergrowth has pulled from it, the page links to that
computer's map. The page shows:

- **Time:** the board's date and time, and where it came from, for example
  `time.google.com ─NTP over Wi-Fi→ this board`. The best source wins: a GPS,
  then internet time, then the computer that pulls from the board, so a board
  on a boat with no internet still gets the right time. The time zone comes
  from that computer too.
- **Plugged in:** each part, how it is wired, and its readings, live.
- **Calibration:** an offset for light, temperature and humidity, added to
  every reading before it is recorded. Hold a trusted thermometer next to the
  sensor and enter the difference.
- **On the board:** set the RGB LED and red LED by hand, right there. If they
  work from here but not from a mission, the hardware is fine and the problem
  is elsewhere.
- **Recent activity:** joining Wi-Fi, each computer that pulls from it, every
  command and who sent it, parts plugged and unplugged, calibration changes and
  the clock.
- **Firmware update:** upload a new firmware file from the browser. No
  programming tools needed.

Its screen shows its name and address, the time, three tiles at a time (each
reading of what is plugged in, then its RGB LED and red LED), whether it is
sharing, and its edition and version in the corner. Buttons **D1** and **D2**
step the tiles back and on, as the arrows beside them say; a row of dots shows
which tiles are on screen. D0 is left alone, because holding it while the board
starts puts it into boot mode.

## Not built yet

- The Pi side of the USB link to an ESP32. For now the board shares over Wi-Fi.
- Setting the clock from GPS. At sea there is no internet time, and the board
  doesn't record readings until its clock is set.
- A fleet key, so only the farm's own computers can share.
- Sharing missions between computers.
- Calibrating the motion sensor. For now it has to lie flat with its arrow
  toward the bow.
