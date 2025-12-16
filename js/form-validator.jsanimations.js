class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupRealTimeValidation();
    }

    setupValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Clear error on focus
            input.addEventListener('focus', () => {
                this.clearError(input);
            });
            
            // Real-time validation for specific fields
            if (input.type === 'email' || input.type === 'tel') {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        // Clear previous errors
        this.clearError(field);
        
        // Check required fields
        if (field.required && !value) {
            this.showError(field, this.getErrorMessage('required'));
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, this.getErrorMessage('invalidEmail'));
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
            if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 9) {
                this.showError(field, this.getErrorMessage('invalidPhone'));
                return false;
            }
        }
        
        return true;
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    showError(field, message) {
        // Remove existing error
        this.clearError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '5px';
        
        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        
        // Scroll to error if needed
        if (!this.isElementInViewport(field)) {
            field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner" style="width: 20px; height: 20px;"></span>
            ${this.getText('common.loading')}
        `;
        
        try {
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification(this.getText('contact.success'), 'success');
            
            // Reset form
            this.form.reset();
            
            // Clear all errors
            this.form.querySelectorAll('.error').forEach(field => {
                this.clearError(field);
            });
            
        } catch (error) {
            // Show error message
            this.showNotification(this.getText('contact.error'), 'error');
            console.error('Form submission error:', error);
            
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    getErrorMessage(type) {
        // This should use the language switcher instance
        if (window.languageSwitcher) {
            return window.languageSwitcher.getText(`contact.${type}`);
        }
        
        // Fallback messages
        const messages = {
            required: 'This field is required',
            invalidEmail: 'Please enter a valid email address',
            invalidPhone: 'Please enter a valid phone number'
        };
        
        return messages[type] || 'Please check this field';
    }

    getText(key) {
        if (window.languageSwitcher) {
            return window.languageSwitcher.getText(key);
        }
        return key;
    }

    showNotification(message, type = 'info') {
        // Create or use existing notification system
        if (window.app && typeof window.app.showNotification === 'function') {
            window.app.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Initialize form validators
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormValidator('contactForm');
    }
    
    const serviceForm = document.getElementById('serviceInquiryForm');
    if (serviceForm) {
        new FormValidator('serviceInquiryForm');
    }
});