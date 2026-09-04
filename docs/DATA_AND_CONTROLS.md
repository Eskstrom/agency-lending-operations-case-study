# Data and Controls

## Conceptual model

| Entity | Purpose | Illustrative key |
|---|---|---|
| `loans` | Agreed loan economics and status | `loan_id` |
| `settlement_instructions` | Expected delivery/receipt instructions | `instruction_id` |
| `settlements` | Actual settlement outcomes | `settlement_id` |
| `collateral_valuations` | Required and eligible collateral values | `valuation_id` |
| `recalls` | Requested returns and outstanding quantity | `recall_id` |
| `fee_accruals` | Expected and reported fee amounts | `accrual_id` |
| `exceptions` | Current actionable exception state | `exception_id` |
| `exception_events` | Append-only workflow and evidence history | `exception_event_id` |
| `rule_versions` | Effective-dated detection configuration | `rule_id`, `version` |

## Minimum lineage

Every derived exception should retain or resolve:

- Source system and source record ID.
- Event time, ingestion time, business date, and processing run ID.
- Rule ID, version, configuration effective time, and evaluation time.
- Business key used for deduplication.
- Relevant input values and treatment of missing data.
- Current owner, status, and due time plus immutable change history.

## Core controls

| Control | Preventive/Detective | Evidence |
|---|---|---|
| Schema and required-field validation | Preventive | Quarantine count and rejected-record detail |
| Source freshness threshold | Detective | Last-success timestamp and breach event |
| Event completeness reconciliation | Detective | Source vs. ingested counts by business date |
| Idempotency and deduplication | Preventive | Unique event key and duplicate count |
| Versioned rule approval | Preventive | Approval, test result, effective date |
| Unowned exception check | Detective | Daily count by severity and queue |
| SLA and cutoff monitoring | Detective | Escalation event and notification result |
| Closure evidence enforcement | Preventive | Validation result and approver where required |
| Override monitoring | Detective | Original value, new value, reason, actor, reviewer |

## Data-quality rules

- Required identifiers must be non-null and stable within a source.
- Quantities and monetary values must include units/currency and valid precision.
- Event timestamps cannot be implausibly future-dated.
- Status transitions must conform to the approved state model.
- Reference data must be effective for the event's business date.
- Late-arriving data must trigger re-evaluation without erasing the prior decision.

## Reconciliation design

Daily reconciliation compares:

1. Source record counts and control totals against ingested events.
2. Eligible lifecycle records against rule evaluation results.
3. Rule-positive results against created or updated exceptions.
4. Closed exceptions against evidence and approval requirements.
5. Dashboard measures against the underlying exception population.

Differences are reported as control breaks, not silently adjusted.

