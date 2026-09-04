from pathlib import Path
import sqlite3
ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "output" / "agency_lending_demo.db"
CONTROLS = ["unmatched_instructions","settlement_fails","collateral_breaks","overdue_recalls","fee_discrepancies","unowned_high_severity","breached_slas","closure_quality_breaks","duplicate_open_exceptions"]
def build_database(path=DB):
    path=Path(path); path.parent.mkdir(exist_ok=True)
    if path.exists(): path.unlink()
    db=sqlite3.connect(path); db.row_factory=sqlite3.Row
    db.executescript((ROOT/"sql"/"runnable_demo.sql").read_text(encoding="utf-8"))
    return db
def main():
    db=build_database()
    print("Synthetic run as of 2026-01-15 14:00 UTC")
    for name in CONTROLS:
        rows=db.execute(f"SELECT * FROM {name} ORDER BY 1").fetchall()
        print(f"\n{name}: {len(rows)} break(s)")
        for row in rows: print(" ",dict(row))
    db.close()
if __name__=="__main__": main()
