# Relay

A full-stack, real-time chat application: an Express + Socket.IO backend, a React 19 frontend, and a shared Zod schema package, all managed as an npm-workspaces monorepo. This is the evolution of the standalone `real-time-chat-backend` project earlier in this series into a proper full-stack product, with the backend's request/response and event contracts now defined once in `packages/shared` and consumed by both sides instead of being duplicated.

---

## Tech Stack

| Layer               | Technology                                            |
| --------------------- | -------------------------------------------------------- |
| Monorepo tooling         | npm workspaces                                          |
| Backend runtime          | Node.js                                                  |
| Backend framework        | Express 5                                                |
| Real-time                | Socket.IO 4 (server and client)                          |
| Shared validation        | Zod v4, published internally as `@relay/shared`           |
| Database                 | PostgreSQL (via `pg`)                                    |
| Backend auth              | JWT (`jsonwebtoken`) + `httpOnly` cookies                 |
| Frontend framework        | React 19 + Vite                                          |
| Frontend server state      | TanStack Query                                           |
| Frontend client state       | Zustand                                                   |
| Frontend forms             | React Hook Form + `@hookform/resolvers` (Zod)              |
| Frontend UI                 | shadcn/ui, Tailwind CSS v4, Lucide icons                    |
| Frontend HTTP client        | Axios                                                      |
| Frontend linting             | oxlint                                                     |

---

## Project Structure

```
relay/
├── apps/
│   ├── backend/
│   │   ├── seed/                      # Database seeding (currently: users only)
│   │   └── src/
│   │       ├── app.ts                 # Express app setup — CORS, parsers, routers, error handler
│   │       ├── server.ts              # HTTP server bootstrap — wires up Express AND Socket.IO
│   │       ├── config/env.ts          # Fail-fast validated environment variable access
│   │       ├── controllers/           # auth, user, conversation, conversation_member, message, notification
│   │       ├── database/              # db.ts, init.ts, check.ts, queries/
│   │       ├── middlewares/           # auth, error, rate limit, validation
│   │       ├── repositories/          # one file per resource — the only layer touching the DB
│   │       ├── routers/               # one router per REST resource
│   │       ├── services/              # business logic, shared between REST controllers and socket handlers
│   │       ├── sockets/               # Socket.IO bootstrap, connection handling, event handlers, middlewares
│   │       ├── types/                 # Express/Socket augmentation, shared handler types
│   │       └── utils/                 # AppError, query builders, auth token helpers
│   └── frontend/
│       └── src/
│           ├── app/App.tsx            # Root component — routing setup
│           ├── pages/                 # auth (login/signup), chat, not-found
│           ├── layouts/               # AuthLayout, ChatLayout
│           ├── features/              # auth, conversations, messages, notifications, presence, typing, users
│           │   └── <feature>/         # api/, components/, hooks/, socket/ — one folder per domain feature
│           ├── components/
│           │   ├── ui/                # shadcn/ui primitives (button, dialog, avatar, tabs, etc.)
│           │   └── common/            # shared composite components (UserSearch, SelectedUserItem, etc.)
│           ├── services/
│           │   ├── api/axios.ts       # Configured Axios instance
│           │   └── socket/            # socket.ts, per-domain listeners/, useSocketListeners hook
│           ├── stores/auth.store.ts   # Zustand store for the authenticated user
│           ├── config/env.ts          # Fail-fast validated Vite environment variables
│           └── lib/                   # queryClient.ts, utils.ts
├── packages/
│   └── shared/
│       └── src/
│           ├── index.ts               # Re-exports everything below
│           └── schemas/               # auth/, users/, conversations/, conversation_members/, messages/,
│                                       # message_reads/, notifications/, common.ts
├── package.json                        # Workspace root — orchestrates per-app scripts
└── README.md
```

### How the three workspaces relate

```
packages/shared  --(built to dist/, imported as @relay/shared)-->  apps/backend
packages/shared  --(built to dist/, imported as @relay/shared)-->  apps/frontend

apps/frontend  --(REST, via Axios)-->  apps/backend
apps/frontend  --(WebSocket, via socket.io-client)-->  apps/backend
```

`@relay/shared` must be built (`npm run build:shared`, or kept running via `npm run watch:shared` during development) before its output is usable by the other two workspaces, since both import from its compiled `dist/`, not its `src/` directly.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (workspaces support required — npm 7+)
- A running PostgreSQL instance (local install, Docker, or a hosted service like Supabase/Neon/RDS)

### Installation

```bash
git clone <your-repo-url>
cd relay
npm install
```

A single `npm install` at the repo root installs dependencies for all three workspaces and links `@relay/shared` into both `apps/backend` and `apps/frontend` automatically.

### Build the shared package first

```bash
npm run build:shared
```

Do this once before running either app for the first time, and again any time you change something under `packages/shared/src`. During active development, running it in watch mode in its own terminal is more convenient:

```bash
npm run watch:shared
```

### Environment Variables

**Backend** — create `apps/backend/.env`:

```env
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=relay
DATABASE_USER=postgres
DATABASE_PASSWORD=<your-postgres-password>

ACCESS_TOKEN_SECRET=<a-long-random-secret>
REFRESH_TOKEN_SECRET=<a-different-long-random-secret>
```

(Once the unused Cloudinary variables are removed from `config/env.ts` per the note above, they will not be needed here either.)

**Frontend** — create `apps/frontend/.env`:

```env
VITE_APP_NAME=Relay
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

### Running the App

In separate terminals, from the repo root:

```bash
npm run dev:backend
npm run dev:frontend
```

On backend startup, the database connection is verified and all tables are created automatically if missing. The frontend runs on Vite's dev server (default `http://localhost:5173`).

**Seed the database with sample users:**

```bash
npm run db:seed:backend
```

**Production build:**

```bash
npm run build            # builds shared, backend, and frontend, in that order via workspaces
npm run build:backend    # or individually, per workspace
npm run build:frontend
```

---

## Backend API Summary

Full endpoint-by-endpoint detail (REST routes, Socket.IO event contracts, data model, response envelope) matches the standalone `real-time-chat-backend` project earlier in this series, with one addition:

| Method | Endpoint            | Auth required | Description                        |
| ------ | ---------------------| ---------------| --------------------------------------|
| GET    | `/api/v1/users`         | Yes              | Search/list users, paginated (used by the frontend to find people to message) |

Everything else — `/api/v1/auth/*`, `/api/v1/conversations/*`, `/api/v1/notifications/*`, the `message:*`/`conversation:*`/`typing:*`/`user:*` socket events, the `users` / `conversations` / `conversation_members` / `messages` / `notifications` schema — is unchanged from that project.

---

## Frontend Overview

The frontend is organized by feature (`src/features/<domain>/{api,components,hooks,socket}`), not by file type, which keeps everything related to (say) typing indicators — its API calls, its React hook, its socket listener — in one folder rather than spread across parallel `components/`, `hooks/`, and `services/` trees.

- **`services/socket/socket.ts`** creates a single, app-wide `socket.io-client` instance with `autoConnect: false` — connection is driven explicitly by `useSocketListeners`, which connects once a user is authenticated and disconnects on logout, registering all five domain listener sets (conversations, messages, notifications, presence, typing) for the lifetime of the session.
- **`stores/auth.store.ts`** (Zustand) holds the authenticated user and drives `checkAuth`/`login`/`register`/`logout`, which in turn is what `useSocketListeners` watches to decide whether the socket should be connected.
- **TanStack Query** owns all server-derived state (conversations, messages, notifications); socket event listeners call `queryClient` methods (invalidate/set query data) to keep that cache in sync with live events rather than maintaining a separate parallel state store for the same data.
- **`config/env.ts`** fails fast (same pattern as the backend) if any required `VITE_*` variable is missing, rather than surfacing a confusing runtime error later.

---

## Roadmap / Ideas

- [ ] Extend the seed script beyond users — conversations/messages would make local frontend development against realistic data much faster
- [ ] Add a root-level `turbo.json` (or similar) if the monorepo grows enough that plain npm workspace scripts start feeling limiting — not needed yet at this size
- [ ] Add automated tests on both sides — backend integration tests (as noted in the standalone project) and frontend component/hook tests (e.g. React Testing Library for the socket listener hooks)
- [ ] Add CI that builds `packages/shared` before `apps/backend`/`apps/frontend`, matching the required local build order
- [ ] Document the Socket.IO event contract (ideally generated from the `@relay/shared` event schemas) so the frontend/backend event surface is discoverable without reading handler source on both sides

---

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a PR or issue.

## License

ISC (see `package.json`) — update as appropriate for your project.
