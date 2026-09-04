import tempfile, unittest
from pathlib import Path
from scripts.run_demo import build_database
class Controls(unittest.TestCase):
 @classmethod
 def setUpClass(c): c.tmp=tempfile.TemporaryDirectory(); c.db=build_database(Path(c.tmp.name)/"test.db")
 @classmethod
 def tearDownClass(c): c.db.close(); c.tmp.cleanup()
 def rows(s,v): return [tuple(r) for r in s.db.execute(f"SELECT * FROM {v} ORDER BY 1")]
 def test_unmatched(s): s.assertEqual([("INS-1",)],s.rows("unmatched_instructions"))
 def test_settlement(s): s.assertEqual([("INS-1",1000),("INS-3",500)],s.rows("settlement_fails"))
 def test_collateral(s): s.assertEqual([("VAL-1","COLLATERAL_DEFICIT"),("VAL-3","DATA_QUALITY")],s.rows("collateral_breaks"))
 def test_recall(s): s.assertEqual([("REC-1",600)],s.rows("overdue_recalls"))
 def test_fees(s): s.assertEqual([("FEE-1",),("FEE-3",)],s.rows("fee_discrepancies"))
 def test_owner(s): s.assertEqual([("EX-1",)],s.rows("unowned_high_severity"))
 def test_sla(s): s.assertEqual([("EX-1",),("EX-2",)],s.rows("breached_slas"))
 def test_closure(s): s.assertEqual([("EX-3",)],s.rows("closure_quality_breaks"))
 def test_duplicates(s): s.assertEqual([("SETTLEMENT_FAIL","INS-3",2)],s.rows("duplicate_open_exceptions"))
if __name__=="__main__": unittest.main()
