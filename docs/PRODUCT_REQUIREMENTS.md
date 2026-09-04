# Product Requirements

## Objective

Reduce preventable operational risk by detecting and routing material agency-lending exceptions before relevant cutoffs, while preserving human judgment and auditability.

## User stories

- As an operations analyst, I need a prioritized queue so I can act on the most time-sensitive break first.
- As a queue lead, I need ownership and aging visibility so no material exception is unattended.
- As a control owner, I need reproducible rule decisions and evidence so I can validate control performance.
- As a product manager, I need rule-level outcome metrics so I can tune the product without hiding risk.

## Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-01 | Ingest normalized lifecycle events with source and event timestamps | Must | Valid events are available within agreed latency; invalid events are quarantined and counted |
| FR-02 | Evaluate versioned exception rules | Must | Every result stores rule ID/version and input snapshot |
| FR-03 | Deduplicate persistent conditions | Must | Repeated events update one open exception for the business key |
| FR-04 | Calculate severity and due time | Must | Output is deterministic and references effective configuration |
| FR-05 | Route to queue and owner | Must | No open S1/S2 item remains without an accountable queue; assignment history is retained |
| FR-06 | Support acknowledgment, investigation, pending, resolution, closure, and reopening | Must | Only allowed transitions are accepted and every transition is audited |
| FR-07 | Capture notes, actions, reason codes, and evidence references | Must | Required closure fields are enforced by type/severity |
| FR-08 | Escalate approaching or breached SLAs | Must | Notification is sent once per escalation tier and recorded |
| FR-09 | Search and filter the queue | Must | Users filter by type, severity, owner, market, counterparty, client, age, and status |
| FR-10 | Display event chronology and calculation detail | Must | User can reproduce why the exception was opened and closed |
| FR-11 | Provide operational and control metrics | Should | Dashboard reconciles to underlying exception records |
| FR-12 | Export an audit package | Should | Authorized user exports history, evidence references, rules, approvals, and timestamps |
| FR-13 | Allow authorized severity override | Should | Reason required; S1/S2 reduction invokes approval policy |
| FR-14 | Group related fee discrepancies | Could | Daily breaks can roll into a configurable billing-period case |

## Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Availability | Defined by operating calendar and critical processing windows |
| NFR-02 | Detection latency | 95% of valid events evaluated within 2 minutes |
| NFR-03 | Auditability | Append-only history for rule decisions, assignments, overrides, and state changes |
| NFR-04 | Access control | Least privilege with role- and entity-based restrictions |
| NFR-05 | Data protection | Encryption in transit/at rest; evidence references preferred over duplication |
| NFR-06 | Resilience | Idempotent event processing and recoverable replay |
| NFR-07 | Observability | Feed freshness, rule failures, queue volume, notification failures, and lag monitored |
| NFR-08 | Explainability | User-visible reason, thresholds, and relevant input values for every exception |

## Business rules

- Configuration is effective-dated and evaluated using the applicable business date and calendar.
- Monetary comparisons use normalized currency values only when a governed FX source is present.
- Null is not treated as zero; missing critical data creates a data-quality outcome.
- A closed record is immutable except through an explicit reopen event.
- System timestamps use UTC; user views may localize while showing the source timezone and cutoff.
- Manual adjustments never overwrite source facts; they are stored as separate, attributed events.

## Analytics

Required measures include exception volume by rule, precision sample, detection latency, time to acknowledge, time to resolve, SLA breaches, reopen rate, manual override rate, age distribution, and source-data freshness.

## Dependencies

- Authoritative lifecycle event feeds.
- Security, client, counterparty, SSI, calendar, currency, and rule reference data.
- Identity and role service.
- Approved notification channels.
- Evidence-retention and audit-log services.

