# Run the control demonstration

Python 3 is the only requirement; SQLite is included with Python.

```bash
python scripts/run_demo.py
python -m unittest discover -v
```

The demo rebuilds `output/agency_lending_demo.db` and evaluates nine controls against fixed, fully synthetic records at `2026-01-15 14:00 UTC`. Tests cover unmatched and partial settlements, collateral deficit and missing data, overdue recall, fee differences, ownership, SLA, closure-evidence, and duplicate-case controls.
