<div class="page-header">
  <span class="category-badge">DEPLOYMENT</span>
  <h1>Deployment Architecture</h1>
  <p class="page-subtitle">The application is built for straightforward deployment across modern cloud platforms.</p>
  <hr class="header-divider" />
</div>

## Production Targets

<div class="architecture-container">
  <img src="/assets/architecture/deployment-architecture.svg" alt="Deployment Architecture" />
</div>
<p class="screenshot-caption">Figure 9 — Target Deployment Architecture</p>

<div class="feature-grid">
  <div class="content-card">
    <h3>Vercel</h3>
    <p><strong>React Frontend</strong>. Built to static HTML/JS. Requires setting `VITE_API_BASE_URL` to point to the backend host.</p>
  </div>
  <div class="content-card">
    <h3>Railway</h3>
    <p><strong>Express Backend</strong>. Deployed as a web service. Configured via `DATABASE_URL` and `JWT_SECRET`.</p>
  </div>
  <div class="content-card">
    <h3>Supabase</h3>
    <p><strong>PostgreSQL Database</strong>. Connections must point to the IPv4 Transaction Pooler (Port 6543) ensuring serverless restarts don't exhaust connections.</p>
  </div>
  <div class="content-card">
    <h3>GitHub Pages</h3>
    <p><strong>Documentation</strong>. Hosted statically via GitHub Actions, rendering this exact documentation site.</p>
  </div>
</div>

## Local Development (Docker)
The workspace ships with a fully configured `docker-compose.yml` file.
To start the entire stack locally:

```bash
docker-compose up -d --build
```

This brings up:
- PostgreSQL 16 (Port 5432)
- Express Backend (Port 5001) - *Updated to avoid macOS AirPlay Receiver conflict.*
- React Frontend (Port 5173)
