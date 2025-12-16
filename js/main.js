// Main JavaScript file

class ChristopherStationaryApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupImageSlider();
        this.setupScrollAnimations();
        this.setupServiceTabs();
        this.setupForms();
        this.setupAnimations();
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.innerHTML = navMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });

            // Close menu when clicking a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }
    }

    setupImageSlider() {
        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.slider-dot');
        let currentSlide = 0;
        
        if (slides.length === 0) return;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }

        // Initialize first slide
        showSlide(0);

        // Auto slide
        let slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }, 5000);

        // Dot controls
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                
                // Restart auto slide
                slideInterval = setInterval(() => {
                    let nextSlide = (currentSlide + 1) % slides.length;
                    showSlide(nextSlide);
                }, 5000);
            });
        });

        // Pause on hover
        const slider = document.querySelector('.slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });

            slider.addEventListener('mouseleave', () => {
                slideInterval = setInterval(() => {
                    let nextSlide = (currentSlide + 1) % slides.length;
                    showSlide(nextSlide);
                }, 5000);
            });
        }
    }

    setupScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });
    }

    setupServiceTabs() {
        const serviceTabs = document.querySelectorAll('.service-tab');
        const serviceContents = document.querySelectorAll('.service-content-section');
        
        if (serviceTabs.length === 0) return;

        serviceTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                serviceTabs.forEach(t => t.classList.remove('active'));
                serviceContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetId = tab.dataset.target;
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    setupForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Show loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<span class="spinner"></span>';
                submitBtn.disabled = true;
                
                // Simulate form submission
                setTimeout(() => {
                    // Show success message
                    this.showNotification('Form submitted successfully!', 'success');
                    
                    // Reset form
                    form.reset();
                    
                    // Reset button
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        });
    }

    setupAnimations() {
        // Add hover effects
        document.querySelectorAll('.service-card, .news-card').forEach(card => {
            card.classList.add('hover-lift');
        });

        // Add pulse animation to call-to-action buttons
        document.querySelectorAll('.btn-primary').forEach(btn => {
            btn.classList.add('pulse');
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Add show class after a delay
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ChristopherStationaryApp();
    
    // Add page transition
    document.body.classList.add('page-transition');
    
    // Update active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (linkPage === `./${currentPage}`)) {
            link.classList.add('active');
        }
    });
});


// Navigation Toggle Functionality
class Navigation {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navOverlay = document.createElement('div');
        this.init();
    }

    init() {
        this.createOverlay();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupOutsideClick();
    }

    createOverlay() {
        this.navOverlay.className = 'nav-overlay';
        document.body.appendChild(this.navOverlay);
    }

    setupEventListeners() {
        // Toggle button click
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Overlay click
        this.navOverlay.addEventListener('click', () => {
            this.closeMenu();
        });

        // Close menu when clicking a link
        this.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991 && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }

    setupKeyboardNavigation() {
        // Trap focus within mobile menu when open
        document.addEventListener('keydown', (e) => {
            if (!this.isMenuOpen()) return;

            const focusableElements = this.navMenu.querySelectorAll(
                'a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen() && 
                !this.navMenu.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navMenu.classList.add('active');
        this.navOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        this.navToggle.innerHTML = '<i class="fas fa-times"></i>';
        this.navToggle.setAttribute('aria-expanded', 'true');
        
        // Focus on first menu item for accessibility
        setTimeout(() => {
            const firstLink = this.navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }, 100);
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        this.navToggle.setAttribute('aria-expanded', 'false');
        this.navToggle.focus();
    }

    isMenuOpen() {
        return this.navMenu.classList.contains('active');
    }

    // Update active link based on current page
    updateActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = this.navMenu.querySelectorAll('a');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href');
            
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (linkPage === `./${currentPage}`)) {
                link.classList.add('active');
            }
        });
    }
}

// Initialize navigation when DOM is loaded
let navigation;

document.addEventListener('DOMContentLoaded', () => {
    navigation = new Navigation();
    navigation.updateActiveLink();
    
    // Update active link on language change
    document.addEventListener('languageChanged', () => {
        navigation.updateActiveLink();
    });
});