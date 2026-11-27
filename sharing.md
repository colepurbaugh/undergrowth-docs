# Sharing between computers

[← Guide](README.md)

There is no central server. Every computer running Undergrowth, whether a PC
in the office, a Raspberry Pi in a shed or on a boat, or a small ESP32 board,
keeps its own records and serves its own dashboard. A computer with no signal,
such as one out on the water or at the far end of a field, still records its
readings, checks its missions and shows its map. When two computers can reach
each other, they share what they know.

## Who can change what

Whoever creates a record owns it. If the greenhouse Pi made the grow room's
thermometer node, only the greenhouse Pi can change it. Every other computer
holds a copy.

A copy looks like everything else on the map, but its panel says where it
came from. Commands still work: switching a relay or pressing a button on a
copy is passed on to the computer that owns it. The record itself can't be
edited or dragged here yet; to change it, open the dashboard on the computer
that owns it. That way two computers can never disagree about what a record
says.

Readings and log entries are shared the same way. Each one stays with the time
it was taken, so a copy of a two-hour-old position fades just like the
original does.

If someone in the greenhouse overrides a thermometer to test the overheat
alarm, the office sees the same reading, marked *set by hand*. The test can
only be turned off on the greenhouse Pi. The same goes for a boat's crew
testing the capsize alarm: only the boat can turn it off.

## Catching up

Every 10 seconds each computer asks the others what is new since last time.
A computer that was out of range all morning, such as a boat's, catches up
when it gets back, from where it left off.

A computer also passes on the copies it holds. If one boat hears another out
on the water, it brings that boat's readings back to the office. A reading that
arrives by two routes is only stored once.

## Adding a computer

Two computers share only once they have been introduced into the same cluster
with authentication turned on. On one of them, open **Nodes → + Add Node**:
anything running Undergrowth nearby shows up under **Scanning…**, found on
Wi-Fi or over USB, even on a phone hotspot where addresses change every time.
Tick how to reach it, press **Add**, and check that both screens show the same
six-digit number. [Let them trust each other](setup-greenhouse.md#4-let-them-trust-each-other)
goes through it step by step.

**⚙ → Sharing** then lists every computer this one shares with, and whether
each is up to date or why it can't be reached. Anything on the network that
hasn't been introduced gets this computer's hello and nothing else.

A computer only shares with others if it is listening on the network: start
its node service with `UG_HOST=0.0.0.0`.

While a screen is in a [scenario](scenarios.md), **⚙** says sharing
is off. Nothing in a scenario is shared, but the real records on that same
computer keep sharing as usual underneath.

## Letting a screen in

Any phone, tablet or laptop can use an Undergrowth computer's dashboard in its
web browser, with nothing installed on it. That makes it a **screen**: it isn't
a node and joins nothing. A browser on the computer itself always works. Any
other has to be let in first, either to change things or to look only.

1. On the new device, open the computer's address in the browser, such as
   `http://192.168.0.12:3001`, or `http://shed-pi.local` for a Pi. It shows
   *This screen isn't let in yet* and a six-digit code.
2. On a screen that is let in already, or on the computer itself, open
   **⚙ → Screens → Let a screen in** and type the code. It says which browser
   is waiting, such as *Chrome on Android*.
3. Give it a name, such as *Deck tablet*, and choose:
   - **Can change things:** controls, readings, missions and settings, and
     letting more screens in.
   - **Look only:** it sees everything and changes nothing. Its switches and
     buttons are greyed out or hidden, and *Look only* shows at the top.
4. Press **Let it in**. The new screen opens the dashboard by itself.

It stays let in until it is removed. **⚙ → Screens** lists every screen, who
let it in and when, with **Remove**, and a removed screen goes straight back to
showing a code. Anything changed from a screen is logged with its name, such as
*Graph saved: Pool, from Deck tablet*.

Use the same address on that device each time: a browser is let in for the
address it used, so `shed-pi.local` and the Pi's number count as two screens.
The computer has to be listening on the network. A Pi always is; a PC needs
`UG_HOST=0.0.0.0`, as in [Installing on Linux](install-on-linux.md).

**The first screen on a Pi.** A Pi has no screen of its own to let the first
browser in from, so its card carries a **setup code**, shown when the card was
made. Type it on the waiting page under *Setting this node up?*, with a name for
the screen, and that browser is let in, able to change things. **⚙ → Screens**
can change the setup code or turn it off. After five wrong codes it makes
everyone wait a minute.

On plain Wi-Fi, someone else on the same network could watch what a screen
sends and pretend to be it. Let screens in on a network you trust, and remove
any you no longer trust.

## A Pi, a phone and a board

Somewhere away from the office, such as a shed, a field or a boat, a
Raspberry Pi 4 can keep the records, on a battery pack if there is no power
socket. On a boat, the crew's phone is the hotspot, and runs the
[Undergrowth app](install-on-android.md) as a node of its own, introduced into
the boat's cluster with the Pi. A phone without the app can use the Pi's
dashboard in its browser once it is [let in](#letting-a-screen-in).

Sensors can be wired two ways, and either works. Here, a boat's GPS and motion
sensor:

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
- Adding nodes and Bluetooth sensors, or Wi-Fi details for new boards, from a
  screen on another device. For now they are done on the computer itself.
- Screens for the board's own page: any browser nearby can still open it and
  change things on it.
- Sharing missions between computers.
- Calibrating the motion sensor. For now it has to lie flat with its arrow
  toward the bow.
