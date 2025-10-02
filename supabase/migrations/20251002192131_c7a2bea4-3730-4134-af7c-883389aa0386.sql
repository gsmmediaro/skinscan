-- Add new fields to user_stats table for freemium and gamification
ALTER TABLE public.user_stats 
ADD COLUMN IF NOT EXISTS last_free_scan_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_achievements INTEGER DEFAULT 0;

-- Add scan_type field to scans table
ALTER TABLE public.scans 
ADD COLUMN IF NOT EXISTS scan_type TEXT DEFAULT 'free' CHECK (scan_type IN ('free', 'premium'));

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements table
CREATE POLICY "Users can view their own achievements"
  ON public.achievements
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.achievements
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON public.achievements(achievement_type);

-- Add comment for documentation
COMMENT ON TABLE public.achievements IS 'Stores user achievements and badges for gamification';
COMMENT ON COLUMN public.user_stats.last_free_scan_date IS 'Timestamp of last free scan for 7-day cooldown';
COMMENT ON COLUMN public.user_stats.current_streak_days IS 'Current consecutive days with routine completion';
COMMENT ON COLUMN public.user_stats.longest_streak_days IS 'Longest streak ever achieved';
COMMENT ON COLUMN public.scans.scan_type IS 'Type of scan: free (limited) or premium (full access)';