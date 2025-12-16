// Additional animations and effects

class Animations {
    constructor() {
        this.init();
    }

    init() {
        this.setupParallax();
        this.setupCounters();
        this.setupTimeline();
        this.setupOrgChart();
        this.setupGallery();
    }

    setupParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(counter) {
        const target = parseInt(counter.dataset.target);
        const duration = parseInt(counter.dataset.duration) || 2000;
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    setupTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => observer.observe(item));
    }

    setupOrgChart() {
        const orgNodes = document.querySelectorAll('.org-node');
        if (orgNodes.length === 0) return;

        orgNodes.forEach(node => {
            node.addEventListener('click', () => {
                orgNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');
                
                // Show node details
                const details = node.dataset.details;
                if (details) {
                    this.showOrgDetails(details);
                }
            });
        });
    }

    showOrgDetails(details) {
        // Create or update details panel
        let detailsPanel = document.querySelector('.org-details-panel');
        
        if (!detailsPanel) {
            detailsPanel = document.createElement('div');
            detailsPanel.className = 'org-details-panel';
            document.body.appendChild(detailsPanel);
        }
        
        detailsPanel.innerHTML = `
            <div class="org-details-content">
                <button class="close-details">
                    <i class="fas fa-times"></i>
                </button>
                <div class="details-content">${details}</div>
            </div>
        `;
        
        detailsPanel.classList.add('show');
        
        // Close button
        detailsPanel.querySelector('.close-details').addEventListener('click', () => {
            detailsPanel.classList.remove('show');
        });
        
        // Close on outside click
        detailsPanel.addEventListener('click', (e) => {
            if (e.target === detailsPanel) {
                detailsPanel.classList.remove('show');
            }
        });
    }

    setupGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length === 0) return;

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                this.openLightbox(item);
            });
            
            // Add zoom effect on hover
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1)';
            });
        });
    }

    openLightbox(item) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const imgSrc = item.dataset.full || item.src;
        const caption = item.dataset.caption || '';
        
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">
                    <i class="fas fa-times"></i>
                </button>
                <button class="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <img src="${imgSrc}" alt="${caption}">
                <div class="lightbox-caption">${caption}</div>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close lightbox
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.closest('.lightbox-close')) {
                lightbox.remove();
            }
        });
        
        // Navigation
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        const currentIndex = galleryItems.indexOf(item);
        
        lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
            e.stopPropagation();
            const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            this.updateLightbox(lightbox, galleryItems[prevIndex]);
        });
        
        lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
            e.stopPropagation();
            const nextIndex = (currentIndex + 1) % galleryItems.length;
            this.updateLightbox(lightbox, galleryItems[nextIndex]);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function handleKeydown(e) {
            if (e.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', handleKeydown);
            } else if (e.key === 'ArrowLeft') {
                const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                animations.updateLightbox(lightbox, galleryItems[prevIndex]);
            } else if (e.key === 'ArrowRight') {
                const nextIndex = (currentIndex + 1) % galleryItems.length;
                animations.updateLightbox(lightbox, galleryItems[nextIndex]);
            }
        });
    }

    updateLightbox(lightbox, item) {
        const imgSrc = item.dataset.full || item.src;
        const caption = item.dataset.caption || '';
        
        lightbox.querySelector('img').src = imgSrc;
        lightbox.querySelector('.lightbox-caption').textContent = caption;
    }
}

// Initialize animations
let animations;

document.addEventListener('DOMContentLoaded', () => {
    animations = new Animations();
});