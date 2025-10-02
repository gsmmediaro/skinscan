-- Remove client-side UPDATE permission on invites table
-- Only the process-referral edge function should update acceptance fields
DROP POLICY IF EXISTS "Users can update their sent invites" ON public.invites;

-- Remaining policies ensure secure access:
-- 1. Users can INSERT invites they create
-- 2. Users can DELETE invites they sent (cancel invitations)
-- 3. Users can SELECT invites they created or received
-- 4. Only process-referral edge function (with service role) can UPDATE acceptance fields

COMMENT ON TABLE public.invites IS 'Stores user invitations. UPDATE restricted to server-side edge functions only.';