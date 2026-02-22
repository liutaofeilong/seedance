# Seedance - AI Video Generation Platform

A cutting-edge AI-powered video generation platform with stunning cyberpunk aesthetics. Create professional videos from text descriptions or images using advanced AI technology.

## ✨ Features

- 🎬 **Text to Video**: Transform written narratives into cinematic videos
- 🖼️ **Image to Video**: Animate static images with AI
- 🔐 **Google OAuth**: Seamless authentication with Google
- 💳 **Subscription Plans**: Flexible pricing with Stripe integration
- 🎨 **Cyberpunk UI**: Modern, futuristic design with neon accents
- ⚡ **Lightning Fast**: Generate videos in under 30 seconds
- 🔒 **Supabase Backend**: Secure, scalable database

## 🎨 Design Highlights

- **Orbitron** font for futuristic headings
- **Cyan (#00F0FF)**, **Purple (#7C3AED)**, **Pink (#F72585)** color scheme
- Glassmorphism effects with neon glows
- Smooth Framer Motion animations
- Responsive design for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **Payment**: Stripe
- **Animations**: Framer Motion
- **AI Integration**: Seedance API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Stripe account
- Seedance API key
- Google OAuth credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd seedance
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Seedance API
SEEDANCE_API_KEY=your-seedance-api-key
SEEDANCE_API_URL=https://api.seedance.ai

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

4. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Enable Google OAuth in Authentication settings
   - Copy your project URL and anon key

5. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
   - Add credentials to Supabase Auth settings

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## 💰 Pricing Plans

- **Free Trial**: $0 - 1 video generation
- **Monthly**: $100/month - Unlimited videos, 4K quality
- **Quarterly**: $250/3 months - Save $50
- **Annual**: $800/year - Save $400

## 📁 Project Structure

```
seedance/
├── components/          # React components
│   ├── Navbar.tsx      # Navigation with glassmorphism
│   ├── Hero.tsx        # Landing hero section
│   ├── Features.tsx    # Feature showcase
│   ├── Pricing.tsx     # Pricing cards
│   └── Footer.tsx      # Footer with social links
├── pages/              # Next.js pages
│   ├── index.tsx       # Landing page
│   ├── generate.tsx    # Video generation interface
│   ├── login.tsx       # Login with Google OAuth
│   ├── signup.tsx      # Signup page
│   └── api/            # API routes
├── lib/                # Utility functions
│   └── supabase.ts     # Supabase client
├── styles/             # Global styles
│   └── globals.css     # Cyberpunk theme
└── public/             # Static assets
```

## 🎨 Color Palette

- **Primary (Cyan)**: #00F0FF - Main accent color
- **Secondary (Purple)**: #7C3AED - Secondary accent
- **Accent (Pink)**: #F72585 - Call-to-action
- **Dark Background**: #0A0E27 - Main background
- **Dark Card**: #1A1F3A - Card backgrounds

## 🔧 Configuration

### Supabase Setup

Create the following table in your Supabase database:

```sql
create table users (
  id uuid references auth.users primary key,
  name text,
  email text unique,
  subscription_plan text default 'free',
  subscription_status text default 'active',
  videos_generated integer default 0,
  created_at timestamp with time zone default now()
);
```

### Stripe Setup

1. Create products in Stripe Dashboard
2. Copy price IDs to your code
3. Set up webhook endpoint: `/api/stripe/webhook`
4. Add webhook secret to `.env.local`

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Make sure to add all environment variables from `.env.local.example` to your deployment platform.

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Support

For support, email support@seedance.com or open an issue.

---

Built with ❤️ using Next.js, Supabase, and cutting-edge AI technology.

# seedance
