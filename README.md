# 🎓 internVerse — Smart Internship Matching & Candidate Portal

> **Learn. Grow. Get Hired.**  
> Futuristic, AI-assisted internship matching platform for students across all academic streams with 3D motion design, cloud-synced database, recruiter dialogue simulation, and developer portfolio generation.

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://interrship-app.vercel.app)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js-000000?style=for-the-badge&logo=threedotjs)](https://threejs.org)

🌐 **Live Production App:** [https://interrship-app.vercel.app](https://interrship-app.vercel.app)  
🖥️ **Candidate Portal & Desktop Workspace:** [https://interrship-app.vercel.app/app.html](https://interrship-app.vercel.app/app.html)

---

## 🚀 Key Features

### 1. 🎯 AI Smart Match & Auto-Apply Algorithm
- Multi-variable weighted scoring matching student stream, verified skills, and academic CGPA against 160+ curated internships.
- Transparent match percentages with skill requirement breakdown and eligibility checks.
- One-click **Auto-Apply by Top Percentage** to instantly queue and track top opportunities.

### 2. 💬 AI Recruiter Dialogue & Instant WhatsApp Offer
- Real-time simulated interview dialogue with company hiring managers across 4 assessment phases.
- Fast-track credential verification and stipend/duration term negotiation.
- **Candidate Selection Card:** Automatically triggers selection notifications and one-click dispatch of formal offer letters directly to **WhatsApp** (`https://wa.me/?text=...`).

### 3. ✉️ Cold Pitch & Resume Email Generator
- One-click generated tailored emails across 3 outreach modes:
  - 🧊 **Cold Application:** Comprehensive introductory pitch highlighting coursework & key repos.
  - ⏰ **Follow-Up:** Polite 5-7 day milestone check-in.
  - 💼 **LinkedIn InMail / DM:** Punchy outreach for hiring leads and tech founders.
- Instant integration with local default mail client (`mailto:`) and WhatsApp sharing.

### 4. 🎨 AI Developer Portfolio Builder
- Single-file responsive personal website generator based on candidate profile.
- 4 interactive visual themes:
  - 🟣 **Cyberpunk Neon**
  - ⚪ **Clean Minimalist**
  - 🟢 **Terminal Matrix**
  - 🔵 **Creative Indigo**
- Live iframe preview, interactive project showcase, and 1-click `.html` download.

### 5. 🪐 Advanced 3D Motion Design & UI
- **Three.js Interactive Hero Scene:** Holographic 3D gyroscopic orbital rings with interactive starfield galaxy responding to cursor parallax.
- **3D Card Perspective Tilt:** Dynamic CSS 3D transforms with moving specular light reflections on mouse hover.
- **Ambient Glowing Cursor Follower & Floating Orbs:** Neon ambient lighting and glassmorphism with GPU-accelerated 60 FPS transitions.
- **Full Desktop Sidebar & Mobile Bottom Navigation:** Dual-pane layout for monitors/laptops and fluid bottom drawer navigation on mobile devices.

### 6. 🔒 Cloud Database & Authentication (Supabase)
- **Google OAuth Sign-In** & **Mobile SMS OTP** authentication.
- Real-time profile synchronization (`public.student_profiles`).
- Persistent cloud application tracking across saved, applied, interviewing, and offer states (`public.applications`).

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Glassmorphic System, 3D CSS Transforms), Vanilla JavaScript (ES6+).
- **3D & Animation:** [Three.js](https://threejs.org/) WebGL Engine, IntersectionObserver API, requestAnimationFrame lerp physics.
- **Backend / Database:** [Supabase](https://supabase.com) (PostgreSQL, Supabase Auth, Row Level Security, Edge APIs).
- **Deployment:** [Vercel](https://vercel.com) (Global Edge CDN, HTTPS, Instant CI/CD).
- **Core CLI / C Engine:** ANSI-styled C matching engine (`internship_agent.c`).

---

## 📂 Project Structure

```text
├── internverse-web/
│   ├── index.html            # Main 3D landing page, smart matcher & catalog
│   ├── app.html              # Candidate portal & desktop function workspaces
│   ├── supabase-client.js    # Shared Supabase Auth & PostgreSQL client
│   ├── logo.png              # 3D brand logo asset
│   └── favicon.png           # App icon
├── internship_agent.c        # High-performance C matching agent
├── supabase_setup.sql        # Database schema, RLS policies, tables
├── vercel.json               # Vercel deployment configuration
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```

2. **Run a local development server:**
   ```bash
   # Using Python
   python -m http.server 3000 --directory internverse-web

   # Or using Node
   npx serve internverse-web -p 3000
   ```

3. **Open in browser:**
   ```text
   http://localhost:3000
   ```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
