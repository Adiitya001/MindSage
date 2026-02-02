# Security – GitHub and secrets

## Never commit

- **`.env`**, **`.env.local`**, and any **`*.env.*`** (local env files with secrets)
- **Firebase service account JSON** (e.g. `mindsage-firebase.json`, `firebase-admin*.json`, `*service-account*.json`)
- API keys, tokens, or private keys in source, comments, or docs

## Setup

1. Copy `.env.example` to `.env.local`.
2. Fill values locally only. Do not commit `.env.local`.
3. For Firebase Admin, use `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON string) or a local JSON file that is git-ignored.

## Before first push

- Run: `git status` and confirm `.env.local` and `mindsage-firebase.json` do **not** appear as untracked/modified (they should be ignored).
- If either was ever committed: remove from index and history before pushing (e.g. `git rm --cached .env.local`, then amend or rewrite history).

## Config in code

- Firebase client config uses **`NEXT_PUBLIC_*`** env vars only (no keys in source).
- Botpress chat URL is **`NEXT_PUBLIC_BOTPRESS_CHAT_URL`** (optional).
- Backend secrets (e.g. `FIREBASE_SERVICE_ACCOUNT_KEY`) are read from env only, never hardcoded.

## First secure push to GitHub

1. Ensure no sensitive files are staged:  
   `git status` — `.env.local` and `mindsage-firebase.json` must **not** appear (they are ignored).
2. Stage only safe files:  
   `git add .` (ignored files will not be added).
3. Commit:  
   `git commit -m "chore: secure repo – env-based config, no secrets in source"`
4. Push to your new GitHub repository.
