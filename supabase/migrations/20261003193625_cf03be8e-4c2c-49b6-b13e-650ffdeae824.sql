CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  hourly_rate INTEGER NOT NULL,
  availability TEXT NOT NULL,
  bio TEXT NOT NULL,
  match_score INTEGER,
  uncertainty_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.candidates TO anon;
GRANT SELECT ON public.candidates TO authenticated;
GRANT ALL ON public.candidates TO service_role;

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read candidates" ON public.candidates FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.candidates (name, role, skills, location, hourly_rate, availability, bio, match_score, uncertainty_note) VALUES
('Maya Chen', 'Full-stack engineer', ARRAY['React','TypeScript','Node.js','Postgres'], 'Austin, TX', 95, '20 hrs/week', 'Ex-fintech engineer who ships fast. Built two payment dashboards from scratch and loves ambiguous early-stage problems.', 92, 'Limited public work samples — score based mostly on interview signals.'),
('Jordan Alvarez', 'Product designer', ARRAY['Figma','Design systems','Prototyping','User research'], 'Mexico City, MX', 70, '30 hrs/week', 'Designs clean, testable flows quickly. Previously led design at a seed-stage SaaS startup through its Series A.', 85, NULL),
('Priya Nair', 'ML engineer', ARRAY['Python','PyTorch','LLM fine-tuning','Data pipelines'], 'Bangalore, IN', 80, '15 hrs/week', 'Shipped production recommendation systems at scale. Comfortable owning models end-to-end from data to deployment.', 88, 'Timezone overlap with US team is narrow — async collaboration required.'),
('Sam Okafor', 'Growth marketer', ARRAY['SEO','Paid acquisition','Analytics','Copywriting'], 'Lagos, NG', 55, '25 hrs/week', 'Grew a consumer app from 5k to 200k users on a shoestring budget. Very data-driven and experiment-happy.', 78, 'Portfolio metrics are self-reported and could not be independently verified.'),
('Elena Petrova', 'DevOps engineer', ARRAY['AWS','Kubernetes','Terraform','CI/CD'], 'Warsaw, PL', 85, '10 hrs/week', 'Keeps infrastructure boring and reliable. Has rescued three startups from deployment chaos in the last two years.', 81, NULL);