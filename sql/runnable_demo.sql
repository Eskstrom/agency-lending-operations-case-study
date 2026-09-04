PRAGMA foreign_keys = ON;
CREATE TABLE loans (loan_id TEXT PRIMARY KEY, security_id TEXT, counterparty TEXT, client_account TEXT);
CREATE TABLE instructions (instruction_id TEXT PRIMARY KEY, loan_id TEXT REFERENCES loans, quantity INTEGER, settle_date TEXT, sent_at TEXT, match_status TEXT);
CREATE TABLE settlements (settlement_id TEXT PRIMARY KEY, instruction_id TEXT REFERENCES instructions, settled_quantity INTEGER);
CREATE TABLE collateral (valuation_id TEXT PRIMARY KEY, loan_id TEXT REFERENCES loans, required_value REAL, eligible_value REAL);
CREATE TABLE recalls (recall_id TEXT PRIMARY KEY, loan_id TEXT REFERENCES loans, due_at TEXT, recalled_quantity INTEGER, returned_quantity INTEGER, status TEXT);
CREATE TABLE fees (accrual_id TEXT PRIMARY KEY, loan_id TEXT REFERENCES loans, expected_amount REAL, reported_amount REAL);
CREATE TABLE exceptions (exception_id TEXT PRIMARY KEY, exception_type TEXT, business_key TEXT, severity TEXT, status TEXT, owner_id TEXT, owner_queue TEXT, sla_due_at TEXT, resolution_code TEXT);
CREATE TABLE exception_events (event_id TEXT PRIMARY KEY, exception_id TEXT REFERENCES exceptions, event_type TEXT);

INSERT INTO loans VALUES ('LN-1','SEC-1','Borrower Alpha','Owner A'),('LN-2','SEC-2','Borrower Beta','Owner B'),('LN-3','SEC-3','Borrower Gamma','Owner C');
INSERT INTO instructions VALUES ('INS-1','LN-1',1000,'2026-01-14','2026-01-14 13:00','UNMATCHED'),('INS-2','LN-2',2000,'2026-01-15','2026-01-15 13:45','MATCHED'),('INS-3','LN-3',1500,'2026-01-14','2026-01-14 12:00','MATCHED');
INSERT INTO settlements VALUES ('SET-2','INS-2',2000),('SET-3','INS-3',1000);
INSERT INTO collateral VALUES ('VAL-1','LN-1',105000,103500),('VAL-2','LN-2',210000,215000),('VAL-3','LN-3',155000,NULL);
INSERT INTO recalls VALUES ('REC-1','LN-1','2026-01-15 13:30',1000,400,'PARTIAL'),('REC-2','LN-2','2026-01-15 15:00',2000,0,'OPEN');
INSERT INTO fees VALUES ('FEE-1','LN-1',1000,850),('FEE-2','LN-2',1000,995),('FEE-3','LN-3',0,125);
INSERT INTO exceptions VALUES ('EX-1','SETTLEMENT_FAIL','INS-3','S2','INVESTIGATING',NULL,'SETTLEMENT','2026-01-15 13:00',NULL),('EX-2','RECALL_OVERDUE','REC-1','S1','ACKNOWLEDGED','analyst-1','RECALLS','2026-01-15 13:30',NULL),('EX-3','FEE_DISCREPANCY','FEE-1','S3','CLOSED','analyst-2','BILLING','2026-01-14 18:00',NULL),('EX-4','SETTLEMENT_FAIL','INS-3','S3','ASSIGNED','analyst-3','SETTLEMENT','2026-01-15 15:00',NULL);

CREATE VIEW unmatched_instructions AS SELECT instruction_id FROM instructions WHERE match_status IN ('UNMATCHED','MISMATCHED') AND datetime(sent_at)<=datetime('2026-01-15 14:00','-30 minutes');
CREATE VIEW settlement_fails AS WITH s AS (SELECT instruction_id,SUM(settled_quantity) settled FROM settlements GROUP BY instruction_id) SELECT i.instruction_id,i.quantity-COALESCE(s.settled,0) outstanding FROM instructions i LEFT JOIN s USING(instruction_id) WHERE date(i.settle_date)<=date('2026-01-15') AND i.quantity>COALESCE(s.settled,0);
CREATE VIEW collateral_breaks AS SELECT valuation_id,CASE WHEN eligible_value IS NULL THEN 'DATA_QUALITY' ELSE 'COLLATERAL_DEFICIT' END result FROM collateral WHERE eligible_value IS NULL OR eligible_value<required_value;
CREATE VIEW overdue_recalls AS SELECT recall_id,recalled_quantity-COALESCE(returned_quantity,0) outstanding FROM recalls WHERE status NOT IN ('CLOSED','CANCELLED') AND datetime(due_at)<datetime('2026-01-15 14:00');
CREATE VIEW fee_discrepancies AS SELECT accrual_id FROM fees WHERE ABS(expected_amount-reported_amount)>100 OR (expected_amount<>0 AND ABS(expected_amount-reported_amount)/ABS(expected_amount)>0.01);
CREATE VIEW unowned_high_severity AS SELECT exception_id FROM exceptions WHERE status NOT IN ('CLOSED','CANCELLED') AND severity IN ('S1','S2') AND owner_id IS NULL;
CREATE VIEW breached_slas AS SELECT exception_id FROM exceptions WHERE status NOT IN ('RESOLVED','CLOSED','CANCELLED') AND datetime(sla_due_at)<datetime('2026-01-15 14:00');
CREATE VIEW closure_quality_breaks AS SELECT e.exception_id FROM exceptions e WHERE status='CLOSED' AND (resolution_code IS NULL OR NOT EXISTS (SELECT 1 FROM exception_events v WHERE v.exception_id=e.exception_id AND v.event_type='EVIDENCE_ATTACHED'));
CREATE VIEW duplicate_open_exceptions AS SELECT exception_type,business_key,COUNT(*) count FROM exceptions WHERE status NOT IN ('CLOSED','CANCELLED') GROUP BY exception_type,business_key HAVING COUNT(*)>1;
