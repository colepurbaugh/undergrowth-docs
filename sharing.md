# Sharing between computers

[← Guide](README.md)

There is no central server. Every computer running Undergrowth, whether a PC
at the shop, a Raspberry Pi on a boat or a small ESP32 board, keeps its own
records and serves its own dashboard. A boat with no signal still records its
position, checks its watches and shows its map. When two computers can reach
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
board is a small Undergrowth computer of its own: it owns its GPS and motion
records, keeps a few hours of readings in memory, and shares them like any
other computer. The Pi keeps the long history. If the Pi restarts, the board
still has the readings from while it was down.

The board serves a plain text page with its GPS fix, satellites, heading, roll
and pitch, and when it last shared. Its screen shows the address to browse to.
New firmware can be sent to it over Wi-Fi.

## Not built yet

- The Pi side of the USB link to an ESP32. For now the board shares over Wi-Fi.
- Setting the clock from GPS. At sea there is no internet time, and the board
  doesn't record readings until its clock is set.
- A fleet key, so only the farm's own computers can share.
- Sharing missions and watches between computers.
- Calibrating the motion sensor. For now it has to lie flat with its arrow
  toward the bow.
- The ESP32 firmware has been built but not yet run on a board.
