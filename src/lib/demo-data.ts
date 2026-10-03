// Synthetic demo data only. Will move to the hackathon database in step 2.
export const DEMO_BRIEF =
  "I need someone who can lead product strategy, prototype quickly, communicate clearly, and work well in ambiguity. I'd like to start with a $300 paid trial project.";

export const TRAITS = [
  { key: "leadership", label: "Leadership", color: "var(--trait-leadership)" },
  { key: "composure", label: "Composure", color: "var(--trait-composure)" },
  { key: "adaptability", label: "Adaptability", color: "var(--trait-adaptability)" },
  { key: "communication", label: "Communication", color: "var(--trait-communication)" },
  { key: "problem", label: "Problem-Solving", color: "var(--trait-problem)" },
  { key: "creativity", label: "Creativity", color: "var(--trait-creativity)" },
  { key: "collaboration", label: "Collaboration", color: "var(--trait-collaboration)" },
] as const;

export type TraitKey = (typeof TRAITS)[number]["key"];

export type Capability = { name: string; proof: string; evidenceBacked: boolean; trait: TraitKey };

export type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  alignment: number;
  requiredMet: number;
  traits: Record<TraitKey, number>;
  workingStyle: string[];
  capabilities: Capability[];
  proof: { label: string; value: number }[];
  uncertainty: string;
  note: string;
};

export const MAYA: Candidate = {
  id: "maya-chen",
  name: "Maya Chen",
  title: "Product Builder",
  location: "San Francisco",
  alignment: 92,
  requiredMet: 4,
  traits: { leadership: 0.86, composure: 0.7, adaptability: 0.92, communication: 0.84, problem: 0.8, creativity: 0.88, collaboration: 0.74 },
  workingStyle: ["Experimenter", "Visionary", "Adaptable under ambiguity"],
  capabilities: [
    { name: "Product Strategy", proof: "Evidence-backed", evidenceBacked: true, trait: "leadership" },
    { name: "Rapid Prototyping", proof: "3 projects", evidenceBacked: true, trait: "creativity" },
    { name: "Storytelling", proof: "4 endorsements", evidenceBacked: false, trait: "communication" },
    { name: "Cross-functional Leadership", proof: "2 references", evidenceBacked: true, trait: "collaboration" },
  ],
  proof: [
    { label: "Evidence-backed required capabilities", value: 3 },
    { label: "Relevant projects", value: 4 },
    { label: "Endorsements", value: 7 },
    { label: "References", value: 2 },
  ],
  uncertainty: "No direct fintech project is currently attached to Maya's profile.",
  note: "Strongest overall fit",
};

export const RUNNERS_UP = [
  { name: "Jordan Ellis", alignment: 78, note: "Strong strategist, limited prototyping evidence" },
  { name: "Elena Rivera", alignment: 74, note: "Excellent prototyper, weaker leadership evidence" },
  { name: "Aisha Patel", alignment: 69, note: "Missing Product Strategy evidence" },
  { name: "David Park", alignment: 61, note: "Less aligned working style" },
];

export const TRIAL = {
  project: "Product strategy + prototype sprint",
  duration: "1 week",
  amount: 300,
};

export const AGENT_STEPS = [
  { tool: "interpret_brief", label: "Understanding requirements" },
  { tool: "search_professionals", label: "Searching professional identities" },
  { tool: "get_professional_identity", label: "Reading capability evidence" },
  { tool: "get_match_evidence", label: "Checking working-style alignment" },
  { tool: "get_match_evidence", label: "Evaluating proof strength" },
  { tool: "rank", label: "Comparing 5 candidates" },
];
