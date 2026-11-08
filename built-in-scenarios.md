# Built-in scenarios

[← Guide](README.md)

A scenario is a small, ready-made example to try things on. Open
**Scenarios** in the top bar and press **Start** on one. Undergrowth sets it
up in records of its own, apart from your real ones, and switches this screen
over to it. A yellow bar across the top shows you're in a scenario.

- **Nothing in a scenario touches your real records,** and nothing in it is
  shared with other computers. Your real farm keeps running underneath. If it
  raises an alert while you're in a scenario, the yellow bar says so.
- **Each scenario lists what to try.** The steps open under the yellow bar
  when you start it. **Hide steps** tucks them away, and **What to try**
  brings them back. Each card on the Scenarios page has the same steps.
- **One scenario runs at a time.** Starting another one, or pressing **Start
  again**, throws away the last one and starts fresh.
- **Leave** on the yellow bar goes back to your real records and leaves the
  scenario where it is, so **Go to it** on its card picks up where you left
  off. **End it** throws it away.

The first five are small, so there is only one thing to look at in each. The
last one has everything at once.

## Capsize test

One small boat at the dock, with a tilt sensor and a safety watch that raises
an alarm if the boat rolls past 35° for three seconds.

You set the roll by hand to 60°. Within about ten seconds a red alert comes
up, marked *set by hand*. Setting the roll back to 0° turns the alert amber:
the boat is upright again, but someone still has to acknowledge it.

More on this: [Manual override](manual-override.md),
[Safety watches](safety-watches.md).

## Crab tank goes cold

A house of three crab tanks. Each has a floating thermometer and a heater on
a remote plug. A safety watch raises an alarm if any tank drops below 42 °F.

You switch one tank's heater off. The panel shows *Sent Off* while the plug
still reports *On*, because there is no real plug in a scenario. Then you
skip ahead a few hours by setting the water temperature to 40 °F, and the
alarm goes off. Logs show the heater commands and the alert side by side.

More on this: [Tanks and controls](tanks-and-controls.md),
[Safety watches](safety-watches.md).

## Boat to a basket

One boat at the dock, a short channel route, a submerged piling beside the
channel, and three oyster baskets. A mission sends the boat to basket 2.

You move the boat around by hand and watch the plan change:

- **Near the dock:** the plan follows the channel and bends to stay 80 ft
  from the piling.
- **Out in open water:** it heads straight for the basket instead.
- **Within 30 ft of the basket:** the advice changes to *Arrived — hold
  position*.

Logs show each change of plan and why.

More on this: [Vessels and missions](vessels-and-missions.md).

## Out of radio range

A dock with Wi-Fi and a LoRa gateway, and a boat with both radios. Both of
the boat's radios report hearing the dock.

You take the boat far up the bay, and both links still show as connected. The
map only knows what the radios last reported. Then you clear what the boat's
Wi-Fi hears, as it would once it lost the dock:

- **Wi-Fi:** the link drops.
- **LoRa:** reaches much further, so it holds.

Back near the dock, the Wi-Fi link shows as *in range*: the two radios could
connect, but nothing says they have.

More on this: [Radios and connections](radios-and-connections.md).

## Rescue

Lil Toot's engine has failed up the bay, and Big Toot has a mission to reach
it. A safety watch warns if Big Toot gets within another boat's 40 ft
keep-out distance.

You bring Big Toot alongside, and there is no alarm: a boat is never warned
about the boat it was sent to. Once you mark the rescue complete, they are
just two boats 30 ft apart, and the alarm goes off.

Then you join them into one vessel, in two edits:

1. **Make Lil Toot part of Big Toot.** A boat is never warned about its own
   parts, so the alarm clears.
2. **Give Lil Toot Big Toot's position.** Wherever Big Toot goes, Lil Toot
   goes too, the way a boat under tow does.

More on this: [Vessels and missions](vessels-and-missions.md),
[Safety watches](safety-watches.md).

## The whole farm

Everything at once:

- two boats with all their parts
- a home dock
- a channel route
- keep-outs
- a bed of oyster baskets
- two houses of holding tanks
- missions and safety watches running

One crab tank has already gone cold, so there is an alert to find straight
away. Every picture in this guide was taken in this scenario.

More on this: [Getting started](getting-started.md) has a first look around
it.
