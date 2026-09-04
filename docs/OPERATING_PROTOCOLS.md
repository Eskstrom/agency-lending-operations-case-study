# Operating Protocols

These protocols describe a hypothetical operating model. Production procedures must be approved by the relevant operations, risk, compliance, legal, information-security, and audit stakeholders.

## 1. Detection protocol

1. Validate source identity, schema version, event time, and business date.
2. Quarantine malformed events and raise a data-quality incident; do not silently discard them.
3. Evaluate only active, effective-dated rules.
4. Store the rule ID, version, thresholds, and input snapshot used for each decision.
5. Deduplicate on exception type plus the configured business key.
6. Update an existing open exception when the same condition persists; do not create a daily duplicate.

## 2. Triage protocol

Every new exception receives:

- A severity from `S1` to `S4`.
- One accountable queue and one accountable owner.
- A due time based on the earliest applicable cutoff or SLA.
- A primary reason code and the rule explanation.
- Links to authoritative lifecycle records and supporting events.

| Severity | Definition | Acknowledge | Escalation pattern |
|---|---|---:|---|
| S1 Critical | Immediate material exposure, regulatory/control concern, or missed critical cutoff | 5 min | Operations lead immediately; control/risk path as configured |
| S2 High | Likely financial/client impact or cutoff at risk | 15 min | Team lead at 50% of remaining SLA |
| S3 Medium | Actionable break with limited near-term impact | 2 hours | Queue lead before SLA breach |
| S4 Low | Informational or low-impact reconciliation item | 1 business day | Daily aging review |

Severity is deterministic in the MVP. An override requires a reason; reducing S1/S2 severity requires an authorized reviewer.

## 3. Ownership and handoff protocol

- The routing engine assigns an initial queue using exception type, market, entity, and operating calendar.
- The queue lead assigns a named owner for S1/S2 items.
- A handoff records the sender, recipient, timestamp, reason, current diagnosis, next action, and due time.
- Ownership remains with the sender until the recipient accepts the handoff.
- Absence schedules route work to a designated backup; they must never result in an unowned exception.

## 4. Investigation protocol

The owner follows a reproducible sequence:

1. Confirm the alert is supported by authoritative events.
2. Check data freshness and reference-data version.
3. Compare expected and actual state.
4. Identify the most specific supported reason code.
5. Record actions taken and the next follow-up time.
6. Attach or link evidence without copying restricted data unnecessarily.
7. Escalate uncertainty when a control, legal, credit, or client decision is required.

## 5. Communication protocol

- Use approved channels and templates for external communication.
- Separate confirmed facts, working hypotheses, requested actions, and deadlines.
- Do not expose another client's or counterparty's information.
- Log the communication timestamp, recipient role, purpose, and reference—not credentials or unnecessary message content.
- Require approval for communications designated as material by policy.

## 6. Escalation protocol

Escalation occurs when any of the following is true:

- An acknowledgment or resolution SLA threshold is reached.
- A market, contractual, or downstream-delivery cutoff is at risk.
- Exposure or client impact crosses an approved threshold.
- The same issue recurs above a configured frequency.
- Required source data is unavailable or contradictory.
- The analyst identifies a potential control breach.

An escalation must identify the decision needed, decision owner, deadline, known impact, and current containment action.

## 7. Resolution and closure protocol

Resolution means the underlying condition no longer requires action. Closure additionally requires:

- A final reason and resolution code.
- Evidence supporting the outcome.
- Expected and actual values where applicable.
- Confirmation that linked child exceptions are resolved or explicitly separated.
- Second-person approval for defined S1/S2 overrides.
- A complete audit trail.

New contradictory evidence reopens the record and preserves the earlier closure history.

## 8. Daily control protocol

At each operating-day checkpoint, the queue lead reviews:

- Unowned and unacknowledged S1/S2 records.
- Items approaching cutoff or SLA breach.
- Aged exceptions and repeated reopenings.
- Data feeds with missed freshness thresholds.
- Manual severity changes and rule overrides.
- Closed records missing evidence.

The lead records completion, material findings, and follow-up owners.

## 9. Rule-change protocol

1. Document the problem, evidence, expected benefit, and affected population.
2. Version the rule and test it on historical/synthetic data.
3. Measure false positives, false negatives where observable, and volume change.
4. Obtain product, operations, and control-owner approval.
5. Deploy in shadow mode before enforcement when risk warrants.
6. Monitor outcomes and retain a rollback path.

## 10. Incident protocol

If detection or routing is unreliable, declare degraded mode, identify affected rules and time windows, activate approved fallback reports, reconcile records after recovery, and document missed or delayed exceptions. Recovery is not complete until backlog reconciliation is signed off.

