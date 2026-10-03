import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandMark, Fingerprint } from "@/components/passport/Fingerprint";
import { MAYA, TRIAL } from "@/lib/demo-data";

export const Route = createFileRoute("/trial/success")({
  head: () => ({
    meta: [
      { title: "Paid trial funded — Sprnkle Passport" },
      { name: "description", content: "The paid trial is funded. Completed work becomes new proof on the living profile." },
      { property: "og:title", content: "Paid trial funded — Sprnkle Passport" },
      { property: "og:description", content: "Identity created the match. Paid work creates the next piece of proof." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Success,
});

const LOOP = ["Professional identity", "Match", "Paid work", "Proof", "Stronger identity"];

function Success() {
  return (
    <div className="grain min-h-screen">
      <header className="mx-auto max-w-5xl px-8 py-6"><Link to="/"><BrandMark /></Link></header>
      <main className="mx-auto max-w-5xl px-8 pb-20 pt-8 text-center">
        <div className="flex justify-center"><Fingerprint traits={MAYA.traits} size={120} /></div>
        <p className="eyebrow mt-8 text-success">Paid trial funded</p>
        <h1 className="mt-3 font-display text-8xl tracking-tight">${TRIAL.amount}</h1>
        <p className="mt-3 text-xl">{MAYA.name} · {TRIAL.project}</p>
        <p className="mt-2 text-sm text-muted-foreground">Status: <span className="text-foreground">Ready to begin</span> · Candidate payout is future functionality.</p>

        <div className="mt-16 space-y-2 font-display text-3xl leading-tight">
          <p>Identity created the match.</p>
          <p className="italic text-spectrum">Paid work creates the next piece of proof.</p>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {LOOP.map((l, i) => (
            <div key={l} className="flex items-center gap-3">
              <span className="panel px-4 py-2 text-sm">{l}</span>
              {i < LOOP.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        <p className="eyebrow mt-20">Professional identity for the agent economy</p>
      </main>
    </div>
  );
}
