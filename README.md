# 🌟 Sahana Frontend

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()  
[![Hosted on Vercel](https://img.shields.io/badge/hosted%20on-Vercel-black?logo=vercel)](https://sahana-drab.vercel.app)  
[![Backend API](https://img.shields.io/badge/backend-FastAPI-blue?logo=fastapi)](https://sahana-backend-856426602401.us-west1.run.app/docs)

> Sahana is a community-driven meetup and event discovery platform where users can connect, host, and attend events based on their interests and location.

---

## 🚀 Live App

🌐 **Frontend**: [https://sahana-drab.vercel.app](https://sahana-drab.vercel.app)  
🔗 **Backend API**: [https://sahana-backend-856426602401.us-west1.run.app/docs](https://sahana-backend-856426602401.us-west1.run.app/docs)

---

## 🧰 Tech Stack

- **React.js + Vite**
- **Material UI**
- **Redux Toolkit**
- **React Router**
- **Axios**
- **Vercel** for frontend hosting
- **FastAPI** backend (Google Cloud Run)

---

## 🛠️ Getting Started

```bash
git clone https://github.com/rajeshsawant98/sahana-frontend.git
cd sahana-frontend
npm install
npm run dev
```

### 🌱 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=https://sahana-backend-856426602401.us-west1.run.app/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> ⚠️ Note: `REACT_APP_*` is no longer supported — use `VITE_*` prefix with Vite.

---

## 🧪 Available Scripts

```bash
npm run dev     # Start local dev server (http://localhost:5173)
npm run build   # Build for production (outputs to /build)
npm run preview # Preview production build locally
```

---

## 🎯 Features

- ✅ Google SSO & email-password login
- ✅ Interest-based event recommendations
- ✅ Location-aware event discovery
- ✅ Create, update, join, and review events
- ✅ Friend system to connect with users
- ✅ Calendar integration (upcoming)

---

## 🛫 Deployment Notes

- Deployed on **Vercel** using Vite
- Ensure these are set in Vercel → Environment Variables:
  - `VITE_BACKEND_URL`
  - `VITE_GOOGLE_MAPS_API_KEY`
- CORS must be enabled on the backend for both `localhost:5173` and your Vercel domain
- Add `vercel.json` for React Router fallback:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/" }
    ]
  }
  ```

---

## 📖 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [Material UI](https://mui.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [FastAPI Docs](https://sahana-backend-856426602401.us-west1.run.app/docs)

---

## 📬 Contact

Created by [Rajesh Sawant](https://github.com/rajeshsawant98) — feel free to reach out!
