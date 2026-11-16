# Setting up a greenhouse

[← Guide](README.md)

This page is for the people installing Undergrowth at a greenhouse. It sets
up one small example: a Linux computer that stays on, two Bluetooth
thermometers watching two grow rooms, and an Android tablet as the screen
people look at. It takes an afternoon.

The names on this page (*Greenhouse PC*, *Grow room 1*, *Grow room 2*,
*Greenhouse tablet*) are examples. Use whatever the grower calls things.

```
Grow room 1 thermometer ─Bluetooth→ Greenhouse PC ─Wi-Fi→ Greenhouse tablet
Grow room 2 thermometer ─Bluetooth→ Greenhouse PC
```

The computer owns everything: it hears the thermometers, keeps the history,
and raises the alerts. The tablet keeps a copy and shows it.

## Before you go

> **Try it on the bench first.** Hearing Govee thermometers on **Linux** is
> built, but marked *Should work* on
> [Hardware compatibility](hardware-compatibility.md#bluetooth-sensors): it
> hasn't been tried with a real sensor yet. If you can, install on the
> computer and add one thermometer before the visit (steps 1 and 3), and
> leave it overnight to check readings keep arriving. Then say how it went,
> so that row can say **Tested**. The tablet can't hear them by itself yet.

Check the code is ready: on the Undergrowth repository, the newest version
should be the one you'll install. Write its number down, so you can check it
on both screens later.

## What to bring

| Thing | Notes |
|---|---|
| A Linux computer, such as a small PC like an Intel NUC, with Linux Mint | It needs **Bluetooth**, a power socket, and internet. It stays on. |
| An Android tablet, Android 8 or newer | See [Installing on Android](install-on-android.md#what-you-need). |
| Two Govee H5075 thermometers | One per grow room. Fresh AAA batteries, and spares. |
| A GitHub account for the computer, and one signed in on the tablet | Each has to be added to the Undergrowth repository first, with the invite accepted. |
| The greenhouse's Wi-Fi name and password | The computer and tablet must be on the same Wi-Fi. |
| A trusted thermometer | To check the Govees read about right. |

Agree with the grower before the visit:

- **What each room should stay between**, in temperature and humidity. This
  page uses 65–85 °F and 40–70 % as placeholders.
- **How long a quiet thermometer is a problem.** This page uses 30 minutes.
- **Where the tablet lives**, and who looks at it.

## 1. The computer

1. Plug the computer in where it can stay, ideally **between the two grow
   rooms**, so both thermometers are in Bluetooth range. Bluetooth goes
   through one wall well, and through two badly. Not on the floor, not next to
   a metal cabinet or a fan motor.
2. Join it to the greenhouse Wi-Fi, or plug in a network cable.
3. Follow [Installing on Linux](install-on-linux.md) from the start, up to
   **Undergrowth is installed**.
4. Let the tablet reach it. In a terminal:

   ```bash
   mkdir -p ~/.config/undergrowth && printf 'UG_HOST=0.0.0.0\nUG_NAME=greenhouse-pc\n' > ~/.config/undergrowth/settings
   ```

5. Log out and back in once, so the permission to use Bluetooth takes
   effect. Then double-click **Undergrowth**. The map opens in the browser.
6. Write down the computer's address: `hostname -I` in a terminal, the first
   number, such as `192.168.1.50`. If you can, ask whoever looks after the
   Wi-Fi router to **reserve** that address for this computer, so it doesn't
   change.

### Keeping it running

Undergrowth only watches while it's running, so the computer has to stay on
and start Undergrowth by itself.

| Setting | Where (Linux Mint) |
|---|---|
| Never sleep or suspend | **System Settings → Power Management**: *Suspend when inactive* **Never**, on AC power. |
| Undergrowth starts when someone logs in | **Startup Applications → + → Custom command**: name *Undergrowth*, command `gtk-launch undergrowth`. It opens the same terminal window as the icon. |
| Log in by itself | **Login Window → Users**: turn on automatic login for this account. |
| Turn back on after a power cut | In the computer's BIOS (press **F2** while it starts, on a NUC): *After Power Failure* → **Power On**. |

Test it: pull the power cord, plug it back in, and don't touch anything. The
computer should start, log in, and open Undergrowth by itself.

### Bluetooth

In a terminal:

```bash
bluetoothctl show
```

It should say **Powered: yes**. If it says *No default controller available*,
the computer's Bluetooth is off or missing: turn it on in the BIOS, or plug in
a USB Bluetooth adapter.

## 2. The rooms

On the computer's map:

1. **Clusters → + Add Cluster**: *Greenhouse*, type **greenhouse**. Put it on
   the map where the greenhouse is.
2. **+ Add Cluster** twice more: *Grow room 1* and *Grow room 2*, type
   **room**. For the position, press **＋** and tick *Greenhouse*. Untick
   **Show on Map**; the greenhouse stands for its rooms.
3. **Edit / Membership** on *Greenhouse*, and tick both rooms.

This is the same shape as a tank house and its tanks. See
[Walkthroughs](walkthroughs.md#2-a-new-crab-tank).

## 3. The thermometers

Do one thermometer at a time, so you know which is which.

1. Put the batteries in the first Govee. Its screen comes on.
2. Hold it next to the computer. On **Nodes → + Add Node**, it shows up under
   Bluetooth within a minute, with its signal strength and a reading.
3. Check the reading against your trusted thermometer. A degree or two out is
   normal for these; much more, and use a spare.
4. Press **Add**. Name it *Grow room 1 thermometer*. Position from *Grow room
   1*, **Show on Map** unticked, and under **Belongs to Clusters** tick
   *Grow room 1*.

   ```
   Grow room 1 thermometer ─Bluetooth→ Greenhouse PC
   ```

5. Put a piece of tape on its back saying *Grow room 1*.
6. Do the same for the second one, as *Grow room 2 thermometer*.

Then place them:

- At plant height, in the middle of the room, out of direct sun and away from
  heaters, fans and misters. Not touching the wall.
- After placing each one, wait a few minutes and check on the room's display
  that its readings are still arriving and staying fresh. If one keeps dropping
  out, move the computer closer, or the thermometer nearer the door.

On **Clusters**, press **▸** beside each room, **＋**, and add the
thermometer's temperature, humidity and battery to the room's display. Then
**▸** beside *Greenhouse* and add both rooms' displays, so one screen shows
both.

## 4. The alerts

On **Missions**, make these. Point each one at *Greenhouse*, so it covers both
rooms, and any room added later.

| When | Limits | Why |
|---|---|---|
| A reading goes out of range: temperature | 65–85 °F, **only if it lasts** 10 minutes | A heater or vent stuck. Opening the door for a moment isn't. |
| A reading goes out of range: humidity | 40–70 %, **only if it lasts** 10 minutes | Misters or dehumidifier stuck. |
| A reading goes out of range: battery | below 20 % | Time for new batteries, before it goes quiet. |
| A sensor stops reporting | 30 minutes | Dead battery, moved out of range, or the computer stopped hearing it. |

Test each room: on the thermometer's display, set the temperature to 95 °F by
hand ([Manual override](manual-override.md)). After the 10 minutes a red alert
comes up, marked *set by hand*. Release the override, and **Acknowledge** it.

Alerts show on the screens: the red **⚠ alerts** button, and the room flagged
in red. **Nobody is texted or emailed yet**, so someone has to look. Tell the
grower that.

## 5. The tablet

1. Join the tablet to the same Wi-Fi as the computer.
2. Follow [Installing on Android](install-on-android.md). The tablet becomes a
   node of its own. Rename it *Greenhouse tablet* under **⚙ → Configure This
   Node**.
3. Open **⚙ → Sharing**. *greenhouse-pc* appears there by itself, marked
   *found on the network*. If it doesn't after a minute, type the computer's
   address and port, such as `192.168.1.50:3001`, and press **Add**.
4. Within a few seconds it says it's up to date, and the greenhouse, both
   rooms and their readings appear on the tablet.
5. In the tablet's browser, open `http://192.168.1.50:3001` (the computer's
   address) and add it to the home screen as *Greenhouse PC*.

The two icons do different things:

- **Undergrowth** (the app) is the tablet's own copy. It keeps the readings
  even when the computer is off, but the rooms and thermometers are greyed out
  on it, because the computer owns them. See
  [Who can change what](sharing.md#who-can-change-what).
- **Greenhouse PC** (the bookmark) is the computer's own dashboard. **Alerts
  are raised there**, because that's where the missions are, so this is the
  one to look at and to acknowledge from. Changes to rooms, thermometers and
  missions are made here too.

Set the tablet to stay plugged in, with the screen on while charging
(**Settings → Developer options → Stay awake**), and its Undergrowth app's
battery to **Unrestricted**.

## Before you leave

- [ ] Both thermometers have readings less than two minutes old, on both
      screens.
- [ ] Each room's alert was tested and acknowledged.
- [ ] The computer came back by itself after pulling the power.
- [ ] The version number at the top of every screen is the one you wrote down,
      on the computer and the tablet.
- [ ] The grower knows: look at **Greenhouse PC** for alerts; nobody is
      texted; don't close the Undergrowth terminal window on the computer; new
      batteries when the battery alert comes up.
- [ ] Note down the computer's address, its login, and which GitHub accounts
      are on it, and leave a copy with the grower.

## Afterwards

To update, double-click **Update Undergrowth** on the computer, and update the
tablet's app the same way it was installed. Do the computer first. Nothing
needs to be set up again.

## If something goes wrong

| What you see | What to do |
|---|---|
| **+ Add Node** says Bluetooth is off, or lists nothing | `bluetoothctl show`, as in step 1. Check the Govee's screen is on, and hold it next to the computer. |
| A room's readings keep going old | Out of range. Move the computer or the thermometer closer, and check the battery. |
| The tablet says it can't reach *greenhouse-pc* | Both on the same Wi-Fi? Undergrowth running on the computer? The settings file from step 1.4 there? The computer's address changed? |
| The **Greenhouse PC** bookmark doesn't load | The computer's address has changed. Find it with `hostname -I` and make the bookmark again, and ask for the address to be reserved. |
| Nothing after a power cut | Check the BIOS setting and Startup Applications in [Keeping it running](#keeping-it-running). |
| An alert that won't go away | It's waiting for someone to press **Acknowledge**, even if the problem fixed itself. |

Also see the problem tables on [Installing on Linux](install-on-linux.md#if-something-goes-wrong)
and [Installing on Android](install-on-android.md#if-something-goes-wrong).

## Not built yet

- Hearing Govee thermometers on the tablet. The computer has to do the
  listening.
- Texting or emailing someone when an alert comes up.
- Missions shared between computers, so the tablet's app raises the same
  alerts as the computer.
- A login. Anyone on the greenhouse Wi-Fi can open the dashboard, so keep the
  Wi-Fi password private.
