-- ==========================================
-- 1. ENUMS & EXTENSIONS
-- ==========================================
CREATE TYPE user_role AS ENUM ('VOLUNTEER', 'ADMIN');

-- ==========================================
-- 2. USERS TABLE
-- ==========================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- For Credentials login (Hashed)
  phone TEXT,
  course TEXT,
  semester TEXT,
  gender TEXT, -- New field
  caste TEXT,  -- New field
  hobbies TEXT, -- New field
  provider TEXT DEFAULT 'credentials', -- 'google' or 'credentials'
  role user_role DEFAULT 'VOLUNTEER',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  total_hours INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  profile_picture TEXT, -- For Google OAuth/Uploads
  email_verified TIMESTAMPTZ
);

-- Index for fast login lookups
CREATE INDEX idx_users_email ON users(email);

-- ==========================================
-- 3. EVENTS TABLE
-- ==========================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT, -- e.g., 'Plantation', 'Education', 'Health'
  location TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT NOW(),
  description TEXT,
  hours_granted INTEGER DEFAULT 0, -- New: Fixed hours for this event
  max_participants INTEGER DEFAULT 100, -- New: Limit on registrations
  certificate_layout_url TEXT, -- New: URL for certificate template
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- ==========================================
-- 4. EVENT REGISTRATIONS (New Table)
-- ==========================================
CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'REGISTERED', -- 'REGISTERED', 'ATTENDED', 'CANCELLED'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ==========================================
-- 5. CHECKINS TABLE (Core Attendance)
-- ==========================================
-- Create an enum for checkin status
CREATE TYPE checkin_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  event_id UUID REFERENCES events(id),
  hours INTEGER DEFAULT 0,
  image_url TEXT,
  notes TEXT,
  status checkin_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to recalculate user stats from scratch (to fix existing data)
CREATE OR REPLACE FUNCTION recalculate_user_stats(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET total_hours = COALESCE((SELECT SUM(hours) FROM checkins WHERE user_id = user_id_param AND status = 'APPROVED'), 0),
      total_checkins = (SELECT COUNT(*) FROM checkins WHERE user_id = user_id_param AND status = 'APPROVED')
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to increment user stats
CREATE OR REPLACE FUNCTION increment_user_stats(user_id_param UUID, hours_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET total_hours = total_hours + hours_param,
      total_checkins = total_checkins + 1
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement user stats
CREATE OR REPLACE FUNCTION decrement_user_stats(user_id_param UUID, hours_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET total_hours = GREATEST(0, total_hours - hours_param),
      total_checkins = GREATEST(0, total_checkins - 1)
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Indexes for statistics and user history
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_event_id ON checkins(event_id);
CREATE INDEX idx_checkins_created_at ON checkins(created_at DESC);

-- ==========================================
-- 5. MILESTONES TABLE (Gamification)
-- ==========================================
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  hours_required INTEGER NOT NULL,
  badge_icon TEXT -- Icon name or URL
);

-- Pre-seed Milestones
INSERT INTO milestones (title, hours_required, badge_icon) VALUES
('First Drive', 3, 'star'),
('Active Volunteer', 120, 'award'),
('Dedicated Volunteer', 240, 'shield-check');

-- ==========================================
-- 6. FEEDBACK TABLE (Contact Page)
-- ==========================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Support', 'Feedback', 'Report Issue'
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. ADMINS TABLE (Roles & Metadata)
-- ==========================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL -- 'Program Officer', 'Volunteer Leader', 'Core Team'
);

-- ==========================================
-- 8. STORAGE BUCKET (Optional Tip)
-- ==========================================
-- Remember to create a bucket named 'checkins' in your Supabase Dashboard 
-- under 'Storage' to hold the proof images.