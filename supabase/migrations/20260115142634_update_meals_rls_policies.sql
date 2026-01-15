-- Drop the existing "Public Access" policy
drop policy if exists "Public Access" on public.meals;

-- Enable RLS (should already be enabled, but ensure it)
alter table public.meals enable row level security;

-- Create RLS policies for user-specific access

-- SELECT policy: Users can only read their own meals
create policy "Users can view own meals"
  on public.meals
  for select
  using (auth.uid() = user_id);

-- INSERT policy: Users can only insert meals with their own user_id
-- The user_id is automatically set by the application, but we validate it here
create policy "Users can insert own meals"
  on public.meals
  for insert
  with check (auth.uid() = user_id);

-- UPDATE policy: Users can only update their own meals
create policy "Users can update own meals"
  on public.meals
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- DELETE policy: Users can only delete their own meals
create policy "Users can delete own meals"
  on public.meals
  for delete
  using (auth.uid() = user_id);

