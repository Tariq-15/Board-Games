// Main application entry point
class App {
    constructor() {
        this.homeController = null;
        this.authController = null;
        this.gameService = null;
        this.authService = null;
        this.init();
    }

    // Initialize the application
    init() {
        try {
            // Initialize services
            this.gameService = new GameService();
            this.authService = new AuthService();

            // Initialize controllers
            this.homeController = new HomeController();
            this.authController = new AuthController();

            // Setup global functions for onclick handlers
            this.setupGlobalFunctions();

            // Initialize based on current page
            this.initializePage();

            console.log('BoardGameHub application initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }

    // Setup global functions for onclick handlers
    setupGlobalFunctions() {
        // Authentication functions
        window.showLoginModal = () => {
            if (this.authController) {
                this.authController.showLoginModal();
            }
        };

        window.showRegisterModal = () => {
            if (this.authController) {
                this.authController.showRegisterModal();
            }
        };

        window.closeModal = (modalId) => {
            if (this.authController) {
                this.authController.closeModal(modalId);
            }
        };

        window.logout = () => {
            if (this.authController) {
                this.authController.handleLogout();
            }
        };

        // Mobile menu toggle
        window.toggleMobileMenu = () => {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('show');
            }
        };

        // Filter functions
        window.applyFilters = () => {
            this.applyGameFilters();
        };

        window.clearFilters = () => {
            this.clearGameFilters();
        };

        // Admin functions
        window.showAddGameModal = () => {
            this.showAddGameModal();
        };

        window.showUserManagement = () => {
            this.showUserManagement();
        };
    }

    // Initialize based on current page
    initializePage() {
        const path = window.location.pathname;
        
        if (path === '/' || path === '/index.html' || path.endsWith('/')) {
            // Home page - already initialized by HomeController
            console.log('Initialized home page');
        } else if (path.includes('/pages/games.html')) {
            this.initializeGamesPage();
        } else if (path.includes('/pages/game-detail.html')) {
            this.initializeGameDetailPage();
        } else if (path.includes('/pages/admin.html')) {
            this.initializeAdminPage();
        } else if (path.includes('/pages/profile.html')) {
            this.initializeProfilePage();
        }
    }

    // Initialize games page
    async initializeGamesPage() {
        try {
            console.log('Starting games page initialization...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            console.log('DOM is ready, initializing GamesController...');
            
            // Initialize the GamesController
            window.gamesController = new GamesController();
            console.log('GamesController created:', window.gamesController);
            
            await window.gamesController.init();
            
            console.log('Initialized games page');
        } catch (error) {
            console.error('Error initializing games page:', error);
        }
    }

    // Initialize game detail page
    async initializeGameDetailPage() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const gameId = urlParams.get('id');

            if (!gameId) {
                window.location.href = '/pages/games.html';
                return;
            }

            // Load game details
            const game = await this.gameService.getGameById(gameId);
            if (!game) {
                window.location.href = '/pages/games.html';
                return;
            }

            // Load game reviews
            const reviews = await this.gameService.getGameReviews(gameId);

            // Load similar games
            const similarGames = await this.gameService.getSimilarGames(game);

            // Render game detail
            this.renderGameDetail(game, reviews, similarGames);

            console.log('Initialized game detail page');
        } catch (error) {
            console.error('Error initializing game detail page:', error);
        }
    }

    // Initialize admin page
    async initializeAdminPage() {
        try {
            // Check if user is admin
            if (!this.authService.isAdmin()) {
                window.location.href = '/';
                return;
            }

            // Render admin panel
            const authView = new AuthView();
            authView.renderAdminPanel();

            // Load admin stats
            await this.loadAdminStats();

            console.log('Initialized admin page');
        } catch (error) {
            console.error('Error initializing admin page:', error);
        }
    }

    // Initialize profile page
    async initializeProfilePage() {
        try {
            // Check if user is authenticated
            if (!this.authService.checkAuth()) {
                window.location.href = '/';
                return;
            }

            // Render user profile
            const authView = new AuthView();
            const currentUser = this.authService.getCurrentUser();
            authView.renderUserProfile(currentUser);

            console.log('Initialized profile page');
        } catch (error) {
            console.error('Error initializing profile page:', error);
        }
    }

    // Apply game filters
    applyGameFilters() {
        const categoryFilter = document.getElementById('categoryFilter');
        const playersFilter = document.getElementById('playersFilter');
        const playtimeFilter = document.getElementById('playtimeFilter');

        const params = new URLSearchParams();
        
        if (categoryFilter && categoryFilter.value) {
            params.set('category', categoryFilter.value);
        }
        
        if (playersFilter && playersFilter.value) {
            params.set('players', playersFilter.value);
        }
        
        if (playtimeFilter && playtimeFilter.value) {
            params.set('playtime', playtimeFilter.value);
        }

        window.location.href = `/pages/games.html?${params.toString()}`;
    }

    // Clear game filters
    clearGameFilters() {
        window.location.href = '/pages/games.html';
    }

    // Set filter values from URL params
    setFilterValues(params) {
        const categoryFilter = document.getElementById('categoryFilter');
        const playersFilter = document.getElementById('playersFilter');
        const playtimeFilter = document.getElementById('playtimeFilter');

        if (categoryFilter && params.category) {
            categoryFilter.value = params.category;
        }
        
        if (playersFilter && params.players) {
            playersFilter.value = params.players;
        }
        
        if (playtimeFilter && params.playtime) {
            playtimeFilter.value = params.playtime;
        }
    }

    // Render game detail
    renderGameDetail(game, reviews, similarGames) {
        const container = document.querySelector('.game-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div class="game-detail">
                <div class="game-header">
                    <div class="game-image">
                        <img src="${game.image}" alt="${game.name}" 
                             onerror="this.src='https://via.placeholder.com/600x400/6c757d/ffffff?text=Game+Image'">
                    </div>
                    <div class="game-info">
                        <h1>${game.name}</h1>
                        <div class="game-meta">
                            <span class="game-category">${game.category}</span>
                            <span class="game-players">${game.getPlayerRange()}</span>
                            <span class="game-playtime">${game.getFormattedPlaytime()}</span>
                        </div>
                        <div class="game-rating">
                            ${game.getStarRating()}
                            <span class="rating-value">${game.rating}</span>
                            <span class="review-count">(${game.reviewCount} reviews)</span>
                        </div>
                        <p class="game-description">${game.description}</p>
                        <div class="game-actions">
                            <button class="btn btn-primary" onclick="addReview()">Write Review</button>
                            ${game.tutorialUrl ? `<a href="${game.tutorialUrl}" target="_blank" class="btn btn-outline">Watch Tutorial</a>` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="game-content">
                    <div class="game-reviews">
                        <h2>Reviews (${reviews.length})</h2>
                        ${reviews.length > 0 ? 
                            reviews.map(review => `
                                <div class="review-item">
                                    <div class="review-header">
                                        <span class="review-user">${review.userName}</span>
                                        <div class="review-rating">${review.getStarRating()}</div>
                                    </div>
                                    <p class="review-comment">${review.comment}</p>
                                    <span class="review-date">${review.getFormattedDate()}</span>
                                </div>
                            `).join('') : 
                            '<p class="text-muted">No reviews yet. Be the first to review this game!</p>'
                        }
                    </div>
                    
                    ${similarGames.length > 0 ? `
                        <div class="similar-games">
                            <h2>Similar Games</h2>
                            <div class="games-grid">
                                ${similarGames.map(game => `
                                    <div class="game-card" data-game-id="${game.id}">
                                        <img src="${game.image}" alt="${game.name}" class="game-card-image">
                                        <div class="game-card-content">
                                            <h3 class="game-card-title">${game.name}</h3>
                                            <p class="game-card-description">${game.description}</p>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // Load admin stats
    async loadAdminStats() {
        try {
            const { games } = await this.gameService.getGames();
            const totalReviews = games.reduce((sum, game) => sum + game.reviewCount, 0);
            
            // Update stats
            const totalGamesElement = document.getElementById('totalGames');
            const totalReviewsElement = document.getElementById('totalReviews');
            const totalUsersElement = document.getElementById('totalUsers');
            
            if (totalGamesElement) totalGamesElement.textContent = games.length;
            if (totalReviewsElement) totalReviewsElement.textContent = totalReviews;
            if (totalUsersElement) totalUsersElement.textContent = '25'; // Mock data
        } catch (error) {
            console.error('Error loading admin stats:', error);
        }
    }

    // Show add game modal
    showAddGameModal() {
        // Implementation for adding new games
        console.log('Show add game modal');
    }

    // Show user management
    showUserManagement() {
        // Implementation for user management
        console.log('Show user management');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Global function for adding reviews
window.addReview = () => {
    // Implementation for adding reviews
    console.log('Add review functionality');
}; 