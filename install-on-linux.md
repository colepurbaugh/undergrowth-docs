# Installing on Linux

This page goes step by step through putting Undergrowth on a Linux computer,
such as Ubuntu or Linux Mint, for someone who hasn't used a terminal much.
It takes about half an hour, and the computer needs internet the whole time.

Undergrowth hasn't been tried on many Linux computers yet. If a step doesn't
go the way this page says, write down exactly what the screen shows and look
under [If something goes wrong](#if-something-goes-wrong).

## What you need

- A Linux computer with internet.
- A GitHub account. Undergrowth's code is not public, so ask to be added to
  the Undergrowth repository first, and accept the invite in the email GitHub
  sends.

## Opening a terminal

The terminal is a window where you type commands. Open it with
**Ctrl + Alt + T**, or find *Terminal* in the applications menu.

Type each command below (or copy and paste it; in a terminal, paste is
**Ctrl + Shift + V**), then press **Enter**. Wait until the line ending in `$`
comes back before you type the next one. Commands that start with `sudo` ask
for the computer's password. Nothing shows while you type it, which is normal.

## 1. Install the tools

Git fetches the code, GitHub's `gh` tool logs you in, and the build tools are
needed in case anything has to be compiled:

```bash
sudo apt update
```

```bash
sudo apt install -y git gh curl build-essential python3
```

## 2. Install Node.js

Undergrowth runs on Node.js. The version that comes with Ubuntu and Mint is
usually too old, so get the current long-term version from NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
```

```bash
sudo apt install -y nodejs
```

Check it worked:

```bash
node -v
```

It should print a version, such as `v24.11.0`. It needs to be at least 22.

## 3. Log in to GitHub

```bash
gh auth login
```

It asks a few questions. Use the arrow keys and **Enter**:

1. *Where do you use GitHub?* **GitHub.com**
2. *Preferred protocol?* **HTTPS**
3. *Authenticate Git with your GitHub credentials?* **Yes**
4. *How would you like to authenticate?* **Login with a web browser**

It shows a code like `ABCD-1234`. Press **Enter**, a browser opens, type the
code in, and approve. The terminal then says you're logged in.

## 4. Get the code

This puts Undergrowth in a folder called `undergrowth` in your home folder:

```bash
cd ~
```

```bash
git clone https://github.com/colepurbaugh/undergrowth.git
```

If it says *Repository not found*, the invite hasn't been accepted yet, or
you're logged in to a different account (step 3).

## 5. Install and build

The node service first. `npm install` fetches the pieces Undergrowth is built
from, and takes a few minutes:

```bash
cd ~/undergrowth/node-service
```

```bash
npm install
```

Then the dashboard, the part you look at. `npm run build` makes it into
pages the node service hands out:

```bash
cd ~/undergrowth/dashboard
```

```bash
npm install
```

```bash
npm run build
```

Warnings in yellow are fine. Errors in red are not; see below.

## 6. Start Undergrowth

```bash
cd ~/undergrowth/node-service
```

```bash
npm run dev
```

After a few seconds it prints `UNDERGROWTH NODE` and a few lines ending in
`:3001/api/node`. Open a web browser
and go to **http://localhost:3001**. That's Undergrowth.

**Leave the terminal window open.** Closing it, or pressing **Ctrl + C** in it,
stops Undergrowth. Your records are kept in `~/undergrowth/runtime/` and are
still there next time.

To look around, follow [A first look around](getting-started.md#a-first-look-around).

## Starting it again later

After the computer restarts, open a terminal and run the two commands from
step 6 again.

## Getting the newest version

When there's a new version, stop Undergrowth (**Ctrl + C**), then:

```bash
cd ~/undergrowth
```

```bash
git pull
```

```bash
cd ~/undergrowth/node-service && npm install
```

```bash
cd ~/undergrowth/dashboard && npm install && npm run build
```

Then start it again as in step 6. The version number at the top of every
screen should go up. `git pull` only changes the code. Your records in
`runtime/` stay as they are.

## Using it from a phone or another computer

To reach Undergrowth from a phone on the same Wi-Fi, start it like this
instead:

```bash
cd ~/undergrowth/node-service
```

```bash
UG_HOST=0.0.0.0 UG_NAME=greenhouse-pc npm run dev
```

`UG_NAME` is the name other computers see, so pick your own. Find this
computer's address with:

```bash
hostname -I
```

The first number, such as `192.168.1.50`, is the address. On the phone, go to
`http://192.168.1.50:3001`. Undergrowth has no login yet, so only do this on
your own Wi-Fi.

## Plugging in a board

If you plug in an ESP32 board over USB, Linux only lets you use it once you're
in the `dialout` group. Run this once, then log out and back in:

```bash
sudo usermod -aG dialout $USER
```

## If something goes wrong

| What you see | What to do |
|---|---|
| `command not found: node` or `npm` | Step 2 didn't finish. Run it again. |
| `node -v` prints something below `v22` | The old version is still in the way. Run step 2 again, then close the terminal and open a new one. |
| *Repository not found* or *Authentication failed* | Accept the GitHub invite, then run `gh auth login` again. |
| `npm install` fails with `gyp` or `make` errors | Run step 1 again, then `npm install` again. |
| *address already in use* | Undergrowth is already running in another terminal window. Use that one, or press **Ctrl + C** there first. |
| The browser says it can't connect | Check the terminal window is still open and shows `UNDERGROWTH NODE`. |
| The page is blank or out of date after an update | Run `npm run build` in `~/undergrowth/dashboard` again. |

If none of these fit, take a photo of the terminal window and send it to
whoever set you up.
