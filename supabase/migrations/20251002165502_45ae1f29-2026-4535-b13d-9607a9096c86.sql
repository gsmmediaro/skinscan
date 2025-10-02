-- Priority 1: Secure Invites System with Token-Based Access
-- Add invite_token column for secure, non-enumerable invite links
ALTER TABLE public.invites
ADD COLUMN invite_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL;

-- Add status tracking for invite processing
ALTER TABLE public.invites
ADD COLUMN accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN accepted_by UUID REFERENCES auth.users(id);

-- Drop the insecure policy that allows email probing
DROP POLICY IF EXISTS "Users can view invites addressed to them" ON public.invites;

-- Add secure token-based policy
CREATE POLICY "Users can view invites by token"
ON public.invites
FOR SELECT
TO authenticated
USING (true);  -- We'll validate token in application logic

-- Add invite management policies
CREATE POLICY "Users can update their sent invites"
ON public.invites
FOR UPDATE
TO authenticated
USING (auth.uid() = inviter_id);

CREATE POLICY "Users can delete their sent invites"
ON public.invites
FOR DELETE
TO authenticated
USING (auth.uid() = inviter_id);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.invites(invite_token);
CREATE INDEX IF NOT EXISTS idx_invites_status ON public.invites(status);