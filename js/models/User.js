class User {
    constructor(data = {}) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.email = data.email || '';
        this.role = data.role || 'user';
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.lastLogin = data.lastLogin ? new Date(data.lastLogin) : null;
    }

    // Static method to create a User instance from API data
    static fromApi(data) {
        return new User(data);
    }

    // Method to check if user is admin
    isAdmin() {
        return this.role === 'admin';
    }

    // Method to check if user is authenticated
    isAuthenticated() {
        return !!this.id;
    }

    // Method to get display name
    getDisplayName() {
        return this.name || this.email.split('@')[0];
    }

    // Method to get initials for avatar
    getInitials() {
        if (!this.name) {
            return this.email.charAt(0).toUpperCase();
        }
        
        const names = this.name.split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }

    // Method to validate user data
    validate() {
        const errors = [];
        
        if (!this.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!this.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(this.email)) {
            errors.push('Email is not valid');
        }
        
        if (!['user', 'admin'].includes(this.role)) {
            errors.push('Invalid role');
        }
        
        return errors;
    }

    // Helper method to validate email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Method to convert to plain object for API
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt.toISOString(),
            lastLogin: this.lastLogin ? this.lastLogin.toISOString() : null
        };
    }

    // Method to update last login
    updateLastLogin() {
        this.lastLogin = new Date();
    }
} 