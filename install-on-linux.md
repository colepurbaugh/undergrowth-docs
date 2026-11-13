# Installing on Linux

This page puts Undergrowth on a Linux computer, such as Ubuntu or Linux Mint.
You paste one line, and after that everything is a double-click. It takes
about half an hour, and the computer needs internet the whole time.

Undergrowth hasn't been tried on many Linux computers yet. If something
doesn't go the way this page says, take a photo of the screen and look under
[If something goes wrong](#if-something-goes-wrong).

## What you need

- A Linux computer with internet.
- A GitHub account. Undergrowth's code is not public, so ask to be added to
  the Undergrowth repository first, and accept the invite in the email GitHub
  sends.

## Installing

1. Open a terminal with **Ctrl + Alt + T**, or find *Terminal* in the
   applications menu.
2. Copy this whole line, paste it into the terminal with
   **Ctrl + Shift + V**, and press **Enter**:

   ```bash
   bash -c "$(curl -fsSL https://raw.githubusercontent.com/colepurbaugh/undergrowth-docs/main/get-undergrowth.sh)"
   ```

   If it says `curl: command not found`, run `sudo apt install -y curl`
   first, then paste the line again.
3. When it asks for a password, type this computer's password and press
   **Enter**. Nothing shows while you type, which is normal.
4. When it shows a code like `ABCD-1234`, copy it, press **Enter**, and paste
   the code into the GitHub page that opens in the browser. Approve, then go
   back to the terminal.
5. Wait. It fetches everything it needs, which takes a while. Green lines say
   what it's doing; yellow warnings are fine. It's done when it says
   **Undergrowth is installed**. Close the terminal.

There are now two icons on the desktop and in the applications menu:
**Undergrowth** and **Update Undergrowth**. On Ubuntu, if a desktop icon
won't open, right-click it and choose **Allow Launching** once.

## Using it

Double-click **Undergrowth**. A terminal window opens, and a few seconds later
Undergrowth opens in the browser at **http://localhost:3001**.

**Leave that terminal window open.** Closing it stops Undergrowth. Your
records are kept in `~/undergrowth/runtime/` and are still there next time.
Double-clicking the icon while Undergrowth is already running just opens the
browser again.

To look around, follow [A first look around](getting-started.md#a-first-look-around).

## Getting the newest version

Double-click **Update Undergrowth**. It stops Undergrowth if it's running,
gets the newest code, and rebuilds it, then says which version you went from
and to. Press **Enter** to close it, then double-click **Undergrowth** again.
The version number at the top of every screen should have gone up. Your
records stay as they are.

## What it set up

- `git`, `gh` (GitHub's tool), `curl`, the build tools, and Node.js, if they
  weren't there already.
- The code, in the `undergrowth` folder in your home folder.
- Permission to use USB boards such as an ESP32. It takes effect after you
  log out and back in.
- The two icons. They run `start.sh` and `update.sh` in
  `~/undergrowth/linux/`.

## Using it from a phone or another computer

Undergrowth only answers this computer at first. To reach it from a phone on
the same Wi-Fi, make a settings file:

```bash
mkdir -p ~/.config/undergrowth && printf 'UG_HOST=0.0.0.0\nUG_NAME=greenhouse-pc\n' > ~/.config/undergrowth/settings
```

`UG_NAME` is the name other computers see, so pick your own. Stop and start
Undergrowth, then find this computer's address with `hostname -I`. The first
number, such as `192.168.1.50`, is the address, and on the phone you go to
`http://192.168.1.50:3001`. Undergrowth has no login yet, so only do this on
your own Wi-Fi.

## If something goes wrong

| What you see | What to do |
|---|---|
| *GitHub didn't hand over the code* | Accept the GitHub invite, then paste the line from step 2 again. |
| The GitHub page says the code is wrong or expired | Paste the line from step 2 again to get a new code. |
| Red lines mentioning `gyp` or `make` | Paste the line from step 2 again. If it fails the same way, take a photo. |
| The Undergrowth icon opens a text file instead | Right-click it, choose **Allow Launching** (Ubuntu) or **Properties → Permissions → Allow executing** (Mint). |
| *address already in use* | Undergrowth is already running in another window. Use that one, or close it first. |
| The browser says it can't connect | Check the Undergrowth terminal window is still open. |
| *Couldn't get the newest code* when updating | Something in `~/undergrowth` was changed by hand. Take a photo. |

You can always run the installer again by pasting the line from step 2. It
skips what's already done and keeps your records.

If none of these fit, take a photo of the terminal window and send it to
whoever set you up.
