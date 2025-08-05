class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    // Initialize the service
    init() {
        // Check for stored user data
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUser = User.fromApi(JSON.parse(storedUser));
                this.isAuthenticated = true;
                this.updateUI();
            } catch (error) {
                console.error('Error loading stored user:', error);
                this.logout();
            }
        }
    }

    // Login method
    async login(email, password) {
        try {
            this.showLoading();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock authentication - in real app, this would be an API call
            if (email === 'admin@example.com' && password === 'admin123') {
                const user = new User({
                    id: 'admin-1',
                    name: 'Admin User',
                    email: email,
                    role: 'admin',
                    createdAt: new Date(),
                    lastLogin: new Date()
                });
                
                this.setCurrentUser(user);
                return { success: true, user };
            } else if (email === 'user@example.com' && password === 'user123') {
                const user = new User({
                    id: 'user-1',
                    name: 'Regular User',
                    email: email,
                    role: 'user',
                    createdAt: new Date(),
                    lastLogin: new Date()
                });
                
                this.setCurrentUser(user);
                return { success: true, user };
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    // Register method
    async register(name, email, password) {
        try {
            this.showLoading();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock registration - in real app, this would be an API call
            if (email === 'existing@example.com') {
                throw new Error('Email already exists');
            }
            
            const user = new User({
                id: `user-${Date.now()}`,
                name: name,
                email: email,
                role: 'user',
                createdAt: new Date(),
                lastLogin: new Date()
            });
            
            this.setCurrentUser(user);
            return { success: true, user };
        } catch (error) {
            throw error;
        } finally {
            this.hideLoading();
        }
    }

    // Logout method
    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('currentUser');
        this.updateUI();
        
        // Redirect to home page
        window.location.href = '/';
    }

    // Set current user
    setCurrentUser(user) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(user.toJSON()));
        this.updateUI();
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    checkAuth() {
        return this.isAuthenticated;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin();
    }

    // Update UI based on authentication state
    updateUI() {
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const adminLink = document.querySelector('.admin-link');
        
        if (this.isAuthenticated && this.currentUser) {
            // Hide auth buttons, show user menu
            if (authButtons) authButtons.classList.add('hidden');
            if (userMenu) {
                userMenu.classList.remove('hidden');
                if (userName) userName.textContent = this.currentUser.getDisplayName();
            }
            
            // Show admin link if user is admin
            if (adminLink) {
                if (this.isAdmin()) {
                    adminLink.classList.remove('hidden');
                } else {
                    adminLink.classList.add('hidden');
                }
            }
        } else {
            // Show auth buttons, hide user menu
            if (authButtons) authButtons.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            if (adminLink) adminLink.classList.add('hidden');
        }
    }

    // Show loading spinner
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.remove('hidden');
    }

    // Hide loading spinner
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) spinner.classList.add('hidden');
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password) {
        return password.length >= 6;
    }
} 