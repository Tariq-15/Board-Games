class HomeController {
    constructor() {
        this.gameService = new GameService();
        this.authService = new AuthService();
        this.gameView = new GameView();
        this.init();
    }

    // Initialize the controller
    async init() {
        try {
            await this.loadFeaturedGames();
            await this.loadCategories();
            await this.loadRecentReviews();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing home controller:', error);
            this.showError('Failed to load page content');
        }
    }

    // Load featured games
    async loadFeaturedGames() {
        try {
            const games = await this.gameService.getFeaturedGames();
            await this.gameView.renderFeaturedGames(games);
        } catch (error) {
            console.error('Error loading featured games:', error);
            this.showError('Failed to load featured games');
        }
    }

    // Load game categories
    async loadCategories() {
        try {
            const categories = await this.gameService.getCategories();
            await this.gameView.renderCategories(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showError('Failed to load categories');
        }
    }

    // Load recent reviews
    async loadRecentReviews() {
        try {
            // Get all games and their reviews
            const { games } = await this.gameService.getGames();
            const allReviews = [];
            
            for (const game of games) {
                const reviews = await this.gameService.getGameReviews(game.id);
                reviews.forEach(review => {
                    allReviews.push({
                        ...review,
                        gameName: game.name,
                        gameId: game.id
                    });
                });
            }
            
            // Sort by date and take the most recent
            const recentReviews = allReviews
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);
            
            await this.gameView.renderRecentReviews(recentReviews);
        } catch (error) {
            console.error('Error loading recent reviews:', error);
            this.showError('Failed to load recent reviews');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Search functionality
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        });

        // Search buttons
        const searchButtons = document.querySelectorAll('.btn-primary');
        searchButtons.forEach(button => {
            if (button.textContent.includes('Search')) {
                button.addEventListener('click', () => {
                    const searchInput = button.closest('.hero-search')?.querySelector('.search-input') ||
                                      button.closest('.nav-right')?.querySelector('.search-input');
                    if (searchInput) {
                        this.handleSearch(searchInput.value);
                    }
                });
            }
        });

        // Category card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.category-card')) {
                const categoryCard = e.target.closest('.category-card');
                const categoryName = categoryCard.querySelector('.category-card-title').textContent;
                this.handleCategoryClick(categoryName);
            }
        });

        // Game card clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.game-card')) {
                const gameCard = e.target.closest('.game-card');
                const gameId = gameCard.dataset.gameId;
                if (gameId) {
                    this.handleGameClick(gameId);
                }
            }
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileMenu && mobileMenuBtn && 
                !mobileMenu.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('show');
            }
        });
    }

    // Handle search
    handleSearch(query) {
        if (query.trim()) {
            const searchParams = new URLSearchParams();
            searchParams.set('search', query.trim());
            window.location.href = `pages/games.html?${searchParams.toString()}`;
        }
    }

    // Handle category click
    handleCategoryClick(categoryName) {
        const searchParams = new URLSearchParams();
        searchParams.set('category', categoryName);
        window.location.href = `pages/games.html?${searchParams.toString()}`;
    }

    // Handle game click
    handleGameClick(gameId) {
        window.location.href = `pages/game-detail.html?id=${gameId}`;
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
        }
    }

    // Show error message
    showError(message) {
        // Create a simple error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc3545;
            color: white;
            padding: 1rem;
            border-radius: 0.375rem;
            z-index: 10000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    // Show success message
    showSuccess(message) {
        // Create a simple success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #28a745;
            color: white;
            padding: 1rem;
            border-radius: 0.375rem;
            z-index: 10000;
            max-width: 300px;
        `;
        successDiv.textContent = message;
        
        document.body.appendChild(successDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
} 