'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight, Clock3, Database, Filter, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const cases = [
  { id: 'EX-1002', type: 'Recall overdue', ref: 'REC-1001', severity: 'S1', status: 'Acknowledged', owner: 'M. Chen', queue: 'Recalls', age: '30m', due: 'Breached 30m', impact: '$1.84M', reason: '600 shares remain outstanding after the contractual return deadline.', next: 'Confirm borrower delivery status and assess downstream client obligation.', evidence: ['Recall sent 12:30 UTC', '400 of 1,000 shares returned', 'SLA escalation logged 13:30 UTC'] },
  { id: 'EX-1001', type: 'Settlement fail', ref: 'INS-1003', severity: 'S2', status: 'Investigating', owner: 'Unassigned', queue: 'US settlement', age: '2h', due: 'Breached 1h', impact: '$742K', reason: 'Only 1,000 of 1,500 shares settled by the intended settlement date.', next: 'Assign an owner and confirm counterparty fail reason before market cutoff.', evidence: ['Instruction matched', 'Partial settlement received', '500 shares outstanding'] },
  { id: 'EX-1006', type: 'Collateral deficit', ref: 'VAL-1001', severity: 'S2', status: 'Assigned', owner: 'A. Rivera', queue: 'Collateral', age: '18m', due: '42m remaining', impact: '$1.5K', reason: 'Eligible collateral is below the haircut-adjusted requirement.', next: 'Validate valuation inputs and request additional eligible collateral.', evidence: ['$105,000 required', '$103,500 eligible', 'Pricing feed current'] },
  { id: 'EX-1007', type: 'Data quality', ref: 'VAL-1003', severity: 'S3', status: 'New', owner: 'Data ops', queue: 'Data quality', age: '5m', due: '1h 55m', impact: 'Unknown', reason: 'Eligible collateral value is missing; exposure cannot be evaluated safely.', next: 'Restore the valuation input and replay the affected control.', evidence: ['Required value present', 'Eligible value null', 'Record quarantined'] },
  { id: 'EX-1008', type: 'Fee discrepancy', ref: 'FEE-1001', severity: 'S3', status: 'Investigating', owner: 'J. Patel', queue: 'Billing', age: '1d', due: '6h remaining', impact: '$150', reason: 'Reported fee differs from expected accrual by 15%, above tolerance.', next: 'Compare rate, balance, and billing-period inputs.', evidence: ['$1,000 expected', '$850 reported', 'Tolerance: $100 or 1%'] },
];

const severityStyle: Record<string, string> = { S1: 'bg-red-50 text-red-700 ring-red-200', S2: 'bg-amber-50 text-amber-800 ring-amber-200', S3: 'bg-sky-50 text-sky-700 ring-sky-200' };

export default function Home() {
  const [severity, setSeverity] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('EX-1002');
  const filtered = useMemo(() => cases.filter((item) => (severity === 'All' || item.severity === severity) && `${item.id} ${item.type} ${item.ref} ${item.owner}`.toLowerCase().includes(query.toLowerCase())), [severity, query]);
  const selected = cases.find((item) => item.id === selectedId) ?? filtered[0] ?? cases[0];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-[#071d2b] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-teal-400/15 ring-1 ring-teal-300/30"><ShieldCheck className="size-5 text-teal-300" /></div><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-teal-300">Agency Lending</p><h1 className="text-base font-semibold tracking-tight">Exception Control Center</h1></div></div>
          <div className="flex items-center gap-3 text-xs text-slate-300"><span className="hidden sm:inline">Synthetic portfolio environment</span><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 font-medium text-emerald-300 ring-1 ring-emerald-300/20">All feeds current</span><div className="grid size-8 place-items-center rounded-full bg-slate-700 font-semibold">GS</div></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-6 lg:px-8">
        <section className="mb-6 flex flex-col justify-between gap-3 lg:flex-row lg:items-end"><div><p className="text-sm font-medium text-muted-foreground">Thursday, 15 January 2026 · 14:00 UTC</p><h2 className="mt-1 text-2xl font-semibold tracking-tight">Operational risk queue</h2></div><div className="flex items-center gap-2 text-xs text-muted-foreground"><Database className="size-4 text-teal-600" />9 controls evaluated · 13 synthetic records</div></section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[['Open exceptions','5','2 need immediate action',AlertTriangle,'text-red-600'],['SLA breached','2','Both escalated',Clock3,'text-amber-600'],['Exposure at risk','$2.58M','Across 3 material cases',ArrowUpRight,'text-sky-600'],['Control health','9 / 9','Validation tests passing',CheckCircle2,'text-emerald-600']].map(([label,value,note,Icon,color]) => <article key={String(label)} className="rounded-xl border border-border bg-card p-4 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-muted-foreground">{String(label)}</p><p className="mt-2 text-2xl font-semibold tracking-tight">{String(value)}</p></div><div className="rounded-lg bg-muted p-2"><Icon className={`size-4 ${color}`} /></div></div><p className="mt-2 text-xs text-muted-foreground">{String(note)}</p></article>)}
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,.75fr)]">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-semibold">Exception queue</h3><p className="text-xs text-muted-foreground">Ranked by severity, cutoff proximity, and exposure</p></div><div className="flex flex-wrap gap-2"><label className="relative"><Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search exceptions" placeholder="Search cases" className="h-9 w-44 rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></label><div className="flex items-center rounded-lg border border-input bg-background p-1"><Filter className="mx-1 size-3.5 text-muted-foreground" />{['All','S1','S2','S3'].map((level) => <button key={level} onClick={() => setSeverity(level)} className={`rounded-md px-2 py-1 text-xs font-medium ${severity === level ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{level}</button>)}</div></div></div>
            <Table><TableHeader><TableRow className="bg-muted/40"><TableHead className="pl-4">Priority</TableHead><TableHead>Exception</TableHead><TableHead>Status</TableHead><TableHead>Owner</TableHead><TableHead>Due</TableHead><TableHead className="text-right">Exposure</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filtered.map((item) => <TableRow key={item.id} onClick={() => setSelectedId(item.id)} data-state={selected.id === item.id ? 'selected' : undefined} className="cursor-pointer"><TableCell className="pl-4"><span className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${severityStyle[item.severity]}`}>{item.severity}</span></TableCell><TableCell><p className="font-medium">{item.type}</p><p className="text-xs text-muted-foreground">{item.id} · {item.ref} · {item.age}</p></TableCell><TableCell><span className="text-xs font-medium">{item.status}</span></TableCell><TableCell className={item.owner === 'Unassigned' ? 'font-medium text-red-600' : ''}>{item.owner}</TableCell><TableCell className={item.due.includes('Breached') ? 'font-medium text-red-600' : 'text-muted-foreground'}>{item.due}</TableCell><TableCell className="text-right font-mono text-xs">{item.impact}</TableCell><TableCell><ChevronRight className="size-4 text-muted-foreground" /></TableCell></TableRow>)}</TableBody></Table>
            {filtered.length === 0 && <div className="p-12 text-center text-sm text-muted-foreground">No exceptions match these filters.</div>}
          </div>

          <aside className="self-start overflow-hidden rounded-xl border border-border bg-card shadow-sm xl:sticky xl:top-5">
            <div className="border-b border-border bg-[#0d2a3b] p-5 text-white"><div className="flex items-center justify-between"><span className={`rounded-md px-2 py-1 text-xs font-bold ring-1 ${severityStyle[selected.severity]}`}>{selected.severity}</span><span className="font-mono text-xs text-slate-300">{selected.id}</span></div><h3 className="mt-4 text-xl font-semibold">{selected.type}</h3><p className="mt-1 text-sm text-slate-300">{selected.ref} · {selected.queue}</p></div>
            <div className="space-y-5 p-5"><div><p className="detail-label">Why it was raised</p><p className="mt-2 text-sm leading-6">{selected.reason}</p></div><div className="grid grid-cols-2 gap-3"><div className="detail-box"><p className="detail-label">Owner</p><p className="mt-1 text-sm font-semibold">{selected.owner}</p></div><div className="detail-box"><p className="detail-label">Exposure</p><p className="mt-1 text-sm font-semibold">{selected.impact}</p></div></div><div><p className="detail-label">Required next action</p><p className="mt-2 rounded-lg border-l-2 border-teal-500 bg-teal-50 p-3 text-sm leading-5 text-teal-950">{selected.next}</p></div><div><p className="detail-label">Control evidence</p><ol className="mt-3 space-y-3">{selected.evidence.map((event,index) => <li key={event} className="flex gap-3 text-sm"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal-500 ring-4 ring-teal-50" /><span>{event}</span></li>)}</ol></div><div className="flex gap-2 border-t border-border pt-4"><Button className="flex-1">Open case</Button><Button variant="outline">Reassign</Button></div></div>
          </aside>
        </section>
        <footer className="mt-6 flex flex-col justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row"><span>Portfolio prototype · All names, values, and records are synthetic</span><span>Rule snapshot v1.0 · Last evaluation 14:00:03 UTC</span></footer>
      </div>
    </main>
  );
}
