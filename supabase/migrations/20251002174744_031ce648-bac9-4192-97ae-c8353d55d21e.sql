-- Create a security definer function to get user email from profiles
-- This avoids RLS recursion issues
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

-- Add policy allowing invite recipients to view invites sent to them
CREATE POLICY "Recipients can view their invites"
ON public.invites
FOR SELECT
TO authenticated
USING (
  public.get_user_email(auth.uid()) = invitee_email
  OR auth.uid() = accepted_by
);

-- Add policy allowing invite recipients to update (accept) invites sent to them
CREATE POLICY "Recipients can accept their invites"
ON public.invites
FOR UPDATE
TO authenticated
USING (public.get_user_email(auth.uid()) = invitee_email)
WITH CHECK (public.get_user_email(auth.uid()) = invitee_email);