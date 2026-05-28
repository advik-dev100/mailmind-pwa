# 🚀 MailMind — Deploy & Cache-Bust Guide

## Files to push to your GitHub repo

```
mailmind-pwa/
├── index.html       ← updated (cache-bust meta tags + fixed fetch)
├── manifest.json    ← NEW
├── sw.js            ← NEW
├── icons/
│   ├── icon-192.png ← you need to add this
│   └── icon-512.png ← you need to add this
└── DEPLOY.md        ← this file
```

---

## Step 1 — Push all files to GitHub

```bash
git add index.html manifest.json sw.js
git commit -m "fix: cache bust + proper SW + manifest v4"
git push origin main
```

Wait ~60 seconds for GitHub Pages to rebuild.

---

## Step 2 — Force-refresh the browser (bypass cache)

Do this in Chrome/Edge on your PC first to confirm it works:

| Action | Keys |
|---|---|
| Hard reload (clears memory cache) | `Ctrl + Shift + R` (Win) / `Cmd + Shift + R` (Mac) |
| Open DevTools → Application → Service Workers → click **Unregister** | Manual |
| Open DevTools → Application → Storage → click **Clear site data** | Nuclear option |

---

## Step 3 — Verify the new SW is running

1. Open DevTools → **Application** tab → **Service Workers**
2. You should see `mailmind-v4` as the active worker
3. If you see an old version still listed, click **Unregister**, then hard-reload

---

## Step 4 — Test Gmail fetch on mobile

1. Visit `https://advik-dev100.github.io/mailmind-pwa/` in Chrome Android
2. Tap **Sign in with Google** → approve the Gmail readonly scope
3. You should be redirected back with `#access_token=...` in the URL — the app reads it, cleans the URL, and loads your inbox

---

## How to bust the cache on every future deploy

In `index.html`, change:
```js
const APP_VERSION = 'v4'; // ← change to v5, v6, etc.
```

In `sw.js`, change:
```js
const CACHE_VERSION = 'mailmind-v4'; // ← match the above
```

Commit and push. The new SW will auto-delete old caches on activate.

---

## About the icons

The `manifest.json` references `icons/icon-192.png` and `icons/icon-512.png`.  
Create these by:
- Making a 512×512 PNG of your logo
- Using [realfavicongenerator.net](https://realfavicongenerator.net) to generate all sizes
- Put the output files into `icons/` in your repo

Without the icons, the app still works — but Android won't show a proper splash screen.

---

## Why the old 404 was happening

The original code was doing:
```
GET https://gmail.googleapis.com/...&access_token=ya29...  ← WRONG (URL param)
```

The fixed code does:
```
GET https://gmail.googleapis.com/gmail/v1/users/me/messages
Authorization: Bearer ya29...                              ← CORRECT (header)
```

Google's Gmail API rejects tokens in query strings for security reasons, causing the 404.
The new `fetchRealGmailInbox()` only ever uses the `Authorization` header.
