-- ============================================================
-- CareerSetu — V4: Demo Data Seed
-- ============================================================

-- ── Skill Categories ──────────────────────────────────────────
INSERT INTO skill_categories (id, name, sort_order) VALUES
    (uuid_generate_v4(), 'Programming Languages', 1),
    (uuid_generate_v4(), 'Web Development', 2),
    (uuid_generate_v4(), 'Backend Frameworks', 3),
    (uuid_generate_v4(), 'Databases', 4),
    (uuid_generate_v4(), 'Cloud & DevOps', 5),
    (uuid_generate_v4(), 'Data Science & AI/ML', 6),
    (uuid_generate_v4(), 'Mobile Development', 7),
    (uuid_generate_v4(), 'Cybersecurity', 8),
    (uuid_generate_v4(), 'Soft Skills', 9),
    (uuid_generate_v4(), 'Domain Knowledge', 10);

-- ── Demo Tenants ─────────────────────────────────────────────
INSERT INTO tenants (id, name, slug, type) VALUES
    ('11111111-0000-0000-0000-000000000001', 'Demo University', 'demo-university', 'INSTITUTION'),
    ('22222222-0000-0000-0000-000000000001', 'TechCorp India', 'techcorp-india', 'COMPANY'),
    ('33333333-0000-0000-0000-000000000001', 'InnovateSoft', 'innovatesoft', 'COMPANY'),
    ('44444444-0000-0000-0000-000000000001', 'CareerSetu Platform', 'careersetu', 'PLATFORM');

-- ── Demo Institutions ─────────────────────────────────────────
INSERT INTO institutions (id, tenant_id, name, short_name, type, state, city, status) VALUES
    (
        'aaaaaaaa-0000-0000-0000-000000000001',
        '11111111-0000-0000-0000-000000000001',
        'Demo Institute of Technology',
        'DIT',
        'COLLEGE',
        'Maharashtra',
        'Pune',
        'ACTIVE'
    ),
    (
        'aaaaaaaa-0000-0000-0000-000000000002',
        uuid_generate_v4(),
        'National College of Engineering',
        'NCE',
        'COLLEGE',
        'Karnataka',
        'Bengaluru',
        'ACTIVE'
    );

-- ── Demo Companies ────────────────────────────────────────────
INSERT INTO companies (
    id, tenant_id, legal_name, brand_name, company_type, industry,
    headquarters_city, headquarters_state, verification_status, is_active
) VALUES
    (
        'bbbbbbbb-0000-0000-0000-000000000001',
        '22222222-0000-0000-0000-000000000001',
        'TechCorp India Private Limited',
        'TechCorp',
        'STARTUP',
        'Information Technology',
        'Bengaluru',
        'Karnataka',
        'APPROVED',
        TRUE
    ),
    (
        'bbbbbbbb-0000-0000-0000-000000000002',
        '33333333-0000-0000-0000-000000000001',
        'InnovateSoft Solutions Pvt Ltd',
        'InnovateSoft',
        'SME',
        'Software Development',
        'Hyderabad',
        'Telangana',
        'APPROVED',
        TRUE
    ),
    (
        'bbbbbbbb-0000-0000-0000-000000000003',
        uuid_generate_v4(),
        'DataVision Analytics Pvt Ltd',
        'DataVision',
        'SME',
        'Analytics & Data Science',
        'Mumbai',
        'Maharashtra',
        'APPROVED',
        TRUE
    );

-- NOTE: Demo user passwords will be set by the application at startup
-- using Argon2id hashing. Raw passwords are never stored.
-- Demo accounts are only for development environments.
-- Password for all demo accounts: "Demo@CareerSetu2024"

-- ── Demo Skills (subset) ──────────────────────────────────────
-- Full skills will be loaded via the application seed service
INSERT INTO skills (id, name, slug, industry_demand, is_technical) VALUES
    (uuid_generate_v4(), 'Java', 'java', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Python', 'python', 'HIGH', TRUE),
    (uuid_generate_v4(), 'JavaScript', 'javascript', 'HIGH', TRUE),
    (uuid_generate_v4(), 'TypeScript', 'typescript', 'HIGH', TRUE),
    (uuid_generate_v4(), 'React', 'react', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Spring Boot', 'spring-boot', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Node.js', 'nodejs', 'HIGH', TRUE),
    (uuid_generate_v4(), 'PostgreSQL', 'postgresql', 'HIGH', TRUE),
    (uuid_generate_v4(), 'MySQL', 'mysql', 'HIGH', TRUE),
    (uuid_generate_v4(), 'MongoDB', 'mongodb', 'MEDIUM', TRUE),
    (uuid_generate_v4(), 'Docker', 'docker', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Kubernetes', 'kubernetes', 'HIGH', TRUE),
    (uuid_generate_v4(), 'AWS', 'aws', 'HIGH', TRUE),
    (uuid_generate_v4(), 'GCP', 'gcp', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Git', 'git', 'HIGH', TRUE),
    (uuid_generate_v4(), 'REST APIs', 'rest-apis', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Machine Learning', 'machine-learning', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Deep Learning', 'deep-learning', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Data Analysis', 'data-analysis', 'HIGH', TRUE),
    (uuid_generate_v4(), 'SQL', 'sql', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Redis', 'redis', 'MEDIUM', TRUE),
    (uuid_generate_v4(), 'Microservices', 'microservices', 'HIGH', TRUE),
    (uuid_generate_v4(), 'CI/CD', 'ci-cd', 'HIGH', TRUE),
    (uuid_generate_v4(), 'Linux', 'linux', 'HIGH', TRUE),
    (uuid_generate_v4(), 'FastAPI', 'fastapi', 'MEDIUM', TRUE),
    (uuid_generate_v4(), 'Communication', 'communication', 'HIGH', FALSE),
    (uuid_generate_v4(), 'Problem Solving', 'problem-solving', 'HIGH', FALSE),
    (uuid_generate_v4(), 'Team Collaboration', 'team-collaboration', 'HIGH', FALSE),
    (uuid_generate_v4(), 'Critical Thinking', 'critical-thinking', 'HIGH', FALSE),
    (uuid_generate_v4(), 'Leadership', 'leadership', 'MEDIUM', FALSE);
