-- Add user_id column to meals table
alter table public.meals 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Make user_id required (but allow null temporarily for existing data)
-- We'll handle existing data migration separately

-- Create index on user_id for performance
create index if not exists idx_meals_user_id on public.meals(user_id);

-- Update existing rows: Set user_id to NULL for now (they will be filtered out by RLS)
-- In production, you might want to assign them to a specific user or delete them
-- For now, we'll leave them as NULL and they won't be accessible after RLS is enabled

