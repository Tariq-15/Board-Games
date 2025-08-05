class Review {
    constructor(data = {}) {
        this.id = data.id || '';
        this.gameId = data.gameId || '';
        this.userId = data.userId || '';
        this.userName = data.userName || '';
        this.rating = data.rating || 0;
        this.comment = data.comment || '';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    }

    // Static method to create a Review instance from API data
    static fromApi(data) {
        return new Review(data);
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

    // Method to get formatted date
    getFormattedDate() {
        const now = new Date();
        const diffInMs = now - this.createdAt;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return `${diffInDays} days ago`;
        } else if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 365) {
            const months = Math.floor(diffInDays / 30);
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years = Math.floor(diffInDays / 365);
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }

    // Method to get truncated comment
    getTruncatedComment(maxLength = 150) {
        if (this.comment.length <= maxLength) {
            return this.comment;
        }
        return this.comment.substring(0, maxLength) + '...';
    }

    // Method to validate review data
    validate() {
        const errors = [];
        
        if (!this.gameId) {
            errors.push('Game ID is required');
        }
        
        if (!this.userId) {
            errors.push('User ID is required');
        }
        
        if (!this.userName.trim()) {
            errors.push('User name is required');
        }
        
        if (this.rating < 1 || this.rating > 5) {
            errors.push('Rating must be between 1 and 5');
        }
        
        if (!this.comment.trim()) {
            errors.push('Comment is required');
        } else if (this.comment.length < 10) {
            errors.push('Comment must be at least 10 characters long');
        }
        
        return errors;
    }

    // Method to convert to plain object for API
    toJSON() {
        return {
            id: this.id,
            gameId: this.gameId,
            userId: this.userId,
            userName: this.userName,
            rating: this.rating,
            comment: this.comment,
            createdAt: this.createdAt.toISOString()
        };
    }
} 