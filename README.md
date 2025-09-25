# 🎯 Employee Feedback Analyzer - Text Analytics Demo

**Date: September 24, 2025**

A basic demo project for the subject **Text Analytics and Natural Language Processing**. This modern, AI-powered employee feedback system is built with Next.js 15, Supabase, and TypeScript to demonstrate sentiment analysis, PII detection, and text processing techniques in a real-world application context.

## 📚 Academic Context

This project serves as a practical demonstration of **Text Analytics and Natural Language Processing** concepts including:

- **Sentiment Analysis** - Implementing and comparing different sentiment analysis approaches
- **PII Detection** - Using regex patterns and text processing to identify personal information
- **Text Preprocessing** - Data cleaning, redaction, and preparation techniques
- **Natural Language Understanding** - Processing unstructured text data for insights
- **Machine Learning Integration** - Connecting text analysis with real-world applications

## ✨ Features

### 🔒 **Privacy-First Design**

- **100% Anonymous** - No user authentication required
- **PII Redaction** - Automatic detection and redaction of personal information
- **Data Encryption** - All sensitive data encrypted at rest
- **IP Hashing** - Anonymous analytics without tracking individuals

### 🤖 **AI-Powered Analysis**

- **Enhanced Sentiment Analysis** - Advanced sentiment analysis with intensity levels and aspect-based analysis
- **Intensity Levels** - Sentiment intensity classification (Mild, Moderate, Strong, Extreme)
- **Aspect-based Sentiment** - Granular sentiment analysis for Work Environment, Management, Compensation, and Growth Opportunities
- **PII Detection** - Automatic detection and redaction of personal information
- **Confidence Scoring** - ML confidence metrics for reliability
- **Caching** - Intelligent caching to optimize API usage
- **Text Processing** - Advanced text analysis and redaction

### 📊 **HR Dashboard**

- **Real-time Analytics** - Live feedback metrics and trends
- **Enhanced Sentiment Overview** - Comprehensive sentiment analysis with intensity distribution
- **Aspect-based Analytics** - Detailed sentiment breakdown by workplace aspects
- **Department Insights** - Department-wise sentiment and rating analysis
- **Visual Charts** - Interactive charts and graphs using Recharts
- **CSV Export** - Download analytics data for further analysis
- **Trend Analysis** - 7-day feedback trends and patterns
- **Detailed Feedback Table** - Individual feedback submissions with expandable enhanced sentiment details
- **Rating Breakdowns** - Star ratings for work environment, management, compensation, and growth

### 🎨 **Modern UI/UX**

- **Responsive Design** - Works on all devices
- **shadcn/ui Components** - Beautiful, accessible UI components
- **Form Validation** - Zod-powered form validation
- **Loading States** - Smooth user experience with loading indicators

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase CLI
- Git
- Hugging Face API key (optional, has fallback)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/employee-feedback-analyzer.git
cd employee-feedback-analyzer
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Local Development)
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Hugging Face Inference API (Optional)
HUGGINGFACE_API_KEY=your_hf_api_key

# Encryption key (generate with: openssl rand -base64 32)
ENCRYPTION_KEY=your_32_character_encryption_key
```

**Note**: You can get the Supabase keys after running `supabase start` in the next step.

### 3. Start Supabase

```bash
supabase start
```

This will start the local Supabase instance and provide you with the API keys needed for your `.env.local` file.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### 5. Access the Dashboard

Navigate to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the HR analytics dashboard.

## 🏗️ Architecture

### **Frontend**

- **Next.js 15** - React framework with App Router and Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library with Radix UI primitives
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation and type inference
- **Recharts** - Data visualization and interactive charts
- **Lucide React** - Icon library

### **Backend**

- **Supabase** - Database and real-time subscriptions
- **PostgreSQL** - Relational database
- **Row Level Security** - Data access control
- **Edge Functions** - Serverless functions

### **AI/ML**

- **Enhanced Sentiment Analysis** - Advanced sentiment analysis with intensity levels and aspect-based analysis
- **Intensity Classification** - Sentiment intensity levels (Mild, Moderate, Strong, Extreme)
- **Aspect-based Analysis** - Granular sentiment analysis for specific workplace aspects
- **Custom Algorithm** - Fallback sentiment analysis with Hugging Face API integration
- **PII Detection** - Regex-based redaction for emails, names, phone numbers
- **Text Encryption** - AES encryption for sensitive data
- **Caching Layer** - Database caching for ML results
- **Confidence Scoring** - ML reliability metrics

### **Database Schema**

```sql
-- Core tables
departments          -- Department information
feedback_submissions -- Anonymous feedback data with enhanced sentiment fields
topics              -- Discovered topics
feedback_topics     -- Topic assignments
analysis_cache      -- ML result caching

-- Enhanced sentiment fields in feedback_submissions:
sentiment_intensity                    -- Overall sentiment intensity level
work_environment_sentiment            -- Work environment sentiment score
work_environment_sentiment_label      -- Work environment sentiment label
work_environment_intensity            -- Work environment intensity level
management_sentiment                  -- Management sentiment score
management_sentiment_label            -- Management sentiment label
management_intensity                  -- Management intensity level
compensation_sentiment                -- Compensation sentiment score
compensation_sentiment_label          -- Compensation sentiment label
compensation_intensity                -- Compensation intensity level
growth_opportunities_sentiment        -- Growth opportunities sentiment score
growth_opportunities_sentiment_label  -- Growth opportunities sentiment label
growth_opportunities_intensity        -- Growth opportunities intensity level
```

## 🧠 Enhanced Sentiment Analysis Features

### **Intensity Levels**

The system now classifies sentiment intensity into four levels:

- **Mild** - Subtle sentiment expression
- **Moderate** - Clear sentiment with moderate strength
- **Strong** - Intense sentiment expression
- **Extreme** - Very strong sentiment (rare cases)

### **Aspect-based Analysis**

Granular sentiment analysis across four key workplace aspects:

- **Work Environment** - Physical and cultural workplace factors
- **Management** - Leadership and supervisory relationships
- **Compensation** - Salary, benefits, and financial rewards
- **Growth Opportunities** - Career development and advancement

### **Enhanced Dashboard Features**

- **Sentiment Intensity Distribution** - Visual breakdown of sentiment intensity levels
- **Aspect-based Analytics** - Detailed sentiment analysis for each workplace aspect
- **Individual Feedback Details** - Expandable sentiment analysis for each feedback submission
- **Real-time Processing** - Automatic sentiment analysis with intensity and aspect classification

## 📱 Usage

### **For Employees**

1. Visit the homepage
2. Select your department
3. Rate various aspects (1-5 stars)
4. Provide detailed comments and suggestions
5. Submit anonymously (sentiment analysis happens automatically)

### **For HR Teams**

1. Access the dashboard at `/dashboard`
2. View real-time analytics with enhanced sentiment insights
3. Analyze department-wise insights with intensity levels
4. Review aspect-based sentiment breakdowns
5. Export data for further analysis
6. Monitor trends and patterns with detailed sentiment metrics

## 🔧 API Endpoints

### **Feedback Submission**

```typescript
POST /api/feedback
{
  isAnonymous: boolean,
  name?: string,
  departmentId: string,
  overallRating: number,
  workEnvironmentRating: number,
  managementRating: number,
  compensationRating: number,
  growthOpportunitiesRating: number,
  comments: string,
  suggestions?: string
}
```

### **Analytics Data**

```typescript
GET / api / analytics;
// Returns comprehensive analytics data including:
// - Overview metrics (total feedback, avg rating, sentiment)
// - Sentiment distribution with intensity levels
// - Department statistics with enhanced sentiment
// - Rating distribution
// - Trend data (7-day)
// - Enhanced sentiment analysis metrics
```

### **Feedback Data (Paginated)**

```typescript
GET /api/feedback-data?page=1&limit=10
// Returns paginated feedback submissions with department info and enhanced sentiment data
```

### **Departments**

```typescript
GET / api / departments;
// Returns list of departments with descriptions
```

### **Enhanced Sentiment Analysis**

```typescript
POST / api / analyze - sentiment;
{
  text: string;
}
// Returns enhanced sentiment analysis including:
// - Overall sentiment score, label, and confidence
// - Sentiment intensity level (mild, moderate, strong, extreme)
// - Aspect-based sentiment analysis for:
//   - Work Environment (score, label, intensity)
//   - Management (score, label, intensity)
//   - Compensation (score, label, intensity)
//   - Growth Opportunities (score, label, intensity)
```

### **CSV Export**

```typescript
GET /api/export-csv
// Downloads feedback data as CSV file
```

## 🛡️ Security & Privacy

- **Anonymous by Design** - No user accounts or personal data collection
- **PII Redaction** - Automatic detection of emails, names, phone numbers
- **Data Encryption** - AES encryption for sensitive text data
- **IP Hashing** - Anonymous analytics without individual tracking
- **Row Level Security** - Database-level access control

## 🚀 Deployment

### **Vercel Deployment**

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### **Supabase Production**

1. Create a new Supabase project
2. Update environment variables
3. Run migrations: `supabase db push`

## 📁 Project Structure

```
employee-feedback-analyzer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── analytics/     # Analytics endpoint
│   │   │   ├── departments/   # Department management
│   │   │   ├── feedback/      # Feedback submission
│   │   │   ├── feedback-data/ # Paginated feedback data
│   │   │   ├── analyze-sentiment/ # Sentiment analysis
│   │   │   └── export-csv/    # CSV export
│   │   ├── dashboard/         # HR dashboard page
│   │   └── page.tsx           # Homepage with feedback form
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── FeedbackForm.tsx  # Main feedback form
│   │   ├── FeedbackTable.tsx # Feedback data table
│   │   ├── Navigation.tsx    # Navigation component
│   │   └── AIDemo.tsx        # AI demo component
│   ├── lib/                  # Utility libraries
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # Utility functions
│   └── schemas/              # Zod validation schemas
│       └── feedback.ts       # Feedback form schema
├── supabase/                 # Database migrations
│   ├── migrations/
│   └── seed.sql
└── scripts/                  # Utility scripts
    ├── generate-seed-data.js
    └── verify-seed-data.js
```

## 🔮 Future Enhancements

- [x] **Enhanced Sentiment Analysis** - Intensity levels and aspect-based sentiment analysis ✅
- [ ] **Topic Clustering** - BERTopic integration for automatic topic discovery
- [ ] **Advanced Analytics** - More sophisticated ML models
- [ ] **Real-time Notifications** - Alert HR teams of concerning feedback
- [ ] **Multi-language Support** - International feedback collection
- [ ] **Custom Dashboards** - Department-specific views
- [ ] **Integration APIs** - Connect with existing HR systems
- [ ] **Advanced PII Detection** - Machine learning-based PII detection
- [ ] **Feedback Categories** - Automatic categorization of feedback topics
- [ ] **Sentiment Trends** - Historical sentiment analysis and trend prediction
- [ ] **Emotion Detection** - Beyond sentiment to detect specific emotions

## 🎓 Academic Purpose

This project was developed as a **Text Analytics and Natural Language Processing** demonstration for academic purposes. It showcases practical implementation of:

- **Advanced Sentiment Analysis** - Multi-level sentiment analysis with intensity classification
- **Aspect-based Analysis** - Granular sentiment analysis for specific text aspects
- **Text preprocessing and cleaning techniques** - Data preparation and normalization
- **Sentiment analysis algorithms and their applications** - From basic to advanced sentiment analysis
- **PII detection using pattern matching and regex** - Privacy protection techniques
- **Natural language processing in web applications** - Real-world NLP implementation
- **Data visualization of text analytics results** - Interactive dashboards and charts
- **Machine Learning Integration** - API integration and fallback algorithms

## 📄 License

MIT License - see LICENSE file for details.

---

**Developed for Text Analytics and Natural Language Processing Course - September 24, 2025**
