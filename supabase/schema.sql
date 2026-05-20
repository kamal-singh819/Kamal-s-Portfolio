create type public.user_role as enum ('admin', 'end_user');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'end_user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content_html text not null,
  author_id uuid not null references public.users(id) on delete restrict,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.blogs enable row level security;

create policy "Users can read users"
on public.users for select
using (true);

create policy "Users can create their own profile"
on public.users for insert
with check (auth.uid() = id and role = 'end_user');

create policy "Users can update their own non-role profile"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id and role = (select role from public.users where id = auth.uid()));

create policy "Anyone can read blogs"
on public.blogs for select
using (true);

create policy "Admins can create blogs"
on public.blogs for insert
with check (public.is_admin() and author_id = auth.uid());

create policy "Admins can update blogs"
on public.blogs for update
using (public.is_admin())
with check (public.is_admin());

create index blogs_published_at_idx on public.blogs (published_at desc);
