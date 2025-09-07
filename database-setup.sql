-- Board Games Database Setup for Supabase
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '/placeholder-user.jpg',
  bio TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT DEFAULT '',
  publisher TEXT DEFAULT '',
  designer TEXT DEFAULT '',
  year_published INTEGER DEFAULT 0,
  min_players INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 1,
  min_age INTEGER DEFAULT 0,
  playing_time INTEGER DEFAULT 0, -- in minutes
  complexity_rating DECIMAL(2,1) DEFAULT 0.0,
  price DECIMAL(10,2) DEFAULT 0.00,
  image_url TEXT DEFAULT '/placeholder.jpg',
  thumbnail_url TEXT DEFAULT '/placeholder.jpg',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, user_id) -- One review per user per game
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_games_category_id ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_is_active ON games(is_active);
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_reviews_game_id ON reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for games
CREATE POLICY "Anyone can view active games" ON games FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can view all games" ON games FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can view own reviews" ON reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Strategy', 'Games that require strategic thinking and planning'),
('Family', 'Games suitable for all ages and family gatherings'),
('Party', 'Fun, social games perfect for groups'),
('Adventure', 'Games with exploration and adventure themes'),
('Puzzle', 'Games that challenge your problem-solving skills'),
('Educational', 'Games designed to teach while entertaining'),
('Card Games', 'Games primarily using cards as components'),
('Dice Games', 'Games that heavily feature dice mechanics')
ON CONFLICT (name) DO NOTHING;

-- Insert sample games
INSERT INTO games (title, description, short_description, publisher, designer, year_published, min_players, max_players, min_age, playing_time, complexity_rating, price, image_url, thumbnail_url, category_id) VALUES
('Catan', 'A strategy board game where players collect resources and build settlements, cities, and roads to become the dominant force on Catan.', 'Build settlements and trade resources in this classic strategy game.', 'Catan Studio', 'Klaus Teuber', 1995, 3, 4, 10, 90, 2.3, 49.99, '/images/games/Catan.jpeg', '/images/games/Catan.jpeg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1)),
('Ticket to Ride', 'A railway-themed board game where players collect train cards to claim railway routes on a map.', 'Build railway routes across North America.', 'Days of Wonder', 'Alan R. Moon', 2004, 2, 5, 8, 60, 1.9, 39.99, '/images/games/ticket_to_ride.jpg', '/images/games/ticket_to_ride.jpg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1)),
('Pandemic', 'A cooperative board game where players work together to stop the spread of diseases and find cures.', 'Work together to save the world from deadly diseases.', 'Z-Man Games', 'Matt Leacock', 2008, 2, 4, 13, 45, 2.4, 44.99, '/images/games/pandemic.jpeg', '/images/games/pandemic.jpeg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1)),
('Codenames', 'A social word game where players give one-word clues to help their teammates identify secret agents.', 'Give clues to help your team identify secret agents.', 'Czech Games', 'Vlaada Chvátil', 2015, 4, 8, 14, 15, 1.2, 19.99, '/images/games/Codenames.jpeg', '/images/games/Codenames.jpeg', (SELECT id FROM categories WHERE name = 'Party' LIMIT 1)),
('Azul', 'A tile-laying game where players draft colorful tiles to create beautiful patterns.', 'Create beautiful patterns with colorful tiles.', 'Plan B Games', 'Michael Kiesling', 2017, 2, 4, 8, 45, 1.8, 34.99, '/images/games/azul.jpeg', '/images/games/azul.jpeg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1)),
('Wingspan', 'A competitive bird-collection game where players attract birds to their wildlife preserves.', 'Attract beautiful birds to your wildlife preserve.', 'Stonemaier Games', 'Elizabeth Hargrave', 2019, 1, 5, 10, 70, 2.4, 59.99, '/images/games/Wingspan.jpeg', '/images/games/Wingspan.jpeg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1)),
('Splendor', 'A fast-paced card game where players collect gems to build an economic engine.', 'Collect gems and build your economic empire.', 'Asmodee', 'Marc André', 2014, 2, 4, 10, 30, 1.8, 29.99, '/images/games/splendor.jpg', '/images/games/splendor.jpg', (SELECT id FROM categories WHERE name = 'Strategy' LIMIT 1))
ON CONFLICT DO NOTHING;
