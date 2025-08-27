// Function to load HTML components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Initialize mobile menu after header is loaded
        if (elementId === 'header') {
            initializeMobileMenu();
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Update button icon
            const svg = mobileMenuBtn.querySelector('svg');
            if (mobileMenu.classList.contains('hidden')) {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const svg = mobileMenuBtn.querySelector('svg');
                svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        });
    }
}

// Load header and footer
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', 'components/header.html');
    loadComponent('footer', 'components/footer.html');

    // Set active navigation link
    const setActiveNavLink = () => {
        // Get the current path and remove any trailing slashes
        const currentPath = window.location.pathname.replace(/\/$/, '');
        // Get the last part of the path (the page name)
        const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
        
        // Update both desktop and mobile navigation
        const allNavLinks = document.querySelectorAll('a[href]');
        
        allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === currentPage + '.html' || (currentPage === 'index' && href === 'index.html'))) {
                link.classList.add('text-primary');
                link.classList.remove('text-dark');
            }
        });
    };

    // Call setActiveNavLink after header is loaded
    const headerContainer = document.getElementById('header');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                setActiveNavLink();
            }
        });
    });

    observer.observe(headerContainer, { childList: true });
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Counter animation function
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Initialize counters when they come into view
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter); // Only animate once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Initialize counters after page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure DOM is fully loaded
    setTimeout(initCounters, 500);
}); 