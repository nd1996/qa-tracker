# ShopFloor Quality Inspection Tracker

A mobile-first web app for shop-floor supervisors to log, track, and resolve quality defects in under 5 minutes.

## Features
- **Mobile-First Ergonomics:** Optimized for 390px mobile viewports.
- **Dynamic Filter Chips:** Multi-criteria filter builder with dismissible tags.
- **Paginated Feed:** Configurable page size, order sorting, and status tracking.
- **Summary Metrics:** Live Open vs. Resolved KPI breakdown by severity.
- **Mandatory Resolution Notes:** Full audit trail tracking logging and resolving supervisors.
- **Offline Sync Queue:** Local storage queue auto-flushes upon network restoration.
- **Mock SAP Webhook:** Automated telemetry ingestion at `POST /api/sap-webhook`.

---

## Quick Start (Docker Compose)

```bash
docker compose up --build
```

## Stop
```bash
docker compose down