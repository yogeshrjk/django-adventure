# Django Adventure — Learn Django Like a Game (0 to 100)

Anime-style full-stack Next.js learning platform. Left panel is the story explainer and guided learning path, right panel is the Monaco code editor. Python runs live in-browser with Pyodide, submissions and hints are reviewed by AI, user progression syncs with MongoDB Atlas, and Sensei AI provides an in-game coding mentor.

## Quick start

```bash
cd "django-adventure"
npm install
cp .env.example .env.local
npm run dev
# open http://localhost:3000/play/0
```

## Features

- **101-Level Curriculum (0 to 100)**: Python basics, Django models, views, templates, forms, authentication, DRF (Django REST Framework) APIs, serializers, viewsets, and deployment.
- **Server-Side Gemini AI (`gemini-3.5-flash-lite`)**: Forges guided chapter lessons on demand, grades user submissions, provides hints, and powers the **Sensei** chatbot.
- **Python Snake Arcade Dojo**: Classic arcade Snake mini-game that runs on outline levels while Gemini forges the chapter in the background.
- **Dual Authentication & Cloud Save**: Sign in with **Google OAuth 2.0** or **Email/Password** to backup your journey and stats to MongoDB Atlas.
- **Guest / Offline Mode**: Play immediately without signing in — progress is preserved locally with milestone-based backup reminders.
- **Sensei AI Coding Mentor**: Bottom-right popup chatbot equipped with syntax-highlighted code blocks, copy actions, and a strict Python/Django programming scope guard.
- **Gem & XP Mechanics**: Earn XP to level up on the global leaderboard, and spend Gems to unlock step-by-step hints.
- **Grand Finale Celebration**: Level 100 victory modal with multi-stage confetti and mastery badges.
- **Dark Mode**: Anti-flash theme engine supporting light and dark modes across Monaco and the entire UI.

## Environment Configuration

Configure the following in `.env` or `.env.local`:

```dotenv
# 1. Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite

# 2. MongoDB Atlas Database
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
MONGODB_DB=django_adventure

# 3. Google OAuth 2.0 (Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# 4. Session Secrets
AUTH_SECRET=your-random-32-char-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Production Deployment

1. Run standard Next.js build:
   ```bash
   npm run build
   npm run start
   ```
2. In your deployment dashboard (e.g. Vercel / Railway), add all environment variables listed above.
3. In [Google Cloud Console](https://console.cloud.google.com/apis/credentials), add your production URL to **Authorized JavaScript origins** and `https://your-domain.com/api/auth/callback/google` to **Authorized redirect URIs**.
4. In [MongoDB Atlas](https://cloud.mongodb.com), ensure `0.0.0.0/0` is allowed in **Network Access**.
