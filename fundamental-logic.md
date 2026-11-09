# Fundamental logic

[← Guide](README.md)

This page is the yardstick for Undergrowth. Every new feature should fit
the rules below. If something doesn't fit, the feature changes, or this
page changes on purpose. A rule should never be bent quietly.

Some of it is built and some is planned. [What's built today](#whats-built-today)
at the end shows which is which.

## Three things

Everything in Undergrowth is one of three things:

| | What it is | Examples |
|---|---|---|
| **Node** | One thing, not broken into parts. | A GPS, a pump, a grow light, a moisture sensor, a dock. |
| **Cluster** | A group of nodes or other clusters. | A boat (its GPS, motor and radios), a greenhouse (its lights, fans and sensors), a bed of baskets. |
| **Mission** | What should happen between nodes and clusters, and how urgent it is. | "At 6:00, ease the lights up." "If it gets too hot, turn the lights off, run the fans and alert someone." |

There is no fourth kind of thing. A boat, a greenhouse and a tank house are all
clusters. A safety alarm, a schedule, a navigation plan and a colour on a
display are all missions.

## Nothing is guaranteed to answer

- **Every reading carries the time it was taken,** and shows its age. An old
  reading still counts, but less.
- **A node may never reply.** Undergrowth can ask for a reading or send a
  command, but it never assumes an answer will come.
- **A missing answer is information, not a failure of the system.** A mission
  can act on it ("the lights didn't confirm the shut-off").
- **Positions are optional.** A whole operation can run with no GPS at all.
  The map is useful when lots of things move around, or when there are several
  sites. It's never required: everything works from Nodes, Clusters, Missions
  and Logs.

## Missions

### One kind of mission

Every mission has the same three parts:

| Part | What it is | Examples |
|---|---|---|
| **When** | A clock time or a window of time, or a condition on readings. | 6:00 to 18:00. Temperature above 85 °F. Moisture below 30%. |
| **Do** | One or more actions. | Set or ease a value. Alert a person. Tell a person what to do. Colour a display. |
| **Priority** | A number. **1 is the most urgent.** | Harm right now is 1. Normal operation is 2. Displays are 3. |

There are no "safety missions", "schedule missions" or "rescue missions". An
alarm is a mission whose *do* is "alert", set to priority 1. Ranking jobs
like this is how a colony game sets work priorities. You don't give each
worker a contingency plan. You say "putting out fires before farming".

Two missions may share a priority when they never want the same output, such
as *overheat* and *over-watered* in the example below.

### A mission stays in effect while its "when" is true

"Lights on, 6:00 to 18:00" is in effect all day, not only at 6:00. That doesn't
mean it keeps sending messages. It's how the control node knows what the lights
*should* be at any moment.

Missions don't remember what they overruled. When one ends, nothing has to be
put back by hand. The control node simply asks again which mission is in charge
now.

### How the control node decides

For each output (a light, a pump, a fan), the control node:

1. **waits for something to change:** a time arriving, a reading crossing a
   line, or a mission starting, ending, or being edited;
2. **finds the highest-priority mission that is in effect** for that output;
3. **sends that mission's command, once,** and only if it differs from the
   last command it sent.

**Example.** At 14:00 the greenhouse overheats. *Overheat* (priority 1) beats
*Lights on* (priority 2), so the control node sends "lights to 0%". At 14:20
it has cooled down and *Overheat* ends. The control node asks again:
*Lights on* is in effect until 18:00, so it sends "ease lights to 20%".

If it had cooled down at 19:00 instead, *Lights off* (18:00 to 6:00) would be
in effect, and the lights would stay off.

**Same priority, same output, different wishes:** the mission that started
first keeps the output. The clash is written to Logs so the setup can be fixed.

## Commands

- **A command is one message.** For example: "Ease the lights from 20% to 0%
  over 1 hour."
- **The device does the work.** A microcontroller such as an ESP32, or the
  computer's own pins, turns the command into PWM. Undergrowth never sends
  20%… 19%… 18%.
- **Easing is for analog outputs only,** such as brightness or motor speed.
  On/off outputs just switch.
- **The newest command always wins at the device.** The device knows nothing
  about priorities. A stop command takes over immediately, even in the middle
  of an ease.
- **Priorities are decided before sending,** by the control node, never by the
  device.
- **A device may confirm a command.** The command and the confirmation, or the
  lack of one, are both written to Logs. A command with no confirmation shows
  as *unconfirmed*.

## Grow as the hardware grows

A mission is written for the equipment that exists today. As the hardware
improves, you edit the mission rather than starting over.

| Stage | The equipment | The mission |
|---|---|---|
| 1 | A moisture meter with a screen, and a pump with a switch. | A person types in the moisture reading. When it's below 30%, Undergrowth tells them to turn the pump on. |
| 2 | The moisture sensor is connected. | No more typing. A person gets an alert when the plants need water. |
| 3 | The pump is on a relay. | Undergrowth turns the pump on itself, and alerting a person becomes optional. |

Whether Undergrowth acts on its own is decided only by how the missions are
set up. Telling a person, alerting a person, or switching equipment can be in
the same mission or in separate ones.

Checking that something actually worked is a separate mission too. For
example: "If the lights should be on but the light sensor sees nothing, alert
someone."

## Displays

- **Every node and cluster has one display, blank to start.**
- **＋ under it adds a row:** a reading or a control, from the node itself or
  from anything inside the cluster, or something inside it, which opens with
  ▸ to show its own display underneath. Displays can be opened and closed;
  each device remembers which are open.
- **What a display shows is separate from what is inside what.** Putting a tank
  in a tank house doesn't change the house's display. Missions follow what is
  inside what; displays follow what you chose to show.
- **The display is the same everywhere.** It looks the same whether it's opened
  from the map, the Nodes list or the Clusters list. Changing it in one place
  changes it in all of them.
- **Colour is set by missions.** A low-priority mission can fade a display
  between two or three colours: blue when too cold, green when right, red when
  too hot. Or no colour to yellow, as more light is sensed.
- **Times show their time zone.**

## Example: a greenhouse

| Mission | Priority | When | Do |
|---|---|---|---|
| Overheat | 1 | Temperature above the safe limit | Lights off, fans on, alert |
| Over-watered | 1 | Moisture above 70% | Pumps off, alert |
| Lights on | 2 | 6:00 to 18:00 | Ease lights from 0% to 20% over 1 hour |
| Lights off | 2 | 18:00 to 6:00 | Ease lights from 20% to 0% over 1 hour |
| Water plants | 2 | Moisture drops below 30% | Pumps on for 1 minute |
| Light display | 3 | Always | Colour the light sensor from none to yellow as light rises |
| Temperature display | 3 | Always | Colour the thermometer from blue to green to red |

Nothing in it needs a position, and no mission refers to another.

## What's built today

| Rule | Status |
|---|---|
| Nodes and clusters, clusters inside clusters | Built |
| Every reading shows its age | Built |
| Positions optional | Built. Displays open from the Nodes and Clusters lists, so nothing needs the map. |
| One kind of mission: when, do, priority | Built. *When* can be always, a reading out of range, too close to a keep-out, or a sensor gone quiet. *Do* can be alert people or advise a vessel the way. |
| Clock times as a *when* | Planned |
| Priorities choosing between missions | Planned. Every mission has a priority, shown on the Missions page, but nothing competes for an output until missions send commands. |
| The control node choosing and sending commands | Planned. Today, only people send commands. |
| Easing, confirmations | Built for commands people send: a number eases as one message, and a device can confirm each command. |
| One blank display per node and cluster, the same on the map and in the lists | Built. ▸ opens it under its row in the Nodes and Clusters lists, and things inside a cluster open inside its display. Records from before keep what they showed. |
| Colour missions | Planned. Today, only alerts colour things red. |
| Time zone shown | Built. The clock in the top bar shows the Undergrowth computer's time zone, the one clock times in missions will use. |
