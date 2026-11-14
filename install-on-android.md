# Installing on Android

This page puts the Undergrowth app on an Android phone or tablet. The app is
the full Undergrowth, the same as on a computer: it keeps its own records, and
places itself on the map with the phone's GPS and compass. It takes about ten
minutes.

Undergrowth isn't in the Play Store yet. You download the app from the
Undergrowth repository on GitHub, and Android asks you to allow that once.

## What you need

- An Android phone or tablet with **Android 8 or newer**, and a 64-bit
  processor. Nearly every phone made since 2017 has one. See
  [Hardware compatibility](hardware-compatibility.md#phones-and-tablets).
- About 200 MB free.
- A GitHub account. Undergrowth's code is not public, so ask to be added to
  the Undergrowth repository first, and accept the invite in the email GitHub
  sends.

## Installing

1. On the phone, open the browser (Chrome, for example) and sign in at
   **github.com**.
2. Go to the newest release:

   **https://github.com/colepurbaugh/undergrowth/releases/latest**

3. Under **Assets**, press **undergrowth-3.8.0.apk** (the number is the
   version, and will be higher later). If the browser asks whether to keep
   the file, press **Download anyway**.
4. When it has downloaded, press **Open** in the browser, or find the file in
   the **Files** app under **Downloads**.
5. Android says the browser isn't allowed to install apps. Press
   **Settings**, turn on **Allow from this source**, and go back.
6. Press **Install**. If Google Play Protect says it doesn't recognise the
   app, press **More details**, then **Install anyway**.
7. Press **Open**.

The **Undergrowth** icon is now with the phone's other apps.

## The first time it opens

1. It asks for this phone's **location**. Choose **Precise** and **While
   using the app**. That's how it puts the phone on the map.
2. On Android 13 and newer it asks to send **notifications**. Allow it: the
   notification is how Undergrowth keeps running with the screen off.
3. The map opens. The phone is already a node, named after its model, such
   as *Pixel 2*, with an arrow pointing where the top of the phone faces.

To give it your own name, open **⚙**, press **Configure This Node**, and
change **Map Name**.

To look around, follow [A first look around](getting-started.md#a-first-look-around).

## Using it

While Undergrowth is open, a notification says **Undergrowth is running**. It
keeps recording the phone's position and sharing with your other computers,
even with the screen off.

- **Stop** in that notification closes Undergrowth completely.
- Pressing the **Undergrowth** icon starts it again.
- It doesn't start by itself when the phone turns on.

Your records are kept inside the app on this phone, and are still there next
time.

**Uninstalling the app deletes them.** To keep a copy first, archive them on
the [Data](data.md) page.

## Getting the newest version

Download the newest release the same way, from
**https://github.com/colepurbaugh/undergrowth/releases/latest**, open it, and
press **Update**. Your records stay as they are. The version number at the
top of every screen should have gone up.

Don't uninstall the old app first. Updating keeps everything; uninstalling
doesn't.

## Sharing with your other computers

The app listens on the phone's Wi-Fi, so computers on the same network find
it by themselves under **⚙ → Sharing**. See
[Sharing between computers](sharing.md#adding-a-computer). Undergrowth has no
login yet, so only use it on your own Wi-Fi or the phone's own hotspot.

## If something goes wrong

| What you see | What to do |
|---|---|
| GitHub says *404* or *Page not found* | Sign in to github.com on the phone, and check you accepted the invite to the repository. |
| *There was a problem parsing the package* | The download didn't finish, or the phone is older than Android 8. Download it again. |
| *App not installed* or *conflicts with an existing package* | There's already an Undergrowth app that was signed differently, such as one built on another computer. Don't uninstall it before archiving its records, and ask whoever set you up. |
| The phone isn't on the map | Android **Settings → Apps → Undergrowth → Permissions → Location**: choose **Allow only while using the app** and **Use precise location**. Then go outside, or near a window. |
| The arrow points the wrong way | Wave the phone in a figure 8 to settle its compass. |
| Undergrowth stops on its own | Android **Settings → Apps → Undergrowth → Battery**: choose **Unrestricted**. |
| The screen is blank after opening | Wait a few seconds; the first start after installing or updating takes longest. If it stays blank, press **Stop** in the notification and open it again. |

If none of these fit, take a screenshot and send it to whoever set you up.

## Making a release

This part is for whoever builds the app. The app is built on a Windows
computer with the Android tools set up (see `android/build-app.mjs` in the
Undergrowth code):

```
node android/build-app.mjs --release
```

That makes `android/build/undergrowth-<version>.apk`. Attach it to a new
release on GitHub (**Releases → Draft a new release**), with a tag such as
`v3.8.0`.

Every version must be signed with **the same key**,
`%LOCALAPPDATA%\Android\undergrowth.keystore`. A phone only updates to an app
signed with the key it already has. Signed with any other key, the old app has
to be uninstalled first, and the phone's records go with it. Keep a copy of
that file somewhere other than this computer, and never make a new one.
