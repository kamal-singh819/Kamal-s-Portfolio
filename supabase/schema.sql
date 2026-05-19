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

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references public.blogs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table public.likes (
  blog_id uuid not null references public.blogs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blog_id, user_id)
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
alter table public.comments enable row level security;
alter table public.likes enable row level security;

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

create policy "Anyone can read comments"
on public.comments for select
using (true);

create policy "Logged-in users can create comments"
on public.comments for insert
with check (auth.uid() = user_id);

create policy "Anyone can read likes"
on public.likes for select
using (true);

create policy "Logged-in users can like"
on public.likes for insert
with check (auth.uid() = user_id);

create policy "Users can remove their own likes"
on public.likes for delete
using (auth.uid() = user_id);

create index blogs_published_at_idx on public.blogs (published_at desc);
create index comments_blog_id_created_at_idx on public.comments (blog_id, created_at desc);
create index likes_blog_id_idx on public.likes (blog_id);
