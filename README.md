# Quality Inspection Tracker

A mobile-first quality inspection tracker for shop-floor supervisors. The application lets supervisors log defects, review inspection history, filter and paginate records, resolve issues with mandatory resolution notes, and continue logging inspections while temporarily offline.

## Why This Architecture?

This project intentionally favors a small, operationally simple architecture over a more distributed or enterprise-heavy stack.

### React + Vite + Tailwind

**Choice:** React with Vite and Tailwind CSS.

**Why:**
- React keeps the UI componentized without introducing a large application framework.
- Vite provides a fast development/build cycle and a small production footprint.
- Tailwind makes the dark industrial UI and responsive 390px mobile layout easy to keep consistent.

**Trade-off:** A component library or design system could provide more prebuilt accessibility and interaction patterns, but would add dependency and styling complexity for a relatively focused application.

### Node.js + Express REST API

**Choice:** Express with a conventional REST API.

**Why:**
- The API surface is small and maps naturally to the application's core entities and actions.
- Authentication middleware can be applied consistently to protected routes.
- Express keeps the backend easy to inspect and operate for a small deployment.

**Trade-off:** A more opinionated framework could provide stronger conventions around validation, dependency injection, and project structure. For this application's scope, those benefits were not considered worth the additional complexity.

### SQLite + Prisma

**Choice:** SQLite accessed through Prisma ORM.

**Why:**
- Inspection data is relational but relatively modest in scale.
- SQLite removes the operational overhead of running a separate database service.
- Prisma provides typed database access and keeps relationships such as `loggedBy` and `resolvedBy` explicit.

**Trade-off:** SQLite is not the ideal choice for a high-concurrency, horizontally scaled production workload. A server database such as PostgreSQL would be a better fit if the application grows to require multiple application replicas or significantly higher write concurrency.

### Docker Compose

**Choice:** Separate client and server containers managed by Docker Compose.

**Why:**
- The frontend and backend have different runtime responsibilities.
- The production frontend can be served by lightweight Nginx rather than a Node process.
- Compose makes the complete evaluation environment reproducible with one configuration.

**Trade-off:** Two containers introduce slightly more deployment complexity than running everything in a single process. The separation is worthwhile because it keeps the static frontend serving concerns independent from the API runtime.

### Nginx for the Frontend

The React application is built into static assets and served by Nginx.

The `/api/` path is reverse-proxied to the Express container. This means the browser can communicate through one frontend origin rather than needing to know the backend container's internal address.

**Trade-off:** This adds a small amount of configuration compared with exposing the Vite development server directly, but it better represents a production deployment and avoids coupling the deployed frontend to the Vite dev server.

### JWT Authentication

**Choice:** Stateless JWT authentication with pre-seeded supervisor accounts.

**Why:**
- The API can authenticate requests without maintaining server-side sessions.
- The user's identity and shift can be carried in the token.
- Pre-seeded accounts fit the controlled shop-floor evaluation environment where public registration is not required.

**Trade-off:** JWTs are convenient for stateless APIs but make immediate token revocation more complicated than a server-side session model. For a larger production deployment, token rotation, stronger secret management, and a deliberate revocation strategy would be appropriate.

### Offline Inspection Queue

**Choice:** Queue inspection submissions locally and retry them when connectivity returns.

**Why:**
- Shop-floor connectivity can be unreliable.
- Logging an inspection should not depend on an uninterrupted network connection.
- Automatic re-sync reduces the amount of manual recovery required from supervisors.

**Trade-off:** Offline-first behavior introduces eventual consistency. A record may exist locally before the server has accepted it, so synchronization failures and duplicate-submission handling become additional concerns.

### Pagination and Server-Side Filtering

Filtering, sorting, and pagination are performed by the API rather than downloading the entire inspection history.

**Why:**
- The mobile client receives only the records needed for the current view.
- The approach continues to work as inspection history grows.
- Query parameters provide a simple API contract for filters and pagination.

**Trade-off:** Server-side filtering requires more API logic than filtering an already-loaded array in React, but avoids making client memory and network usage scale with the complete history.

### Summary KPI Aggregation

The dashboard summary is calculated by the backend using grouped database queries.

**Why:**
- The server remains the source of truth for Open/Resolved and severity counts.
- The client does not need to download every inspection just to calculate KPIs.
- Aggregation stays close to the data.

**Trade-off:** Every summary refresh requires a database query. For this application's scale that is preferable to maintaining a separate caching or analytics layer.

## UX Decisions

### Mobile First

The primary target is a 390px viewport because supervisors may use the application directly from a phone on the shop floor.

This influences:
- Compact summary cards
- Large tap targets
- Bottom/sheet-style actions
- Simple filter controls
- Short inspection forms
- Dense but readable inspection feeds

Desktop responsiveness is supported, but the interface is designed around the smaller operational viewport first.

### One-Tap Resolution

Resolving an inspection is treated as a focused action rather than another full form.

A resolution note is mandatory because changing an inspection to `Resolved` without recording what was done would weaken the audit trail.

### Dynamic Filters

Instead of presenting every possible filter as a permanently expanded form, the UI allows a filter type to be selected and its value to be represented as a dismissible chip.

This keeps the primary inspection feed compact while still allowing multiple filters.

## Data and Audit Trail

Each inspection records:

- Production line
- Defect type
- Severity
- Status
- Remarks
- Logged timestamp
- User who logged it
- Resolution note
- Resolution timestamp
- User who resolved it

The separate `loggedBy` and `resolvedBy` relationships preserve accountability when one supervisor identifies an issue and another supervisor resolves it.

## API Overview

### Authentication

`POST /api/auth/login`

Authenticates a seeded supervisor account and returns a JWT.

### Inspections

`GET /api/inspections`

Supports:

- `severity`
- `status`
- `defectType`
- `lineId`
- `fromDate`
- `toDate`
- `sort`
- `page`
- `limit`

`POST /api/inspections`

Creates a new Open inspection.

`PATCH /api/inspections/:id/resolve`

Resolves an inspection and requires a non-empty resolution note.

### Summary

`GET /api/inspections/summary`

Returns Open and Resolved counts grouped by severity.

### SAP Integration

`POST /api/sap-webhook`

Provides the mock SAP integration point used by the application.

## Running the Application

### Prerequisites

- Docker
- Docker Compose

### Start

```bash
docker compose up --build
```

## Stop
```bash
docker compose down
```
