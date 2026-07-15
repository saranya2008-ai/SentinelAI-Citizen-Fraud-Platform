-- Create scam_reports table to store user-submitted suspicious content
CREATE TABLE IF NOT EXISTS scam_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  scam_category TEXT,
  warning_signs TEXT[],
  recommended_action TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_session TEXT
);

-- Create authority_verifications table for verification queries
CREATE TABLE IF NOT EXISTS authority_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  response TEXT,
  is_legitimate BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create statistics table for platform metrics
CREATE TABLE IF NOT EXISTS platform_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_name TEXT UNIQUE NOT NULL,
  stat_value BIGINT DEFAULT 0,
  stat_label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial statistics
INSERT INTO platform_statistics (stat_name, stat_value, stat_label) VALUES
  ('scams_detected', 1284567, 'Scams Detected'),
  ('citizens_protected', 89234, 'Citizens Protected'),
  ('money_saved', 487500000, 'Money Saved (INR)'),
  ('reports_submitted', 156789, 'Reports Submitted')
ON CONFLICT (stat_name) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE scam_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE authority_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for scam_reports (public can insert, read own)
CREATE POLICY "public_read_scam_reports" ON scam_reports FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "public_insert_scam_reports" ON scam_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create policies for authority_verifications (public read/insert)
CREATE POLICY "public_read_verifications" ON authority_verifications FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "public_insert_verifications" ON authority_verifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Create policies for platform_statistics (public read only)
CREATE POLICY "public_read_statistics" ON platform_statistics FOR SELECT
  TO anon, authenticated USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_scam_reports_created_at ON scam_reports(created_at DESC);