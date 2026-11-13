#!/usr/bin/env bash
# Gets Undergrowth onto a Linux computer (Ubuntu, Mint or another Debian-based
# one) in one go. Run it by pasting this line into a terminal:
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/colepurbaugh/undergrowth-docs/main/get-undergrowth.sh)"
#
# It installs git and GitHub's gh tool, logs in to GitHub in the browser,
# copies the code into ~/undergrowth, and runs its installer, which puts an
# Undergrowth icon on the desktop. Undergrowth's code is not public, so the
# GitHub account has to have been added to the repository first.
set -euo pipefail

repo_url="https://github.com/colepurbaugh/undergrowth.git"
dest="$HOME/undergrowth"

step() { printf '\n\033[1;32m== %s\033[0m\n' "$*"; }
fail() { printf '\n\033[1;31m%s\033[0m\n' "$*"; exit 1; }

command -v apt-get >/dev/null || fail "This needs a Debian-based Linux, such as Ubuntu or Mint."

need=()
for p in git gh curl; do command -v "$p" >/dev/null || need+=("$p"); done
if ((${#need[@]})); then
  step "Installing ${need[*]} (it asks for this computer's password; nothing shows while you type it)"
  sudo apt-get update
  sudo apt-get install -y "${need[@]}"
fi

if ! gh auth status --hostname github.com >/dev/null 2>&1; then
  step "Logging in to GitHub"
  echo "Copy the code it shows, press Enter, and paste the code into the browser page that opens."
  gh auth login --hostname github.com --git-protocol https --web
fi
gh auth setup-git --hostname github.com || true

if [[ -d "$dest/.git" ]]; then
  step "Undergrowth is already in $dest; getting the newest code"
  git -C "$dest" pull --ff-only
else
  step "Copying Undergrowth into $dest"
  git clone "$repo_url" "$dest" || fail "GitHub didn't hand over the code. Has this GitHub account been added to the Undergrowth repository, and the invite email accepted?"
fi

bash "$dest/linux/install.sh"
