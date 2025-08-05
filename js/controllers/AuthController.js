class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.authView = new AuthView();
        this.init();
    }

    // Initialize the controller
    init() {
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form submission
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Modal close buttons
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Logout functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('[onclick*="logout"]') || 
                (e.target.textContent === 'Logout' && e.target.closest('.dropdown-menu'))) {
                e.preventDefault();
                this.handleLogout();
            }
        });
    }

    // Handle login
    async handleLogin() {
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        if (!emailInput || !passwordInput) {
            this.showError('Login form not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!email) {
            this.showError('Email is required');
            return;
        }

        if (!password) {
            this.showError('Password is required');
            return;
        }

        if (!this.authService.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        try {
            const result = await this.authService.login(email, password);
            
            if (result.success) {
                this.showSuccess('Login successful!');
                this.closeModal('loginModal');
                this.clearForm('loginForm');
                
                // Redirect to home page or previous page
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } catch (error) {
            this.showError(error.message || 'Login failed. Please try again.');
        }
    }

    // Handle register
    async handleRegister() {
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');

        if (!nameInput || !emailInput || !passwordInput) {
            this.showError('Register form not found');
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validate inputs
        if (!name) {
            this.showError('Name is required');
            return;
        }

        if (!email) {
            this.showError('Email is required');
            return;
        }

        if (!password) {
            this.showError('Password is required');
            return;
        }

        if (!this.authService.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return;
        }

        if (!this.authService.validatePassword(password)) {
            this.showError('Password must be at least 6 characters long');
            return;
        }

        try {
            const result = await this.authService.register(name, email, password);
            
            if (result.success) {
                this.showSuccess('Registration successful! Welcome to BoardGameHub!');
                this.closeModal('registerModal');
                this.clearForm('registerForm');
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            }
        } catch (error) {
            this.showError(error.message || 'Registration failed. Please try again.');
        }
    }

    // Handle logout
    handleLogout() {
        try {
            this.authService.logout();
            this.showSuccess('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            this.showError('Logout failed');
        }
    }

    // Show login modal
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            const emailInput = document.getElementById('loginEmail');
            if (emailInput) {
                emailInput.focus();
            }
        }
    }

    // Show register modal
    showRegisterModal() {
        const modal = document.getElementById('registerModal');
        if (modal) {
            modal.classList.remove('hidden');
            const nameInput = document.getElementById('registerName');
            if (nameInput) {
                nameInput.focus();
            }
        }
    }

    // Close modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Clear form
    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
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
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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

    // Check if user is authenticated
    isAuthenticated() {
        return this.authService.checkAuth();
    }

    // Check if user is admin
    isAdmin() {
        return this.authService.isAdmin();
    }

    // Get current user
    getCurrentUser() {
        return this.authService.getCurrentUser();
    }
} 