-- Create the table
create table meals (
  id text primary key,
  name text not null,
  timestamp bigint not null,
  nutrition jsonb not null,
  "imageUrl" text,
  description text,
  type text not null
);

-- Enable Row Level Security (RLS)
alter table meals enable row level security;

-- Create a policy that allows everything (for development/demo purposes)
create policy "Public Access" on meals for all using (true) with check (true);
