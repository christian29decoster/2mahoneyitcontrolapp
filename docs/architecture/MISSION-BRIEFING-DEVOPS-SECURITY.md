# Mission Briefing – DevOps, Security & Performance

## Deployment (AWS)

- **Application**: Mission briefing APIs and UI are part of the main Next.js app (`/api/mission-briefing/*`, `/mission-control`). Deploy as today (e.g. Vercel, or Node on ECS/Lambda + API Gateway). No separate microservice is required for the current in-memory implementation.
- **Optional microservice**: If you split out `mission-briefing-service` later (e.g. Node/Express or Lambda), run it behind the same API Gateway or ALB. Env: `TENANT_CONFIG`, `AUTOTASK_*`, `RMM_*`, `SIEM_*`, `SOPHOS_*`, `DATABASE_URL`.
- **Database**: When moving from in-memory to Postgres, run migrations for tables in `MISSION-BRIEFING-SCHEMA.md`. Use RDS or Aurora; encrypt at rest (default in RDS). Store connection string in Secrets Manager or env.
- **Scheduler (06:30 local)**: To auto-generate daily briefings per tenant at 06:30 in tenant timezone:
  - **Option A**: EventBridge (or CloudWatch Events) rule with cron; target Lambda that calls an internal endpoint (e.g. `POST /api/mission-briefing/scheduled?tenantId=...&date=YYYY-MM-DD`) with auth (e.g. IAM or shared secret). Lambda must resolve tenant list and timezones (e.g. from DB or config) and invoke once per tenant at 06:30 local (convert to UTC in cron).
  - **Option B**: Single cron at a fixed UTC time; Lambda loads all tenants, computes 06:30 local for each, and enqueues SQS messages with delay so each tenant’s job runs at its 06:30. Worker (Lambda or ECS) consumes queue and creates briefing via same API.
- **Env vars**: Document `NEXT_PUBLIC_APP_URL` (or equivalent) if aggregation calls back into the app (e.g. RMM proxy). For external APIs: `AUTOTASK_*`, `DATTO_RMM_*`, `SPLUNK_*`, `SOPHOS_*` as needed.

---

## Security

- **RBAC**: Use existing app roles. Only authorized operators (e.g. `tenant_user`, `admin`) can access `/mission-control` and briefing/debrief APIs. Restrict “lock briefing” and “Start Briefing” to roles that are allowed to run daily ops (e.g. exclude read-only). Debrief list/create: same tenant-scoped roles.
- **Tenant isolation**: Every API and store function is keyed by `tenant_id`. Never return or mutate another tenant’s data. Enforce in API: `tenant_user` may only use `sessionTenantId`; optional `tenantId` query/body only for admins.
- **Encryption**: TLS in transit (HTTPS). At rest: use RDS encryption, and encrypt sensitive fields (e.g. readback, red-flag content) if required by policy; KMS for key management.
- **Audit**: Log who created/locked a briefing and who created debriefs. When persisting to DB, add `audit_log` table or append-only log (see schema doc). Retain 12+ months for compliance.

---

## Performance

- **Caching**: Aggregation (RMM, Autotask, SIEM, Sophos, risk engine) can be expensive. Cache `generateAutoSummary(tenantId)` result with TTL (e.g. 5–15 minutes) in Redis or in-memory per tenant. Invalidate on “Start Briefing” or use short TTL so dashboard and briefing creation see fresh enough data.
- **Rate limiting**: Apply rate limits to external API calls (Autotask, Datto RMM, Splunk, Sophos) in the aggregation layer to avoid throttling. Use per-tenant and global limits; queue or back off on 429.
- **API rate limiting**: Protect `/api/mission-briefing/*` with standard per-tenant or per-user rate limits (e.g. 100 req/min) to avoid abuse.

---

## Compliance mapping

- **ISO 27001 A.5 (Governance)**: Briefing and debrief flows support operational governance; lock and audit trail support accountability.
- **SOC 2 CC7 (Monitoring)**: Mission Control dashboard and risk scores support monitoring of security and operational posture; audit log supports evidence.
- **ITIL Service Operation**: Aligns with daily operational coordination and post-incident debrief; preventive action ticket links to problem management.

---

## Retention

- Store briefing and debrief records for at least 12 months. When using Postgres, use partitioning or archival if needed; PDF export can be generated on demand from stored data.
