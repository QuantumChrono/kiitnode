-- =============================================================================
-- KIIT Node — Complete Schema & Seed Data (Fixed FK)
-- Run this entire file in the Supabase SQL Editor.
-- =============================================================================

-- ─── 0. Extensions ──────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── 1. Tables ──────────────────────────────────────────────────────────────

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@kiit.ac.in'),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  whatsapp_number TEXT,
  campus_location TEXT,
  is_moderator BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts (Teammate Matcher, Marketplace, Forum)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tag TEXT NOT NULL CHECK (tag IN ('MARKET', 'COLLAB', 'REQUEST', 'DISCUSSION')),
  skill_tags TEXT[],
  seriousness_level TEXT,
  weekly_bandwidth TEXT,
  location_tag TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  sponsored BOOLEAN DEFAULT FALSE,
  sponsor_name TEXT,
  moderation_score JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- K-Directory (team-curated, NO user submission)
CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('APP', 'WEBSITE', 'TOOL', 'NOTES')),
  upvotes_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resource upvotes (one per user per resource)
CREATE TABLE IF NOT EXISTS resource_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Reports (one report per user per post)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('SPAM', 'INAPPROPRIATE', 'THREAT_SAFETY')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, reporter_id)
);

-- Blocks
CREATE TABLE IF NOT EXISTS blocks (
  blocker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id)
);

-- ─── 2. Domain-gate trigger ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NULL OR NEW.email NOT LIKE '%@kiit.ac.in' THEN
    RAISE EXCEPTION 'Only @kiit.ac.in accounts are allowed';
  END IF;
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── 3. Anonymity view ─────────────────────────────────────────────────────
DROP VIEW IF EXISTS posts_public;
CREATE VIEW posts_public AS
SELECT
  p.id,
  CASE WHEN p.is_anonymous THEN NULL ELSE p.user_id END   AS user_id,
  CASE WHEN p.is_anonymous THEN NULL ELSE pr.full_name END AS full_name,
  CASE WHEN p.is_anonymous THEN NULL ELSE pr.avatar_url END AS avatar_url,
  CASE WHEN p.is_anonymous THEN NULL ELSE pr.whatsapp_number END AS whatsapp_number,
  p.title,
  p.content,
  p.tag,
  p.skill_tags,
  p.seriousness_level,
  p.weekly_bandwidth,
  p.location_tag,
  p.is_anonymous,
  p.sponsored,
  p.sponsor_name,
  p.is_active,
  p.created_at
FROM posts p
JOIN profiles pr ON pr.id = p.user_id
WHERE p.is_active = TRUE;

GRANT SELECT ON posts_public TO authenticated;

-- ─── 4. Upvote count sync ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE resources SET upvotes_count = upvotes_count + 1
    WHERE id = NEW.resource_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE resources SET upvotes_count = upvotes_count - 1
    WHERE id = OLD.resource_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_upvote_change ON resource_upvotes;
CREATE TRIGGER on_upvote_change
  AFTER INSERT OR DELETE ON resource_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.update_upvote_count();

-- ─── 5. Row Level Security ─────────────────────────────────────────────────

ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources        ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks           ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_select"     ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- posts
DROP POLICY IF EXISTS "posts_select_own_raw" ON posts;
DROP POLICY IF EXISTS "posts_insert_own"     ON posts;
DROP POLICY IF EXISTS "posts_update_own"     ON posts;

CREATE POLICY "posts_select_own_raw" ON posts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "posts_insert_own" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- resources (K-Directory)
DROP POLICY IF EXISTS "resources_select"           ON resources;
DROP POLICY IF EXISTS "resources_insert_moderator" ON resources;
DROP POLICY IF EXISTS "resources_update_moderator" ON resources;
DROP POLICY IF EXISTS "resources_delete_moderator" ON resources;

CREATE POLICY "resources_select" ON resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "resources_insert_moderator" ON resources FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_moderator = true));
CREATE POLICY "resources_update_moderator" ON resources FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_moderator = true));
CREATE POLICY "resources_delete_moderator" ON resources FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_moderator = true));

-- resource_upvotes
DROP POLICY IF EXISTS "upvotes_select"     ON resource_upvotes;
DROP POLICY IF EXISTS "upvotes_insert_own" ON resource_upvotes;
DROP POLICY IF EXISTS "upvotes_delete_own" ON resource_upvotes;

CREATE POLICY "upvotes_select" ON resource_upvotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "upvotes_insert_own" ON resource_upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "upvotes_delete_own" ON resource_upvotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- reports
DROP POLICY IF EXISTS "reports_insert_own"              ON reports;
DROP POLICY IF EXISTS "reports_select_own_or_moderator" ON reports;
DROP POLICY IF EXISTS "reports_update_moderator"        ON reports;

CREATE POLICY "reports_insert_own" ON reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "reports_select_own_or_moderator" ON reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_moderator = true));
CREATE POLICY "reports_update_moderator" ON reports FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_moderator = true));

-- blocks
DROP POLICY IF EXISTS "blocks_all_own" ON blocks;
CREATE POLICY "blocks_all_own" ON blocks FOR ALL TO authenticated USING (auth.uid() = blocker_id);

-- ─── 6. Seed Data (Fixed auth.users FK insertion) ───────────────────────────

DO $$
DECLARE
  uid_cse3   UUID := '11111111-1111-1111-1111-111111111111';
  uid_mech2  UUID := '22222222-2222-2222-2222-222222222222';
  uid_mod    UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
  -- 1. Insert seed accounts into auth.users first so FK constraints succeed
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES
    (uid_cse3,  'authenticated', 'authenticated', '2205001@kiit.ac.in', crypt('kiitpass123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Arjun Patel"}', NOW(), NOW()),
    (uid_mech2, 'authenticated', 'authenticated', '2205002@kiit.ac.in', crypt('kiitpass123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sneha Mohanty"}', NOW(), NOW()),
    (uid_mod,   'authenticated', 'authenticated', '2205003@kiit.ac.in', crypt('kiitpass123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ravi Kumar"}', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- 2. Upsert Profiles details (trigger creates basic row, this sets the extra metadata)
  INSERT INTO profiles (id, email, full_name, avatar_url, whatsapp_number, campus_location, is_moderator)
  VALUES
    (uid_cse3,  '2205001@kiit.ac.in',  'Arjun Patel',   NULL, '919876543210', 'Campus 6',  FALSE),
    (uid_mech2, '2205002@kiit.ac.in',  'Sneha Mohanty',  NULL, '919876543211', 'Campus 15', FALSE),
    (uid_mod,   '2205003@kiit.ac.in',  'Ravi Kumar',     NULL, '919876543212', 'Campus 6',  TRUE)
  ON CONFLICT (id) DO UPDATE SET
    whatsapp_number = EXCLUDED.whatsapp_number,
    campus_location = EXCLUDED.campus_location,
    is_moderator    = EXCLUDED.is_moderator;

  -- 3. Teammate Matcher posts (tag = COLLAB)
  INSERT INTO posts (id, user_id, title, content, tag, skill_tags, seriousness_level, weekly_bandwidth)
  VALUES
    (gen_random_uuid(), uid_cse3,
     'Need a React Native dev for campus app',
     'Building a utility app for KIIT students. Need someone who knows Expo and Supabase. DM me.',
     'COLLAB',
     ARRAY['React Native', 'Supabase', 'Figma'],
     'Serious',
     '10-15 hrs/week'),
    (gen_random_uuid(), uid_mech2,
     'Looking for ML teammates — NLP project',
     'Working on a sentiment analysis tool for campus reviews. Python + PyTorch stack.',
     'COLLAB',
     ARRAY['Python', 'PyTorch', 'NLP'],
     'Serious',
     '8-10 hrs/week'),
    (gen_random_uuid(), uid_cse3,
     'Hackathon team — SIH 2026',
     'Forming a team for Smart India Hackathon. Need backend + design. Casual vibe, serious output.',
     'COLLAB',
     ARRAY['Node.js', 'Figma', 'PostgreSQL'],
     'Hackathon Win',
     '15-20 hrs/week'),
    (gen_random_uuid(), uid_mech2,
     'IoT project partner needed',
     'Building a smart hostel energy monitor. Arduino + cloud dashboard. Campus 15 preferred.',
     'COLLAB',
     ARRAY['Arduino', 'Firebase', 'React'],
     'Casual',
     '5-8 hrs/week'),
    (gen_random_uuid(), uid_cse3,
     'Open-source contributors wanted',
     'Maintaining a CLI tool for KIIT SAP automation. Rust or Go. Any skill level welcome.',
     'COLLAB',
     ARRAY['Rust', 'Go', 'CLI'],
     'Casual',
     '3-5 hrs/week');

  -- 4. Marketplace posts (tag = MARKET)
  INSERT INTO posts (id, user_id, title, content, tag, location_tag)
  VALUES
    (gen_random_uuid(), uid_mech2,
     'Selling TI-84 Calculator — ₹2500',
     'Used for 1 semester, works perfectly. Meet at Campus 6 Food Court.',
     'MARKET',
     'Campus 6 Food Court'),
    (gen_random_uuid(), uid_cse3,
     'Buying a second-hand cycle',
     'Looking for a geared cycle in decent condition. Budget ₹3000. Pickup from KP-7.',
     'MARKET',
     'Hostel KP-7 Gate'),
    (gen_random_uuid(), uid_mech2,
     'Rent: Room cooler for summer sem',
     'Symphony cooler, ₹500/month. Pickup from Library Lawn side gate.',
     'MARKET',
     'Library Lawn'),
    (gen_random_uuid(), uid_cse3,
     'Selling Data Structures textbook — Cormen',
     'CLRS 3rd edition, highlighted but clean. ₹400. Campus 6 canteen.',
     'MARKET',
     'Campus 6 Food Court');

  -- 5. Forum posts
  INSERT INTO posts (id, user_id, title, content, tag, is_anonymous)
  VALUES
    (gen_random_uuid(), uid_cse3,
     'Semester 5 CSE end-sem notes compiled',
     'Google Drive link in the first comment. Covers OS, DBMS, and CN. Good luck everyone.',
     'DISCUSSION',
     FALSE),
    (gen_random_uuid(), uid_mech2,
     'Robotics Society — open workshop this Saturday',
     'Free soldering + Arduino basics workshop at Campus 15 lab. No registration needed, just show up.',
     'DISCUSSION',
     FALSE),
    (gen_random_uuid(), uid_mech2,
     'Is the hostel mess food actually safe?',
     'Three people on my floor got food poisoning last week. Has anyone else noticed? Genuinely worried.',
     'REQUEST',
     TRUE);

  -- 6. K-Directory resources
  INSERT INTO resources (id, submitted_by, title, url, description, category)
  VALUES
    (gen_random_uuid(), uid_mod,
     'KIIT SAP Portal Helper',
     'https://github.com/example/kiit-sap-helper',
     'Browser extension that fixes SAP portal UX issues and adds quick links.',
     'TOOL'),
    (gen_random_uuid(), uid_mod,
     'Semester 5 CSE Notes Drive',
     'https://drive.google.com/drive/folders/example',
     'Community-maintained Google Drive with notes, PYQs, and slides for all CSE subjects.',
     'NOTES'),
    (gen_random_uuid(), uid_mod,
     'KIIT Shuttle Tracker',
     'https://example.com/shuttle',
     'Real-time bus/shuttle tracking for inter-campus routes.',
     'APP'),
    (gen_random_uuid(), uid_mod,
     'KIIT Academic Calendar',
     'https://kiit.ac.in/academic-calendar',
     'Official academic calendar with exam dates, holidays, and registration windows.',
     'WEBSITE');

END $$;