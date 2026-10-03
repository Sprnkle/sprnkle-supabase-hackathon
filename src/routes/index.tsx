import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandMark, Fingerprint } from "@/components/passport/Fingerprint";
import { DEMO_BRIEF } from "@/lib/demo-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sprnkle Passport — Professional identity for the agent economy" },
      { name: "description", content: "Structured, permissioned professional identity that lets AI agents match, explain, and propose paid work with human approval." },
      { property: "og:title", content: "Sprnkle Passport" },
      { property: "og:description", content: "Give agents the human context résumés leave out." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PILLARS = [
  { k: "Identity", d: "Who they are and how they work.", c: "var(--trait-leadership)" },
  { k: "Proof", d: "What they can actually do — backed by evidence.", c: "var(--trait-problem)" },
  { k: "Action", d: "Match, explain, and create opportunities with human approval.", c: "var(--trait-collaboration)" },
];

function Landing() {
  const [brief, setBrief] = useState(DEMO_BRIEF);
  const navigate = useNavigate();
  return (
    <div className="grain min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
        <BrandMark />
        <span className="eyebrow">Hackathon prototype · synthetic data</span>
      </header>

      <main className="mx-auto max-w-6xl px-8 pb-20 pt-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="animate-rise">
            <p className="eyebrow mb-6">Professional identity for the agent economy</p>
            <h1 className="font-display text-6xl leading-[1.02] tracking-tight lg:text-7xl">
              Give agents<br />the <span className="italic text-spectrum">human context</span><br />résumés leave out.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Structured, permissioned professional identity for the agent economy.
            </p>
          </div>
          <div className="hidden justify-center text-foreground lg:flex">
            <Fingerprint size={300} />
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.k} className="bg-background p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: p.c }} />
                <span className="eyebrow text-foreground">{p.k}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>

        <form
          className="panel mt-14 p-8"
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("sprnkle-brief", brief);
            navigate({ to: "/agent" });
          }}
        >
          <label htmlFor="brief" className="eyebrow">What are you looking for?</label>
          <textarea
            id="brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={4}
            className="mt-4 w-full resize-none bg-transparent font-display text-2xl leading-snug outline-none placeholder:text-muted-foreground"
          />
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <p className="eyebrow">Powered by Supabase · Claude · Vercel · Stripe</p>
            <button
              type="submit"
              disabled={!brief.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            >
              Find the right person <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
