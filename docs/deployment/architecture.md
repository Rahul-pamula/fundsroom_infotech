<div class="page-header">
  <span class="category-badge">DEPLOYMENT</span>
  <h1>Deployment Architecture</h1>
  <p class="page-subtitle">The application is built for straightforward deployment across modern cloud platforms.</p>
  <hr class="header-divider" />
</div>

## Live Application

[Open Fundsroom Application →](https://fundsroom-infotech-client.vercel.app/)

Frontend: Vercel  
https://fundsroom-infotech-client.vercel.app/

## Backend API

[Open Backend API →](https://fundsroom-api-u6tm.onrender.com)

Backend: Render  
https://fundsroom-api-u6tm.onrender.com

## Production Targets

<div class="architecture-container">
  <img src="/assets/architecture/deployment-architecture.svg" alt="Deployment Architecture" />
</div>
<p class="screenshot-caption">Figure 9 — Target Deployment Architecture</p>

<div class="feature-grid">
  <div class="content-card">
    <h3>Vercel</h3>
    <p><strong>React Frontend</strong>. Built to static HTML/JS. Set to `https://fundsroom-infotech-client.vercel.app/`</p>
  </div>
  <div class="content-card">
    <h3>Render</h3>
    <p><strong>Express Backend</strong>. Deployed as a web service at `https://fundsroom-api-u6tm.onrender.com`</p>
  </div>
  <div class="content-card">
    <h3>Supabase</h3>
    <p><strong>PostgreSQL Database</strong>. Live production database via connection pooling.</p>
  </div>
  <div class="content-card">
    <h3>GitHub Pages</h3>
    <p><strong>Documentation</strong>. Hosted statically via GitHub Actions.</p>
  </div>
</div>

## Deployment Proof

<div class="feature-grid">
  <a href="https://fundsroom-infotech-client.vercel.app/" class="content-card">
    <h3>🌐 Frontend</h3>
    <p>Vercel • React + Vite<br/><strong>LIVE</strong><br/>Open Application</p>
  </a>
  <a href="https://fundsroom-api-u6tm.onrender.com" class="content-card">
    <h3>⚙️ Backend</h3>
    <p>Render • Express + Node.js<br/><strong>LIVE</strong><br/>Open API</p>
  </a>
  <div class="content-card">
    <h3>🗄️ Database</h3>
    <p>Supabase • PostgreSQL<br/><strong>Connected</strong></p>
  </div>
</div>

## Frontend Deployment — Vercel

The Fundsroom frontend is deployed on Vercel.

Live Frontend: [https://fundsroom-infotech-client.vercel.app/](https://fundsroom-infotech-client.vercel.app/)

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/vercel_screenshot.png" alt="Fundsroom frontend deployed on Vercel" />
</div>

## Backend Deployment — Render

The Fundsroom Express backend is deployed on Render.

Live Backend: [https://fundsroom-api-u6tm.onrender.com](https://fundsroom-api-u6tm.onrender.com)

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/render_screenshot.png" alt="Fundsroom backend deployed on Render" />
</div>

## Database — Supabase PostgreSQL

The application uses Supabase PostgreSQL as its production database.

<div class="premium-screenshot">
  <div class="premium-screenshot-bar">
    <div class="browser-dot dot-red"></div>
    <div class="browser-dot dot-yellow"></div>
    <div class="browser-dot dot-green"></div>
  </div>
  <img src="/assets/screenshots/supabase_screenshot.png" alt="Fundsroom PostgreSQL database on Supabase" />
</div>

## Local Development (Docker)
The workspace ships with a fully configured `docker-compose.yml` file.
To start the entire stack locally:

```bash
docker-compose up -d --build
```

