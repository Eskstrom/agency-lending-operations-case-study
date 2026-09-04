# Case Study

## Executive summary

This case study explores a hypothetical Exception Control Center for an agency securities-lending platform. The enhancement connects lifecycle events to a standardized exception record so operations teams can detect, prioritize, investigate, escalate, and close breaks with consistent evidence.

The proposed MVP focuses on five operationally meaningful exception families: unmatched instructions, settlement fails, collateral deficits, overdue recalls, and fee discrepancies. It does not automate trading decisions, credit approvals, collateral eligibility determinations, or client communications.

## Context

In an agency-lending model, an agent facilitates securities loans on behalf of beneficial owners. A single loan can produce events across trade capture, settlement, collateralization, billing, income processing, recall, return, and reconciliation. Those events may be sourced from different platforms and arrive at different times.

The product challenge is therefore not simply to display failed records. It is to turn fragmented signals into an actionable, controlled workflow without hiding uncertainty or removing required human judgment.

## Discovery framing

### Users

| User | Goal | Current friction |
|---|---|---|
| Lending operations analyst | Resolve breaks before cutoff | Searches across queues and messages |
| Operations lead | Allocate work and control risk | Limited consolidated aging and ownership view |
| Collateral analyst | Maintain required coverage | Delayed or inconsistent exposure inputs |
| Client-service partner | Explain material events | Incomplete chronology and status context |
| Product/control owner | Improve rules safely | Weak traceability from rule to outcome |

### Discovery questions

- Which exceptions create the highest financial, client, or market risk?
- What event proves that an exception exists, and what event proves resolution?
- Which cutoffs and service levels vary by market, client, security, or counterparty?
- Where is human approval mandatory?
- What evidence must be retained for audit and post-incident review?
- Which apparent breaks are expected timing differences rather than actionable exceptions?

## Current-state observations

The hypothetical baseline has four recurring gaps:

1. **Fragmented detection:** lifecycle breaks appear in separate operational reports.
2. **Implicit ownership:** responsibility is inferred from team knowledge rather than recorded.
3. **Inconsistent escalation:** urgency depends on manual monitoring and local practice.
4. **Weak closure evidence:** a status may be changed without recording the proof or rationale.

## Opportunity statement

How might we give operations teams a single, risk-ranked view of agency-lending exceptions, with enough context and evidence to act before a contractual or market deadline?

## Scope

### MVP

- Ingest normalized loan, instruction, settlement, collateral, recall, fee, and reference-data events.
- Evaluate configurable rules and create or update exception records.
- Calculate severity and SLA due time.
- Support assignment, acknowledgment, notes, evidence, escalation, resolution, and reopening.
- Provide queue filters, record history, aging, and control dashboards.
- Export auditable exception history.

### Out of scope

- Autonomous trade execution or recall initiation.
- Credit-limit changes and collateral eligibility approval.
- Replacement of settlement, books-and-records, or collateral platforms.
- Automated external communications without an approved workflow.
- Predictive prioritization in the MVP.

## Prioritization

| Exception | Frequency | Potential impact | Time sensitivity | MVP |
|---|---:|---:|---:|---:|
| Unmatched instruction | High | High | High | Yes |
| Settlement fail | Medium | High | High | Yes |
| Collateral deficit | Medium | High | High | Yes |
| Overdue recall | Medium | High | High | Yes |
| Fee discrepancy | High | Medium | Medium | Yes |
| Corporate-action discrepancy | Low/Medium | High | High | Later |
| Tax-treatment discrepancy | Low | High | Medium | Later |

## Key decisions and tradeoffs

### Rules before machine learning

The MVP uses transparent, configurable rules. Operations and control teams can understand why a record was flagged, reproduce the result, and approve threshold changes. Historical outcomes can later support predictive ranking if governance permits.

### One exception, one accountable owner

Multiple collaborators may contribute, but a record has one accountable owner at a time. This prevents ambiguous handoffs and enables reliable SLA reporting.

### Resolution is not closure

An analyst can mark the underlying issue resolved, but the system closes the exception only after required evidence and reason codes are present. High-severity manual overrides require a second reviewer.

## Rollout

1. **Shadow mode:** run rules without changing the operating process; measure precision and missing data.
2. **Controlled pilot:** enable the queue for one team and a limited set of counterparties or markets.
3. **Parallel control:** compare the new queue with legacy reports through an agreed reconciliation period.
4. **Scaled adoption:** expand coverage after exit criteria and control-owner approval.
5. **Optimization:** tune thresholds using measured false positives, missed events, and resolution outcomes.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Noisy alerts reduce trust | Shadow mode, reason codes, precision monitoring, rule-level tuning |
| Missing events hide exposure | Source freshness controls and completeness reconciliation |
| Incorrect reference data changes severity | Effective-dated configuration and approval workflow |
| Users close records without proof | Required evidence and role-based closure permissions |
| Queue becomes a new system of record | Explicit boundaries and links back to authoritative platforms |
| SLA encourages superficial closure | Reopen monitoring and quality sampling |

## Outcome narrative

The value of the enhancement is operational control, not merely a new dashboard. A successful pilot would demonstrate earlier detection, faster accountable action, fewer aged exceptions, and complete evidence—without materially increasing false alerts or bypassing existing approvals.

