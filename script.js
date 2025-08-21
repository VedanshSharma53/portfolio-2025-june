// ===== MODERN PROFESSIONAL PORTFOLIO - JAVASCRIPT ===== //

class Portfolio {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.scrollThreshold = 50;
        
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.animateSkillBars();
        this.setupSmoothScrolling();
    }

    // ===== THEME MANAGEMENT ===== //
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle.querySelector('i');
        
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // ===== EVENT LISTENERS ===== //
    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Scroll handling with throttling for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Navigation link highlighting
        this.setupNavigationHighlighting();

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-links') && !e.target.closest('.mobile-toggle')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });

        // Close mobile menu when clicking on nav links
        const navLinkElements = document.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // ===== SCROLL HANDLING ===== //
    handleScroll() {
        const nav = document.getElementById('nav');
        const scrollY = window.scrollY;

        // Add/remove scrolled class for nav styling
        if (scrollY > this.scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    // ===== NAVIGATION HIGHLIGHTING ===== //
    setupNavigationHighlighting() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        const updateActiveLink = () => {
            let currentSection = '';
            const scrollY = window.scrollY;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        };

        // Throttle the scroll event for better performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===== SMOOTH SCROLLING ===== //
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.getElementById('nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const navLinks = document.querySelector('.nav-links');
                    const mobileToggle = document.getElementById('mobile-toggle');
                    navLinks.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        });
    }

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS ===== //
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Animate skill bars when skills section is visible
                    if (entry.target.classList.contains('skills')) {
                        setTimeout(() => this.animateSkillBars(), 300);
                    }
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const animatedElements = document.querySelectorAll('.timeline-item, .skill-category, .project-card, .skills');
        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== SKILL BAR ANIMATIONS ===== //
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            }, index * 150);
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS ===== //
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== UTILITY FUNCTIONS ===== //

// Preload critical images
function preloadImages() {
    const imageUrls = [
        // Add any critical image URLs here if needed
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Check if user prefers reduced motion
function respectsReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Add loading states for better UX
function addLoadingStates() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        if (button.href && button.href.includes('mailto:')) {
            button.addEventListener('click', (e) => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            });
        }
    });
}

// Copy email to clipboard functionality
function setupEmailCopy() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        const email = link.href.replace('mailto:', '');
        
        // Add copy functionality on right-click
        link.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('📧 Email copied to clipboard!');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = email;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showToast('📧 Email copied to clipboard!');
                });
            }
        });
    });
}

// Simple toast notification
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-lg);
        font-weight: 500;
        z-index: 10000;
        animation: slideInUp 0.3s ease;
        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.3);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Add CSS for toast animations
function addToastStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(100%);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideOutDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(100%);
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== CONTACT FORM ENHANCEMENTS ===== //
function enhanceContactSection() {
    // Add interactive feedback for contact methods
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(10px)';
                item.style.transition = 'transform 0.2s ease';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        }
    });
}

// ===== EASTER EGGS ===== //
function setupEasterEggs() {
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showToast('🎉 Konami Code activated! You found the secret! - Vedansh');
            document.body.style.animation = 'rainbow 2s ease-in-out';
            konamiCode = [];
            
            // Reset animation after completion
            setTimeout(() => {
                document.body.style.animation = '';
            }, 2000);
        }
    });
    
    // Add rainbow animation
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
}

// ===== PERFORMANCE MONITORING ===== //
function setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`🚀 Portfolio loaded in ${loadTime.toFixed(2)}ms`);
        
        // Show loading success toast for very fast load times
        if (loadTime < 1000) {
            setTimeout(() => {
                showToast('⚡ Super fast loading!');
            }, 1000);
        }
    });
}

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', () => {
    // Initialize portfolio
    const portfolio = new Portfolio();
    
    // Initialize additional features
    preloadImages();
    addLoadingStates();
    setupEmailCopy();
    addToastStyles();
    setupEasterEggs();
    enhanceContactSection();
    setupPerformanceMonitoring();
    
    // Add a subtle entrance animation
    if (!respectsReducedMotion()) {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';
        document.body.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);
    }

    // Welcome message in console
    console.log(`
    🎯 Welcome to Vedansh Sharma's Portfolio!
    
    ✨ Features:
    • Dark/Light theme toggle
    • Responsive design
    • Smooth animations
    • Mobile-friendly navigation
    • Easter eggs (try the Konami code!)
    
    📧 Contact: svedansh0302@gmail.com
    🔗 GitHub: github.com/vedanshsharma53
    
    Built with modern web technologies and lots of ❤️
    `);
});

// ===== SERVICE WORKER FOR PERFORMANCE ===== //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register service worker in production
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered successfully');
                })
                .catch(registrationError => {
                    console.log('❌ Service Worker registration failed:', registrationError);
                });
        }
    });
} 