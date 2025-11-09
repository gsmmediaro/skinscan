-- Create user_preferences table for onboarding data
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Step 1: Skin concerns (multi-select)
  skin_concerns text[] DEFAULT '{}',

  -- Step 2: Current routine
  current_routine_morning text,
  current_routine_evening text,
  products_using text[] DEFAULT '{}',

  -- Step 3: Trust & preferences
  influenced_by_creators boolean DEFAULT false,
  prefers_scientific_approach boolean DEFAULT true,
  budget_preference text CHECK (budget_preference IN ('budget', 'mid-range', 'luxury', 'any')),
  ingredient_sensitivities text[] DEFAULT '{}',

  -- Metadata
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX idx_user_preferences_completed_at ON public.user_preferences(completed_at);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- Add comment
COMMENT ON TABLE public.user_preferences IS 'Stores user onboarding preferences and skin profile';
