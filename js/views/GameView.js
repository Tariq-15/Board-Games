class GameView {
    constructor() {
        this.featuredGamesContainer = document.getElementById('featuredGames');
        this.categoriesContainer = document.getElementById('categoriesGrid');
        this.reviewsContainer = document.getElementById('reviewsGrid');
        this.templateEngine = new TemplateEngine();
    }

    // Render featured games
    async renderFeaturedGames(games) {
        if (!this.featuredGamesContainer) return;

        if (games.length === 0) {
            this.featuredGamesContainer.innerHTML = await this.templateEngine.renderTemplate('empty-state', {
                message: 'No featured games available at the moment.'
            });
            return;
        }

        const gamesHTML = await Promise.all(games.map(game => this.createGameCard(game)));
        this.featuredGamesContainer.innerHTML = gamesHTML.join('');
    }

    // Render categories
    async renderCategories(categories) {
        if (!this.categoriesContainer) return;

        if (categories.length === 0) {
            this.categoriesContainer.innerHTML = await this.templateEngine.renderTemplate('empty-state', {
                message: 'No categories available.'
            });
            return;
        }

        const categoriesHTML = await Promise.all(categories.map(category => this.createCategoryCard(category)));
        this.categoriesContainer.innerHTML = categoriesHTML.join('');
    }

    // Render recent reviews
    async renderRecentReviews(reviews) {
        if (!this.reviewsContainer) return;

        if (reviews.length === 0) {
            this.reviewsContainer.innerHTML = await this.templateEngine.renderTemplate('empty-state', {
                message: 'No reviews available at the moment.'
            });
            return;
        }

        const reviewsHTML = await Promise.all(reviews.map(review => this.createReviewCard(review)));
        this.reviewsContainer.innerHTML = reviewsHTML.join('');
    }

    // Create game card HTML using template
    async createGameCard(game) {
        const data = {
            game: {
                id: game.id,
                image: game.image,
                name: game.name,
                category: game.category,
                description: game.description,
                playerRange: game.getPlayerRange(),
                formattedPlaytime: game.getFormattedPlaytime(),
                starRating: game.getStarRating(),
                rating: game.rating
            }
        };
        return await this.templateEngine.renderTemplate('game-card', data);
    }

    // Create game card HTML for games page (same as createGameCard but with a different name for clarity)
    createGameCardHTML(game) {
        return this.createGameCard(game);
    }

    // Create category card HTML using template
    async createCategoryCard(category) {
        const data = {
            category: {
                name: category.name,
                icon: category.icon,
                count: category.count
            }
        };
        return await this.templateEngine.renderTemplate('category-card', data);
    }

    // Create review card HTML using template
    async createReviewCard(review) {
        const data = {
            review: {
                userInitial: review.userName.charAt(0).toUpperCase(),
                userName: review.userName,
                formattedDate: review.getFormattedDate(),
                starRating: review.getStarRating(),
                truncatedComment: review.getTruncatedComment(),
                gameId: review.gameId,
                gameName: review.gameName
            }
        };
        return await this.templateEngine.renderTemplate('review-card', data);
    }

    // Render games grid (for games page)
    async renderGamesGrid(games, containerId = 'gamesGrid') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (games.length === 0) {
            container.innerHTML = await this.templateEngine.renderTemplate('empty-state', {
                message: 'No games found matching your criteria.'
            });
            return;
        }

        const gamesHTML = await Promise.all(games.map(game => this.createGameCard(game)));
        container.innerHTML = gamesHTML.join('');
    }

    // Render pagination
    renderPagination(currentPage, totalPages, containerId = 'pagination') {
        const container = document.getElementById(containerId);
        if (!container || totalPages <= 1) {
            if (container) container.innerHTML = '';
            return;
        }

        let paginationHTML = '<div class="pagination">';
        
        // Previous button
        if (currentPage > 1) {
            paginationHTML += `<a href="?page=${currentPage - 1}" class="btn btn-outline">Previous</a>`;
        }

        // Page numbers
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHTML += `<span class="btn btn-primary">${i}</span>`;
            } else {
                paginationHTML += `<a href="?page=${i}" class="btn btn-outline">${i}</a>`;
            }
        }

        // Next button
        if (currentPage < totalPages) {
            paginationHTML += `<a href="?page=${currentPage + 1}" class="btn btn-outline">Next</a>`;
        }

        paginationHTML += '</div>';
        container.innerHTML = paginationHTML;
    }

    // Render game filters
    renderFilters(filters, containerId = 'gameFilters') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const filtersHTML = `
            <div class="filters">
                <div class="filter-group">
                    <label for="categoryFilter">Category:</label>
                    <select id="categoryFilter" class="filter-select">
                        <option value="">All Categories</option>
                        ${filters.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
                <div class="filter-group">
                    <label for="playersFilter">Players:</label>
                    <select id="playersFilter" class="filter-select">
                        <option value="">Any Players</option>
                        <option value="1">1 Player</option>
                        <option value="2">2 Players</option>
                        <option value="3">3 Players</option>
                        <option value="4">4 Players</option>
                        <option value="5+">5+ Players</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label for="playtimeFilter">Max Playtime:</label>
                    <select id="playtimeFilter" class="filter-select">
                        <option value="">Any Duration</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                        <option value="180">3+ hours</option>
                    </select>
                </div>
                <button class="btn btn-primary" onclick="applyFilters()">Apply Filters</button>
                <button class="btn btn-outline" onclick="clearFilters()">Clear Filters</button>
            </div>
        `;

        container.innerHTML = filtersHTML;
    }

    // Show loading state
    async showLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = await this.templateEngine.renderTemplate('loading', {});
        }
    }

    // Show error state
    async showError(message, containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = await this.templateEngine.renderTemplate('error', {
                message: message
            });
        }
    }

    // Update search results count
    updateResultsCount(count, total) {
        const resultsElement = document.getElementById('resultsCount');
        if (resultsElement) {
            resultsElement.textContent = `Showing ${count} of ${total} games`;
        }
    }
} 