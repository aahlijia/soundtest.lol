// main.js — MAXIMUM OVERDRIVE EDITION

/* ============================================================
   UTILITIES
   ============================================================ */

function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches ||
           window.matchMedia('(hover: none)').matches;
}

function triggerScreenFlash(color) {
    const flash = document.querySelector('.screen-flash');
    if (!flash) return;
    flash.style.background = color;
    flash.classList.remove('active');
    void flash.offsetWidth; // force reflow
    flash.classList.add('active');
}

function shakeScreen() {
    document.body.classList.remove('shaking');
    void document.body.offsetWidth;
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 450);
}

function createParticleBurst(x, y, count = 10) {
    const colors = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF6600', '#FFFFFF'];
    const chars  = ['★', '♦', '●', '■', '▲', '♪', '✦', '◆'];

    for (let i = 0; i < count; i++) {
        const angle  = (i / count) * Math.PI * 2 + Math.random() * 0.6;
        const speed  = 3 + Math.random() * 6;
        const color  = colors[Math.floor(Math.random() * colors.length)];
        const char   = chars[Math.floor(Math.random() * chars.length)];

        const p = document.createElement('div');
        p.textContent = char;
        Object.assign(p.style, {
            position:      'fixed',
            left:          x + 'px',
            top:           y + 'px',
            color,
            fontSize:      (8 + Math.random() * 10) + 'px',
            pointerEvents: 'none',
            zIndex:        '99999',
            textShadow:    `0 0 6px ${color}`,
            fontFamily:    'monospace',
            transform:     'translate(-50%, -50%)',
            userSelect:    'none',
            lineHeight:    '1',
        });
        document.body.appendChild(p);

        let posX = x, posY = y, opacity = 1;
        const vx = Math.cos(angle) * speed;
        let vy = Math.sin(angle) * speed - 2;

        (function animate() {
            posX    += vx;
            posY    += vy;
            vy      += 0.3; // gravity
            opacity -= 0.034;
            p.style.left    = posX + 'px';
            p.style.top     = posY + 'px';
            p.style.opacity = opacity;
            if (opacity > 0) requestAnimationFrame(animate);
            else p.remove();
        })();
    }
}

/* ============================================================
   INJECT GLOBAL OVERLAYS (vignette, grid, flash, canvas)
   ============================================================ */

function injectOverlays() {
    [
        ['div',    'screen-vignette'],
        ['div',    'pixel-grid-bg'],
        ['div',    'screen-flash'],
    ].forEach(([tag, cls]) => {
        const el = document.createElement(tag);
        el.className = cls;
        el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(el);
    });
}

/* ============================================================
   PAGE BOOT — CRT POWER-ON FLASH
   ============================================================ */

function initPageBoot() {
    document.body.classList.add('page-booting');
    const done = () => document.body.classList.remove('page-booting');
    document.body.addEventListener('animationend', done, { once: true });
    setTimeout(done, 1000); // fallback
}

/* ============================================================
   PIXEL CURSOR TRAIL
   ============================================================ */

function initCursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail';
    Object.assign(canvas.style, {
        position:      'fixed',
        top:           '0',
        left:          '0',
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        '9996',
    });
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF6600'];
    let particles = [];

    document.addEventListener('mousemove', (e) => {
        for (let i = 0; i < 3; i++) {
            particles.push({
                x:     e.clientX + (Math.random() - 0.5) * 10,
                y:     e.clientY + (Math.random() - 0.5) * 10,
                size:  Math.floor(Math.random() * 3) + 2,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                life:  1,
                vx:    (Math.random() - 0.5) * 1.5,
                vy:    (Math.random() - 0.5) * 1.5 - 0.5,
            });
        }
    });

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            ctx.globalAlpha = p.life * 0.9;
            ctx.fillStyle   = p.color;
            // snap to 2px grid for pixel-art feel
            ctx.fillRect(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2, p.size, p.size);
            p.x    += p.vx;
            p.y    += p.vy;
            p.life -= 0.06;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    })();
}

/* ============================================================
   CLICK PARTICLE BURST
   ============================================================ */

function initClickParticles() {
    document.addEventListener('click', (e) => {
        createParticleBurst(e.clientX, e.clientY, 8);
    });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {
    const targets = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip'
    );
    if (!targets.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => obs.observe(el));
}

/* ============================================================
   STAGGERED GRID ENTRANCE
   ============================================================ */

function initStaggeredEntrance() {
    const grids = document.querySelectorAll(
        '.menu-grid, .character-grid, .level-select-grid, .powerup-grid'
    );
    grids.forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.opacity    = '0';
            child.style.transform  = 'translateY(28px)';
            child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
            setTimeout(() => {
                child.style.opacity   = '';
                child.style.transform = '';
            }, 60 + i * 110);
        });
    });
}

/* ============================================================
   PAGE TITLE UNDERLINE BARS
   ============================================================ */

function initTitleUnderlines() {
    document.querySelectorAll('.page-title').forEach(title => {
        // page-title uses glitch ::before/::after — inject a sibling div instead
        const bar = document.createElement('div');
        bar.className = 'title-underline-bar';
        title.insertAdjacentElement('afterend', bar);
    });
}

/* ============================================================
   FLOATING XP POPUPS
   ============================================================ */

function initFloatingXP() {
    const XP_VALUES = ['+10 XP', '+25 XP', '+50 XP', '★ BONUS ★', '+100 XP', '1UP!'];
    const XP_COLORS = ['#FFFF00', '#00FFFF', '#FF00FF', '#00FF00', '#FF6600', '#FFFFFF'];

    document.querySelectorAll('.menu-item, .powerup-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const idx = Math.floor(Math.random() * XP_VALUES.length);
            const xp  = document.createElement('div');
            xp.className   = 'xp-popup';
            xp.textContent = XP_VALUES[idx];
            xp.style.color = XP_COLORS[idx % XP_COLORS.length];

            const rect = item.getBoundingClientRect();
            xp.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
            xp.style.top  = (rect.top  - 5) + 'px';
            document.body.appendChild(xp);
            setTimeout(() => xp.remove(), 1500);
        });
    });
}

/* ============================================================
   PERSPECTIVE TILT ON MOUSE MOVE
   ============================================================ */

function initPerspectiveTilt() {
    document.querySelectorAll('.character-card, .game-box, .menu-item').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const dx   = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
            const dy   = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
            el.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/* ============================================================
   FOOTER EQUALIZER
   ============================================================ */

function initFooterEqualizer() {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const eq = document.createElement('div');
    eq.className = 'equalizer';
    eq.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 7; i++) {
        const bar = document.createElement('div');
        bar.className = 'eq-bar';
        eq.appendChild(bar);
    }
    footer.prepend(eq);
}

/* ============================================================
   NEON SCAN CLASS — apply to interactive panels
   ============================================================ */

function initNeonScan() {
    document.querySelectorAll('.level-item.unlocked, .powerup-item').forEach(el => {
        el.classList.add('neon-scan');
    });
}

/* ============================================================
   KONAMI CODE EASTER EGG
   ============================================================ */

function initKonamiCode() {
    const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === CODE[idx]) {
            idx++;
            if (idx === CODE.length) { triggerKonami(); idx = 0; }
        } else {
            idx = e.key === CODE[0] ? 1 : 0;
        }
    });
}

function triggerKonami() {
    document.body.classList.add('konami-active');
    triggerScreenFlash('rgba(255,255,255,0.2)');
    shakeScreen();

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createParticleBurst(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                16
            );
        }, i * 140);
    }

    const msg = document.createElement('div');
    msg.textContent = '★ +30 LIVES! ★';
    Object.assign(msg.style, {
        position:      'fixed',
        top:           '50%',
        left:          '50%',
        transform:     'translate(-50%, -50%)',
        zIndex:        '999999',
        fontFamily:    "'Press Start 2P', cursive",
        fontSize:      'clamp(0.9rem, 4vw, 1.5rem)',
        color:         '#FFFF00',
        textShadow:    '0 0 20px #FFFF00, 0 0 40px #FF00FF',
        pointerEvents: 'none',
        textAlign:     'center',
        lineHeight:    '1.6',
        animation:     'score-pop 0.5s ease-out',
    });
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.transition = 'opacity 0.5s';
        msg.style.opacity    = '0';
        setTimeout(() => msg.remove(), 550);
    }, 2200);

    setTimeout(() => document.body.classList.remove('konami-active'), 3000);
}

/* ============================================================
   RANDOM RARE SCREEN GLITCH
   ============================================================ */

function initRandomGlitch() {
    const colors = [
        'rgba(0,255,255,0.07)',
        'rgba(255,0,255,0.07)',
        'rgba(255,255,0,0.05)',
    ];
    setInterval(() => {
        if (Math.random() < 0.22) {
            triggerScreenFlash(colors[Math.floor(Math.random() * colors.length)]);
        }
    }, 7000);
}

/* ============================================================
   MOBILE NAV
   ============================================================ */

function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList   = document.querySelector('.nav-list');
    if (!navToggle || !navList) return;

    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !expanded);
        navList.classList.toggle('active');
    });

    navList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
            navList.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ============================================================
   SPOTIFY EMBED TOGGLE
   ============================================================ */

function initSpotifyEmbeds() {
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const trackId   = this.dataset.trackId;
            const levelItem = this.closest('.level-item');
            const embed     = levelItem.querySelector('.spotify-embed');
            const isOpen    = embed.classList.contains('open');

            // Close all open embeds
            document.querySelectorAll('.spotify-embed.open').forEach(el => {
                el.classList.remove('open');
                el.innerHTML = '';
                const other = el.closest('.level-item')?.querySelector('.play-btn');
                if (other) { other.textContent = '\u25B6'; other.classList.remove('playing'); }
            });

            if (!isOpen) {
                embed.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" height="80" frameborder="0" allowfullscreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
                embed.classList.add('open');
                this.textContent = '\u25A0';
                this.classList.add('playing');
                triggerScreenFlash('rgba(0,255,0,0.08)');
            }
        });
    });
}

/* ============================================================
   CHARACTER CARD SELECTION
   ============================================================ */

function initCharacterCards() {
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            shakeScreen();
            const rect = this.getBoundingClientRect();
            createParticleBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
            triggerScreenFlash('rgba(255,255,0,0.1)');
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
    });
}

/* ============================================================
   HERO SUBTITLE INTERACTION
   ============================================================ */

function initHeroInteraction() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            heroSubtitle.textContent = 'Loading...';
            heroSubtitle.style.animation = 'none';
            setTimeout(() => { window.location.href = 'about.html'; }, 500);
        }
    });
}

/* ============================================================
   MENU ITEM HOVER ANIMATION
   ============================================================ */

function initMenuHover() {
    document.querySelectorAll('.menu-item, .level-item, .powerup-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            void this.offsetHeight;
            this.style.animation = 'menuHover 0.2s ease';
        });
    });
}

/* ============================================================
   LAZY LOAD IMAGES
   ============================================================ */

function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        images.forEach(img => obs.observe(img));
    } else {
        images.forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); });
    }
}

/* ============================================================
   DYNAMIC KEYFRAMES
   ============================================================ */

const style = document.createElement('style');
style.textContent = `
    @keyframes selectPulse {
        0%   { transform: scale(1); }
        50%  { transform: scale(1.05); }
        100% { transform: scale(1.02); }
    }
    @keyframes menuHover {
        0%   { transform: translateX(0); }
        50%  { transform: translateX(4px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    injectOverlays();
    initPageBoot();
    initMobileNav();
    initSpotifyEmbeds();
    initCharacterCards();
    initMenuHover();
    initHeroInteraction();
    initLazyLoad();
    initScrollReveal();
    initStaggeredEntrance();
    initTitleUnderlines();
    initFooterEqualizer();
    initNeonScan();
    initKonamiCode();
    initRandomGlitch();

    if (!isMobile()) {
        initCursorTrail();
        initPerspectiveTilt();
    }

    initClickParticles();
    initFloatingXP();
});
