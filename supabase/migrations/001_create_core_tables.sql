-- Create extended user profiles table
create table if not exists public.user_profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  plan text default 'free', -- free, pro, enterprise
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles on delete cascade,
  name text not null,
  idea text not null,
  industry text,
  target_audience text,
  tone text,
  language text default 'en',
  status text default 'draft', -- draft, generating, completed, failed
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create generated content versions table
create table if not exists public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  version_number integer not null,
  content jsonb not null, -- Structured AI output
  generation_tokens integer,
  generation_time_ms integer,
  created_at timestamp with time zone default now()
);

-- Create generation history table
create table if not exists public.generation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles on delete cascade,
  project_id uuid not null references public.projects on delete cascade,
  version_id uuid references public.project_versions on delete cascade,
  prompt_used text,
  tokens_used integer,
  generation_time_ms integer,
  model_version text default 'granite-3b',
  status text default 'completed', -- completed, failed, pending
  error_message text,
  created_at timestamp with time zone default now()
);

-- Create exports tracking table
create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles on delete cascade,
  version_id uuid not null references public.project_versions on delete cascade,
  export_format text not null, -- pdf, markdown, json, text
  file_size_bytes integer,
  created_at timestamp with time zone default now()
);

-- Create indexes for performance
create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_created_at on public.projects(created_at);
create index idx_project_versions_project_id on public.project_versions(project_id);
create index idx_generation_history_user_id on public.generation_history(user_id);
create index idx_generation_history_project_id on public.generation_history(project_id);
create index idx_generation_history_created_at on public.generation_history(created_at);
create index idx_exports_user_id on public.exports(user_id);

-- Enable Row Level Security
alter table public.user_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.generation_history enable row level security;
alter table public.exports enable row level security;

-- Create RLS policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Create RLS policies for projects
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Create RLS policies for project_versions
create policy "Users can view versions of their projects"
  on public.project_versions for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_versions.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Create RLS policies for generation_history
create policy "Users can view their own generation history"
  on public.generation_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generation history"
  on public.generation_history for insert
  with check (auth.uid() = user_id);

-- Create RLS policies for exports
create policy "Users can view their own exports"
  on public.exports for select
  using (auth.uid() = user_id);

create policy "Users can create their own exports"
  on public.exports for insert
  with check (auth.uid() = user_id);

-- Create function to handle updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_user_profiles_updated_at before update on public.user_profiles
  for each row execute function update_updated_at_column();

create trigger update_projects_updated_at before update on public.projects
  for each row execute function update_updated_at_column();
