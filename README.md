# MarketingPlan.ai - AI-Powered Marketing Plan Generator

A comprehensive web application that generates personalized marketing plans using Claude AI's advanced reasoning capabilities. Built with Next.js 14, TypeScript, and a modern tech stack.

## 🚀 Features

- **Intelligent Questionnaire**: 60+ industry-specific questions covering the 9-square marketing framework
- **Claude AI Integration**: Advanced AI reasoning for strategic marketing analysis and plan generation
- **Comprehensive Output**: Visual one-page plans + detailed implementation guides (25-35 pages)
- **PDF Generation**: Professional marketing plan PDFs with custom branding
- **Email System**: Automated completion emails and sharing functionality
- **User Analytics**: Track user behavior, plan generation metrics, and engagement
- **Industry-Adaptive**: Customized recommendations for 12+ industry types
- **Responsive Design**: Mobile-optimized interface with modern UI/UX

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React 18** with modern hooks
- **Lucide React** for icons

### Backend
- **Next.js API Routes** for serverless functions
- **NextAuth.js** for authentication
- **Prisma ORM** with PostgreSQL
- **Claude AI API** (Anthropic)

### Services & Tools
- **Supabase** (PostgreSQL) for data storage
- **Resend** for email delivery
- **React-PDF** for document generation
- **Analytics tracking** with custom implementation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/marketing-plan-generator.git
   cd marketing-plan-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` and `.env.local` files:

   **For Supabase (Recommended):**
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project and save your database password
   - Go to Settings → Database → Connection Pooling
   - Enable Session Pooler and copy the connection string

   Create `.env` file (for Prisma):
   ```env
   # Supabase Database Connection Strings
   DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-1-[region].pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-1-[region].pooler.supabase.com:5432/postgres"
   ```

   Create `.env.local` file (for Next.js):
   ```env
   # Database (same as .env)
   DATABASE_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-1-[region].pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
   DIRECT_URL="postgresql://postgres.[project-ref]:[PASSWORD]@aws-1-[region].pooler.supabase.com:5432/postgres"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"

   # Claude AI (Required)
   ANTHROPIC_API_KEY="your-anthropic-api-key-here"

   # Email Service (Required)
   RESEND_API_KEY="your-resend-api-key-here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔑 Required API Keys

### Claude AI API Key (Anthropic)
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Resend API Key (Email)
1. Visit [Resend](https://resend.com/)
2. Create an account and generate an API key
3. Add to `.env.local` as `RESEND_API_KEY`

## 📊 How It Works

### Marketing Framework (9 Squares)
1. **Target Market & Customer Avatar**
2. **Value Proposition & Messaging**
3. **Media Channels & Reach**
4. **Lead Capture & Acquisition**
5. **Lead Nurturing & Relationship Building**
6. **Sales Conversion & Closing**
7. **Customer Experience & Delivery**
8. **Lifetime Value & Growth**
9. **Referral System & Advocacy**

### AI Processing Pipeline
- **Step 1**: Business analysis and opportunity identification
- **Step 2**: Strategic recommendations and competitive positioning
- **Step 3**: Comprehensive plan generation with implementation details

## 🚀 Deployment

### Netlify (Configured)
This application is pre-configured for Netlify deployment:

1. **Database Setup**: Create a Supabase project (free tier available)
   - Enable Session Pooler for IPv4 compatibility
   - Copy connection strings for environment variables
2. **Push to GitHub**: Ensure code is in a GitHub repository
3. **Connect to Netlify**: Link your GitHub repository to Netlify
4. **Environment Variables**: Add all required variables in Netlify dashboard
   - `DATABASE_URL` and `DIRECT_URL` from Supabase
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
   - `ANTHROPIC_API_KEY`, `RESEND_API_KEY`
5. **Deploy**: Netlify will automatically build and deploy

See `DEPLOYMENT.md` for detailed Netlify deployment instructions.

### Vercel (Alternative)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## 📚 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── plan/              # Plan display pages
│   └── questionnaire/     # Questionnaire interface
├── components/            # React components
├── lib/                  # Utility libraries
│   ├── claude.ts         # Claude AI integration
│   ├── email/           # Email service
│   ├── pdf/             # PDF generation
│   └── analytics/       # Analytics tracking
├── constants/           # Application constants
└── types/              # TypeScript definitions
```

## 🔒 Security & Compliance

- Secure authentication with NextAuth.js
- Encrypted data storage and transmission
- Input validation and sanitization
- GDPR-compliant data handling

## 📈 Analytics

Tracks user engagement, plan generation metrics, completion rates, and feature usage for continuous improvement.

---

**Built with Claude AI's superior reasoning capabilities for strategic marketing analysis**
