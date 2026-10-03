import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Candidate } from "./demo-data";

type DbCandidate = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  location: string;
  hourly_rate: number;
  availability: string;
  bio: string;
  uncertainty_note: string | null;
};

export type MatchResult = {
  top: Candidate;
  runnersUp: { name: string; alignment: number; note: string }[];
  reasons: string[];
};

const TRAIT_KEYS = ["leadership", "composure", "adaptability", "communication", "problem", "creativity", "collaboration"] as const;

export const matchCandidates = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ brief: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<MatchResult> => {
    const supabase = createClient(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_PUBLISHABLE_KEY"]!,
      { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
    );

    const { data: candidates, error } = await supabase
      .from("candidates")
      .select("id, name, role, skills, location, hourly_rate, availability, bio, uncertainty_note");
    if (error) throw new Error(error.message);
    if (!candidates?.length) throw new Error("No candidates found");

    const apiKey = process.env["LOVABLE_API_KEY"]!;
    const prompt = `You are a talent-matching agent. An employer brief is below, followed by candidate profiles from a database.

Employer brief: "${data.brief}"

Candidates:
${(candidates as DbCandidate[]).map((c, i) => `${i + 1}. ${c.name} — ${c.role}, ${c.location}, $${c.hourly_rate}/hr, ${c.availability}. Skills: ${c.skills.join(", ")}. Bio: ${c.bio}${c.uncertainty_note ? ` Known uncertainty: ${c.uncertainty_note}` : ""}`).join("\n")}

Pick the single best match and rank the rest. Respond with ONLY valid JSON in this exact shape:
{
  "top": {
    "name": string,
    "title": string (short role label),
    "location": string,
    "alignment": number 0-100,
    "requiredMet": number 0-4,
    "traits": { "leadership": 0-1, "composure": 0-1, "adaptability": 0-1, "communication": 0-1, "problem": 0-1, "creativity": 0-1, "collaboration": 0-1 },
    "workingStyle": string[] (3 short tags),
    "capabilities": [ { "name": string, "proof": string (short), "evidenceBacked": boolean, "trait": one of ${TRAIT_KEYS.join("|")} } ] (exactly 4, derived from the brief's requirements),
    "proof": [ { "label": string, "value": number } ] (exactly 4 small stats),
    "uncertainty": string (one honest sentence about what is NOT verified; use the known uncertainty if present),
    "note": string (very short)
  },
  "runnersUp": [ { "name": string, "alignment": number, "note": string (short reason they ranked lower) } ] (the other 4 candidates, best first),
  "reasons": string[] (exactly 3 short bullet reasons the top match fits the brief)
}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/messages", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`AI gateway error: ${res.status}`);

    const json = await res.json();
    const text: string = (json.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("");
    const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(jsonText) as MatchResult;

    const topDb = (candidates as DbCandidate[]).find((c) => c.name === parsed.top.name);
    parsed.top.id = topDb?.id ?? parsed.top.name.toLowerCase().replace(/\s+/g, "-");
    return parsed;
  });
