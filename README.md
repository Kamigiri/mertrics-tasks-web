# mertrics-tasks-web

Angular frontend for **Mertrics Tasks** — a task and habit tracking app with Google Tasks integration.

## Features

- **Task Management** — Kanban board view, list view, drag & drop, due dates, smart filters (Today/Upcoming/All)
- **Habit Tracking** — Create habits with various frequencies, streak visualization, 7-day history graph
- **Material Design** — Angular Material 21 with custom magenta/violet theme
- **TailwindCSS** — Utility-first styling with Tailwind v4

## Prerequisites

- Node.js 20+
- npm 10+
- Backend API running (see `mertrics-tasks-api`)

## Local Development Setup

### 1. Install dependencies

```bash
cd mertrics-tasks-web
npm install --legacy-peer-deps
```

### 2. Create local environment file

Create `src/environments/environment.local.ts` (this file is gitignored):

```typescript
export const environment = {
    backendUrl: 'http://localhost:5000/api'
};
```

### 3. Start the dev server

```bash
npm run start:local
```

This serves the app at `http://localhost:4200` and proxies API calls to the Flask backend on port 5000.

> **Note:** Use `start:local` (not `start`) to use the local environment config that points to `localhost:5000`.

## Project Structure

```
mertrics-tasks-web/
├── angular.json            # Angular CLI config (uses @angular/build)
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── .postcssrc.json         # TailwindCSS PostCSS plugin
├── Dockerfile
├── nginx.conf              # Production nginx (serves at /mertrics-tasks/)
└── src/
    ├── index.html
    ├── main.ts
    ├── styles.css           # Tailwind imports + global styles
    ├── custom-theme.scss    # Angular Material theme
    ├── environments/
    │   ├── environment.ts        # Production (backendUrl: /mertrics-tasks/api)
    │   └── environment.local.ts  # Local dev (backendUrl: http://localhost:5000/api)
    └── app/
        ├── app.ts               # Root component
        ├── app.config.ts        # Providers (router, httpClient, errorInterceptor)
        ├── app.routes.ts        # Route definitions
        ├── models/              # TypeScript interfaces (Task, Habit)
        ├── services/            # HTTP services (TasksService, HabitsService)
        ├── interceptors/        # Error interceptor with snackbar notifications
        ├── utils/               # Date utilities
        └── components/
            ├── sidebar/         # Navigation sidebar
            ├── habits/          # Habit list, item, dialog
            └── tasks/           # Task views, board, list, item, dialog
```

## Build Configurations

| Configuration | Command | Description |
|---|---|---|
| Production | `npm run build` | Optimized build with `baseHref=/mertrics-tasks/` |
| Development | `ng serve` | Dev server, no optimization |
| Local | `npm run start:local` | Dev server with local API URL |

## Docker Deployment

The app is deployed via Docker Compose from the repository root. The production build sets `baseHref=/mertrics-tasks/` and nginx serves from that path.

```bash
# From repository root
docker compose up -d mertrics-tasks-web
```

