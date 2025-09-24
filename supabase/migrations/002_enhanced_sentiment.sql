-- Enhanced Sentiment Analysis Migration
-- Adds intensity levels and aspect-based sentiment analysis

-- Add intensity level column
ALTER TABLE feedback_submissions 
ADD COLUMN sentiment_intensity VARCHAR(20) CHECK (sentiment_intensity IN ('mild', 'moderate', 'strong', 'extreme'));

-- Add aspect-based sentiment scores
ALTER TABLE feedback_submissions 
ADD COLUMN work_environment_sentiment DECIMAL(3,2),
ADD COLUMN management_sentiment DECIMAL(3,2),
ADD COLUMN compensation_sentiment DECIMAL(3,2),
ADD COLUMN growth_opportunities_sentiment DECIMAL(3,2);

-- Add aspect-based sentiment labels
ALTER TABLE feedback_submissions 
ADD COLUMN work_environment_sentiment_label VARCHAR(20),
ADD COLUMN management_sentiment_label VARCHAR(20),
ADD COLUMN compensation_sentiment_label VARCHAR(20),
ADD COLUMN growth_opportunities_sentiment_label VARCHAR(20);

-- Add aspect-based sentiment intensity
ALTER TABLE feedback_submissions 
ADD COLUMN work_environment_intensity VARCHAR(20),
ADD COLUMN management_intensity VARCHAR(20),
ADD COLUMN compensation_intensity VARCHAR(20),
ADD COLUMN growth_opportunities_intensity VARCHAR(20);

-- Add indexes for better query performance
CREATE INDEX idx_sentiment_intensity ON feedback_submissions(sentiment_intensity);
CREATE INDEX idx_work_env_sentiment ON feedback_submissions(work_environment_sentiment);
CREATE INDEX idx_management_sentiment ON feedback_submissions(management_sentiment);
CREATE INDEX idx_compensation_sentiment ON feedback_submissions(compensation_sentiment);
CREATE INDEX idx_growth_sentiment ON feedback_submissions(growth_opportunities_sentiment);
