# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**每次回复都需要叫我:【dong4j】**

## Project Overview

**zeka-stack-webui** is a React 19 + TypeScript single-page application serving as the web interface for the Zeka Stack IntelliJ plugin ecosystem. It provides plugin documentation, feature request management, statistics dashboards, and user authentication via GitHub OAuth.

**Key Features:**
- Multi-plugin showcase pages (Javadoc, Changelog, Terminal, Tracer, Repairer, Engine, Swagger, Nacos)
- Feature request and feedback system with voting and comments
- Statistics dashboard with ECharts visualizations
- Internationalization (Chinese/English)
- GitHub OAuth authentication with role-based access control

## Common Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:5173
pnpm build            # TypeScript check + production build to dist/
pnpm lint             # Run ESLint
pnpm preview          # Preview production build locally

# Deployment
./deploy.sh           # Build, upload to server, sync Nginx config
./deploy.sh -n        # Sync Nginx config only (skip build/upload)
```

## Architecture

### Routing System

The app uses a **custom hash-based router** (no react-router) implemented in `src/App.tsx`:
- Listens to `hashchange` events
- Routes mapped directly to components via if/else chains
- Some routes trigger variant changes on Header/Footer components

**Route format:** `#/path` (e.g., `#/plugins/engine`)

**Key routes:**
- `#/` - Home
- `#/feedback` - Feature requests
- `#/statistics` - Analytics dashboard (ECharts)
- `#/login` - GitHub OAuth login
- `#/plugins/{name}` - Plugin-specific pages

### Component Architecture

**Functional components** with TypeScript interfaces for props. Common patterns:
- `variant` prop for component theming (e.g., `Header` variant: 'default' | 'dark' | 'terminal')
- Composition pattern for reusable UI elements
- Local component state with `useState` (no global state library)

### API Layer

Centralized in `src/lib/api.ts`:
- RESTful API calls with fetch
- TypeScript interfaces for all request/response types
- Base URL: `/api` (proxied to `http://127.0.0.1:8080` in dev)
- Error handling with try-catch

### Authentication

- Token-based auth with localStorage (`src/lib/auth.ts`)
- GitHub OAuth integration
- Mock auth for local development via URL params:
  - `?role=admin` - Admin mode (manage feedback, change status)
  - `?role=user` - User mode (submit feedback, vote, comment)
  - `?role=guest` - Guest mode (read-only)

### Internationalization

- i18next with React bindings (`src/i18n/config.ts`)
- Locale files: `src/i18n/locales/zh-CN.json`, `src/i18n/locales/en-US.json`
- Language preference persisted in localStorage
- Browser language detection

### Build System

- **Vite 7.2** with custom `versionPlugin` middleware
- Dev server proxies `/api` to backend
- Build process: `tsc -b` (TypeScript check) → `vite build` (bundle)

### Data Visualization

- **ECharts 5.6** for statistics dashboard
- `react-markdown` with `remark-gfm` and `rehype-highlight` for GitHub Flavored Markdown with syntax highlighting

## Development Notes

### Adding New Pages

1. Create component in `src/pages/` or `src/pages/plugins/`
2. Add route in `src/App.tsx`:
   ```tsx
   else if (route === '#/new-page') {
       Component = NewPage;
       footerVariant = 'default';  // optional
       headerVariant = 'default';  // optional
   }
   ```
3. Update navigation menus in `src/components/Header.tsx` if needed

### Adding Translations

Add keys to both `src/i18n/locales/zh-CN.json` and `src/i18n/locales/en-US.json`, then use:
```tsx
import {useTranslation} from 'react-i18next';
const {t} = useTranslation();
<t('translation.key'/>
```

### Styling

- Use Tailwind CSS utility classes directly in components
- Global styles in `src/index.css` and `src/App.css`
- Component-specific animations defined in CSS files

### Security

- HMAC-SHA256 request signing for API calls (`src/lib/signature.ts`)
- Client ID/secret-based authentication for certain endpoints
- Never commit `.env` files (see `.env.example`)

## Deployment

Production deployment via `deploy.sh`:
- Builds production bundle
- Uploads via rsync to `aliyun` server at `/var/www/zeka-stack-webui/dist`
- Syncs Nginx configuration to `/etc/nginx/conf.d/`
- Restarts Nginx after validation

**Production URL:** https://zekastack.dong4j.site

**Server requirements:**
- SSH alias `aliyun` configured in `~/.ssh/config`
- Nginx with reverse proxy configuration

## Related Projects

- **[zeka-stack-api](../zeka-stack-api)** - Backend API service (port 8080)
- **[intelli-ai-javadoc](../../zeka-idea-plugin/intelli-ai-javadoc)** - Javadoc plugin
