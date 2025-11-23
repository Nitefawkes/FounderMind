-- FounderMind Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  experience_points INTEGER DEFAULT 0,
  founder_level INTEGER DEFAULT 1,
  skill_tree JSONB DEFAULT '{}',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'founder', 'accelerator'))
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Startups table
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  stage TEXT DEFAULT 'idea' CHECK (stage IN ('idea', 'mvp', 'launch', 'growth', 'scale', 'exit')),
  current_capital NUMERIC DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metrics JSONB DEFAULT '{
    "burn_rate": 5000,
    "runway": 2,
    "mrr": 0,
    "user_count": 0,
    "user_growth_rate": 0,
    "team_size": 1,
    "team_morale": 80,
    "product_quality": 50,
    "market_share": 0,
    "valuation": 0,
    "customer_satisfaction": 50
  }',
  is_active BOOLEAN DEFAULT true
);

ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own startups" ON public.startups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create startups" ON public.startups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own startups" ON public.startups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own startups" ON public.startups
  FOR DELETE USING (auth.uid() = user_id);

-- Decisions table
CREATE TABLE IF NOT EXISTS public.decisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'hire', 'fire', 'pivot', 'fundraise', 'build_feature',
    'marketing_campaign', 'price_change', 'partnership',
    'acquisition', 'expansion'
  )),
  choice TEXT NOT NULL,
  outcome JSONB DEFAULT '{}',
  impact NUMERIC DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view decisions for own startups" ON public.decisions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE startups.id = decisions.startup_id
      AND startups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create decisions for own startups" ON public.decisions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE startups.id = decisions.startup_id
      AND startups.user_id = auth.uid()
    )
  );

-- Scenarios table
CREATE TABLE IF NOT EXISTS public.scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  unlocked_at_level INTEGER DEFAULT 1,
  stages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios are public (no RLS needed)

-- Advisor Interactions table
CREATE TABLE IF NOT EXISTS public.advisor_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  startup_id UUID REFERENCES public.startups(id) ON DELETE CASCADE NOT NULL,
  persona TEXT NOT NULL CHECK (persona IN ('ceo', 'cto', 'cfo', 'cmo', 'investor')),
  message TEXT NOT NULL,
  advice TEXT NOT NULL,
  context JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.advisor_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions for own startups" ON public.advisor_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE startups.id = advisor_interactions.startup_id
      AND startups.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create interactions for own startups" ON public.advisor_interactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.startups
      WHERE startups.id = advisor_interactions.startup_id
      AND startups.user_id = auth.uid()
    )
  );

-- Market Events table
CREATE TABLE IF NOT EXISTS public.market_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  impact JSONB DEFAULT '{}',
  triggered_by UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  affected_startups UUID[] DEFAULT '{}'
);

-- Market events are publicly visible (no RLS needed for now)

-- Competitions table
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  players UUID[] NOT NULL,
  winner UUID REFERENCES public.users(id) ON DELETE SET NULL,
  market_snapshot JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed'))
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view competitions they're in" ON public.competitions
  FOR SELECT USING (auth.uid() = ANY(players));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_startups_user_id ON public.startups(user_id);
CREATE INDEX IF NOT EXISTS idx_startups_is_active ON public.startups(is_active);
CREATE INDEX IF NOT EXISTS idx_decisions_startup_id ON public.decisions(startup_id);
CREATE INDEX IF NOT EXISTS idx_decisions_timestamp ON public.decisions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_advisor_interactions_startup_id ON public.advisor_interactions(startup_id);
CREATE INDEX IF NOT EXISTS idx_advisor_interactions_timestamp ON public.advisor_interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on startups
CREATE TRIGGER update_startups_updated_at BEFORE UPDATE ON public.startups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
