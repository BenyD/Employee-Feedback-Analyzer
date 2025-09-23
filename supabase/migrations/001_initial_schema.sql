-- Employee Feedback Analyzer Database Schema
-- This migration creates the initial tables for the feedback system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Departments table
CREATE TABLE departments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Engineering', 'Software development and technical teams'),
('Product', 'Product management and design teams'),
('Sales', 'Sales and business development'),
('Marketing', 'Marketing and growth teams'),
('HR', 'Human resources and people operations'),
('Operations', 'Operations and administrative teams'),
('Finance', 'Finance and accounting teams'),
('Customer Success', 'Customer support and success teams');

-- Feedback submissions table
CREATE TABLE feedback_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    -- Anonymous feedback data
    is_anonymous BOOLEAN DEFAULT TRUE,
    submitter_name TEXT, -- Only populated when is_anonymous = false
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
    work_environment_rating INTEGER CHECK (work_environment_rating >= 1 AND work_environment_rating <= 5),
    management_rating INTEGER CHECK (management_rating >= 1 AND management_rating <= 5),
    compensation_rating INTEGER CHECK (compensation_rating >= 1 AND compensation_rating <= 5),
    growth_opportunities_rating INTEGER CHECK (growth_opportunities_rating >= 1 AND growth_opportunities_rating <= 5),
    
    -- Text feedback (encrypted)
    comments TEXT,
    suggestions TEXT,
    
    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_hash VARCHAR(64), -- Hashed IP for basic analytics
    user_agent_hash VARCHAR(64), -- Hashed user agent
    
    -- Analysis results (populated by ML pipeline)
    sentiment_score DECIMAL(3,2), -- -1.0 to 1.0
    sentiment_label VARCHAR(20), -- 'positive', 'negative', 'neutral'
    confidence_score DECIMAL(3,2), -- 0.0 to 1.0
    
    -- Privacy flags
    contains_pii BOOLEAN DEFAULT FALSE,
    redacted_comments TEXT, -- PII-redacted version
    redacted_suggestions TEXT
);

-- Topics table for clustering results
CREATE TABLE topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    keywords TEXT[], -- Array of keywords
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback topic assignments
CREATE TABLE feedback_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    feedback_id UUID REFERENCES feedback_submissions(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3,2), -- 0.0 to 1.0
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(feedback_id, topic_id)
);

-- Analysis cache table for ML results
CREATE TABLE analysis_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content_hash VARCHAR(64) NOT NULL UNIQUE, -- Hash of the input text
    model_name VARCHAR(100) NOT NULL,
    result JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Indexes for performance
CREATE INDEX idx_feedback_department ON feedback_submissions(department_id);
CREATE INDEX idx_feedback_submitted_at ON feedback_submissions(submitted_at);
CREATE INDEX idx_feedback_sentiment ON feedback_submissions(sentiment_score);
CREATE INDEX idx_feedback_topics_feedback ON feedback_topics(feedback_id);
CREATE INDEX idx_feedback_topics_topic ON feedback_topics(topic_id);
CREATE INDEX idx_analysis_cache_hash ON analysis_cache(content_hash);
CREATE INDEX idx_analysis_cache_expires ON analysis_cache(expires_at);

-- RLS (Row Level Security) policies
ALTER TABLE feedback_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_cache ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for feedback submissions
CREATE POLICY "Allow anonymous feedback submission" ON feedback_submissions
    FOR INSERT WITH CHECK (true);

-- Allow public read access to departments
CREATE POLICY "Allow public read departments" ON departments
    FOR SELECT USING (true);

-- Allow public read access to topics
CREATE POLICY "Allow public read topics" ON topics
    FOR SELECT USING (true);

-- Allow public read access to feedback topics
CREATE POLICY "Allow public read feedback topics" ON feedback_topics
    FOR SELECT USING (true);

-- Service role can access all data
CREATE POLICY "Service role full access" ON feedback_submissions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access departments" ON departments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access topics" ON topics
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access feedback topics" ON feedback_topics
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access analysis cache" ON analysis_cache
    FOR ALL USING (auth.role() = 'service_role');

-- Functions for analytics
CREATE OR REPLACE FUNCTION get_department_sentiment_stats(department_uuid UUID)
RETURNS TABLE (
    department_name VARCHAR,
    total_feedback BIGINT,
    avg_sentiment DECIMAL,
    positive_count BIGINT,
    negative_count BIGINT,
    neutral_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.name,
        COUNT(fs.id) as total_feedback,
        ROUND(AVG(fs.sentiment_score)::DECIMAL, 3) as avg_sentiment,
        COUNT(CASE WHEN fs.sentiment_label = 'positive' THEN 1 END) as positive_count,
        COUNT(CASE WHEN fs.sentiment_label = 'negative' THEN 1 END) as negative_count,
        COUNT(CASE WHEN fs.sentiment_label = 'neutral' THEN 1 END) as neutral_count
    FROM departments d
    LEFT JOIN feedback_submissions fs ON d.id = fs.department_id
    WHERE d.id = department_uuid
    GROUP BY d.id, d.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get trending topics
CREATE OR REPLACE FUNCTION get_trending_topics(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    topic_name VARCHAR,
    topic_description TEXT,
    feedback_count BIGINT,
    avg_sentiment DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.name,
        t.description,
        COUNT(ft.feedback_id) as feedback_count,
        ROUND(AVG(fs.sentiment_score)::DECIMAL, 3) as avg_sentiment
    FROM topics t
    LEFT JOIN feedback_topics ft ON t.id = ft.topic_id
    LEFT JOIN feedback_submissions fs ON ft.feedback_id = fs.id
    GROUP BY t.id, t.name, t.description
    ORDER BY feedback_count DESC, avg_sentiment DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
