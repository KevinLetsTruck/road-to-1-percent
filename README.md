# Road to 1% - Personal Development Platform

A comprehensive personal development platform designed to help professional drivers progress through different tiers (90%, 9%, 1%) by completing assessments and tracking their progress.

## Features

- **User Authentication**: Secure login and registration with Supabase
- **Assessment System**: Multiple assessment types (SPI Financial, Leadership, etc.)
- **Progress Tracking**: Visual progress indicators and milestone tracking
- **Quarterly Assessment System**: Regular progress reviews and goal setting
- **Personalized Action Plans**: AI-generated recommendations based on assessment results
- **Community Features**: Peer groups and member connections
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Live progress tracking and score calculation

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd road-to-1-percent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   **profiles table:**
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     phone TEXT,
     avatar_url TEXT,
     is_active BOOLEAN DEFAULT true,
     is_admin BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **user_progress table:**
   ```sql
   CREATE TABLE user_progress (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     current_tier TEXT DEFAULT '90%',
     spi_completed BOOLEAN DEFAULT false,
     standout_completed BOOLEAN DEFAULT false,
     leadership_completed BOOLEAN DEFAULT false,
     customer_service_completed BOOLEAN DEFAULT false,
     operational_completed BOOLEAN DEFAULT false,
     health_completed BOOLEAN DEFAULT false,
     business_track_progress INTEGER DEFAULT 0,
     personal_track_progress INTEGER DEFAULT 0,
     health_track_progress INTEGER DEFAULT 0,
     milestones_achieved JSONB DEFAULT '[]',
     program_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **spi_assessments table:**
   ```sql
   CREATE TABLE spi_assessments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) NOT NULL,
     cash_checking NUMERIC DEFAULT 0,
     savings NUMERIC DEFAULT 0,
     investments NUMERIC DEFAULT 0,
     retirement NUMERIC DEFAULT 0,
     real_estate NUMERIC DEFAULT 0,
     vehicles NUMERIC DEFAULT 0,
     equipment NUMERIC DEFAULT 0,
     other_assets NUMERIC DEFAULT 0,
     credit_cards NUMERIC DEFAULT 0,
     auto_loans NUMERIC DEFAULT 0,
     mortgage NUMERIC DEFAULT 0,
     equipment_loans NUMERIC DEFAULT 0,
     personal_loans NUMERIC DEFAULT 0,
     other_debts NUMERIC DEFAULT 0,
     monthly_income NUMERIC DEFAULT 0,
     monthly_expenses NUMERIC DEFAULT 0,
     emergency_fund_months INTEGER DEFAULT 0,
     overall_spi_score INTEGER DEFAULT 0,
     category TEXT,
     assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── assessments/   # Assessment pages
│   │   ├── community/     # Community features
│   │   ├── progress/      # Progress tracking
│   │   └── page.tsx       # Main dashboard
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utility libraries
│   └── supabase/         # Supabase client configuration
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Explained

### Assessment System
- **SPI Financial Assessment**: Comprehensive financial evaluation
- **Leadership Assessment**: Leadership readiness evaluation
- **Customer Service Assessment**: Customer service excellence
- **Operational Assessment**: Operational efficiency
- **Health Assessment**: Health and wellness evaluation

### Progress Tracking
- Visual progress bars for each track
- Milestone achievement tracking
- Tier progression (90% → 9% → 1%)
- Assessment completion status

### Community Features
- Peer group management
- Member profiles and connections
- Community statistics and engagement

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@roadto1percent.com or create an issue in the repository.
