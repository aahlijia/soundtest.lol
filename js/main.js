// main.js - Global scripts

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        navList.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile nav when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Spotify Embed Toggle
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trackId = this.dataset.trackId;
            const levelItem = this.closest('.level-item');
            const embed = levelItem.querySelector('.spotify-embed');
            const isOpen = embed.classList.contains('open');

            // Close all other open embeds
            document.querySelectorAll('.spotify-embed.open').forEach(el => {
                el.classList.remove('open');
                el.innerHTML = '';
                const otherBtn = el.closest('.level-item')?.querySelector('.play-btn');
                if (otherBtn) {
                    otherBtn.textContent = '\u25B6';
                    otherBtn.classList.remove('playing');
                }
            });

            if (!isOpen) {
                embed.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" height="80" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
                embed.classList.add('open');
                this.textContent = '\u25A0';
                this.classList.add('playing');
            }
        });
    });

    // Character Card Selection Effect
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            characterCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');

            // Play a subtle "select" effect
            this.style.animation = 'none';
            this.offsetHeight; // Trigger reflow
            this.style.animation = 'selectPulse 0.3s ease';
        });

        // Keyboard navigation
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Menu item hover sound effect placeholder
    const menuItems = document.querySelectorAll('.menu-item, .level-item, .powerup-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Could add audio feedback here
            this.style.animation = 'none';
            this.offsetHeight;
            this.style.animation = 'menuHover 0.2s ease';
        });
    });

    // Add "Press Start" title screen interaction (on home page)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                heroSubtitle.textContent = 'Loading...';
                heroSubtitle.style.animation = 'none';
                setTimeout(() => {
                    window.location.href = 'about.html';
                }, 500);
            }
        });
    }

    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});

// Add custom animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes selectPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1.02); }
    }

    @keyframes menuHover {
        0% { transform: translateX(0); }
        50% { transform: translateX(4px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);
