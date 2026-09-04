# User Acceptance Test Plan

## Purpose

Validate that the Exception Control Center detects, routes, manages, escalates, and closes in-scope exceptions according to approved requirements and operating protocols.

## Test roles

- Operations analyst: executes queue and investigation scenarios.
- Queue lead: validates assignment, escalation, and oversight.
- Control owner: validates rule evidence and closure controls.
- Product/technology: resolves defects and maintains traceability.

## Entry criteria

- Requirements and rule configuration are baselined.
- Test environment, roles, calendars, and synthetic data are available.
- Source-to-target reconciliation has passed.
- Unit, integration, security, and critical-path system testing are complete.
- Known defects and workarounds are documented.

## Exit criteria

- 100% of critical scenarios executed.
- No open severity-1 or severity-2 defects.
- At least 95% overall pass rate, with remaining defects explicitly accepted.
- Rule outputs reconcile to expected test populations.
- Operations and control owners sign off.

## UAT scenarios

| ID | Requirement | Scenario | Expected result |
|---|---|---|---|
| UAT-01 | FR-01 | Submit a valid lifecycle event | Event is accepted, timestamped, and traceable to its source |
| UAT-02 | FR-01 | Submit event missing a critical key | Event is quarantined; data-quality incident and metric are created |
| UAT-03 | FR-02 | Instruction remains unmatched beyond tolerance | One exception opens with the correct rule version and evidence |
| UAT-04 | FR-03 | Replay the same source event | No duplicate exception or duplicated workflow action is created |
| UAT-05 | FR-04 | Create high-value fail near cutoff | Deterministic severity and due time match configuration |
| UAT-06 | FR-05 | Route an S2 collateral deficit | Correct queue and owner receive it; assignment history is recorded |
| UAT-07 | FR-05 | Recipient rejects a handoff | Original owner remains accountable and rejection is audited |
| UAT-08 | FR-06 | Attempt an invalid state transition | Change is rejected with a useful error; state remains unchanged |
| UAT-09 | FR-06 | Receive contradictory event after closure | Exception reopens and prior closure history remains intact |
| UAT-10 | FR-07 | Close an S2 item without evidence | Closure is blocked and missing requirements are shown |
| UAT-11 | FR-08 | Leave an S1 unacknowledged | Correct escalation fires at the configured threshold and is logged |
| UAT-12 | FR-08 | Reprocess the escalation job | Duplicate notification is suppressed for the same tier |
| UAT-13 | FR-09 | Filter by market, owner, severity, and age | Results and counts match the underlying population |
| UAT-14 | FR-10 | Inspect an exception chronology | User can reproduce opening, updates, actions, and resolution |
| UAT-15 | FR-12 | Export an audit package | Authorized user receives complete history; unauthorized user is denied |
| UAT-16 | FR-13 | Analyst lowers S1 severity | Change remains pending until authorized review; reason is required |
| UAT-17 | Rule | Partial settlement occurs | Outstanding quantity—not original quantity—drives the open fail |
| UAT-18 | Rule | Collateral equals requirement exactly | No deficit is raised when tolerance is zero |
| UAT-19 | Rule | Recall is partially returned | Exception shows remaining quantity and stays open |
| UAT-20 | Rule | Fee variance is under tolerance | No exception opens; control result is recorded |
| UAT-21 | NFR-06 | Replay events after processing interruption | Results are complete, ordered safely, and idempotent |
| UAT-22 | NFR-08 | Open exception explanation | UI shows rule, threshold, actual value, and relevant timestamps |

## Boundary and negative tests

- Exactly at, one unit below, and one unit above each threshold.
- Null, zero, negative, and maximum supported quantities/amounts.
- Cutoffs across daylight-saving changes and market holidays.
- Late, duplicated, out-of-order, and corrected events.
- Missing FX, price, calendar, or reference data.
- Unauthorized access across client/entity boundaries.
- Simultaneous assignment and closure attempts.

## Defect protocol

Each defect records scenario, environment, data set, expected/actual result, reproducibility, severity, evidence, owner, and requirement ID. Any proposed workaround is reviewed for control impact. Retesting includes the failed scenario and relevant regression set.

## Traceability summary

Every `Must` requirement has at least one positive and one negative or boundary scenario. SQL control outputs are reconciled to the same synthetic UAT population so implementation and acceptance logic do not drift.

