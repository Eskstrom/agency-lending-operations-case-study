# Lifecycle and Workflows

## End-to-end lifecycle

| Stage | Primary event | Key control | Common exception |
|---|---|---|---|
| Locate and availability | Inventory identified | Availability and restriction check | Inventory no longer available |
| Negotiation | Terms agreed | Counterparty, limit, and term validation | Terms outside approved parameters |
| Booking | Loan captured | Required fields and duplicate check | Missing or duplicate booking |
| Instruction and matching | Settlement instruction sent | SSI and economics match | Unmatched or mismatched instruction |
| Settlement | Securities/cash movement confirmed | Expected vs. actual settlement | Partial or failed settlement |
| Collateral and mark-to-market | Exposure and requirement recalculated | Coverage and eligibility control | Deficit, concentration, stale price |
| Income and fees | Accrual/payment calculated | Rate, balance, currency reconciliation | Fee or manufactured-payment break |
| Recall and return | Return requested/received | Due-date and quantity tracking | Overdue or partial recall |
| Close and reconcile | Balances reduced to zero | Position, cash, and fee reconciliation | Residual balance or orphan event |

## Target-state exception flow

```mermaid
flowchart TD
    A[Lifecycle event received] --> B{Schema and freshness valid?}
    B -- No --> DQ[Create data-quality incident]
    B -- Yes --> C[Evaluate approved rules]
    C --> D{Exception condition met?}
    D -- No --> E[Record control result]
    D -- Yes --> F{Existing open exception?}
    F -- Yes --> G[Update evidence, severity, and due time]
    F -- No --> H[Create exception and immutable rule snapshot]
    G --> I[Route to accountable queue]
    H --> I
    I --> J[Owner acknowledges and investigates]
    J --> K{External or internal action required?}
    K -- Yes --> L[Record action and follow-up time]
    K -- No --> M[Document determination]
    L --> N{Resolved?}
    M --> N
    N -- No --> O{SLA threshold reached?}
    O -- Yes --> P[Escalate]
    O -- No --> J
    P --> J
    N -- Yes --> Q[Attach evidence and reason code]
    Q --> R{Closure controls pass?}
    R -- No --> J
    R -- Yes --> S[Close and retain audit history]
```

## Exception state model

```mermaid
stateDiagram-v2
    [*] --> New
    New --> Assigned
    Assigned --> Acknowledged
    Acknowledged --> Investigating
    Investigating --> PendingExternal
    PendingExternal --> Investigating
    Investigating --> Resolved
    Resolved --> Closed: evidence complete
    Resolved --> Investigating: closure check fails
    Closed --> Reopened: new contradictory event
    Reopened --> Assigned
```

## Five MVP exception paths

### Unmatched instruction

Trigger when a sent instruction remains unmatched past its configured tolerance or economics differ on a matched record. Enrich with market, security, quantity, counterparty, intended settlement date, match status, and cutoff. Close after a confirmed match or an approved cancellation is evidenced.

### Settlement fail

Trigger when the settled quantity is below the expected quantity after the relevant checkpoint. Severity increases with approaching cutoff, fail age, materiality, recall linkage, and client impact. Close after full settlement, approved cancellation, or authorized adjustment.

### Collateral deficit

Trigger when eligible collateral value falls below the requirement after approved haircuts and tolerances. Preserve calculation timestamp and input lineage. Close only when a subsequent authoritative calculation demonstrates sufficient coverage or an authorized override is approved.

### Overdue recall

Trigger when recalled quantity remains outstanding after the due time. Highlight partial returns and approaching downstream delivery obligations. Close when the recalled quantity is fully returned or the recall is amended/cancelled with authorization.

### Fee discrepancy

Trigger when expected and reported accruals differ above absolute or percentage tolerance. Group related daily breaks to avoid alert multiplication. Close following correction, documented timing difference, or approved write-off path.

