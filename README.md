# Training Feedback — GitHub Pages + Google Sheets

Multi-session feedback system. One repo, one Google Sheet, unlimited sessions.

## File structure

```
/
├── index.html              ← Landing page (lists all sessions)
├── config.js               ← ONLY FILE TO EDIT: paste Apps Script URL here
├── Code.gs                 ← Paste into Google Apps Script
├── assets/
│   ├── style.css           ← Shared styles for all pages
│   └── form.js             ← Shared JS utilities
└── sessions/
    ├── ai-engineering.html     ← AI session feedback form
    ├── git-best-practices.html ← Git session feedback form
    └── new-session.html        ← Copy either file to add a new session
```

## Setup (one-time)

### 1. Google Sheet
Create a blank Google Sheet at sheets.google.com. Leave it empty — tabs and headers are created automatically on first submission.

### 2. Apps Script
1. In the Sheet: **Extensions → Apps Script**
2. Delete existing code, paste everything from `Code.gs`
3. **Save** (Ctrl+S)
4. **Deploy → New deployment**
5. Gear icon → **Web app**
6. Execute as: **Me** · Who has access: **Anyone**
7. Click Deploy → copy the `/exec` URL

### 3. config.js
Replace `PASTE_APPS_SCRIPT_URL_HERE` with the URL from step 2. That is the only file to edit.

### 4. GitHub Pages
1. Create a public GitHub repo named `feedback` under `zaartha`
2. Upload all files (keep the folder structure)
3. **Settings → Pages → Deploy from branch → main / (root)**
4. Live at: `https://zaartha.github.io/feedback/`

---

## Adding a new session

1. **Copy** `sessions/ai-engineering.html` → `sessions/topic.html`
2. **Edit** the copy:
   - Change the `<title>` and `<h1>`
   - Change the `value` on `<input type="hidden" name="session" ...>` — this becomes the sheet tab name
   - Update the accent color in the `<style>` block (3 CSS variables)
   - Update the questions and checkboxes
3. **Add a card** on `index.html` pointing to the new file
4. **Add column definitions** in `Code.gs` under `SHEET_COLUMNS` and `FIELD_MAP` (or the default columns will be used)

No other changes needed — the Sheet tab is created automatically on first submission.

---

## How responses appear in the Sheet

Each session name becomes a separate tab, created automatically on first submission. Columns match the session's field definitions in `Code.gs`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Apps Script URL not set" | Open `config.js` and paste the URL |
| Responses not landing | Make sure the URL ends in `/exec` not `/dev` |
| New session using wrong columns | Add an entry to `SHEET_COLUMNS` and `FIELD_MAP` in `Code.gs` then redeploy |
| Pages not updating | Wait ~1 min after pushing, or check the Actions tab for errors |

---

## Links

- Live site: `https://zaartha.github.io/feedback/`
- Repo: `https://github.com/zaartha/feedback`

<!-- reviewed May 2026 -->
