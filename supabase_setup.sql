-- ============================================================================
-- internVerse ? Complete Supabase Schema, Auth Triggers, RLS & 135-Row Seed
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. Internships catalog
create table if not exists public.internships (
  id text primary key,
  company text not null,
  title text not null,
  stream text not null,
  eligible_streams text[] not null default '{}',
  skills_required text[] not null default '{}',
  skills_preferred text[] not null default '{}',
  location text not null,
  is_remote boolean not null default false,
  duration_months integer not null,
  min_cgpa numeric(4,2) not null default 0.0,
  stipend text not null,
  application_url text not null,
  description text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 2. Student profiles (linked to Supabase Auth: Google, Mobile OTP, Email)
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  name text not null default '',
  email text unique,
  phone text default '',
  avatar_url text default '',
  auth_provider text default 'email',
  stream text not null default '',
  college text default '',
  graduation_year integer default 0,
  cgpa numeric(4,2) default 0.0,
  skills text[] not null default '{}',
  location_preference text default '',
  remote_ok boolean not null default true,
  duration_preference integer default 0,
  stipend_expectation integer default 0,
  looking_for text default '',
  additional_notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safely upgrade student_profiles if created from an earlier step
alter table public.student_profiles add column if not exists user_id uuid unique references auth.users(id) on delete cascade;
alter table public.student_profiles add column if not exists avatar_url text default '';
alter table public.student_profiles add column if not exists auth_provider text default 'email';
alter table public.student_profiles add column if not exists updated_at timestamptz not null default now();
alter table public.student_profiles alter column email drop not null;
alter table public.student_profiles alter column name set default '';
alter table public.student_profiles alter column stream set default '';

-- 3. Tracked / Saved Applications
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  internship_id text not null default '',
  company text not null,
  role text not null,
  score integer default 0,
  status text not null default 'applied' check (status in ('saved', 'applied', 'interviewing', 'offer', 'rejected')),
  url text default '',
  stipend text default '',
  duration integer default 0,
  location text default '',
  is_remote boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, company, role)
);

-- 4. Search History
create table if not exists public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_snapshot jsonb not null default '{}'::jsonb,
  results_snapshot jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 5. Auto-create/link student_profile when a user signs up (Google, Mobile OTP, Email)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_name text;
  v_avatar text;
  v_provider text;
begin
  v_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(coalesce(new.email, ''), '@', 1),
    new.phone,
    'Student'
  );
  v_avatar := coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '');
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');

  insert into public.student_profiles (user_id, name, email, phone, avatar_url, auth_provider)
  values (new.id, v_name, nullif(new.email, ''), coalesce(new.phone, new.raw_user_meta_data->>'phone', ''), v_avatar, v_provider)
  on conflict (user_id) do update set
    name = case when student_profiles.name = '' then excluded.name else student_profiles.name end,
    email = coalesce(student_profiles.email, excluded.email),
    phone = case when student_profiles.phone = '' then excluded.phone else student_profiles.phone end,
    avatar_url = case when student_profiles.avatar_url = '' then excluded.avatar_url else student_profiles.avatar_url end,
    auth_provider = excluded.auth_provider,
    updated_at = now();

  return new;
exception when unique_violation then
  update public.student_profiles
  set user_id = new.id,
      avatar_url = case when avatar_url = '' then v_avatar else avatar_url end,
      auth_provider = v_provider,
      updated_at = now()
  where email = new.email and user_id is null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Row Level Security (RLS)
alter table public.internships enable row level security;
alter table public.student_profiles enable row level security;
alter table public.applications enable row level security;
alter table public.search_history enable row level security;

-- Internships: everyone can read
drop policy if exists "Public read internships" on public.internships;
create policy "Public read internships"
  on public.internships for select
  using (true);

-- Student profiles: users manage their own row; guests/CLI can insert unowned profiles
drop policy if exists "Allow insert student_profiles" on public.student_profiles;
drop policy if exists "Users read own profile" on public.student_profiles;
drop policy if exists "Users insert own profile" on public.student_profiles;
drop policy if exists "Users update own profile" on public.student_profiles;
drop policy if exists "Guest insert unowned profile" on public.student_profiles;

create policy "Users read own profile"
  on public.student_profiles for select
  using (auth.uid() = user_id);

create policy "Users insert own profile"
  on public.student_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users update own profile"
  on public.student_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Guest insert unowned profile"
  on public.student_profiles for insert
  with check (user_id is null);

-- Applications: users manage only their own
drop policy if exists "Users manage own applications" on public.applications;
create policy "Users manage own applications"
  on public.applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Search history: users manage only their own
drop policy if exists "Users manage own search_history" on public.search_history;
create policy "Users manage own search_history"
  on public.search_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 7. Seed all 135 internships cleanly
truncate table public.internships;

insert into public.internships (
  id, company, title, stream, eligible_streams,
  skills_required, skills_preferred, location, is_remote,
  duration_months, min_cgpa, stipend, application_url, description, tags
) values
('1', 'Google', 'Software Engineering Intern', 'CS/IT', array['CS/IT', 'Electronics', 'Data Science']::text[], array['Python', 'Data Structures']::text[], array['Java', 'C++', 'Algorithms']::text[], 'Bangalore', false, 6, 7, '₹80,000/mo', 'https://careers.google.com', 'Work on real Google products alongside senior engineers.', array['cs/it', 'onsite']::text[]),
('2', 'Microsoft', 'Software Engineering Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['C#', 'Python', 'Data Structures']::text[], array['Azure', 'JavaScript', 'TypeScript']::text[], 'Hyderabad', false, 6, 7.5, '₹75,000/mo', 'https://careers.microsoft.com', 'Build innovative solutions for Microsoft cloud and AI products.', array['cs/it', 'onsite']::text[]),
('3', 'Infosys', 'Full Stack Developer Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['HTML', 'CSS', 'JavaScript']::text[], array['React', 'Node.js', 'SQL']::text[], 'Pune', false, 3, 6, '₹15,000/mo', 'https://www.infosys.com/careers', 'Develop end-to-end web applications using modern frameworks.', array['cs/it', 'onsite']::text[]),
('4', 'Stripe', 'Data Engineering Intern', 'CS/IT', array['CS/IT', 'Data Science', 'Mathematics']::text[], array['Python', 'SQL']::text[], array['Spark', 'Hadoop', 'ETL']::text[], 'Remote', true, 4, 7, '₹60,000/mo', 'https://stripe.com/jobs', 'Build data pipelines that power Stripe''s financial infrastructure.', array['cs/it', 'remote']::text[]),
('5', 'TCS', 'AI/ML Intern', 'CS/IT', array['CS/IT', 'Data Science', 'Electronics', 'Mathematics']::text[], array['Python', 'Machine Learning']::text[], array['TensorFlow', 'PyTorch', 'NLP']::text[], 'Chennai', false, 6, 6.5, '₹20,000/mo', 'https://www.tcs.com/careers', 'Research and develop ML models for enterprise clients.', array['cs/it', 'onsite']::text[]),
('6', 'Tata Motors', 'Mechanical Design Intern', 'Mechanical', array['Mechanical', 'Automobile', 'Industrial']::text[], array['AutoCAD', 'SolidWorks']::text[], array['CATIA', 'ANSYS', 'MATLAB']::text[], 'Pune', false, 6, 6.5, '₹18,000/mo', 'https://www.tatamotors.com/careers', 'Design and simulate automotive components using CAD/CAE tools.', array['mechanical', 'onsite']::text[]),
('7', 'L&T', 'Manufacturing Engineering Intern', 'Mechanical', array['Mechanical', 'Industrial', 'Production']::text[], array['CAD', 'Manufacturing']::text[], array['CNC', 'Lean Manufacturing', 'Six Sigma']::text[], 'Mumbai', false, 4, 6, '₹12,000/mo', 'https://www.larsentoubro.com/careers', 'Optimize manufacturing processes and quality on the shop floor.', array['mechanical', 'onsite']::text[]),
('8', 'Boeing', 'Aerospace Engineering Intern', 'Mechanical', array['Mechanical', 'Aerospace']::text[], array['MATLAB', 'Python']::text[], array['CFD', 'FEA', '3D Modeling']::text[], 'Bangalore', false, 6, 7.5, '₹30,000/mo', 'https://www.boeing.co.in/careers', 'Support aircraft design and analysis with simulation tools.', array['mechanical', 'onsite']::text[]),
('9', 'L&T Construction', 'Site Engineering Intern', 'Civil', array['Civil', 'Construction']::text[], array['AutoCAD', 'Structural Analysis']::text[], array['STAAD Pro', 'Revit', 'Project Management']::text[], 'Delhi', false, 6, 6, '₹15,000/mo', 'https://www.larsentoubro.com/careers', 'Supervise construction sites and prepare engineering drawings.', array['civil', 'onsite']::text[]),
('10', 'WSP Global', 'Transportation Planning Intern', 'Civil', array['Civil', 'Urban Planning']::text[], array['AutoCAD', 'Civil Engineering']::text[], array['Traffic Simulation', 'GIS', 'Python']::text[], 'Mumbai', false, 4, 6.5, '₹14,000/mo', 'https://www.wsp.com/careers', 'Assist in transportation modeling and infrastructure planning.', array['civil', 'onsite']::text[]),
('11', 'Siemens', 'Power Systems Intern', 'Electrical', array['Electrical', 'Electronics', 'ECE']::text[], array['MATLAB', 'Power Systems']::text[], array['Simulink', 'PLC', 'SCADA']::text[], 'Bangalore', false, 6, 7, '₹22,000/mo', 'https://www.siemens.co.in/careers', 'Work on smart grid and power automation projects.', array['electrical', 'onsite']::text[]),
('12', 'Qualcomm', 'VLSI Design Intern', 'Electronics', array['Electronics', 'ECE', 'Electrical']::text[], array['Verilog', 'VLSI']::text[], array['SystemVerilog', 'Cadence', 'Tapeout']::text[], 'Hyderabad', false, 6, 7.5, '₹40,000/mo', 'https://www.qualcomm.com/careers', 'Design and verify digital circuits for mobile chipsets.', array['electronics', 'onsite']::text[]),
('13', 'Samsung R&D', 'Embedded Systems Intern', 'Electronics', array['Electronics', 'ECE', 'CS/IT']::text[], array['C', 'Embedded C']::text[], array['RTOS', 'Linux Kernel', 'ARM']::text[], 'Noida', false, 4, 7, '₹25,000/mo', 'https://www.samsung.com/in/sris/careers', 'Develop firmware and drivers for consumer electronics.', array['electronics', 'onsite']::text[]),
('14', 'Deloitte', 'Audit & Assurance Intern', 'Commerce', array['Commerce', 'Finance', 'BBA']::text[], array['Accounting', 'MS Excel']::text[], array['Tally', 'SAP', 'Financial Analysis']::text[], 'Mumbai', false, 6, 6, '₹18,000/mo', 'https://www.deloitte.com/in/en/careers.html', 'Assist in auditing engagements and financial statement reviews.', array['commerce', 'onsite']::text[]),
('15', 'Goldman Sachs', 'Finance Intern', 'Commerce', array['Commerce', 'Finance', 'Economics', 'Mathematics']::text[], array['Financial Analysis', 'MS Excel']::text[], array['Python', 'Bloomberg', 'Valuation Modeling']::text[], 'Bangalore', false, 3, 8, '₹50,000/mo', 'https://www.goldmansachs.com/careers', 'Support deal teams with research, analysis, and financial modeling.', array['commerce', 'onsite']::text[]),
('16', 'PwC', 'Consulting Intern', 'Commerce', array['Commerce', 'BBA', 'MBA', 'Economics']::text[], array['Business Analysis', 'MS Office']::text[], array['PowerPoint', 'Data Analysis', 'SQL']::text[], 'Delhi', false, 3, 6.5, '₹20,000/mo', 'https://www.pwc.in/careers.html', 'Work with consulting teams on strategy and operations projects.', array['commerce', 'onsite']::text[]),
('17', 'Ogilvy', 'Content & Copywriting Intern', 'Arts', array['Arts', 'Journalism', 'English', 'Design', 'Mass Communication']::text[], array['Content Writing', 'English']::text[], array['SEO', 'Social Media', 'Copywriting']::text[], 'Mumbai', true, 3, 5.5, '₹12,000/mo', 'https://www.ogilvy.com/careers', 'Create compelling content for brand campaigns across digital and print.', array['arts', 'remote']::text[]),
('18', 'Zomato', 'UX/UI Design Intern', 'Design', array['Design', 'Arts', 'CS/IT']::text[], array['Figma', 'UI Design']::text[], array['Prototyping', 'User Research', 'Illustrator']::text[], 'Gurugram', false, 4, 6, '₹20,000/mo', 'https://www.zomato.com/careers', 'Design intuitive interfaces for Zomato''s consumer products.', array['design', 'onsite']::text[]),
('19', 'Google', 'Digital Marketing Intern', 'Arts', array['Arts', 'Commerce', 'Mass Communication', 'Marketing']::text[], array['Digital Marketing', 'Social Media']::text[], array['Google Ads', 'Analytics', 'Content Strategy']::text[], 'Bangalore', true, 3, 6, '₹25,000/mo', 'https://careers.google.com', 'Plan and execute digital marketing campaigns for Google products.', array['arts', 'remote']::text[]),
('20', 'Flipkart', 'Data Science Intern', 'Data Science', array['Data Science', 'CS/IT', 'Mathematics', 'Statistics']::text[], array['Python', 'Statistics']::text[], array['SQL', 'Machine Learning', 'Tableau']::text[], 'Bangalore', false, 6, 7, '₹40,000/mo', 'https://www.flipkartcareers.com', 'Build recommendation and forecasting models for e-commerce.', array['data science', 'onsite']::text[]),
('21', 'Dr. Reddy''s', 'Pharmaceutical Research Intern', 'Pharmacy', array['Pharmacy', 'Biotechnology', 'Chemistry']::text[], array['Pharmacology', 'Drug Analysis']::text[], array['HPLC', 'Mass Spectrometry', 'Regulatory Affairs']::text[], 'Hyderabad', false, 6, 6.5, '₹16,000/mo', 'https://www.drreddys.com/careers', 'Support drug development and quality testing in pharma R&D.', array['pharmacy', 'onsite']::text[]),
('22', 'Amazon', 'Operations Intern', 'CS/IT', array['CS/IT', 'Mechanical', 'Industrial', 'Commerce', 'BBA']::text[], array['MS Excel', 'Analytical Thinking']::text[], array['SQL', 'Python', 'Supply Chain']::text[], 'Multiple Cities', false, 4, 6.5, '₹30,000/mo', 'https://www.amazon.jobs', 'Optimize fulfillment and logistics operations for Amazon India.', array['cs/it', 'onsite']::text[]),
('23', 'Zoho', 'Technical Writer Intern', 'CS/IT', array['CS/IT', 'English', 'Arts']::text[], array['Technical Writing', 'English']::text[], array['API Docs', 'Markdown', 'Git']::text[], 'Chennai', true, 3, 6, '₹15,000/mo', 'https://www.zoho.com/careers.html', 'Write clear documentation and user guides for Zoho products.', array['cs/it', 'remote']::text[]),
('24', 'Freshworks', 'HR Intern', 'BBA', array['BBA', 'Commerce', 'Psychology', 'Arts']::text[], array['Communication']::text[], array['MS Excel', 'Recruitment', 'Employee Engagement']::text[], 'Chennai', false, 3, 5.5, '₹10,000/mo', 'https://www.freshworks.com/careers', 'Support HR operations including recruitment and culture programs.', array['bba', 'onsite']::text[]),
('25', 'HDFC Bank', 'Banking Intern', 'Commerce', array['Commerce', 'Finance', 'BBA', 'Economics']::text[], array['MS Excel', 'Communication']::text[], array['Financial Products', 'CRM', 'Banking Software']::text[], 'Multiple Cities', false, 3, 5.5, '₹12,000/mo', 'https://www.hdfcbank.com/careers', 'Shadow banking professionals and assist in customer operations.', array['commerce', 'onsite']::text[]),
('26', 'Adobe', 'UI/UX Design Intern', 'Design', array['Design', 'Arts', 'CS/IT']::text[], array['Figma', 'UI Design']::text[], array['Illustrator', 'Prototyping', 'User Research']::text[], 'Bangalore', false, 6, 7, '₹35,000/mo', 'https://www.adobe.com/careers', 'Design world-class creative tools used by millions.', array['design', 'onsite']::text[]),
('27', 'Razorpay', 'Software Development Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['Python', 'JavaScript']::text[], array['React', 'Node.js', 'SQL']::text[], 'Bangalore', true, 6, 6.5, '₹30,000/mo', 'https://razorpay.com/careers', 'Build payment infrastructure powering India''s digital economy.', array['cs/it', 'remote']::text[]),
('28', 'Bajaj Auto', 'Product Design Intern', 'Mechanical', array['Mechanical', 'Automobile']::text[], array['SolidWorks', 'AutoCAD']::text[], array['CATIA', 'GD&T', 'Prototyping']::text[], 'Pune', false, 6, 6.5, '₹20,000/mo', 'https://www.bajajauto.com/careers', 'Design next-generation two-wheeler and three-wheeler components.', array['mechanical', 'onsite']::text[]),
('29', 'Deloitte', 'Data Analytics Intern', 'Data Science', array['Data Science', 'CS/IT', 'Statistics', 'Commerce']::text[], array['Python', 'SQL']::text[], array['Tableau', 'Power BI', 'Excel']::text[], 'Mumbai', false, 6, 6.5, '₹22,000/mo', 'https://www.deloitte.com/in/en/careers.html', 'Analyze business data and create dashboards for enterprise clients.', array['data science', 'onsite']::text[]),
('30', 'Naukri.com', 'Content Marketing Intern', 'Arts', array['Arts', 'English', 'Journalism', 'Mass Communication']::text[], array['Content Writing', 'English']::text[], array['SEO', 'Social Media', 'Blogging']::text[], 'Gurugram', true, 3, 5.5, '₹15,000/mo', 'https://www.naukri.com/careers', 'Create engaging content for India''s largest job portal.', array['arts', 'remote']::text[]),
('31', 'BCG', 'Strategy Consulting Intern', 'MBA', array['MBA', 'BBA', 'Commerce', 'Economics']::text[], array['Business Analysis', 'PowerPoint']::text[], array['Financial Modeling', 'Data Analysis', 'Strategy']::text[], 'Delhi', false, 6, 8, '₹60,000/mo', 'https://careers.bcg.com', 'Work with Fortune 500 clients on strategic transformation projects.', array['mba', 'onsite']::text[]),
('32', 'Flipkart', 'Product Management Intern', 'MBA', array['MBA', 'BBA', 'CS/IT', 'Design']::text[], array['MS Excel', 'Communication']::text[], array['SQL', 'Data Analysis', 'User Research']::text[], 'Bangalore', false, 6, 7, '₹45,000/mo', 'https://www.flipkartcareers.com', 'Drive product strategy and execution for Flipkart''s core features.', array['mba', 'onsite']::text[]),
('33', 'HUL', 'Brand Management Intern', 'MBA', array['MBA', 'BBA', 'Marketing', 'Commerce']::text[], array['Marketing', 'MS Excel']::text[], array['Consumer Research', 'PowerPoint', 'Analytics']::text[], 'Mumbai', false, 2, 7, '₹35,000/mo', 'https://www.hul.co.in/careers', 'Manage brand portfolios and drive go-to-market strategies for FMCG products.', array['mba', 'onsite']::text[]),
('34', 'McKinsey', 'Business Analyst Intern', 'MBA', array['MBA', 'Economics', 'Finance', 'Mathematics']::text[], array['Data Analysis', 'PowerPoint']::text[], array['SQL', 'Python', 'Financial Modeling']::text[], 'Mumbai', false, 6, 8.5, '₹70,000/mo', 'https://www.mckinsey.com/careers', 'Solve complex business problems with data-driven insights for top clients.', array['mba', 'onsite']::text[]),
('35', 'Zomato', 'Business Strategy Intern', 'MBA', array['MBA', 'BBA', 'Economics', 'Commerce']::text[], array['Business Analysis', 'MS Excel']::text[], array['SQL', 'Market Research', 'Competitive Analysis']::text[], 'Gurugram', false, 6, 7, '₹40,000/mo', 'https://www.zomato.com/careers', 'Shape Zomato''s growth strategy across new markets and verticals.', array['mba', 'onsite']::text[]),
('36', 'ICICI Bank', 'Investment Banking Intern', 'Finance', array['Finance', 'Commerce', 'MBA', 'Economics']::text[], array['Financial Analysis', 'MS Excel']::text[], array['PowerPoint', 'Bloomberg', 'Valuation']::text[], 'Mumbai', false, 6, 7.5, '₹30,000/mo', 'https://www.icicibank.com/careers', 'Support deal execution and financial modeling for corporate clients.', array['finance', 'onsite']::text[]),
('37', 'Kotak Securities', 'Wealth Management Intern', 'Finance', array['Finance', 'Commerce', 'BBA']::text[], array['Financial Analysis', 'Communication']::text[], array['MS Excel', 'Portfolio Management', 'CRM']::text[], 'Multiple Cities', false, 3, 6, '₹15,000/mo', 'https://www.kotaksecurities.com/careers', 'Assist wealth advisors in managing high-net-worth client portfolios.', array['finance', 'onsite']::text[]),
('38', 'SEBI', 'Regulatory Research Intern', 'Finance', array['Finance', 'Economics', 'Commerce', 'Mathematics']::text[], array['Financial Analysis', 'Research']::text[], array['MS Excel', 'Data Analysis', 'Report Writing']::text[], 'Mumbai', false, 6, 7.5, '₹25,000/mo', 'https://www.sebi.gov.in', 'Research capital market regulations and analyze financial data.', array['finance', 'onsite']::text[]),
('39', 'Practo', 'Mental Health Content Intern', 'Psychology', array['Psychology', 'Arts', 'English']::text[], array['Content Writing', 'Psychology']::text[], array['Research', 'Empathy', 'Communication']::text[], 'Bangalore', true, 3, 5.5, '₹12,000/mo', 'https://www.practo.com/careers', 'Create mental health content and wellness resources for millions of users.', array['psychology', 'remote']::text[]),
('40', 'YourDOST', 'Counseling Intern', 'Psychology', array['Psychology', 'Social Work']::text[], array['Psychology', 'Active Listening']::text[], array['CBT', 'Empathy', 'Behavioral Therapy']::text[], 'Delhi', true, 6, 6, '₹10,000/mo', 'https://www.yourdost.com', 'Provide online mental health support and emotional wellness coaching.', array['psychology', 'remote']::text[]),
('41', '1mg', 'Health Psychology Intern', 'Psychology', array['Psychology', 'Biotechnology', 'Pharmacy']::text[], array['Psychology', 'Research']::text[], array['Data Analysis', 'Content Writing', 'Medical Knowledge']::text[], 'Gurugram', false, 4, 6, '₹14,000/mo', 'https://www.1mg.com/careers', 'Research patient behavior and design health engagement programs.', array['psychology', 'onsite']::text[]),
('42', 'Deloitte', 'People & Organisation Intern', 'Psychology', array['Psychology', 'BBA', 'HR', 'MBA']::text[], array['Communication', 'Psychology']::text[], array['MS Excel', 'Employee Surveys', 'Workplace Culture']::text[], 'Mumbai', false, 6, 6.5, '₹20,000/mo', 'https://www.deloitte.com/in/en/careers.html', 'Support organizational transformation and employee engagement initiatives.', array['psychology', 'onsite']::text[]),
('43', 'Serum Institute', 'Biotech Research Intern', 'Biotechnology', array['Biotechnology', 'Pharmacy', 'Chemistry']::text[], array['Cell Culture', 'Molecular Biology']::text[], array['PCR', 'ELISA', 'Bioinformatics']::text[], 'Pune', false, 6, 6.5, '₹15,000/mo', 'https://www.seruminstitute.com/careers', 'Work on vaccine development and immunology research projects.', array['biotechnology', 'onsite']::text[]),
('44', 'Biocon', 'Pharmaceutical Biotech Intern', 'Biotechnology', array['Biotechnology', 'Pharmacy', 'Chemistry']::text[], array['Protein Purification', 'Biology']::text[], array['HPLC', 'Chromatography', 'GMP']::text[], 'Bangalore', false, 6, 7, '₹18,000/mo', 'https://www.biocon.com/careers', 'Support biopharmaceutical R&D in biosimilar and small molecule development.', array['biotechnology', 'onsite']::text[]),
('45', 'SRF Limited', 'Chemistry R&D Intern', 'Chemistry', array['Chemistry', 'Pharmacy', 'Biotechnology']::text[], array['Chemistry', 'Lab Techniques']::text[], array['HPLC', 'Spectroscopy', 'Organic Synthesis']::text[], 'Delhi', false, 6, 6.5, '₹14,000/mo', 'https://www.srf.com/careers', 'Conduct R&D experiments in specialty chemicals and pharmaceutical intermediates.', array['chemistry', 'onsite']::text[]),
('46', 'Tata Chemicals', 'QC/QA Intern', 'Chemistry', array['Chemistry', 'Pharmacy']::text[], array['Chemistry', 'Quality Control']::text[], array['Instrumental Analysis', 'MS Excel', 'Lab Safety']::text[], 'Mumbai', false, 4, 6, '₹12,000/mo', 'https://www.tatachemicals.com/careers', 'Perform quality control testing and ensure compliance for chemical products.', array['chemistry', 'onsite']::text[]),
('47', 'NDTV', 'Broadcast Journalism Intern', 'Mass Communication', array['Mass Communication', 'Journalism', 'English']::text[], array['Content Writing', 'Research']::text[], array['Video Editing', 'Social Media', 'News Writing']::text[], 'Delhi', false, 3, 5.5, '₹10,000/mo', 'https://www.ndtv.com/careers', 'Research and produce news segments for prime-time television broadcasts.', array['mass communication', 'onsite']::text[]),
('48', 'The Times of India', 'Digital News Intern', 'Mass Communication', array['Mass Communication', 'Journalism', 'English']::text[], array['English', 'Content Writing']::text[], array['SEO', 'WordPress', 'Social Media']::text[], 'Multiple Cities', false, 3, 5.5, '₹12,000/mo', 'https://timesofindia.indiatimes.com/aboutus', 'Write and publish news stories for India''s largest English newspaper.', array['mass communication', 'onsite']::text[]),
('49', 'BuzzFeed India', 'Social Media Intern', 'Mass Communication', array['Mass Communication', 'Arts', 'English', 'Marketing']::text[], array['Social Media', 'Content Creation']::text[], array['Video Editing', 'Copywriting', 'Canva']::text[], 'Mumbai', true, 3, 5, '₹15,000/mo', 'https://www.buzzfeed.com/careers', 'Create viral social media content and manage community engagement.', array['mass communication', 'remote']::text[]),
('50', 'Mu Sigma', 'Decision Science Intern', 'Statistics', array['Statistics', 'Mathematics', 'Data Science', 'CS/IT']::text[], array['Statistics', 'Python']::text[], array['SQL', 'R', 'Data Visualization']::text[], 'Bangalore', false, 6, 7, '₹25,000/mo', 'https://www.mu-sigma.com/careers', 'Apply statistical models to solve business problems for Fortune 500 clients.', array['statistics', 'onsite']::text[]),
('51', 'J.P. Morgan', 'Quantitative Research Intern', 'Mathematics', array['Mathematics', 'Statistics', 'Finance', 'Data Science']::text[], array['Python', 'Statistics']::text[], array['R', 'SQL', 'Machine Learning']::text[], 'Mumbai', false, 6, 8, '₹55,000/mo', 'https://www.jpmorgan.com/careers', 'Develop quantitative models for trading and risk management.', array['mathematics', 'onsite']::text[]),
('52', 'Google', 'Quantitative Analyst Intern', 'Mathematics', array['Mathematics', 'Statistics', 'Data Science']::text[], array['Python', 'Statistics', 'SQL']::text[], array['R', 'Machine Learning', 'BigQuery']::text[], 'Bangalore', false, 6, 8, '₹70,000/mo', 'https://careers.google.com', 'Apply advanced statistics to optimize Google''s products and ads systems.', array['mathematics', 'onsite']::text[]),
('53', 'Mahindra', 'Vehicle Design Intern', 'Automobile', array['Automobile', 'Mechanical']::text[], array['SolidWorks', 'AutoCAD']::text[], array['CATIA', 'NVH Analysis', 'GD&T']::text[], 'Pune', false, 6, 6.5, '₹20,000/mo', 'https://www.mahindra.com/careers', 'Design EV components and body structures for next-gen electric vehicles.', array['automobile', 'onsite']::text[]),
('54', 'Maruti Suzuki', 'Production Planning Intern', 'Automobile', array['Automobile', 'Mechanical', 'Industrial']::text[], array['CAD', 'Manufacturing']::text[], array['Lean Manufacturing', 'SAP', 'Supply Chain']::text[], 'Gurugram', false, 6, 6.5, '₹22,000/mo', 'https://www.marutisuzuki.com/careers', 'Optimize production planning and inventory management for automobile assembly.', array['automobile', 'onsite']::text[]),
('55', 'Tata Steel', 'Industrial Engineering Intern', 'Industrial', array['Industrial', 'Mechanical', 'Production']::text[], array['CAD', 'Manufacturing']::text[], array['Six Sigma', 'SAP', 'Process Optimization']::text[], 'Jamshedpur', false, 6, 6, '₹18,000/mo', 'https://www.tatasteel.com/careers', 'Optimize steel manufacturing processes and improve operational efficiency.', array['industrial', 'onsite']::text[]),
('56', 'Reliance Industries', 'Operations Intern', 'Industrial', array['Industrial', 'Mechanical', 'Commerce', 'MBA']::text[], array['MS Excel', 'Analytical Thinking']::text[], array['SAP', 'Supply Chain', 'SQL']::text[], 'Mumbai', false, 6, 7, '₹25,000/mo', 'https://www.ril.com/careers', 'Support operations across petrochemicals, retail, and telecom verticals.', array['industrial', 'onsite']::text[]),
('57', 'DLF', 'Real Estate Development Intern', 'Civil', array['Civil', 'Construction', 'Architecture']::text[], array['AutoCAD', 'Project Management']::text[], array['Revit', 'MS Project', 'Cost Estimation']::text[], 'Delhi', false, 6, 6, '₹15,000/mo', 'https://www.dlf.in/careers', 'Assist in planning and executing large-scale residential and commercial projects.', array['civil', 'onsite']::text[]),
('58', 'Godrej Properties', 'Construction Management Intern', 'Civil', array['Civil', 'Construction']::text[], array['AutoCAD', 'Structural Analysis']::text[], array['Revit', 'BIM', 'Quality Control']::text[], 'Mumbai', false, 4, 6, '₹14,000/mo', 'https://www.godrejproperties.com', 'Manage construction timelines and quality for premium residential projects.', array['civil', 'onsite']::text[]),
('59', 'Sun Pharma', 'Clinical Research Intern', 'Pharmacy', array['Pharmacy', 'Biotechnology']::text[], array['Pharmacology', 'Clinical Research']::text[], array['GCP', 'Data Collection', 'Medical Writing']::text[], 'Mumbai', false, 6, 6.5, '₹16,000/mo', 'https://www.sunpharma.com/careers', 'Support clinical trial documentation and regulatory submissions.', array['pharmacy', 'onsite']::text[]),
('60', 'Cipla', 'Drug Development Intern', 'Pharmacy', array['Pharmacy', 'Chemistry', 'Biotechnology']::text[], array['Pharmacology', 'Drug Analysis']::text[], array['HPLC', 'Formulation', 'Regulatory Affairs']::text[], 'Mumbai', false, 6, 6.5, '₹18,000/mo', 'https://www.cipla.com/careers', 'Work on formulation development and bioequivalence studies for generic drugs.', array['pharmacy', 'onsite']::text[]),
('61', 'Atlassian', 'Backend Engineering Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['Java', 'SQL']::text[], array['Python', 'AWS', 'REST APIs']::text[], 'Bangalore', true, 6, 7, '₹45,000/mo', 'https://www.atlassian.com/company/careers', 'Build scalable backend services for Jira and Confluence products.', array['cs/it', 'remote']::text[]),
('62', 'Swiggy', 'Mobile App Development Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['JavaScript', 'React']::text[], array['React Native', 'TypeScript', 'Firebase']::text[], 'Bangalore', false, 6, 6.5, '₹35,000/mo', 'https://careers.swiggy.com', 'Build and optimize the Swiggy mobile app experience for millions of users.', array['cs/it', 'onsite']::text[]),
('63', 'PhonePe', 'Platform Engineering Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['Python', 'SQL']::text[], array['Go', 'Kubernetes', 'Microservices']::text[], 'Bangalore', false, 6, 7, '₹40,000/mo', 'https://www.phonepe.com/careers', 'Build resilient payment infrastructure handling millions of daily transactions.', array['cs/it', 'onsite']::text[]),
('64', 'Cred', 'Frontend Engineering Intern', 'CS/IT', array['CS/IT']::text[], array['JavaScript', 'React']::text[], array['TypeScript', 'CSS', 'GraphQL']::text[], 'Bangalore', false, 6, 7, '₹50,000/mo', 'https://cred.club/careers', 'Craft premium user experiences for India''s most exclusive credit platform.', array['cs/it', 'onsite']::text[]),
('65', 'Ola Electric', 'Software Intern — IoT', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['Python', 'C']::text[], array['IoT', 'AWS', 'Embedded Systems']::text[], 'Bangalore', false, 6, 6.5, '₹30,000/mo', 'https://www.olaelectric.com/careers', 'Develop IoT platforms and telemetry systems for electric vehicles.', array['cs/it', 'onsite']::text[]),
('66', 'Netflix', 'Content Marketing Intern', 'Arts', array['Arts', 'Mass Communication', 'English']::text[], array['Content Writing', 'Social Media']::text[], array['Copywriting', 'Video Editing', 'SEO']::text[], 'Mumbai', true, 3, 6, '₹30,000/mo', 'https://jobs.netflix.com', 'Create marketing campaigns for Netflix India''s original content launches.', array['arts', 'remote']::text[]),
('67', 'Hotstar', 'Creative Production Intern', 'Arts', array['Arts', 'Design', 'Mass Communication']::text[], array['Video Editing', 'Content Creation']::text[], array['Adobe Premiere', 'After Effects', 'Canva']::text[], 'Mumbai', false, 3, 5.5, '₹18,000/mo', 'https://www.hotstar.com/in/careers', 'Produce creative assets and video content for Hotstar''s streaming platform.', array['arts', 'onsite']::text[]),
('68', 'Pinkvilla', 'Lifestyle Writer Intern', 'Arts', array['Arts', 'English', 'Journalism']::text[], array['Content Writing', 'English']::text[], array['SEO', 'WordPress', 'Social Media']::text[], 'Mumbai', true, 3, 5, '₹10,000/mo', 'https://www.pinkvilla.com/careers', 'Write trending lifestyle, fashion, and entertainment stories.', array['arts', 'remote']::text[]),
('69', 'RBI', 'Research Intern — Economics', 'Economics', array['Economics', 'Finance', 'Mathematics']::text[], array['Economic Analysis', 'MS Excel']::text[], array['Stata', 'Econometrics', 'R']::text[], 'Mumbai', false, 6, 8, '₹30,000/mo', 'https://www.rbi.org.in', 'Conduct monetary policy research and macroeconomic analysis.', array['economics', 'onsite']::text[]),
('70', 'World Bank', 'Development Economics Intern', 'Economics', array['Economics', 'Finance', 'Public Policy']::text[], array['Data Analysis', 'Research']::text[], array['Stata', 'R', 'Python']::text[], 'Delhi', false, 6, 8, '₹50,000/mo', 'https://www.worldbank.org/en/about/careers', 'Research development policies and economic programs in South Asia.', array['economics', 'onsite']::text[]),
('71', 'Penguin Random House', 'Editorial Intern', 'English', array['English', 'Arts', 'Journalism']::text[], array['English', 'Content Writing']::text[], array['Editing', 'Proofreading', 'Literary Analysis']::text[], 'Delhi', false, 3, 6, '₹10,000/mo', 'https://www.penguinrandomhouse.in/careers', 'Assist editors with manuscript reviews, proofreading, and publishing workflows.', array['english', 'onsite']::text[]),
('72', 'Jaico Publishing', 'Literary Intern', 'English', array['English', 'Arts']::text[], array['English', 'Content Writing']::text[], array['Copy Editing', 'Research', 'MS Word']::text[], 'Mumbai', true, 3, 5.5, '₹8,000/mo', 'https://www.jaicopublishing.com', 'Support editorial operations and assist in book production workflows.', array['english', 'remote']::text[]),
('73', 'Titan Company', 'Retail Management Intern', 'BBA', array['BBA', 'MBA', 'Commerce']::text[], array['MS Excel', 'Communication']::text[], array['Retail Analytics', 'CRM', 'PowerPoint']::text[], 'Bangalore', false, 3, 6, '₹18,000/mo', 'https://www.titan.co.in/careers', 'Learn retail operations and customer experience management for Titan brands.', array['bba', 'onsite']::text[]),
('74', 'Tanishq', 'Merchandising Intern', 'BBA', array['BBA', 'MBA', 'Commerce', 'Design']::text[], array['MS Excel', 'Communication']::text[], array['Visual Merchandising', 'Market Research', 'PowerPoint']::text[], 'Multiple Cities', false, 3, 6, '₹15,000/mo', 'https://www.tanishq.co.in/careers', 'Assist in product merchandising and in-store experience design.', array['bba', 'onsite']::text[]),
('75', 'Nasscom', 'Industry Research Intern', 'BBA', array['BBA', 'MBA', 'Economics', 'CS/IT']::text[], array['Research', 'MS Excel']::text[], array['PowerPoint', 'Data Analysis', 'Report Writing']::text[], 'Delhi', false, 3, 6.5, '₹12,000/mo', 'https://www.nasscom.in/careers', 'Research IT industry trends and produce policy recommendation reports.', array['bba', 'onsite']::text[]),
('76', 'Lenskart', 'Supply Chain Intern', 'BBA', array['BBA', 'MBA', 'Commerce', 'Industrial']::text[], array['MS Excel', 'Analytical Thinking']::text[], array['SAP', 'SQL', 'Inventory Management']::text[], 'Delhi', false, 4, 6, '₹16,000/mo', 'https://www.lenskart.com/careers', 'Optimize supply chain operations for India''s largest eyewear company.', array['bba', 'onsite']::text[]),
('77', 'Meesho', 'Growth Marketing Intern', 'BBA', array['BBA', 'MBA', 'Marketing', 'Commerce']::text[], array['Digital Marketing', 'MS Excel']::text[], array['Google Ads', 'Analytics', 'SQL']::text[], 'Bangalore', false, 6, 6.5, '₹25,000/mo', 'https://www.meesho.com/careers', 'Drive user acquisition and retention for India''s fastest-growing social commerce platform.', array['bba', 'onsite']::text[]),
('78', 'PolicyBazaar', 'Insurance Analytics Intern', 'Data Science', array['Data Science', 'Statistics', 'Finance', 'CS/IT']::text[], array['Python', 'SQL']::text[], array['Tableau', 'Machine Learning', 'MS Excel']::text[], 'Gurugram', false, 6, 6.5, '₹22,000/mo', 'https://www.policybazaar.com/careers', 'Analyze insurance data and build predictive models for pricing optimization.', array['data science', 'onsite']::text[]),
('79', 'MakeMyTrip', 'Data Analytics Intern', 'Data Science', array['Data Science', 'CS/IT', 'Statistics']::text[], array['SQL', 'Python']::text[], array['Tableau', 'Excel', 'A/B Testing']::text[], 'Gurugram', false, 6, 7, '₹30,000/mo', 'https://www.makemytrip.com/careers', 'Analyze travel data to optimize pricing, recommendations, and user experience.', array['data science', 'onsite']::text[]),
('80', 'HCL Tech', 'Cybersecurity Intern', 'CS/IT', array['CS/IT', 'Electronics']::text[], array['Python', 'Networking']::text[], array['Linux', 'Wireshark', 'SIEM']::text[], 'Noida', false, 6, 6.5, '₹18,000/mo', 'https://www.hcltech.com/careers', 'Monitor security threats and assist in incident response for enterprise clients.', array['cs/it', 'onsite']::text[]),
('81', 'NABARD', 'Agricultural Finance Intern', 'Agriculture', array['Agriculture', 'Commerce']::text[], array['MS Excel', 'Research']::text[], array['Rural Development', 'Financial Analysis', 'Agricultural Policy']::text[], 'Mumbai', false, 6, 6.5, '₹18,000/mo', 'https://www.nabard.org', 'Research agricultural financing schemes and rural development programs.', array['agriculture', 'onsite']::text[]),
('82', 'ICAR', 'Crop Research Intern', 'Agriculture', array['Agriculture', 'Biotechnology']::text[], array['Research', 'Lab Techniques']::text[], array['Data Analysis', 'MATLAB', 'MS Excel']::text[], 'New Delhi', false, 6, 7, '₹15,000/mo', 'https://icar.org.in', 'Conduct crop improvement research and field trials.', array['agriculture', 'onsite']::text[]),
('83', 'Nestle India', 'Food Technology Intern', 'Food Science', array['Food Science', 'Chemistry']::text[], array['Food Chemistry', 'Lab Techniques']::text[], array['Quality Control', 'HACCP', 'MS Excel']::text[], 'Mumbai', false, 4, 6.5, '₹16,000/mo', 'https://www.nestle.in', 'Work on food product development and quality assurance.', array['food science', 'onsite']::text[]),
('84', 'Cyril Amarchand', 'Corporate Law Intern', 'Law', array['Law', 'Corporate Law']::text[], array['Legal Research', 'MS Word']::text[], array['Contract Drafting', 'Corporate Law', 'Due Diligence']::text[], 'Mumbai', false, 6, 7, '₹20,000/mo', 'https://www.cyrilshroff.com', 'Assist in corporate mergers, acquisitions, and regulatory compliance.', array['law', 'onsite']::text[]),
('85', 'AIIMS', 'Nursing Research Intern', 'Nursing', array['Nursing', 'Healthcare']::text[], array['Clinical Skills', 'Patient Care']::text[], array['Research', 'Medical Terminology', 'Documentation']::text[], 'Delhi', false, 6, 6, '₹12,000/mo', 'https://www.aiims.edu', 'Conduct nursing research and assist in patient care at AIIMS.', array['nursing', 'onsite']::text[]),
('86', 'Apollo Hospitals', 'Physiotherapy Intern', 'Physiotherapy', array['Physiotherapy', 'Sports Science']::text[], array['Physiotherapy', 'Exercise Therapy']::text[], array['Rehabilitation', 'Manual Therapy', 'Patient Assessment']::text[], 'Chennai', false, 6, 6, '₹10,000/mo', 'https://www.apollohospitals.com', 'Assist in patient rehabilitation and treatment planning.', array['physiotherapy', 'onsite']::text[]),
('87', 'Freshworks', 'BCA Developer Intern', 'BCA', array['BCA', 'MCA', 'CS/IT']::text[], array['JavaScript', 'HTML']::text[], array['React', 'Node.js', 'Git']::text[], 'Chennai', false, 6, 6, '₹18,000/mo', 'https://www.freshworks.com/careers', 'Build web applications for Freshworks SaaS products.', array['bca', 'onsite']::text[]),
('88', 'Quick Heal', 'Cybersecurity Intern', 'CS/IT', array['CS/IT', 'Cybersecurity']::text[], array['Networking', 'Linux']::text[], array['Python', 'Penetration Testing', 'SIEM']::text[], 'Pune', false, 6, 6.5, '₹18,000/mo', 'https://www.quickheal.co.in', 'Research cyber threats and develop security solutions.', array['cs/it', 'onsite']::text[]),
('89', 'DRDO', 'Physics Research Intern', 'Physics', array['Physics', 'Electronics']::text[], array['MATLAB', 'Research']::text[], array['Optics', 'Quantum Mechanics', 'Simulation']::text[], 'Delhi', false, 6, 7.5, '₹20,000/mo', 'https://drdo.gov.in', 'Conduct defense-related physics research.', array['physics', 'onsite']::text[]),
('90', 'IISc Bangalore', 'Chemistry Research Intern', 'Chemistry', array['Chemistry', 'Pharmacy']::text[], array['Chemistry', 'Lab Techniques']::text[], array['Spectroscopy', 'Organic Synthesis', 'HPLC']::text[], 'Bangalore', false, 6, 7.5, '₹16,000/mo', 'https://www.iisc.ac.in', 'Cutting-edge chemistry research at India''s premier institute.', array['chemistry', 'onsite']::text[]),
('91', 'ZSI', 'Zoological Research Intern', 'Zoology', array['Zoology', 'Biology']::text[], array['Research', 'Lab Techniques']::text[], array['Biodiversity', 'Taxonomy', 'Field Work']::text[], 'Kolkata', false, 6, 6.5, '₹12,000/mo', 'https://www.zsi.gov.in', 'Conduct wildlife surveys and biodiversity research.', array['zoology', 'onsite']::text[]),
('92', 'Bharat Biotech', 'Microbiology Intern', 'Microbiology', array['Microbiology', 'Biotechnology']::text[], array['Lab Techniques', 'Microbiology']::text[], array['Cell Culture', 'PCR', 'Sterile Techniques']::text[], 'Hyderabad', false, 6, 6.5, '₹14,000/mo', 'https://www.bharatbiotech.com', 'Assist in vaccine development research.', array['microbiology', 'onsite']::text[]),
('93', 'UNICEF India', 'Social Development Intern', 'Social Work', array['Social Work', 'Psychology']::text[], array['Research', 'MS Office']::text[], array['Community Development', 'Data Collection', 'Report Writing']::text[], 'Delhi', false, 6, 7, '₹18,000/mo', 'https://www.unicef.org/india', 'Support child welfare programs and community assessments.', array['social work', 'onsite']::text[]),
('94', 'Taj Hotels', 'Hotel Operations Intern', 'Hotel Management', array['Hotel Management', 'Tourism']::text[], array['Customer Service', 'MS Office']::text[], array['Revenue Management', 'F&B Operations', 'Event Planning']::text[], 'Multiple Cities', false, 6, 6, '₹12,000/mo', 'https://www.ihcltata.com/careers', 'Learn hotel operations across front office and F&B.', array['hotel management', 'onsite']::text[]),
('95', 'Prana Studios', 'VFX Artist Intern', 'Animation', array['Animation', 'VFX', 'Film Studies']::text[], array['After Effects', 'Nuke']::text[], array['Maya', 'Houdini', 'Compositing']::text[], 'Mumbai', false, 6, 6, '₹15,000/mo', 'https://www.pranastudios.com', 'Create visual effects for films and TV shows.', array['animation', 'onsite']::text[]),
('96', 'FabIndia', 'Fashion Design Intern', 'Fashion Design', array['Fashion Design', 'Design']::text[], array['Adobe Illustrator', 'Fashion Sketching']::text[], array['Textile Design', 'Pattern Making', 'Sustainability']::text[], 'Delhi', false, 3, 5.5, '₹10,000/mo', 'https://www.fabindia.com', 'Assist in design collection and textile sourcing.', array['fashion design', 'onsite']::text[]),
('97', 'NID', 'Interior Design Research', 'Interior Design', array['Interior Design', 'Architecture']::text[], array['AutoCAD', 'SketchUp']::text[], array['Revit', '3D Visualization', 'Vastu']::text[], 'Ahmedabad', false, 6, 7, '₹12,000/mo', 'https://www.nid.edu', 'Research sustainable interior design solutions.', array['interior design', 'onsite']::text[]),
('98', 'GSI', 'Geological Survey Intern', 'Geology', array['Geology', 'Mining']::text[], array['Field Work', 'Geological Mapping']::text[], array['GIS', 'Remote Sensing', 'MS Excel']::text[], 'Multiple Cities', false, 6, 6.5, '₹14,000/mo', 'https://www.geologicalsurvayofindia.gov.in', 'Conduct geological surveys and mineral exploration.', array['geology', 'onsite']::text[]),
('99', 'ASI', 'Archaeological Research Intern', 'Archaeology', array['Archaeology', 'History']::text[], array['Research', 'MS Office']::text[], array['Excavation', 'Artifact Analysis', 'Survey']::text[], 'Multiple Cities', false, 6, 6.5, '₹10,000/mo', 'https://asi.nic.in', 'Assist in archaeological excavations and heritage documentation.', array['archaeology', 'onsite']::text[]),
('100', 'CPCB', 'Environmental Monitoring Intern', 'Environmental Science', array['Environmental Science', 'Chemistry']::text[], array['Research', 'MS Excel']::text[], array['Pollution Monitoring', 'GIS', 'Data Analysis']::text[], 'Delhi', false, 6, 6.5, '₹14,000/mo', 'https://cpcb.gov.in', 'Monitor air and water quality data.', array['environmental science', 'onsite']::text[]),
('101', 'Netflix India', 'Content Development Intern', 'Performing Arts', array['Performing Arts', 'Film Studies']::text[], array['Research', 'Content Writing']::text[], array['Screenwriting', 'Story Development', 'Script Analysis']::text[], 'Mumbai', false, 3, 5.5, '₹20,000/mo', 'https://jobs.netflix.com', 'Assist in content development for Netflix India originals.', array['performing arts', 'onsite']::text[]),
('102', 'Disney+ Hotstar', 'Motion Graphics Intern', 'Animation', array['Animation', 'Design']::text[], array['After Effects', 'Premiere']::text[], array['Cinema 4D', 'Blender', 'Illustrator']::text[], 'Mumbai', false, 3, 5.5, '₹18,000/mo', 'https://www.hotstar.com/in/careers', 'Design motion graphics for marketing campaigns.', array['animation', 'onsite']::text[]),
('103', 'ISI', 'Statistical Research Intern', 'Statistics', array['Statistics', 'Mathematics']::text[], array['R', 'Statistics']::text[], array['Python', 'Bayesian Analysis', 'Stata']::text[], 'Kolkata', false, 6, 8, '₹18,000/mo', 'https://www.isical.ac.in', 'Conduct statistical research at India''s premier institute.', array['statistics', 'onsite']::text[]),
('104', 'IDSA', 'Defense Studies Intern', 'Defense Studies', array['Defense Studies', 'Political Science']::text[], array['Research', 'MS Office']::text[], array['Policy Analysis', 'Geopolitics', 'Report Writing']::text[], 'Delhi', false, 6, 7, '₹15,000/mo', 'https://www.idsa.in', 'Research defense and strategic studies.', array['defense studies', 'onsite']::text[]),
('105', 'Byju''s', 'Ed-Tech Content Intern', 'Education', array['Education', 'Mathematics']::text[], array['Content Writing', 'Subject Knowledge']::text[], array['Video Editing', 'MS PowerPoint', 'MS Excel']::text[], 'Bangalore', true, 3, 6, '₹15,000/mo', 'https://byjus.com/careers', 'Create educational content and interactive modules.', array['education', 'remote']::text[]),
('106', 'WWF India', 'Conservation Research Intern', 'Environmental Science', array['Environmental Science', 'Biology']::text[], array['Research', 'Data Collection']::text[], array['GIS', 'Wildlife Biology', 'Conservation']::text[], 'Multiple Cities', false, 6, 6, '₹10,000/mo', 'https://www.wwfindia.org', 'Conduct biodiversity assessments and conservation research.', array['environmental science', 'onsite']::text[]),
('107', 'CFSL', 'Forensic Science Intern', 'Forensic Science', array['Forensic Science', 'Chemistry']::text[], array['Lab Techniques', 'Chemistry']::text[], array['DNA Analysis', 'Fingerprint Analysis', 'Digital Forensics']::text[], 'Delhi', false, 6, 7, '₹12,000/mo', 'https://www.cfsl.gov.in', 'Assist in crime scene analysis and evidence testing.', array['forensic science', 'onsite']::text[]),
('108', 'Sports Authority of India', 'Sports Science Intern', 'Physical Education', array['Physical Education', 'Sports Science']::text[], array['Sports Training', 'Exercise Physiology']::text[], array['Data Analysis', 'Nutrition', 'Sports Psychology']::text[], 'Delhi', false, 6, 6, '₹12,000/mo', 'https://www.sportsauthorityofindia.nic.in', 'Assist in athlete performance analysis and research.', array['physical education', 'onsite']::text[]),
('109', 'National Library', 'Library Science Intern', 'Library Science', array['Library Science', 'Information Science']::text[], array['Library Management', 'Cataloging']::text[], array['Digital Archives', 'MS Excel', 'Database Management']::text[], 'Kolkata', false, 3, 6, '₹8,000/mo', 'https://nl.main.gov.in', 'Assist in cataloging and digital archiving.', array['library science', 'onsite']::text[]),
('110', 'UN Women India', 'Gender Research Intern', 'Women''s Studies', array['Women''s Studies', 'Sociology']::text[], array['Research', 'MS Office']::text[], array['Gender Analysis', 'Policy Research', 'Report Writing']::text[], 'Delhi', false, 6, 7, '₹16,000/mo', 'https://india.unwomen.org', 'Research gender equality policies and women''s empowerment.', array['women''s studies', 'onsite']::text[]),
('111', 'NPCI', 'Legal & Compliance Intern', 'Law', array['Law', 'Finance']::text[], array['Legal Research', 'MS Excel']::text[], array['Fintech Regulations', 'RBI Guidelines', 'Compliance']::text[], 'Mumbai', false, 6, 7, '₹22,000/mo', 'https://www.npci.org.in', 'Work on payment system regulations and compliance.', array['law', 'onsite']::text[]),
('112', 'Myntra', 'Fashion Tech Intern', 'Fashion Design', array['Fashion Design', 'Design']::text[], array['Fashion Knowledge', 'MS Excel']::text[], array['Visual Merchandising', 'Trend Analysis', 'Photoshop']::text[], 'Bangalore', false, 4, 6, '₹18,000/mo', 'https://www.myntra.com/about/careers', 'Combine fashion with technology for product catalog.', array['fashion design', 'onsite']::text[]),
('113', 'ITC Agri', 'Agri-Supply Chain Intern', 'Agriculture', array['Agriculture', 'Food Science']::text[], array['MS Excel', 'Analytical Thinking']::text[], array['Supply Chain', 'SAP', 'Data Analysis']::text[], 'Bangalore', false, 6, 6.5, '₹20,000/mo', 'https://www.itcportal.com', 'Optimize agricultural supply chain operations.', array['agriculture', 'onsite']::text[]),
('114', 'Amul', 'Dairy Science Intern', 'Food Science', array['Food Science', 'Agriculture']::text[], array['Food Science', 'Lab Techniques']::text[], array['Quality Control', 'Dairy Technology', 'MS Excel']::text[], 'Gujarat', false, 4, 6, '₹12,000/mo', 'https://www.amul.com', 'Work on dairy product quality and new product development.', array['food science', 'onsite']::text[]),
('115', 'NTPC', 'Power Plant Chemistry Intern', 'Chemistry', array['Chemistry', 'Chemical']::text[], array['Chemistry', 'Lab Techniques']::text[], array['Water Treatment', 'Boiler Chemistry', 'MS Excel']::text[], 'Multiple Cities', false, 6, 6, '₹15,000/mo', 'https://www.ntpc.co.in', 'Perform water and boiler chemistry analysis.', array['chemistry', 'onsite']::text[]),
('116', 'Tata Steel Mining', 'Mining Engineering Intern', 'Mining', array['Mining', 'Geology']::text[], array['Mining Methods', 'Safety']::text[], array['Ventilation', 'Blasting', 'MS Excel']::text[], 'Jharkhand', false, 6, 6, '₹16,000/mo', 'https://www.tatasteel.com/careers', 'Assist in mining operations and safety compliance.', array['mining', 'onsite']::text[]),
('117', 'TAC Security', 'Ethical Hacking Intern', 'CS/IT', array['CS/IT', 'Cybersecurity']::text[], array['Networking', 'Linux']::text[], array['Python', 'Penetration Testing', 'Vulnerability Assessment']::text[], 'Delhi', false, 6, 6.5, '₹20,000/mo', 'https://www.tacsecurity.com', 'Conduct penetration testing and vulnerability assessments.', array['cs/it', 'onsite']::text[]),
('118', 'ASCI', 'Anthropology Research Intern', 'Anthropology', array['Anthropology', 'Sociology']::text[], array['Research', 'Field Work']::text[], array['Ethnography', 'Data Collection', 'Report Writing']::text[], 'Kolkata', false, 6, 6.5, '₹12,000/mo', 'https://www.ansi.gov.in', 'Conduct anthropological fieldwork and document cultures.', array['anthropology', 'onsite']::text[]),
('119', 'NDRF', 'Disaster Management Intern', 'Disaster Management', array['Disaster Management', 'Social Work']::text[], array['Emergency Response', 'MS Office']::text[], array['First Aid', 'Crisis Communication', 'Planning']::text[], 'Multiple Cities', false, 4, 6, '₹10,000/mo', 'https://ndrf.gov.in', 'Assist in disaster preparedness and emergency response.', array['disaster management', 'onsite']::text[]),
('120', 'CBSE', 'Education Research Intern', 'Education', array['Education', 'Psychology']::text[], array['Research', 'MS Office']::text[], array['Curriculum Design', 'Assessment', 'Data Analysis']::text[], 'Delhi', false, 6, 7, '₹14,000/mo', 'https://cbse.gov.in', 'Research education policies and curriculum development.', array['education', 'onsite']::text[]),
('121', 'Physical Education Dept', 'Sports Analytics Intern', 'Physical Education', array['Physical Education', 'Sports Science']::text[], array['Exercise Science', 'Data Collection']::text[], array['Wearable Tech', 'Performance Analytics', 'Coaching']::text[], 'Multiple Cities', false, 4, 6, '₹15,000/mo', 'https://www.jsw.in/sports', 'Analyze athlete performance data for training programs.', array['physical education', 'onsite']::text[]),
('122', 'ITC Hotels', 'Culinary Arts Intern', 'Hotel Management', array['Hotel Management']::text[], array['Culinary Skills', 'Food Safety']::text[], array['Menu Planning', 'Kitchen Management', 'HACCP']::text[], 'Multiple Cities', false, 6, 5.5, '₹10,000/mo', 'https://www.itchotels.in', 'Work alongside master chefs in kitchen operations.', array['hotel management', 'onsite']::text[]),
('123', 'NCRB', 'Criminal Data Analytics Intern', 'Forensic Science', array['Forensic Science', 'CS/IT']::text[], array['Data Analysis', 'MS Excel']::text[], array['Python', 'SQL', 'Crime Statistics']::text[], 'Delhi', false, 4, 6.5, '₹14,000/mo', 'https://ncrb.gov.in', 'Analyze criminal data and crime pattern research.', array['forensic science', 'onsite']::text[]),
('124', 'BSI', 'Botany Research Intern', 'Biology', array['Biology', 'Environmental Science']::text[], array['Research', 'Plant Identification']::text[], array['Herbarium', 'Field Work', 'MS Excel']::text[], 'Kolkata', false, 6, 6.5, '₹12,000/mo', 'https://bsidocuments.gov.in', 'Document plant species and conduct taxonomic research.', array['biology', 'onsite']::text[]),
('125', 'Quick Heal', 'Cloud Security Intern', 'CS/IT', array['CS/IT', 'Cloud Computing']::text[], array['Python', 'Networking']::text[], array['AWS', 'Azure', 'Terraform']::text[], 'Pune', false, 6, 6.5, '₹20,000/mo', 'https://www.quickheal.co.in', 'Develop cloud security solutions for enterprise clients.', array['cs/it', 'onsite']::text[]),
('126', 'TERI', 'Sustainability Intern', 'Environmental Science', array['Environmental Science']::text[], array['Research', 'MS Excel']::text[], array['Sustainability Reporting', 'Energy Analysis', 'Carbon Footprint']::text[], 'Delhi', false, 6, 7, '₹15,000/mo', 'https://www.teriin.org', 'Research renewable energy and sustainability frameworks.', array['environmental science', 'onsite']::text[]),
('127', 'Actuarial Society', 'Actuarial Intern', 'Statistics', array['Statistics', 'Mathematics', 'Finance']::text[], array['Probability', 'MS Excel']::text[], array['R', 'Actuarial Modeling', 'Financial Mathematics']::text[], 'Mumbai', false, 6, 8, '₹25,000/mo', 'https://www.actuariesindia.org', 'Develop actuarial models for insurance risk assessment.', array['statistics', 'onsite']::text[]),
('128', 'MSME Dept', 'Small Business Intern', 'Commerce', array['Commerce', 'BBA', 'MBA']::text[], array['MS Excel', 'Business Analysis']::text[], array['Market Research', 'Financial Planning', 'MS PowerPoint']::text[], 'Delhi', false, 3, 6, '₹10,000/mo', 'https://msme.gov.in', 'Support MSME policy research and business development.', array['commerce', 'onsite']::text[]),
('129', 'Forestry Dept', 'Forestry Research Intern', 'Environmental Science', array['Environmental Science', 'Biology', 'Agriculture']::text[], array['Field Work', 'Research']::text[], array['GIS', 'Conservation', 'Wildlife Biology']::text[], 'Multiple Cities', false, 6, 6, '₹12,000/mo', 'https://www.fsi.nic.in', 'Conduct forest surveys and biodiversity documentation.', array['environmental science', 'onsite']::text[]),
('130', 'Textile Ministry', 'Textile Research Intern', 'Textile Design', array['Textile Design', 'Fashion Design']::text[], array['Textile Knowledge', 'MS Excel']::text[], array['Sustainable Fashion', 'Quality Testing', 'Design']::text[], 'Delhi', false, 4, 6, '₹10,000/mo', 'https://textilecommittee.nic.in', 'Research textile standards and sustainable fashion practices.', array['textile design', 'onsite']::text[]),
('131', 'GAIL', 'Chemical Engineering Intern', 'Chemical', array['Chemical', 'Chemistry']::text[], array['Chemical Processes', 'Lab Techniques']::text[], array['Process Simulation', 'MATLAB', 'Safety']::text[], 'Multiple Cities', false, 6, 6.5, '₹18,000/mo', 'https://www.gailonline.com', 'Work on natural gas processing and petrochemical operations.', array['chemical', 'onsite']::text[]),
('132', 'HAL', 'Aerospace Engineering Intern', 'Aerospace', array['Aerospace', 'Mechanical']::text[], array['CAD', 'MATLAB']::text[], array['Aerodynamics', 'FEA', 'Avionics']::text[], 'Bangalore', false, 6, 7, '₹25,000/mo', 'https://www.hal-india.co.in', 'Assist in aircraft design and aerospace component testing.', array['aerospace', 'onsite']::text[]),
('133', 'BHEL', 'Electrical Engineering Intern', 'Electrical', array['Electrical', 'Electronics']::text[], array['MATLAB', 'Circuit Design']::text[], array['Power Systems', 'PLC', 'SCADA']::text[], 'Multiple Cities', false, 6, 6.5, '₹18,000/mo', 'https://www.bhel.com', 'Work on power generation equipment and electrical systems.', array['electrical', 'onsite']::text[]),
('134', 'Deloitte', 'BBA Consulting Intern', 'BBA', array['BBA', 'MBA', 'Commerce']::text[], array['MS Excel', 'Communication']::text[], array['Business Analysis', 'PowerPoint', 'SQL']::text[], 'Multiple Cities', false, 6, 6.5, '₹20,000/mo', 'https://www.deloitte.com/in/en/careers.html', 'Support consulting engagements across business verticals.', array['bba', 'onsite']::text[]),
('135', 'Google', 'Mathematics Intern', 'Mathematics', array['Mathematics', 'Statistics']::text[], array['Python', 'Statistics']::text[], array['R', 'SQL', 'Algorithm Design']::text[], 'Bangalore', false, 6, 8, '₹70,000/mo', 'https://careers.google.com', 'Apply advanced mathematics to optimize Google products.', array['mathematics', 'onsite']::text[])
on conflict (id) do update set
  company = excluded.company,
  title = excluded.title,
  stream = excluded.stream,
  eligible_streams = excluded.eligible_streams,
  skills_required = excluded.skills_required,
  skills_preferred = excluded.skills_preferred,
  location = excluded.location,
  is_remote = excluded.is_remote,
  duration_months = excluded.duration_months,
  min_cgpa = excluded.min_cgpa,
  stipend = excluded.stipend,
  application_url = excluded.application_url,
  description = excluded.description,
  tags = excluded.tags;
