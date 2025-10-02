-- Remove the insecure public policy that exposes all email addresses
DROP POLICY IF EXISTS "Public can view invites by email" ON public.invites;

-- Add a secure policy that allows users to view invites addressed to their email
CREATE POLICY "Users can view invites addressed to them"
ON public.invites
FOR SELECT
TO authenticated
USING (
  invitee_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
);