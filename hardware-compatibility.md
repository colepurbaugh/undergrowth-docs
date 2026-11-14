# Hardware compatibility

[← Guide](README.md)

What Undergrowth runs on, and what it can read from. Each row says how far it
has been tried:

- **Tested**: someone has run it and it worked.
- **Should work**: built for, and close to something tested, but not tried yet.
- **Planned**: not built yet.

If you try something new, say how it went, and this page gets a new row.

## Computers

A computer runs the full **Undergrowth**: the map, the history, missions and
reports. See [Undergrowth versions](undergrowth-versions.md) for the editions.

| Computer | Status | Notes |
|---|---|---|
| Windows 10 PC | Tested | Where Undergrowth is built. Hears Bluetooth sensors by itself. |
| Linux Mint | Tested | Installed by following [Installing on Linux](install-on-linux.md). |
| Ubuntu, and other Linux computers like it | Should work | The same steps as Linux Mint. |
| Windows 11 PC | Should work | |
| Raspberry Pi 4 | Planned | One on each boat, for the boat's own records and radios. |
| Mac | Not tried | |

## Phones and tablets

A phone runs the full **Undergrowth** as an app, with its own GPS and compass.
Any phone or tablet can also be a screen for another Undergrowth computer, in
its web browser.

| Phone or tablet | Status | Notes |
|---|---|---|
| Google Pixel 2 (Android 11) | Tested | The Undergrowth app. Its GPS places it on the map, and its compass points its arrow to true north. |
| Other Android phones and tablets, Android 8 or newer | Should work | The same app. |
| iPhone and iPad | Planned | Until then, they work as a screen for another Undergrowth computer, in Safari. |

## Boards

A board runs **Undergrowth Lite**: a small node with a plain status page, that
owns the sensors plugged into it and shares their readings over Wi-Fi. See
[Sharing between computers](sharing.md#the-computers-on-a-boat).

| Board | Status | Notes |
|---|---|---|
| [Adafruit ESP32-S3 Reverse TFT Feather](https://learn.adafruit.com/esp32-s3-reverse-tft-feather/overview) | Tested | Wi-Fi, USB, its screen, buttons and light. Added from **+ Add Node** over USB. |
| Other ESP32-S3 boards | Not tried | The firmware is built for the Reverse TFT Feather's screen and buttons. |

## Sensors on a board

Plugged into a board's I2C port (STEMMA QT). The board notices one within a few
seconds and it appears as a node of its own, already wired to the board.

| Sensor | Reads | Status |
|---|---|---|
| VEML7700 | Light | Tested |
| AHT10 / AHT20 | Temperature and humidity | Tested |
| BNO08x | Heading, roll and pitch | Should work |
| GPS | Position, speed, course and time | Should work |

## Bluetooth sensors

These broadcast their readings to anything nearby every few seconds.
Undergrowth just listens: there is no pairing, no gateway, no app and no
account. A sensor in range shows up in
**+ Add Node** on the Nodes page, with its signal strength, and **Add** makes it a node:

```
Holding tank air ─Bluetooth→ This computer
```

Anyone nearby can read what these sensors broadcast, and someone could send
fake readings, so use them for watching, not for anything that must not be
wrong.

| Sensor | Reads | Heard by | Status |
|---|---|---|---|
| Govee H5075 thermometer | Temperature, humidity, battery | Windows PC | Tested |
| Govee H5075 thermometer | | Android phone, ESP32-S3 board, Linux | Planned |
| Govee H5072 thermometer | Temperature, humidity, battery | Windows PC | Should work: it broadcasts the same way |

A Windows PC listens with its own Bluetooth. The first time Undergrowth
starts, it builds a small listener with a tool that comes with Windows, so
there is nothing extra to install. If Bluetooth is turned off, **+ Add Node**
says so.
