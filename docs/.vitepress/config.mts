import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "FUNDSROOM INFOTECH",
  description: "Mini ERP + CRM Operations Portal Documentation",
  cleanUrls: true,
  appearance: 'dark', // support dark/light mode toggle
  base: '/fundsroom_infotech/', // for GitHub Pages
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/overview/introduction' },
      { text: 'Application', link: '#' },
      { text: 'GitHub', link: 'https://github.com/Rahul-pamula/fundsroom_infotech' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: [
      {
        text: 'OVERVIEW',
        collapsed: false,
        items: [
          { text: 'Documentation Home', link: '/' },
          { text: 'Introduction', link: '/overview/introduction' },
          { text: 'Problem Statement', link: '/overview/problem-statement' },
          { text: 'Objectives', link: '/overview/objectives' }
        ]
      },
      {
        text: 'GETTING STARTED',
        collapsed: false,
        items: [
          { text: 'Requirements', link: '/getting-started/requirements' },
          { text: 'Quick Start', link: '/getting-started/quick-start' },
          { text: 'Project Structure', link: '/getting-started/project-structure' }
        ]
      },
      {
        text: 'SYSTEM DESIGN',
        collapsed: false,
        items: [
          { text: 'System Design', link: '/system-design/system-design' },
          { text: 'Architecture', link: '/system-design/architecture' },
          { text: 'Data Flow & Concurrency', link: '/system-design/concurrency' },
          { text: 'Database Design', link: '/system-design/database' }
        ]
      },
      {
        text: 'AUTHENTICATION & SECURITY',
        collapsed: false,
        items: [
          { text: 'Authentication & RBAC', link: '/security/authentication' }
        ]
      },
      {
        text: 'FEATURES',
        collapsed: false,
        items: [
          { text: 'Dashboard', link: '/features/dashboard' },
          { text: 'CRM', link: '/features/crm' },
          { text: 'Products', link: '/features/products' },
          { text: 'Inventory', link: '/features/inventory' },
          { text: 'Stock Movements', link: '/features/stock-movements' },
          { text: 'Challans', link: '/features/challans' }
        ]
      },
      {
        text: 'DEVELOPMENT',
        collapsed: false,
        items: [
          { text: 'Frontend', link: '/development/frontend' },
          { text: 'Backend', link: '/development/backend' },
          { text: 'API Reference', link: '/development/api-reference' },
          { text: 'Testing', link: '/development/testing' },
          { text: 'SDLC', link: '/development/sdlc' }
        ]
      },
      {
        text: 'DEPLOYMENT',
        collapsed: false,
        items: [
          { text: 'Deployment Architecture', link: '/deployment/architecture' },
          { text: 'Vercel (Frontend)', link: '/deployment/frontend' },
          { text: 'Render (Backend)', link: '/deployment/backend' },
          { text: 'Supabase (Database)', link: '/deployment/database' }
        ]
      },
      {
        text: 'PROJECT',
        collapsed: false,
        items: [
          { text: 'Product Tour', link: '/project/product-tour' },
          { text: 'Screenshots', link: '/project/screenshots' },
          { text: 'Limitations & Scope', link: '/project/limitations' }
        ]
      }
    ],
    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page'
    },
    footer: {
      message: 'Mini ERP + CRM Operations Portal',
      copyright: 'Copyright © 2026 Fundsroom Infotech'
    }
  }
})
