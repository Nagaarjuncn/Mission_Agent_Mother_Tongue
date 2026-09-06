# 🚀 Deploying VernacLearn on Netlify

This guide explains how to deploy VernacLearn to Netlify with full support for:
- 🔊 **Text-to-Speech (TTS)** & audio playback
- 🎙️ **Microphone access** (Speech-to-Text) with HTTPS TLS security
- ⚡ **Single Page App (SPA)** client-side routing

---

## Method 1: Instant Drag & Drop (Netlify Drop — 30 Seconds)

1. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** in your browser (log in or sign up for free).
2. Drag and drop either:
   - The entire project folder (`The_Prototype_With_Cloudflared`), OR
   - The `Frontend` folder.
3. Netlify will upload and provide your live URL instantly (e.g., `https://your-site-name.netlify.app`).

---

## Method 2: Git Repository Deployment (Continuous Deployment)

1. Push your code to GitHub or GitLab.
2. In your Netlify dashboard, click **Add new site** ➔ **Import an existing project**.
3. Select your repository.
4. Netlify will automatically detect `netlify.toml`. Verify the settings:
   - **Base directory**: *(Leave blank)*
   - **Build command**: *(Leave blank)*
   - **Publish directory**: `.` (or `Frontend`)
5. Click **Deploy Site**.

---

## Files Added for Netlify

| File | Purpose |
|------|---------|
| [`netlify.toml`](file:///./netlify.toml) | Primary Netlify build configuration, security headers, microphone permission policy, and caching. |
| [`_redirects`](file:///./_redirects) | Single-page application redirect (`/* /index.html 200`) so all tabs route properly. |
| [`_headers`](file:///./_headers) | Explicit `Permissions-Policy: microphone=*` allowing browser voice recognition and CORS headers. |

---

## 🎙️ Speech & Microphone Permissions

Netlify automatically provides free SSL/HTTPS certificates. Because modern browsers require HTTPS to enable microphone access (`navigator.mediaDevices.getUserMedia` & `webkitSpeechRecognition`), deploying on Netlify enables **mobile phone microphone testing** immediately without extra certificate setup!

---

## ⚡ Connecting a Remote AI Backend (Optional)

Even without a backend running, VernacLearn runs **100% offline with client-side vernacular pedagogy and Google Translate audio synthesis**.

If you also host your Python FastAPI backend (e.g. on [Render](https://render.com), Railway, or Cloudflare Tunnel):
1. **Option A: URL Query Parameter**  
   Append `?backend=https://your-backend-url.com` to your Netlify URL:  
   `https://your-site.netlify.app/?backend=https://your-backend-url.com`
2. **Option B: LocalStorage**  
   In your browser console on the Netlify site:  
   `localStorage.setItem('vernac_backend_url', 'https://your-backend-url.com')`
3. **Option C: Netlify Proxy Rewrite**  
   In `_redirects`, uncomment and add:  
   `/api/*  https://your-backend-url.com/api/:splat  200`  
   `/health https://your-backend-url.com/health  200`
