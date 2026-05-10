# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
nvm use                  # Switch to correct Node.js version
npm install              # Install dependencies
npm run dev              # Development server with nodemon (port 8102)
npm start                # Production server

npx gulp watch           # Watch and compile SCSS/JS during development
npx gulp                 # Build all assets (CSS + JS)
npx gulp compress_css    # Build CSS only
npx gulp compress_js     # Build JS only
```

No lint or test scripts are configured.

## Architecture

**avnode-admin** is a monolithic Express.js server (ESM, `"type": "module"`) for the AVnode.net artist/performer network. It serves both a server-rendered admin UI (Pug templates) and a REST API.

### Entry Points

- `index.js` — bootstraps MongoDB connection, auto-loads all Mongoose models from `app/models/`, then starts Express
- `server.js` — Express app: middleware, CORS, sessions (MongoDB via connect-mongo), Passport auth, route mounting, error handling

### Request Flow

1. `server.js` mounts routes from `app/routes/index.js`
2. Routes are organized by content type: `admin/`, `adminpro/`, `api/`, plus top-level files for `login`, `signup`, `events`, `organizations`, etc.
3. A middleware sets `global.currentRequest` so Mongoose plugins can attach per-request context (locale, translation fn, moment instance) via `$locals` on every query

### Data Layer

- **MongoDB + Mongoose** — URI from `MONGODB_URI` env var (default: `mongodb://127.0.0.1:27017/avnode`)
- Models in `app/models/` are auto-loaded at startup; shared sub-schemas live in `app/models/shared/`
- Sessions stored in MongoDB (`sessions` collection, 24h TTL)

### Multi-Language / Multi-Tenant

- 11 languages, each mapped to a subdomain (`en.avnode.net`, `it.avnode.net`, etc.)
- Language routing is driven by `config/default.json` (`domain_to_lang`, `lang_to_domain` maps)
- Active language stored in `req.session.current_lang`; translation files are JSON in `locales/`

### Authentication

- Passport.js Local Strategy (email + bcrypt password)
- Admin UI routes under `/admin/*` and `/adminpro/*` require authentication
- API routes under `/api/*` return 404 JSON when unauthenticated (not 401)

### Asset Pipeline

- Gulp 5 + Sass compiles SCSS → `public/css/`; Terser minifies JS → `public/js/`
- Uploaded files handled by Multer, processed by Sharp (images) or ffprobe (video metadata)
- Storage directories: `warehouse/` (active) and `glacier/` (archived) — must exist locally

### Key External Services

| Service | Env vars |
|---------|----------|
| Algolia (search) | `ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_KEY` |
| AWS SES (email) | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` |
| Google Maps | `GOOGLEMAPSAPIKEY` |
| Sendy (mailing list) | `SENDYENDPOINT`, `SENDYAPIKEY`, `SENDYLIST` |

Copy `example.env.local` → `.env.local` and fill in values before running.

### Logging

Winston logs to `../logs/` (outside project root). Daily rotation, 14-day retention. express-winston logs all HTTP requests. Development mode adds colorized console output.

### Production

PM2 cluster mode via `ecosystem.config.cjs` (4 GB memory limit per instance). Deploy with `pm2 start ecosystem.config.cjs`.
