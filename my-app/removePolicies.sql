-- Drop function to handle new user creation
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop function to handle email updates
DROP FUNCTION IF EXISTS public.handle_email_update() CASCADE;

-- Drop function to handle password updates
DROP FUNCTION IF EXISTS public.handle_password_update() CASCADE;


-- Drop trigger for creating a user profile when a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop trigger for syncing email updates from auth.users to user_profile
DROP TRIGGER IF EXISTS on_auth_email_updated ON auth.users;

-- Drop trigger for syncing password updates from auth.users to user_profile
DROP TRIGGER IF EXISTS on_auth_password_updated ON auth.users;


-- Drop RLS policies for user_profile table
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.user_profile;

-- Drop RLS for other tables
DROP POLICY IF EXISTS "Insert own business" ON public.business;
DROP POLICY IF EXISTS "Insert own services" ON public.services;
DROP POLICY IF EXISTS "Insert own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Insert own complaints" ON public.complaints;


-- Disable RLS on user_profile table
ALTER TABLE public.user_profile DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables
ALTER TABLE public.business DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;
