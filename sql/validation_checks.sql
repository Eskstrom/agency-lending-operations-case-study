/*
  Agency Lending Operations Case Study
  Illustrative PostgreSQL-compatible validation logic.

  Assumptions:
  - timestamps are stored in UTC;
  - quantities/amounts use governed units and currencies;
  - tolerances shown here are examples, not production policy;
  - authoritative production logic should use effective-dated configuration.
*/

-- 1. Instructions still unmatched 30 minutes after being sent.
select
    i.instruction_id,
    i.loan_id,
    i.intended_settlement_date,
    i.sent_at,
    i.match_status,
    current_timestamp - i.sent_at as unmatched_age
from settlement_instructions i
where i.match_status in ('UNMATCHED', 'MISMATCHED')
  and i.sent_at <= current_timestamp - interval '30 minutes'
  and i.cancelled_at is null;

-- 2. Settlement fails using the remaining quantity rather than original quantity.
with settled as (
    select
        s.instruction_id,
        sum(case when s.status = 'SETTLED' then s.settled_quantity else 0 end) as settled_quantity
    from settlements s
    group by s.instruction_id
)
select
    i.instruction_id,
    i.loan_id,
    i.quantity as expected_quantity,
    coalesce(s.settled_quantity, 0) as settled_quantity,
    i.quantity - coalesce(s.settled_quantity, 0) as outstanding_quantity
from settlement_instructions i
left join settled s on s.instruction_id = i.instruction_id
where i.intended_settlement_date <= current_date
  and i.cancelled_at is null
  and i.quantity > coalesce(s.settled_quantity, 0);

-- 3. Collateral deficits. Missing values are surfaced separately, never treated as zero.
select
    c.valuation_id,
    c.loan_id,
    c.valuation_at,
    c.required_collateral_value,
    c.eligible_collateral_value,
    c.required_collateral_value - c.eligible_collateral_value as deficit_value,
    case
        when c.required_collateral_value is null or c.eligible_collateral_value is null
            then 'DATA_QUALITY'
        when c.eligible_collateral_value < c.required_collateral_value
            then 'COLLATERAL_DEFICIT'
        else 'PASS'
    end as control_result
from collateral_valuations c
where c.required_collateral_value is null
   or c.eligible_collateral_value is null
   or c.eligible_collateral_value < c.required_collateral_value;

-- 4. Recalls past due with quantity still outstanding.
select
    r.recall_id,
    r.loan_id,
    r.due_at,
    r.recalled_quantity,
    coalesce(r.returned_quantity, 0) as returned_quantity,
    r.recalled_quantity - coalesce(r.returned_quantity, 0) as outstanding_quantity
from recalls r
where r.status not in ('CANCELLED', 'CLOSED')
  and r.due_at < current_timestamp
  and r.recalled_quantity > coalesce(r.returned_quantity, 0);

-- 5. Fee discrepancies above either USD 100 equivalent or 1%.
select
    f.accrual_id,
    f.loan_id,
    f.billing_period,
    f.expected_amount,
    f.reported_amount,
    abs(f.expected_amount - f.reported_amount) as absolute_variance,
    case
        when f.expected_amount = 0 then null
        else abs(f.expected_amount - f.reported_amount) / abs(f.expected_amount)
    end as percentage_variance
from fee_accruals f
where f.currency = 'USD'
  and (
      abs(f.expected_amount - f.reported_amount) > 100.00
      or (
          f.expected_amount <> 0
          and abs(f.expected_amount - f.reported_amount) / abs(f.expected_amount) > 0.01
      )
  );

-- 6. High-severity exceptions without accountable ownership.
select
    e.exception_id,
    e.exception_type,
    e.severity,
    e.status,
    e.created_at
from exceptions e
where e.status not in ('CLOSED', 'CANCELLED')
  and e.severity in ('S1', 'S2')
  and (e.owner_id is null or e.owner_queue is null);

-- 7. Open exceptions that have breached their resolution SLA.
select
    e.exception_id,
    e.exception_type,
    e.severity,
    e.owner_id,
    e.sla_due_at,
    current_timestamp - e.sla_due_at as overdue_by
from exceptions e
where e.status not in ('RESOLVED', 'CLOSED', 'CANCELLED')
  and e.sla_due_at < current_timestamp;

-- 8. Closure-quality check: closed records require evidence and resolution codes.
select
    e.exception_id,
    e.exception_type,
    e.severity,
    e.closed_at
from exceptions e
where e.status = 'CLOSED'
  and (
      e.resolution_code is null
      or not exists (
          select 1
          from exception_events ev
          where ev.exception_id = e.exception_id
            and ev.event_type = 'EVIDENCE_ATTACHED'
      )
  );

-- 9. Duplicate open exceptions for the same governed business key.
select
    e.exception_type,
    e.business_key,
    count(*) as open_exception_count
from exceptions e
where e.status not in ('CLOSED', 'CANCELLED')
group by e.exception_type, e.business_key
having count(*) > 1;

-- 10. Daily control summary suitable for reconciliation and trend monitoring.
select
    cast(e.created_at as date) as opened_date,
    e.exception_type,
    e.severity,
    count(*) as opened_count,
    count(*) filter (where e.status = 'CLOSED') as currently_closed_count,
    count(*) filter (where e.sla_due_at < coalesce(e.closed_at, current_timestamp)) as breached_count,
    avg(extract(epoch from (e.acknowledged_at - e.created_at)) / 60.0)
        filter (where e.acknowledged_at is not null) as avg_minutes_to_acknowledge
from exceptions e
group by cast(e.created_at as date), e.exception_type, e.severity
order by opened_date desc, e.exception_type, e.severity;

