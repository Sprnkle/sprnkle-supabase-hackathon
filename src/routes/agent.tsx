import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Check, CircleDashed, Loader2, ShieldCheck, X } from "lucide-react";
import { BrandMark, Fingerprint } from "@/components/passport/Fingerprint";
import { AGENT_STEPS, DEMO_BRIEF, MAYA, RUNNERS_UP, TRAITS, TRIAL } from "@/lib/demo-data";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "Agent workspace — Sprnkle Passport" },
      { name: "description", content: "Watch the Sprnkle agent search structured identities, weigh evidence, and surface uncertainty." },
      { property: "og:title", content: "Agent workspace — Sprnkle Passport" },
      { property: "og:description", content: "Evidence-backed matching with human-approved paid trials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgentWorkspace,
});

function AgentWorkspace() {
  const [brief, setBrief] = useState(DEMO_BRIEF);
  const [step, setStep] = useState(0);
  const [approving, setApproving] = useState(false);
  const done = step >= AGENT_STEPS.length;

  useEffect(() => {
    const b = sessionStorage.getItem("sprnkle-brief");
    if (b) setBrief(b);
  }, []);
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [step, done]);

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b px-8 py-4">
        <Link to="/"><BrandMark /></Link>
        <span className="eyebrow">Agent session · demo mode</span>
      </header>

      <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr_280px]">
        <aside className="space-y-6">
          <section className="panel p-5">
            <p className="eyebrow mb-3">Employer request</p>
            <p className="font-display text-lg leading-snug">"{brief}"</p>
          </section>
          <section className="panel p-5">
            <p className="eyebrow mb-3">Agent activity</p>
            <ol className="space-y-3">
              {AGENT_STEPS.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  {i < step ? <Check className="mt-0.5 h-4 w-4 text-success" />
                    : i === step ? <Loader2 className="mt-0.5 h-4 w-4 animate-spin" />
                    : <CircleDashed className="mt-0.5 h-4 w-4 text-muted-foreground/40" />}
                  <div className={i > step ? "text-muted-foreground/50" : ""}>
                    {s.label}{i === step ? "…" : ""}
                    <div className="font-mono text-[10px] text-muted-foreground">{s.tool}()</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </aside>

        <main>{done ? <MatchResult onTrial={() => setApproving(true)} /> : <Working step={step} />}</main>

        <aside><Permissions /></aside>
      </div>

      {approving && <ApprovalPanel brief={brief} onCancel={() => setApproving(false)} />}
    </div>
  );
}

function Working({ step }: { step: number }) {
  return (
    <div className="panel flex min-h-[560px] flex-col items-center justify-center gap-6 p-10 text-center">
      <div className="animate-spin [animation-duration:6s]"><Fingerprint size={140} /></div>
      <div>
        <p className="eyebrow">Sprnkle Agent</p>
        <p className="mt-2 font-display text-3xl">{AGENT_STEPS[step]?.label}…</p>
      </div>
    </div>
  );
}

function Permissions() {
  const can = ["Public identity", "Capabilities", "Evidence", "Working style", "Opportunity preferences"];
  const cannot = ["Modify a profile", "Send an offer", "Initiate payment without human approval"];
  return (
    <section className="panel p-5">
      <div className="mb-4 flex items-center gap-2"><ShieldCheck className="h-4 w-4" /><p className="eyebrow text-foreground">Agent permissions</p></div>
      <p className="mb-2 text-xs text-muted-foreground">This agent can access</p>
      <ul className="mb-5 space-y-1.5 text-sm">
        {can.map((c) => <li key={c} className="flex gap-2"><Check className="h-4 w-4 text-success" />{c}</li>)}
      </ul>
      <p className="mb-2 text-xs text-muted-foreground">It cannot</p>
      <ul className="space-y-1.5 text-sm">
        {cannot.map((c) => <li key={c} className="flex gap-2"><X className="h-4 w-4 shrink-0 text-destructive" />{c}</li>)}
      </ul>
    </section>
  );
}

function MatchResult({ onTrial }: { onTrial: () => void }) {
  const m = MAYA;
  return (
    <div className="animate-rise space-y-6">
      <p className="eyebrow">Best match found</p>
      <section className="panel grid items-center gap-8 p-8 md:grid-cols-[auto_1fr_auto]">
        <Fingerprint traits={m.traits} size={150} />
        <div>
          <h1 className="font-display text-5xl tracking-tight">{m.name}</h1>
          <p className="mt-1 text-muted-foreground">{m.title} · {m.location}</p>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            {TRAITS.map((t) => (
              <span key={t.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />{t.label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="font-display text-7xl leading-none">{m.alignment}<span className="text-3xl">%</span></div>
          <p className="eyebrow mt-2">Alignment</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="panel p-6">
          <div className="mb-4 flex justify-between"><p className="eyebrow">Required capabilities</p><span className="font-mono text-xs">{m.requiredMet} / 4</span></div>
          <ul className="space-y-3">
            {m.capabilities.map((c) => (
              <li key={c.name} className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
                <span className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full" style={{ background: TRAITS.find((t) => t.key === c.trait)!.color }} />{c.name}</span>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${c.evidenceBacked ? "border-success/40 text-success" : "text-muted-foreground"}`}>{c.proof}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-6">
          <p className="eyebrow mb-4">Proof</p>
          <div className="grid grid-cols-2 gap-4">
            {m.proof.map((p) => (
              <div key={p.label}><div className="font-display text-4xl">{p.value}</div><p className="text-xs text-muted-foreground">{p.label}</p></div>
            ))}
          </div>
          <p className="eyebrow mb-2 mt-6">Working style</p>
          <div className="flex flex-wrap gap-2">
            {m.workingStyle.map((w) => <span key={w} className="rounded-full bg-secondary px-3 py-1 text-sm">{w}</span>)}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-warning/40 bg-warning/5 p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
          <div><p className="eyebrow text-warning">Uncertainty</p><p className="mt-1 text-lg">{m.uncertainty}</p></div>
        </div>
      </section>

      <section className="panel p-6">
        <p className="eyebrow mb-3">Also considered</p>
        <ul className="space-y-2 text-sm">
          {RUNNERS_UP.map((r) => (
            <li key={r.name} className="flex justify-between gap-4"><span>{r.name} <span className="text-muted-foreground">— {r.note}</span></span><span className="font-mono">{r.alignment}%</span></li>
          ))}
        </ul>
      </section>

      <div className="flex justify-end">
        <button onClick={onTrial} className="rounded-full bg-primary px-7 py-3 font-medium text-primary-foreground hover:opacity-90">
          Create ${TRIAL.amount} paid trial
        </button>
      </div>
    </div>
  );
}

function ApprovalPanel({ brief, onCancel }: { brief: string; onCancel: () => void }) {
  const navigate = useNavigate();
  const rows = [["Candidate", MAYA.name], ["Project", TRIAL.project], ["Duration", TRIAL.duration], ["Budget", `$${TRIAL.amount}`]];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm">
      <div className="panel w-full max-w-lg animate-rise overflow-hidden">
        <div className="h-1 bg-spectrum" />
        <div className="p-8">
          <p className="eyebrow">Paid trial · draft</p>
          <dl className="mt-5 space-y-3">
            {rows.map(([k, v]) => <div key={k} className="flex justify-between border-b pb-3"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
          </dl>
          <p className="eyebrow mb-2 mt-6">The agent recommends this trial because</p>
          <ul className="space-y-1.5 text-sm">
            <li className="flex gap-2"><Check className="h-4 w-4 text-success" />4 / 4 required capabilities align</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-success" />3 are evidence-backed</li>
            <li className="flex gap-2"><Check className="h-4 w-4 text-success" />Working style fits the collaboration brief</li>
          </ul>
          <p className="mt-6 rounded-lg bg-secondary p-3 text-sm"><ShieldCheck className="mr-1.5 inline h-4 w-4" />Human approval is required before payment.</p>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="rounded-full border px-5 py-2.5 text-sm hover:bg-accent">Cancel</button>
            <button
              onClick={() => { sessionStorage.setItem("sprnkle-brief", brief); navigate({ to: "/trial/success" }); }}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Approve & fund ${TRIAL.amount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
