# Mission Briefing Service – Database Schema

Multi-tenant. All tables require `tenant_id` (UUID or string). Indexes and constraints omitted for brevity; add per deployment.

---

## mission_briefings

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| tenant_id | VARCHAR NOT NULL | |
| briefing_date | DATE NOT NULL | Calendar day (tenant timezone) |
| scheduled_at_iso | TIMESTAMPTZ | 06:30 local → UTC |
| started_at_iso | TIMESTAMPTZ | When "Start Briefing" was clicked |
| completed_at_iso | TIMESTAMPTZ | When step 6 (lock) completed |
| status | VARCHAR | draft \| in_progress \| red_flag_round \| risk_confirm \| readback \| signed \| locked |
| auto_summary_json | JSONB | Aggregated scores, counts (Threat, Infra, Load, Compliance, Risk Index) |
| timezone | VARCHAR | IANA e.g. Europe/Berlin |
| locked_at_iso | TIMESTAMPTZ | Immutable after lock |
| created_at_iso | TIMESTAMPTZ | |
| updated_at_iso | TIMESTAMPTZ | |

Unique: (tenant_id, briefing_date). One briefing per tenant per day.

---

## briefing_participants

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| briefing_id | UUID FK → mission_briefings | |
| tenant_id | VARCHAR NOT NULL | Denormalized for isolation |
| user_id | VARCHAR NOT NULL | Internal user/operator id |
| display_name | VARCHAR | |
| role | VARCHAR | optional e.g. lead \| operator |
| joined_at_iso | TIMESTAMPTZ | |
| red_flag_response | TEXT | Mandatory in CRM step 2 |
| red_flag_submitted_at_iso | TIMESTAMPTZ | |
| risk_acknowledged_at_iso | TIMESTAMPTZ | Step 3 |
| readback_text | TEXT | Step 4 closed-loop |
| readback_submitted_at_iso | TIMESTAMPTZ | |
| signature_data | TEXT | Step 5 (e.g. base64 or hash) |
| signed_at_iso | TIMESTAMPTZ | |

No silent participation: red_flag_response and readback_text required before briefing can complete.

---

## briefing_risk_snapshot

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| briefing_id | UUID FK | |
| tenant_id | VARCHAR NOT NULL | |
| snapshot_at_iso | TIMESTAMPTZ | |
| threat_landscape_score | DECIMAL(5,2) | 0–100 |
| infrastructure_health_score | DECIMAL(5,2) | 0–100 |
| operational_load_score | DECIMAL(5,2) | 0–100 |
| compliance_exposure_score | DECIMAL(5,2) | 0–100 |
| customer_risk_index | DECIMAL(5,2) | Weighted formula |
| per_customer_json | JSONB | Array of { customerId, name, threat, patchGap, backupRisk, slaPressure, capacityRisk, riskIndex } |
| raw_metrics_json | JSONB | Counts (alerts, offline, P1/P2, etc.) for audit |

Stored at briefing start (and optionally at lock) for immutable audit.

---

## briefing_acknowledgements

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| briefing_id | UUID FK | |
| participant_id | UUID FK → briefing_participants | |
| tenant_id | VARCHAR NOT NULL | |
| risk_item_id | VARCHAR | Optional ref to risk_snapshot item |
| acknowledged_at_iso | TIMESTAMPTZ | |
| checkbox_confirmation | BOOLEAN | Step 3 |

---

## red_flag_entries

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| briefing_id | UUID FK | |
| tenant_id | VARCHAR NOT NULL | |
| participant_id | UUID FK | |
| flag_type | VARCHAR | risk \| near_miss \| escalation |
| escalation_to_leadership | BOOLEAN | "Flag Risk to Leadership" |
| anonymous | BOOLEAN | Near-miss anonymous toggle |
| content_text | TEXT | |
| created_at_iso | TIMESTAMPTZ | |

---

## post_shift_reviews

| Column | Type | Notes |
|--------|------|------|
| id | UUID PK | |
| tenant_id | VARCHAR NOT NULL | |
| briefing_id | UUID FK | Optional link to briefing day |
| review_date | DATE | |
| what_went_well | TEXT | |
| what_failed | TEXT | |
| near_miss | TEXT | |
| lessons_learned | TEXT | |
| preventive_action_ticket_id | VARCHAR | Autotask ticket id if created |
| created_by_user_id | VARCHAR | |
| created_at_iso | TIMESTAMPTZ | |

---

## Audit and retention

- All tables: `tenant_id` on every row; enforce at application and DB (RLS or shard by tenant).
- mission_briefings: retain minimum 12 months; export to cold storage or archive table after.
- Full audit log: recommend separate `mission_briefing_audit_log` (table, action, row_id, changed_by, changed_at_iso, diff_json).
- Compliance mapping: ISO 27001 A.5, SOC 2 CC7, ITIL Service Operation – document in runbook; store compliance_tags on briefing or snapshot if required.
