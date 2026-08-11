# 15. Deployment Architecture

The application is built for straightforward deployment across modern cloud platforms.

## Production Targets
- **Frontend SPA**: Built to static HTML/JS via `npm run build`. Deployed to **Vercel** or **Netlify**. Requires setting the `VITE_API_BASE_URL` environment variable to the backend host.
- **Backend API**: Deployed as a web service to **Railway** or **Render**. Configured via `DATABASE_URL` and `JWT_SECRET`.
- **Database**: Hosted on **Supabase**. Connections must point to the IPv4 Transaction Pooler (Port 6543) ensuring serverless/container restarts don't exhaust DB connections.
- **Documentation**: Hosted statically via **GitHub Pages**.

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
