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

1. **Navigate to the project directory**
   ```bash
   cd road-to-1-percent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up Supabase Database**
   
   Run the SQL from `database_migration.sql` in your Supabase SQL editor.

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
└── contexts/             # React contexts
```

## Development

- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start`
- **Lint**: `npm run lint`

## Deployment

This project is configured for deployment on Vercel, Netlify, or Railway. See the respective configuration files for details.
