# Board Game Review Platform

A Next.js application for reviewing and discovering board games, built with TypeScript, Tailwind CSS, and Supabase.

## Features

- Browse and search board games
- Read and write game reviews
- User authentication and profiles
- Admin panel for managing games and users
- Responsive design with modern UI components

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel (recommended)

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

```bash
POSTGRES_URL="your_postgres_connection_string"
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"
```

### 2. Database Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the provided SQL script to create tables and sample data
4. The script will create:
   - `profiles` table (extends auth.users)
   - `categories` table
   - `games` table
   - `reviews` table
   - `game_media` table
   - `wishlist` table
   - Row Level Security policies
   - Sample data for categories and games

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
pnpm build
```

## Database Schema

The application uses the following main tables:

- **profiles**: User profiles and information
- **categories**: Game categories (Strategy, Family, Party, etc.)
- **games**: Board game information (title, description, publisher, etc.)
- **reviews**: User reviews and ratings for games
- **game_media**: Additional images and media for games
- **wishlist**: User wishlist items

## Project Structure

```
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── admin/            # Admin panel components
│   ├── auth/             # Authentication components
│   ├── categories/       # Category-related components
│   ├── game-detail/      # Game detail page components
│   ├── games/            # Game listing components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── reviews/          # Review components
│   └── ui/               # Reusable UI components
├── controllers/           # Business logic controllers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and services
│   ├── supabase/         # Supabase client configuration
│   ├── services/         # Service layer for data access
│   └── utils/            # Utility functions
├── models/                # Data models and database access
└── styles/                # Global styles
```

## Authentication

The application uses Supabase Auth for user authentication. Users can:
- Register and login
- Update their profiles
- Write reviews for games
- Add games to their wishlist

## Admin Features

Admin users can:
- Manage games (create, edit, delete)
- View user statistics
- Moderate reviews
- Manage categories

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

