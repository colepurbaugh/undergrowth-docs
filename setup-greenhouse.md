# Setting up a greenhouse

[← Guide](README.md)

This page is for the people installing Undergrowth at a greenhouse. It sets
up one small example: a Linux computer that stays on, an Android tablet as the
screen people look at, and two Bluetooth thermometers watching two grow rooms.
It takes an afternoon.

The names on this page (*Greenhouse PC*, *Greenhouse tablet*, *Greenhouse
crew*, *Grow room 1*, *Grow room 2*) are examples. Use whatever the grower
calls things.

```
Grow room 1 thermometer ─Bluetooth→ Greenhouse PC ─Wi-Fi→ Greenhouse tablet
Grow room 2 thermometer ─Bluetooth→ Greenhouse PC
```

The order matters: first the two Undergrowth nodes, then they learn to trust
each other, then the thermometers as nodes, then a quick look that readings
arrive, and only then the rooms, the alerts and a report that proves it all
works. Everything starts as a node; clusters come after.

This is a prototype. When something doesn't go the way this page says, or a
step could be simpler, write it down: see
[Problems and ideas](#problems-and-ideas).

## Before you go

> **Try the computer on the bench first.** Hearing Govee thermometers on
> **Linux** is built, but marked *Should work* on
> [Hardware compatibility](hardware-compatibility.md#bluetooth-sensors): it
> hasn't been tried with a real sensor yet. If you can, do steps 1 and 5 at
> home with one thermometer and leave it overnight, to check readings keep
> arriving. The tablet can't hear the thermometers itself; the computer does
> the listening.

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

## 1. Install Undergrowth on the computer

1. Plug the computer in where it can stay, ideally **between the two grow
   rooms**, so both thermometers are in Bluetooth range. Bluetooth goes
   through one wall well, and through two badly. Not on the floor, not next to
   a metal cabinet or a fan motor.
2. Join it to the greenhouse Wi-Fi, or plug in a network cable.
3. Follow [Installing on Linux](install-on-linux.md) from the start, up to
   **Undergrowth is installed**.
4. Let the tablet reach it. In a terminal:

   ```bash
   mkdir -p ~/.config/undergrowth && printf 'UG_HOST=0.0.0.0\n' > ~/.config/undergrowth/settings
   ```

5. **Log out and back in once**, so the permission to use Bluetooth takes
   effect.
6. Once the map is open (after the next part), name it: **⚙ → Configure
   This Node**, **Map Name** *Greenhouse PC*.

### Starting with the computer

Undergrowth only watches while it's running, so it runs as a service: it
starts when the computer starts, with nobody logged in, and starts again by
itself if it stops. If Undergrowth is open in a terminal window, close that
window first. Then paste this whole block into a terminal:

```bash
mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/undergrowth.service <<'EOF'
[Unit]
Description=Undergrowth

[Service]
ExecStart=/bin/bash %h/undergrowth/linux/start.sh
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
EOF
systemctl --user daemon-reload
systemctl --user enable --now undergrowth
sudo loginctl enable-linger $USER
```

The last line asks for the computer's password. It lets the service run
before anyone logs in.

- The **Undergrowth** icon now just opens the map in the browser.
- To see what it's doing: `journalctl --user -u undergrowth -f` (Ctrl + C to
  stop watching).
- To stop or start it by hand: `systemctl --user stop undergrowth`, or
  `start`.

Also in **System Settings → Power Management**: *Suspend when inactive*
**Never**, on AC power. And in the computer's BIOS (press **F2** while it
starts, on a NUC): *After Power Failure* → **Power On**.

Double-click **Undergrowth** to open the map, and name the computer as in
step 6 above.

Test it: pull the power cord, plug it back in, and don't touch anything. After
a minute or two, the map should open from the **Undergrowth** icon.

### Bluetooth

In a terminal:

```bash
bluetoothctl show
```

It should say **Powered: yes**. If it says *No default controller available*,
the computer's Bluetooth is off or missing: turn it on in the BIOS, or plug in
a USB Bluetooth adapter.

## 2. Install Undergrowth on the tablet

1. Join the tablet to the same Wi-Fi as the computer.
2. Follow [Installing on Android](install-on-android.md).
3. Name it: **⚙ → Configure This Node**, **Map Name** *Greenhouse tablet*.
4. Android **Settings → Apps → Undergrowth → Battery**: **Unrestricted**.
   Keep the tablet plugged in.

> **The app has to be open on the tablet.** While it runs, a notification
> says *Undergrowth is running*. It doesn't start by itself when the tablet
> turns on, so after the tablet restarts, someone opens the app once. Tell the
> grower.

## 3. Two nodes

There are now two Undergrowth nodes, each with its own records and its own
map: *Greenhouse PC* and *Greenhouse tablet*. Each shows itself on its own
map. They don't share anything yet, and won't until they trust each other.

## 4. Let them trust each other

Nodes share only with nodes in an **authentication cluster** with them.

On the computer:

1. Open **Nodes → + Add Node**. Under **Scanning…**, *Greenhouse tablet*
   shows up within a few seconds, found on Wi-Fi. (The app has to be open on
   the tablet.)
2. Press its **Wi-Fi** icon, so it's chosen, then **Add**.
3. **Name the new authentication cluster**: *Greenhouse crew*. Name the group,
   not a place: whoever's devices should see this greenhouse's readings.
   Press **Start the cluster and add**.
4. Both screens show the same six-digit number. Check they match, then press
   **Yes, that's it** on the computer and on the tablet.
5. The tablet says it's now in *Greenhouse crew*. Within a few seconds each
   shows the other on its map.

Start it from the computer, not the tablet: the node that starts a cluster
owns its name, and the computer is the one that stays.

### Why this matters

- **Nothing is shared with a stranger.** A device outside the cluster gets a
  hello from these nodes and nothing else, even on the same Wi-Fi.
- **The six-digit number** is why it's safe: it proves the device you're
  adding is the one in front of you, not a neighbour's answering in its place.
- **It's how anything joins later.** A replacement tablet, or a second
  computer, is added the same way, from any member. Only nodes that run
  Undergrowth (the computer and the tablet) join; thermometers belong to the
  computer that hears them.
- A node can be in more than one authentication cluster, and each is kept
  apart. That matters later, for working with others; here, one is enough.

**⚙ → Authentication clusters** on either screen lists *Greenhouse crew* and
its two members.

## 5. The thermometers, as nodes

Do one thermometer at a time, on the computer, so you know which is which.

1. Put the batteries in the first Govee. Its screen comes on.
2. Hold it next to the computer. On **Nodes → + Add Node**, it shows up under
   **Scanning…** within a minute, with a reading.
3. Check the reading against your trusted thermometer. A degree or two out is
   normal for these; much more, and use a spare.
4. Name it *Grow room 1 thermometer* and press **Add**. It's now a node:

   ```
   Grow room 1 thermometer ─Bluetooth→ Greenhouse PC
   ```

5. Put a piece of tape on its back saying *Grow room 1*.
6. Do the same for the second one, as *Grow room 2 thermometer*.

On the tablet, both thermometers appear too, greyed out: they're copies,
because the computer owns them. To change them, use the computer. See
[Who can change what](sharing.md#who-can-change-what).

## 6. A quick graph

Before putting the thermometers in the rooms, check readings arrive.

1. On the computer, open **Graphs** and make a new graph, *Grow rooms*.
2. Add both thermometers' **temperature** on the left and **humidity** on the
   right.
3. Dots appear every minute or so. Breathe on one thermometer: its humidity
   jumps.
4. On the tablet, make the same graph. The same dots should appear there,
   a few seconds later. That proves the tablet is getting the readings.

Now place the thermometers:

- At plant height, in the middle of the room, out of direct sun and away from
  heaters, fans and misters. Not touching the wall.
- Leave the graph open for ten minutes. A gap in the dots means that
  thermometer is out of range: move the computer closer, or the thermometer
  nearer the door.

## 7. The rooms

Now group the nodes. On the computer:

1. **Clusters → + Add Cluster**: *Greenhouse*, type **greenhouse**. Put it on
   the map where the greenhouse is.
2. **+ Add Cluster** twice more: *Grow room 1* and *Grow room 2*, type
   **room**. For the position, press **＋** and tick *Greenhouse*. Untick
   **Show on Map**; the greenhouse stands for its rooms.
3. **Edit / Membership** on *Greenhouse*, and tick both rooms.
4. On **Nodes**, edit each thermometer: position from its room, **Show on
   Map** unticked, and under **Belongs to Clusters** tick its room.
5. On **Clusters**, press **▸** beside each room, **＋**, and add its
   thermometer's temperature, humidity and battery. Then **▸** beside
   *Greenhouse* and add both rooms' displays, so one screen shows both.

*Greenhouse* is an ordinary cluster: it says how things are arranged, and
grants nothing. *Greenhouse crew* is the one that decides who sees what.

This is the same shape as a tank house and its tanks. See
[Walkthroughs](walkthroughs.md#2-a-new-crab-tank).

## 8. The alerts

Alerts are raised on the node the mission is on, and the tablet is the screen
people look at, so make these **on the tablet**, under **Missions**. Point each
at *Greenhouse*, so it covers both rooms, and any room added later.

| When | Limits | Why |
|---|---|---|
| A reading goes out of range: temperature | 65–85 °F, **only if it lasts** 10 minutes | A heater or vent stuck. Opening the door for a moment isn't. |
| A reading goes out of range: humidity | 40–70 %, **only if it lasts** 10 minutes | Misters or dehumidifier stuck. |
| A reading goes out of range: battery | below 20 % | Time for new batteries, before it goes quiet. |
| A sensor stops reporting | 30 minutes | Dead battery, moved out of range, or the computer stopped hearing it. |

Test each room: on the **computer**, set the thermometer's temperature to
95 °F by hand ([Manual override](manual-override.md)). After the 10 minutes a
red alert comes up **on the tablet**, marked *set by hand*. Release the
override on the computer, and **Acknowledge** the alert on the tablet.

> Missions watching readings from another node haven't been tried much yet. If
> the alert doesn't come up on the tablet, make the same missions on the
> computer too, and write it down under [Problems and ideas](#problems-and-ideas).

Alerts show on the screen: the red **⚠ alerts** button, and the room flagged
in red. **Nobody is texted or emailed yet**, so someone has to look. Tell the
grower that.

## 9. A report that proves it works

On the computer, open **Reports → + New report**, and call it *Greenhouse
install check*. Set **Covers** to *today*. Then add tiles
([Reports](reports.md#making-a-report)):

| Tile | Set up | It shows |
|---|---|---|
| **Heading** | *Greenhouse install check, {date}* | |
| **Table of readings** | Both rooms' temperature and humidity, with the limits from step 8 | Latest, lowest and highest, and time outside the limits |
| **Graph** | The *Grow rooms* graph from step 6 | Every reading since the install, with the alert tests marked |
| **Outages** | At least 10 minutes | Any time a thermometer went quiet. Ideally none after placing them. |
| **Events from Logs** | | The introduction, the alert tests, and the changes by hand |
| **Text** | The version at the top of each screen, computer and tablet | |
| **Signature lines** | | Who installed it, and when |

Save it as a PDF and leave a copy with the grower. Open it again tomorrow: the
graph should have no gaps overnight.

## Before you leave

- [ ] Both thermometers have readings less than two minutes old, on both
      screens.
- [ ] Each room's alert was tested on the tablet and acknowledged.
- [ ] The computer came back by itself after pulling the power.
- [ ] The install report is saved.
- [ ] The grower knows: the app has to be open on the tablet; nobody is
      texted; new batteries when the battery alert comes up.
- [ ] Note down the computer's address (`hostname -I`), its login, and which
      GitHub accounts are on it, and leave a copy with the grower.

## Afterwards

To update the computer, in a terminal:

```bash
systemctl --user stop undergrowth && bash ~/undergrowth/linux/update.sh; systemctl --user start undergrowth
```

Don't use the **Update Undergrowth** icon while the service is set up: the
service would start Undergrowth again halfway through the update. Then update
the tablet's app the same way it was installed. Do the computer first.
Nothing needs to be set up again.

## Problems and ideas

This is a prototype, and finding what's wrong or awkward is part of the job.
For anything that doesn't go the way this page says, or could be simpler,
write down:

- which step, and what you pressed;
- what you expected, and what happened instead;
- a photo or screenshot, and the version at the top of the screen;
- on the computer, what `journalctl --user -u undergrowth -n 50` says.

Send it to whoever set you up. Ideas for doing it differently are as welcome
as problems.

## If something goes wrong

| What you see | What to do |
|---|---|
| The tablet isn't under **Scanning…** on the computer | Is the app open on the tablet? Are both on the same Wi-Fi? |
| *It didn't go through* when adding the tablet | Try again, keeping both screens open until the number shows. |
| The numbers don't match | Press **They don't match**. Something else answered: try again, and if it happens twice, write it down. |
| **+ Add Node** says Bluetooth is off, or lists no thermometer | `bluetoothctl show`, as in step 1. Check the Govee's screen is on, and hold it next to the computer. |
| The graph on the tablet stays empty | Is the tablet in *Greenhouse crew* (**⚙ → Authentication clusters**)? Is the settings file from step 1.4 there on the computer? |
| A room's readings keep going old | Out of range. Move the computer or the thermometer closer, and check the battery. |
| Nothing after a power cut | `systemctl --user status undergrowth`, and check the BIOS setting in [Starting with the computer](#starting-with-the-computer). |
| An alert that won't go away | It's waiting for someone to press **Acknowledge**, even if the problem fixed itself. |

Also see the problem tables on [Installing on Linux](install-on-linux.md#if-something-goes-wrong)
and [Installing on Android](install-on-android.md#if-something-goes-wrong).

## Not built yet

- Hearing the thermometers on the tablet. The computer does the listening.
- Texting or emailing someone when an alert comes up.
- Opening the computer's map in another device's web browser. For now, a
  tablet or phone runs the app and joins the authentication cluster.
- Missions shared between nodes.
- The service set up by the installer. For now it's the block in
  [Starting with the computer](#starting-with-the-computer).
