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

- **Sentiment Analysis** - Real-time sentiment scoring with fallback algorithms
- **PII Detection** - Automatic detection and redaction of personal information
- **Confidence Scoring** - ML confidence metrics for reliability
- **Caching** - Intelligent caching to optimize API usage
- **Text Processing** - Advanced text analysis and redaction

### 📊 **HR Dashboard**

- **Real-time Analytics** - Live feedback metrics and trends
- **Department Insights** - Department-wise sentiment and rating analysis
- **Visual Charts** - Interactive charts and graphs using Recharts
- **CSV Export** - Download analytics data for further analysis
- **Trend Analysis** - 7-day feedback trends and patterns
- **Detailed Feedback Table** - Individual feedback submissions with expandable details
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
git clone https://github.com/yourusername/moodly.git
cd moodly
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

- **Sentiment Analysis** - Custom algorithm with Hugging Face API fallback
- **PII Detection** - Regex-based redaction for emails, names, phone numbers
- **Text Encryption** - AES encryption for sensitive data
- **Caching Layer** - Database caching for ML results
- **Confidence Scoring** - ML reliability metrics

### **Database Schema**

```sql
-- Core tables
departments          -- Department information
feedback_submissions -- Anonymous feedback data
topics              -- Discovered topics
feedback_topics     -- Topic assignments
analysis_cache      -- ML result caching
```

## 📱 Usage

### **For Employees**

1. Visit the homepage
2. Select your department
3. Rate various aspects (1-5 stars)
4. Provide detailed comments and suggestions
5. Submit anonymously

### **For HR Teams**

1. Access the dashboard at `/dashboard`
2. View real-time analytics
3. Analyze department-wise insights
4. Export data for further analysis
5. Monitor trends and patterns

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
// - Sentiment distribution
// - Department statistics
// - Rating distribution
// - Trend data (7-day)
```

### **Feedback Data (Paginated)**

```typescript
GET /api/feedback-data?page=1&limit=10
// Returns paginated feedback submissions with department info
```

### **Departments**

```typescript
GET / api / departments;
// Returns list of departments with descriptions
```

### **Sentiment Analysis**

```typescript
POST / api / analyze - sentiment;
{
  text: string;
}
// Returns sentiment score, label, and confidence
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
moodly/
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

- [ ] **Topic Clustering** - BERTopic integration for automatic topic discovery
- [ ] **Advanced Analytics** - More sophisticated ML models
- [ ] **Real-time Notifications** - Alert HR teams of concerning feedback
- [ ] **Multi-language Support** - International feedback collection
- [ ] **Custom Dashboards** - Department-specific views
- [ ] **Integration APIs** - Connect with existing HR systems
- [ ] **Advanced PII Detection** - Machine learning-based PII detection
- [ ] **Feedback Categories** - Automatic categorization of feedback topics

## 🎓 Academic Purpose

This project was developed as a **Text Analytics and Natural Language Processing** demonstration for academic purposes. It showcases practical implementation of:

- Text preprocessing and cleaning techniques
- Sentiment analysis algorithms and their applications
- PII detection using pattern matching and regex
- Natural language processing in web applications
- Data visualization of text analytics results

## 📄 License

MIT License - see LICENSE file for details.

---

**Developed for Text Analytics and Natural Language Processing Course - September 24, 2025**
