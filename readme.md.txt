# 🧠 MailMind — AI Email Summariser PWA

A functional, serverless Progressive Web App (PWA) that processes and optimizes email summaries via Google Gemini. It parses strings completely within the client browser workspace, learns priority structures dynamically, and is deployable as a standalone app layout.

## ✨ Technical Highlights

- **Installable PWA Interface**: Launches full-screen natively on iOS and Android devices, utilizing service workers for lightning-fast presentation scaling.
- **Adaptive Gemini Stream Engine**: Connects directly with the free `gemini-2.5-flash` endpoint via progressive browser token streams.
- **Custom Sifting Router**: Monitors incoming senders, system strings, or keyword parameters to dynamically change the priority weights of your inbox.
- **100% Data Confidentiality**: Zero remote database engines. Security credentials, preference choices, and tokens live entirely inside the user's localized browser storage environment.

## 🚀 Deployment Instructions

1. Place the core files (`index.html`, `sw.js`, `manifest.json`) inside your web workspace directory.
2. Initialize your project environment using a clean hosting gateway (e.g., VS Code Live Server, GitHub Pages, or Vercel).
3. Access the application portal link, select **Configure Free Gemini Engine** to assign your verification credentials, and begin processing streams.

## ⚙ Customization Configuration

| Variable Parameter | Targeting Options | Default Staging Value |
|---|---|---|
| AI Engine Selection | Gemini 2.5 Flash / Flash Lite | Gemini 2.5 Flash |
| Text Target Horizons | Brief / Standard / Detailed | Standard |
| Context Synthesis Tone | Casual & Direct / Professional / Terse | Casual & Direct |
| Priority Senders | Comma-delimited strings | coordinator, yashika |
| Priority Keywords | Comma-delimited phrases | deadline, submission, project |