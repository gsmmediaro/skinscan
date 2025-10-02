-- Fix critical security vulnerability in invites table
-- Remove the overly permissive policy that allows viewing all invites
DROP POLICY IF EXISTS "Users can view invites by token" ON public.invites;

-- The existing policies are sufficient and secure:
-- 1. "Users can view their own invites" - users see invites they created
-- 2. "Users can view invites addressed to them" - users see invites sent to their email (via profiles table)

-- These policies ensure:
-- - Users can only see invites they sent
-- - Users can only see invites sent to their own email address
-- - No one can enumerate all invites or harvest email addresses
-- - Token validation happens securely in the edge function with service role access

-- Add comment for documentation
COMMENT ON TABLE public.invites IS 'Stores user invitations. Access restricted by RLS: users can only view invites they created or received.';