class AuthView {
    constructor() {
        this.currentUser = null;
    }

    // Update authentication UI
    updateAuthUI(user) {
        this.currentUser = user;
        
        const authButtons = document.querySelector('.auth-buttons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const adminLink = document.querySelector('.admin-link');
        
        if (user) {
            // User is logged in
            if (authButtons) authButtons.classList.add('hidden');
            if (userMenu) {
                userMenu.classList.remove('hidden');
                if (userName) userName.textContent = user.getDisplayName();
            }
            
            // Show admin link if user is admin
            if (adminLink) {
                if (user.isAdmin()) {
                    adminLink.classList.remove('hidden');
                } else {
                    adminLink.classList.add('hidden');
                }
            }
        } else {
            // User is not logged in
            if (authButtons) authButtons.classList.remove('hidden');
            if (userMenu) userMenu.classList.add('hidden');
            if (adminLink) adminLink.classList.add('hidden');
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

    // Show form validation errors
    showFormErrors(errors, formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Clear previous error messages
        const existingErrors = form.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());

        // Add new error messages
        errors.forEach(error => {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger';
            errorDiv.style.cssText = `
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            errorDiv.textContent = error;
            form.appendChild(errorDiv);
        });
    }

    // Show field validation error
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add error styling to field
        field.classList.add('border-danger');

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-danger';
        errorDiv.style.cssText = `
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        field.classList.remove('border-danger');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Show loading state for form
    showFormLoading(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
    }

    // Hide loading state for form
    hideFormLoading(formId) {
        const form = document.getElementById(formId);
        if (!form) return;

        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.dataset.originalText || 'Submit';
        }
    }

    // Show success message
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const bgColor = type === 'success' ? '#28a745' : 
                       type === 'error' ? '#dc3545' : '#17a2b8';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${bgColor};
            color: white;
            padding: 1rem;
            border-radius: 0.375rem;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Render user profile
    renderUserProfile(user) {
        const profileContainer = document.getElementById('userProfile');
        if (!profileContainer || !user) return;

        profileContainer.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <div class="avatar-circle">
                        ${user.getInitials()}
                    </div>
                </div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p class="text-muted">${user.email}</p>
                    <p class="text-muted">Member since ${user.createdAt.toLocaleDateString()}</p>
                    ${user.isAdmin() ? '<span class="badge badge-primary">Admin</span>' : ''}
                </div>
            </div>
        `;
    }

    // Render admin panel
    renderAdminPanel() {
        const adminContainer = document.getElementById('adminPanel');
        if (!adminContainer) return;

        adminContainer.innerHTML = `
            <div class="admin-panel">
                <h2>Admin Panel</h2>
                <div class="admin-stats">
                    <div class="stat-card">
                        <h3>Total Games</h3>
                        <p class="stat-number" id="totalGames">-</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Reviews</h3>
                        <p class="stat-number" id="totalReviews">-</p>
                    </div>
                    <div class="stat-card">
                        <h3>Total Users</h3>
                        <p class="stat-number" id="totalUsers">-</p>
                    </div>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-primary" onclick="showAddGameModal()">
                        <i class="fas fa-plus"></i> Add New Game
                    </button>
                    <button class="btn btn-outline" onclick="showUserManagement()">
                        <i class="fas fa-users"></i> Manage Users
                    </button>
                </div>
            </div>
        `;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin();
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 