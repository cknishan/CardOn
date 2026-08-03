-- CardOn sync schema
-- Run this in the Supabase SQL editor.
-- Columns are camelCase to match the app's model objects verbatim
-- (the provider upserts `{ ...model, user_id }` without remapping).

-- Decks
create table if not exists public.decks (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null,
  "deletedAt" timestamptz
);

alter table public.decks enable row level security;

create policy "decks_select_own" on public.decks
  for select using (auth.uid() = user_id);
create policy "decks_insert_own" on public.decks
  for insert with check (auth.uid() = user_id);
create policy "decks_update_own" on public.decks
  for update using (auth.uid() = user_id);
create policy "decks_delete_own" on public.decks
  for delete using (auth.uid() = user_id);

create index if not exists decks_user_id_idx on public.decks (user_id);

-- Flashcards
create table if not exists public.flashcards (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  "deckId" uuid not null references public.decks(id) on delete cascade,
  question text not null,
  answer text not null,
  hint text,
  note text,
  interval double precision not null,
  repetitions integer not null,
  "easeFactor" double precision not null,
  "dueDate" date not null,
  "createdAt" timestamptz not null,
  "updatedAt" timestamptz not null,
  "deletedAt" timestamptz
);

alter table public.flashcards enable row level security;

create policy "flashcards_select_own" on public.flashcards
  for select using (auth.uid() = user_id);
create policy "flashcards_insert_own" on public.flashcards
  for insert with check (auth.uid() = user_id);
create policy "flashcards_update_own" on public.flashcards
  for update using (auth.uid() = user_id);
create policy "flashcards_delete_own" on public.flashcards
  for delete using (auth.uid() = user_id);

create index if not exists flashcards_user_id_idx on public.flashcards (user_id);
create index if not exists flashcards_deck_id_idx on public.flashcards ("deckId");

-- Study sessions
create table if not exists public.study_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  "deckId" uuid not null references public.decks(id) on delete cascade,
  "startedAt" timestamptz not null,
  "completedAt" timestamptz not null,
  "cardsReviewed" integer not null,
  "againCount" integer not null,
  "hardCount" integer not null,
  "goodCount" integer not null,
  "easyCount" integer not null,
  "deletedAt" timestamptz
);

alter table public.study_sessions enable row level security;

create policy "study_sessions_select_own" on public.study_sessions
  for select using (auth.uid() = user_id);
create policy "study_sessions_insert_own" on public.study_sessions
  for insert with check (auth.uid() = user_id);
create policy "study_sessions_update_own" on public.study_sessions
  for update using (auth.uid() = user_id);
create policy "study_sessions_delete_own" on public.study_sessions
  for delete using (auth.uid() = user_id);

create index if not exists study_sessions_user_id_idx on public.study_sessions (user_id);
create index if not exists study_sessions_deck_id_idx on public.study_sessions ("deckId");
