class GameService {
    constructor() {
        this.supabase = window.supabaseConfig;
    }

    // Get all products with optional filters
    async getGames(filters = {}, page = 1, pageSize = 12) {
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 100));

            // Build query parameters
            let query = 'product_list?select=*';
            let params = [];

            // Add filters
            if (filters.search) {
                query += `&name=ilike.*${filters.search}*`;
            }
            if (filters.category) {
                query += `&category=eq.${filters.category}`;
            }
            if (filters.players) {
                // Handle player range filters
                switch (filters.players) {
                    case '1':
                        query += `&min_players=eq.1&max_players=eq.1`;
                        break;
                    case '2':
                        query += `&min_players=eq.2&max_players=eq.2`;
                        break;
                    case '3-4':
                        query += `&min_players=gte.3&max_players=lte.4`;
                        break;
                    case '5+':
                        query += `&min_players=gte.5`;
                        break;
                }
            }
            if (filters.playtime) {
                // Handle playtime range filters
                switch (filters.playtime) {
                    case '0-30':
                        query += `&time_required_minutes=lte.30`;
                        break;
                    case '30-60':
                        query += `&time_required_minutes=gte.30&time_required_minutes=lte.60`;
                        break;
                    case '60-120':
                        query += `&time_required_minutes=gte.60&time_required_minutes=lte.120`;
                        break;
                    case '120+':
                        query += `&time_required_minutes=gte.120`;
                        break;
                }
            }
            if (filters.rating) {
                const minRating = filters.rating.replace('+', '');
                query += `&rating=gte.${minRating}`;
            }

            // Add pagination
            const offset = (page - 1) * pageSize;
            query += `&limit=${pageSize}&offset=${offset}`;

            // Get total count for pagination
            const countQuery = query.replace('select=*', 'select=count');
            const countResponse = await this.supabase.request(countQuery.replace('&limit=' + pageSize + '&offset=' + offset, ''));
            const total = countResponse[0]?.count || 0;

            // Get actual data
            const response = await this.supabase.request(query);
            const games = response.map(game => this.mapProductToGame(game));

            const totalPages = Math.ceil(total / pageSize);

            return {
                games,
                total,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            };
        } catch (error) {
            console.error('Error fetching games:', error);
            // Fallback to mock data if Supabase fails
            return this.getMockGames(filters, page, pageSize);
        }
    }

    // Map product_list data to Game model
    mapProductToGame(product) {
        return new Game({
            id: product.id.toString(),
            name: product.name,
            description: product.short_description,
            category: product.category,
            image: product.image_url || '/placeholder.svg?height=300&width=400',
            minPlayers: product.min_players,
            maxPlayers: product.max_players,
            playtime: product.time_required_minutes,
            rating: parseFloat(product.rating) || 0,
            reviewCount: 0, // We'll add this later if needed
            components: [], // We'll add this later if needed
            featured: false, // We'll add this later if needed
            createdAt: new Date(product.created_at),
            price: parseFloat(product.price) || 0
        });
    }

    // Fallback to mock data if Supabase fails
    getMockGames(filters = {}, page = 1, pageSize = 12) {
        const mockGames = [
            {
                id: "1",
                name: "Wingspan",
                description: "A competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games.",
                category: "Strategy",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 1,
                maxPlayers: 5,
                playtime: 70,
                rating: 4.8,
                reviewCount: 1250,
                components: ["170 Bird Cards", "26 Bonus Cards", "16 Automa Cards", "103 Food Tokens", "75 Egg Miniatures"],
                tutorialUrl: "https://youtube.com/watch?v=wingspan",
                featured: true,
                createdAt: new Date("2023-01-01"),
            },
            {
                id: "2",
                name: "Azul",
                description: "A tile-placement game where players compete to create the most beautiful wall.",
                category: "Family",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 2,
                maxPlayers: 4,
                playtime: 45,
                rating: 4.6,
                reviewCount: 890,
                components: ["100 Resin Tiles", "4 Player Boards", "9 Factory Displays", "4 Scoring Markers"],
                featured: true,
                createdAt: new Date("2023-01-02"),
            },
            {
                id: "3",
                name: "Pandemic",
                description: "A cooperative board game where players work together to treat infections around the world.",
                category: "Cooperative",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 2,
                maxPlayers: 4,
                playtime: 60,
                rating: 4.7,
                reviewCount: 2100,
                components: ["1 Board", "7 Role Cards", "59 Player Cards", "48 Infection Cards", "96 Disease Cubes"],
                featured: true,
                createdAt: new Date("2023-01-03"),
            },
            {
                id: "4",
                name: "Ticket to Ride",
                description: "A railway-themed German-style board game designed by Alan R. Moon.",
                category: "Family",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 2,
                maxPlayers: 5,
                playtime: 60,
                rating: 4.5,
                reviewCount: 1800,
                components: ["1 Board Map", "240 Colored Train Cars", "110 Train Car Cards", "30 Destination Tickets"],
                featured: false,
                createdAt: new Date("2023-01-04"),
            },
            {
                id: "5",
                name: "Splendor",
                description: "A fast-paced and addictive game of chip-collecting and card development.",
                category: "Strategy",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 2,
                maxPlayers: 4,
                playtime: 30,
                rating: 4.4,
                reviewCount: 950,
                components: ["40 Gem Tokens", "90 Development Cards", "10 Noble Tiles"],
                featured: false,
                createdAt: new Date("2023-01-05"),
            },
            {
                id: "6",
                name: "Catan",
                description: "A multiplayer board game designed by Klaus Teuber, first published in 1995.",
                category: "Strategy",
                image: "/placeholder.svg?height=300&width=400",
                minPlayers: 3,
                maxPlayers: 4,
                playtime: 75,
                rating: 4.3,
                reviewCount: 3200,
                components: ["19 Terrain Hexes", "6 Sea Frame Pieces", "9 Harbor Pieces", "18 Number Tokens"],
                featured: false,
                createdAt: new Date("2023-01-06"),
            },
        ];

        let filteredGames = [...mockGames];

        // Apply search filter
        if (filters.search) {
            filteredGames = filteredGames.filter(
                game => game.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                        game.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.category) {
            filteredGames = filteredGames.filter(game => game.category === filters.category);
        }

        // Apply players filter
        if (filters.players) {
            switch (filters.players) {
                case '1':
                    filteredGames = filteredGames.filter(game => game.minPlayers === 1 && game.maxPlayers === 1);
                    break;
                case '2':
                    filteredGames = filteredGames.filter(game => game.minPlayers === 2 && game.maxPlayers === 2);
                    break;
                case '3-4':
                    filteredGames = filteredGames.filter(game => game.minPlayers >= 3 && game.maxPlayers <= 4);
                    break;
                case '5+':
                    filteredGames = filteredGames.filter(game => game.minPlayers >= 5);
                    break;
            }
        }

        // Apply playtime filter
        if (filters.playtime) {
            switch (filters.playtime) {
                case '0-30':
                    filteredGames = filteredGames.filter(game => game.playtime <= 30);
                    break;
                case '30-60':
                    filteredGames = filteredGames.filter(game => game.playtime >= 30 && game.playtime <= 60);
                    break;
                case '60-120':
                    filteredGames = filteredGames.filter(game => game.playtime >= 60 && game.playtime <= 120);
                    break;
                case '120+':
                    filteredGames = filteredGames.filter(game => game.playtime >= 120);
                    break;
            }
        }

        // Apply rating filter
        if (filters.rating) {
            const minRating = parseFloat(filters.rating.replace('+', ''));
            filteredGames = filteredGames.filter(game => game.rating >= minRating);
        }

        // Pagination
        const total = filteredGames.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize);

        return {
            games: paginatedGames.map(game => Game.fromApi(game)),
            total,
            currentPage: page,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    }

    // Get featured games
    async getFeaturedGames() {
        try {
            const response = await this.supabase.request('product_list?select=*&limit=6');
            return response.map(game => this.mapProductToGame(game));
        } catch (error) {
            console.error('Error fetching featured games:', error);
            // Fallback to mock data
            const mockGames = [
                {
                    id: "1",
                    name: "Wingspan",
                    description: "A competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games.",
                    category: "Strategy",
                    image: "/placeholder.svg?height=300&width=400",
                    minPlayers: 1,
                    maxPlayers: 5,
                    playtime: 70,
                    rating: 4.8,
                    reviewCount: 1250,
                    components: ["170 Bird Cards", "26 Bonus Cards", "16 Automa Cards", "103 Food Tokens", "75 Egg Miniatures"],
                    tutorialUrl: "https://youtube.com/watch?v=wingspan",
                    featured: true,
                    createdAt: new Date("2023-01-01"),
                },
                {
                    id: "2",
                    name: "Azul",
                    description: "A tile-placement game where players compete to create the most beautiful wall.",
                    category: "Family",
                    image: "/placeholder.svg?height=300&width=400",
                    minPlayers: 2,
                    maxPlayers: 4,
                    playtime: 45,
                    rating: 4.6,
                    reviewCount: 890,
                    components: ["100 Resin Tiles", "4 Player Boards", "9 Factory Displays", "4 Scoring Markers"],
                    featured: true,
                    createdAt: new Date("2023-01-02"),
                },
                {
                    id: "3",
                    name: "Pandemic",
                    description: "A cooperative board game where players work together to treat infections around the world.",
                    category: "Cooperative",
                    image: "/placeholder.svg?height=300&width=400",
                    minPlayers: 2,
                    maxPlayers: 4,
                    playtime: 60,
                    rating: 4.7,
                    reviewCount: 2100,
                    components: ["1 Board", "7 Role Cards", "59 Player Cards", "48 Infection Cards", "96 Disease Cubes"],
                    featured: true,
                    createdAt: new Date("2023-01-03"),
                }
            ];
            return mockGames.map(game => Game.fromApi(game));
        }
    }

    // Get game by ID
    async getGameById(id) {
        try {
            const response = await this.supabase.request(`product_list?select=*&id=eq.${id}`);
            if (response && response.length > 0) {
                return this.mapProductToGame(response[0]);
            }
            return null;
        } catch (error) {
            console.error('Error fetching game by ID:', error);
            return null;
        }
    }

    // Get game reviews (placeholder for now)
    async getGameReviews(gameId) {
        // This would be implemented when we add a reviews table
        return [];
    }

    // Get similar games
    async getSimilarGames(currentGame) {
        try {
            const response = await this.supabase.request(`product_list?select=*&category=eq.${currentGame.category}&limit=4`);
            return response.map(game => this.mapProductToGame(game));
        } catch (error) {
            console.error('Error fetching similar games:', error);
            return [];
        }
    }

    // Get categories
    async getCategories() {
        try {
            const response = await this.supabase.request('product_list?select=category');
            const categories = [...new Set(response.map(item => item.category))];
            return categories.map(category => ({
                name: category,
                icon: this.getCategoryIcon(category)
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [
                { name: 'Strategy', icon: 'fas fa-chess' },
                { name: 'Family', icon: 'fas fa-home' },
                { name: 'Party', icon: 'fas fa-glass-cheers' },
                { name: 'Cooperative', icon: 'fas fa-hands-helping' },
                { name: 'Competitive', icon: 'fas fa-trophy' }
            ];
        }
    }

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'Strategy': 'fas fa-chess',
            'Family': 'fas fa-home',
            'Party': 'fas fa-glass-cheers',
            'Cooperative': 'fas fa-hands-helping',
            'Competitive': 'fas fa-trophy',
            'Card Game': 'fas fa-clone',
            'Board Game': 'fas fa-dice',
            'Dice Game': 'fas fa-dice-d20'
        };
        return icons[category] || 'fas fa-gamepad';
    }

    // Create new game (admin function)
    async createGame(gameData) {
        try {
            const productData = {
                category: gameData.category,
                name: gameData.name,
                short_description: gameData.description,
                time_required_minutes: gameData.playtime,
                min_players: gameData.minPlayers,
                max_players: gameData.maxPlayers,
                price: gameData.price || 0,
                rating: gameData.rating || 0,
                image_url: gameData.image || '/placeholder.jpg'
            };

            const response = await this.supabase.insert('product_list', productData);
            return this.mapProductToGame(response[0]);
        } catch (error) {
            console.error('Error creating game:', error);
            throw error;
        }
    }

    // Update game (admin function)
    async updateGame(id, gameData) {
        try {
            const productData = {
                category: gameData.category,
                name: gameData.name,
                short_description: gameData.description,
                time_required_minutes: gameData.playtime,
                min_players: gameData.minPlayers,
                max_players: gameData.maxPlayers,
                price: gameData.price || 0,
                rating: gameData.rating || 0,
                image_url: gameData.image || '/placeholder.jpg'
            };

            const response = await this.supabase.update('product_list', productData, { id: id });
            return this.mapProductToGame(response[0]);
        } catch (error) {
            console.error('Error updating game:', error);
            throw error;
        }
    }

    // Delete game (admin function)
    async deleteGame(id) {
        try {
            await this.supabase.delete('product_list', { id: id });
            return true;
        } catch (error) {
            console.error('Error deleting game:', error);
            throw error;
        }
    }

    // Add review (placeholder for future implementation)
    async addReview(gameId, reviewData) {
        // This would be implemented when we add a reviews table
        console.log('Adding review:', { gameId, reviewData });
        return { success: true };
    }
} 