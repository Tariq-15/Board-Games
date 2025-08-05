class GamesController {
    constructor() {
        console.log('GamesController constructor called');
        this.gameService = new GameService();
        this.gameView = new GameView();
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.currentFilters = {
            search: '',
            category: '',
            players: '',
            playtime: '',
            rating: ''
        };
        // Don't call init() here - it will be called from app.js
    }

    async init() {
        console.log('GamesController init started');
        
        // Check if DOM elements exist
        const gamesGrid = document.getElementById('gamesGrid');
        console.log('Games grid element:', gamesGrid);
        
        await this.loadCategories();
        await this.loadGames();
        this.setupEventListeners();
        
        console.log('GamesController init completed');
    }

    async loadCategories() {
        try {
            const categories = await this.gameService.getCategories();
            const categoryFilter = document.getElementById('categoryFilter');
            
            if (categoryFilter) {
                // Clear existing options except the first one
                categoryFilter.innerHTML = '<option value="">All Categories</option>';
                
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.name;
                    option.textContent = category.name;
                    categoryFilter.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    async loadGames() {
        console.log('Loading games...');
        this.showLoading();
        
        try {
            const filters = this.getFilters();
            console.log('Filters:', filters);
            const result = await this.gameService.getGames(filters, this.currentPage, this.itemsPerPage);
            console.log('Games result:', result);
            console.log('Number of games loaded:', result.games.length);
            
            this.updateResultsCount(result.total);
            await this.renderGames(result.games);
            this.renderPagination(result.total, result.currentPage, result.totalPages);
            this.hideLoading();
            
            if (result.games.length === 0) {
                this.showEmptyState();
                console.log('No games found - showing empty state');
            } else {
                this.hideEmptyState();
                console.log('Games loaded successfully');
            }
        } catch (error) {
            console.error('Error loading games:', error);
            this.showError('Failed to load games. Please try again.');
            this.hideLoading();
        }
    }

    getFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const playersFilter = document.getElementById('playersFilter');
        const playtimeFilter = document.getElementById('playtimeFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        return {
            search: searchInput ? searchInput.value.trim() : '',
            category: categoryFilter ? categoryFilter.value : '',
            players: playersFilter ? playersFilter.value : '',
            playtime: playtimeFilter ? playtimeFilter.value : '',
            rating: ratingFilter ? ratingFilter.value : ''
        };
    }

    async renderGames(games) {
        console.log('Rendering games:', games);
        const gamesGrid = document.getElementById('gamesGrid');
        if (!gamesGrid) {
            console.error('Games grid element not found!');
            return;
        }

        if (games.length === 0) {
            gamesGrid.innerHTML = await this.gameView.templateEngine.renderTemplate('empty-state', {
                message: 'No games found matching your criteria.'
            });
            console.log('No games to render');
            return;
        }

        const gamesHTML = await Promise.all(games.map(game => this.gameView.createGameCardHTML(game)));
        console.log('Games HTML:', gamesHTML);
        gamesGrid.innerHTML = gamesHTML.join('');

        // Add click event listeners to game cards
        gamesGrid.querySelectorAll('.game-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const gameId = games[index].id;
                window.location.href = `game-detail.html?id=${gameId}`;
            });
        });
    }

    renderPagination(total, currentPage, totalPages) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        paginationHTML += `
            <button onclick="gamesController.goToPage(${currentPage - 1})" 
                    ${currentPage <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button onclick="gamesController.goToPage(1)">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span>...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="gamesController.goToPage(${i})" 
                        class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span>...</span>`;
            }
            paginationHTML += `<button onclick="gamesController.goToPage(${totalPages})">${totalPages}</button>`;
        }

        // Next button
        paginationHTML += `
            <button onclick="gamesController.goToPage(${currentPage + 1})" 
                    ${currentPage >= totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.loadGames();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    applyFilters() {
        this.currentPage = 1;
        this.currentFilters = this.getFilters();
        this.loadGames();
    }

    clearFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const playersFilter = document.getElementById('playersFilter');
        const playtimeFilter = document.getElementById('playtimeFilter');
        const ratingFilter = document.getElementById('ratingFilter');

        if (searchInput) searchInput.value = '';
        if (categoryFilter) categoryFilter.value = '';
        if (playersFilter) playersFilter.value = '';
        if (playtimeFilter) playtimeFilter.value = '';
        if (ratingFilter) ratingFilter.value = '';

        this.currentPage = 1;
        this.currentFilters = {
            search: '',
            category: '',
            players: '',
            playtime: '',
            rating: ''
        };
        this.loadGames();
    }

    updateResultsCount(total) {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = total;
        }
    }

    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const gamesGrid = document.getElementById('gamesGrid');
        
        if (loadingState) loadingState.classList.remove('hidden');
        if (gamesGrid) gamesGrid.style.display = 'none';
    }

    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        const gamesGrid = document.getElementById('gamesGrid');
        
        if (loadingState) loadingState.classList.add('hidden');
        if (gamesGrid) gamesGrid.style.display = 'grid';
    }

    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const gamesGrid = document.getElementById('gamesGrid');
        
        if (emptyState) emptyState.classList.remove('hidden');
        if (gamesGrid) gamesGrid.style.display = 'none';
    }

    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.classList.add('hidden');
        }
    }

    showError(message) {
        // You can implement a toast notification system here
        console.error(message);
        alert(message);
    }

    setupEventListeners() {
        // Search input with debounce
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.applyFilters();
                }, 500);
            });
        }

        // Filter changes
        const filterSelects = ['categoryFilter', 'playersFilter', 'playtimeFilter', 'ratingFilter'];
        filterSelects.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        // Apply filters button
        const applyFiltersBtn = document.querySelector('button[onclick="applyFilters()"]');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyFilters();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.querySelector('button[onclick="clearFilters()"]');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.clearFilters();
            });
        }
    }
}

// Global functions for HTML onclick attributes
function applyFilters() {
    if (window.gamesController) {
        window.gamesController.applyFilters();
    }
}

function clearFilters() {
    if (window.gamesController) {
        window.gamesController.clearFilters();
    }
} 