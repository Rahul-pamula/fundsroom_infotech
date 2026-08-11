---
layout: home

hero:
  name: "FUNDSROOM INFOTECH"
  text: "MINI ERP + CRM"
  tagline: "Operations Portal Documentation"
  actions:
    - theme: brand
      text: "Explore Documentation"
      link: "/overview/introduction"
    - theme: alt
      text: "Open Application"
      link: "#"
---

<style>
.vp-doc h2 {
  text-align: center;
  border-bottom: none;
  margin-top: 5rem;
  margin-bottom: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.home-overview {
  text-align: center;
  max-width: 700px;
  margin: -1rem auto 3rem auto;
  color: var(--vp-c-text-2);
  font-size: 1.15rem;
  line-height: 1.7;
}
.hero-architecture {
  max-width: 900px;
  margin: 0 auto;
}
.screenshot-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 768px) {
  .screenshot-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<p class="home-overview">
A modern enterprise operations platform connecting Customer Relationship Management, Inventory, Products, Stock Movements, and Sales Challans with highly secure role-based access control.
</p>

## Platform at a glance

<div class="feature-grid">
  <a href="./features/crm" class="content-card">
    <h3>👥 Customer CRM</h3>
    <p>Manage customer profiles, firm details, leads, and historical interaction workflows.</p>
  </a>
  <a href="./features/inventory" class="content-card">
    <h3>📦 Inventory & Stock</h3>
    <p>Track product catalogs, pricing, warehousing locations, and stock movements.</p>
  </a>
  <a href="./features/challans" class="content-card">
    <h3>📄 Sales Challans</h3>
    <p>Generate, draft, and confirm sales challans with integrated pessimistic locking.</p>
  </a>
  <a href="./security/authentication" class="content-card">
    <h3>🛡️ Role-Based Access</h3>
    <p>Strict authoritative boundaries enforcing permissions for Admin, Sales, Warehouse, and Accounts.</p>
  </a>
  <a href="./system-design/architecture" class="content-card">
    <h3>🏗️ System Architecture</h3>
    <p>Explore the monolithic Express backend, React frontend, and PostgreSQL 3NF schema.</p>
  </a>
</div>

## System Architecture

<div class="hero-architecture architecture-container">
  <img src="/assets/architecture/high-level-architecture.svg" alt="High-Level System Architecture" />
</div>

## Explore the System

<div class="feature-grid">
  <a href="./getting-started/quick-start" class="content-card">
    <h3>🚀 Quick Start</h3>
    <p>Bring the local stack up fast and understand the minimum setup path.</p>
  </a>
  <a href="./development/testing" class="content-card">
    <h3>🧪 Testing</h3>
    <p>Understand validation rules and test coverage across the system.</p>
  </a>
  <a href="./deployment/architecture" class="content-card">
    <h3>🌐 Deployment</h3>
    <p>Deploy frontend to Vercel, backend to Railway, and DB to Supabase.</p>
  </a>
</div>

## Product Visuals

<div class="screenshot-grid">
  <div class="premium-screenshot">
    <div class="premium-screenshot-bar">
      <div class="browser-dot dot-red"></div>
      <div class="browser-dot dot-yellow"></div>
      <div class="browser-dot dot-green"></div>
    </div>
    <img src="/assets/screenshots/admin_dashboard.png" alt="Operations Dashboard" />
  </div>
  <div class="premium-screenshot">
    <div class="premium-screenshot-bar">
      <div class="browser-dot dot-red"></div>
      <div class="browser-dot dot-yellow"></div>
      <div class="browser-dot dot-green"></div>
    </div>
    <img src="/assets/screenshots/admin_customer.png" alt="Customer CRM Workflow" />
  </div>
</div>

## Technology Stack

<div class="tech-grid">
  <div class="content-card">
    <h3>Frontend</h3>
    <p>React, TypeScript, Vite, TanStack Query, Zod</p>
  </div>
  <div class="content-card">
    <h3>Backend</h3>
    <p>Node.js, Express, TypeScript, REST API</p>
  </div>
  <div class="content-card">
    <h3>Database</h3>
    <p>PostgreSQL, Supabase, pg driver</p>
  </div>
  <div class="content-card">
    <h3>Security</h3>
    <p>JWT, bcrypt, Zod validation</p>
  </div>
</div>
