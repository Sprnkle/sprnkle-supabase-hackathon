import { TRAITS, type TraitKey } from "@/lib/demo-data";

/** Fingerprint-inspired mark: concentric trait arcs, length = trait strength. */
export function Fingerprint({ traits, size = 160 }: { traits?: Record<TraitKey, number>; size?: number }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      {TRAITS.map((t, i) => {
        const r = c - 6 - i * (size / 18);
        const circ = 2 * Math.PI * r;
        const v = traits ? traits[t.key] : 0.55 + ((i * 37) % 40) / 100;
        return (
          <g key={t.key} transform={`rotate(${-90 + i * 23} ${c} ${c})`}>
            <circle cx={c} cy={c} r={r} fill="none" stroke="currentColor" strokeOpacity={0.06} strokeWidth={3} />
            <circle
              cx={c} cy={c} r={r} fill="none" stroke={t.color} strokeWidth={3} strokeLinecap="round"
              strokeDasharray={`${circ * v} ${circ}`}
            />
          </g>
        );
      })}
    </svg>
  );
}

export function BrandMark() {
  return (
    <div className="flex items-center gap-2.5">
      <Fingerprint size={22} />
      <span className="font-display text-lg tracking-tight">Sprnkle <span className="italic text-muted-foreground">Passport</span></span>
    </div>
  );
}
