class Game {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.category = data.category || '';
        this.image = data.image || '';
        this.minPlayers = data.minPlayers || 1;
        this.maxPlayers = data.maxPlayers || 4;
        this.playtime = data.playtime || 60;
        this.rating = data.rating || 0;
        this.reviewCount = data.reviewCount || 0;
        this.components = data.components || [];
        this.tutorialUrl = data.tutorialUrl || '';
        this.featured = data.featured || false;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    // Static method to create a Game instance from API data
    static fromApi(data) {
        return new Game(data);
    }

    // Method to get formatted playtime
    getFormattedPlaytime() {
        if (this.playtime < 60) {
            return `${this.playtime} min`;
        } else {
            const hours = Math.floor(this.playtime / 60);
            const minutes = this.playtime % 60;
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }
    }

    // Method to get player count range
    getPlayerRange() {
        if (this.minPlayers === this.maxPlayers) {
            return `${this.minPlayers} player`;
        }
        return `${this.minPlayers}-${this.maxPlayers} players`;
    }

    // Method to get star rating HTML
    getStarRating() {
        const fullStars = Math.floor(this.rating);
        const hasHalfStar = this.rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    // Method to validate game data
    validate() {
        const errors = [];
        
        if (!this.name.trim()) {
            errors.push('Game name is required');
        }
        
        if (!this.description.trim()) {
            errors.push('Game description is required');
        }
        
        if (!this.category.trim()) {
            errors.push('Game category is required');
        }
        
        if (this.minPlayers < 1) {
            errors.push('Minimum players must be at least 1');
        }
        
        if (this.maxPlayers < this.minPlayers) {
            errors.push('Maximum players must be greater than or equal to minimum players');
        }
        
        if (this.playtime < 1) {
            errors.push('Playtime must be at least 1 minute');
        }
        
        if (this.rating < 0 || this.rating > 5) {
            errors.push('Rating must be between 0 and 5');
        }
        
        return errors;
    }

    // Method to convert to plain object for API
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            category: this.category,
            image: this.image,
            minPlayers: this.minPlayers,
            maxPlayers: this.maxPlayers,
            playtime: this.playtime,
            rating: this.rating,
            reviewCount: this.reviewCount,
            components: this.components,
            tutorialUrl: this.tutorialUrl,
            featured: this.featured,
            createdAt: this.createdAt.toISOString()
        };
    }
} 