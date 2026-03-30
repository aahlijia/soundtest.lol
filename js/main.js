// main.js — ABSOLUTE CHAOS EDITION

/* ============================================================
   UTILITIES
   ============================================================ */

function isMobile() {
    return window.matchMedia('(max-width: 767px)').matches ||
           window.matchMedia('(hover: none)').matches;
}

function throttle(fn, ms) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= ms) { last = now; fn.apply(this, args); }
    };
}

function triggerScreenFlash(color) {
    const flash = document.querySelector('.screen-flash');
    if (!flash) return;
    flash.style.background = color;
    flash.classList.remove('active');
    void flash.offsetWidth;
    flash.classList.add('active');
}

function shakeScreen() {
    document.body.classList.remove('shaking');
    void document.body.offsetWidth;
    document.body.classList.add('shaking');
    setTimeout(() => document.body.classList.remove('shaking'), 450);
}

function triggerScreenTear() {
    document.body.classList.remove('screen-tearing');
    void document.body.offsetWidth;
    document.body.classList.add('screen-tearing');
    setTimeout(() => document.body.classList.remove('screen-tearing'), 380);
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
            posX += vx; posY += vy; vy += 0.28; opacity -= 0.034;
            p.style.left    = posX + 'px';
            p.style.top     = posY + 'px';
            p.style.opacity = opacity;
            if (opacity > 0) requestAnimationFrame(animate);
            else p.remove();
        })();
    }
}

function createShockwave(x, y, color = '#00FFFF') {
    const w = document.createElement('div');
    w.className = 'shockwave';
    Object.assign(w.style, {
        left:      x + 'px',
        top:       y + 'px',
        border:    `3px solid ${color}`,
        boxShadow: `0 0 12px ${color}, inset 0 0 8px ${color}`,
    });
    document.body.appendChild(w);
    setTimeout(() => w.remove(), 700);
}

/* ============================================================
   INJECT GLOBAL OVERLAYS
   ============================================================ */

function injectOverlays() {
    ['screen-vignette', 'pixel-grid-bg', 'screen-flash'].forEach(cls => {
        const el = document.createElement('div');
        el.className = cls;
        el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(el);
    });

    // Combo display
    const combo = document.createElement('div');
    combo.className = 'combo-display';
    combo.innerHTML = '<span class="combo-number">0x</span><span class="combo-label">COMBO!</span>';
    combo.setAttribute('aria-hidden', 'true');
    document.body.appendChild(combo);
}

/* ============================================================
   PAGE BOOT — CRT POWER-ON
   ============================================================ */

function initPageBoot() {
    document.body.classList.add('page-booting');
    const done = () => document.body.classList.remove('page-booting');
    document.body.addEventListener('animationend', done, { once: true });
    setTimeout(done, 1000);
}

/* ============================================================
   MATRIX DIGITAL RAIN
   ============================================================ */

function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    Object.assign(canvas.style, {
        position:      'fixed',
        top:           '0',
        left:          '0',
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        '-2',
        opacity:       '0.13',
    });
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const CHARS = '0123456789ABCDEFabcdef♪★♦■▲●◆░▒▓═╬╔╗╚╝║│─┼ΩΣΔΠΦΨλμπ';
    const FS = 13;
    const COLORS = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00'];

    let cols, drops;

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        cols  = Math.floor(canvas.width / FS);
        drops = Array.from({ length: cols }, () => Math.random() * -60);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 26, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${FS}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * FS;
            const y = drops[i] * FS;

            // Head — bright white
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.fillText(char, x, y);

            // Body — neon color
            ctx.fillStyle = COLORS[i % COLORS.length];
            if (drops[i] > 1) {
                ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, y - FS);
            }

            drops[i] += 0.45;
            if (drops[i] * FS > canvas.height && Math.random() > 0.972) {
                drops[i] = Math.random() * -30;
            }
        }
    }

    setInterval(draw, 55);
}

/* ============================================================
   PIXEL CURSOR TRAIL
   ============================================================ */

function initCursorTrail() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail';
    Object.assign(canvas.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: '9996',
    });
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
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
            ctx.fillRect(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2, p.size, p.size);
            p.x += p.vx; p.y += p.vy; p.life -= 0.06;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    })();
}

/* ============================================================
   CLICK PARTICLE BURST + SHOCKWAVE
   ============================================================ */

function initClickParticles() {
    const swColors = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'];
    document.addEventListener('click', (e) => {
        createParticleBurst(e.clientX, e.clientY, 8);
        createShockwave(e.clientX, e.clientY, swColors[Math.floor(Math.random() * swColors.length)]);
        addCombo();
    });
}

/* ============================================================
   COMBO COUNTER
   ============================================================ */

let comboCount = 0;
let comboTimer = null;

function addCombo() {
    comboCount++;
    const display = document.querySelector('.combo-display');
    if (!display) return;

    display.classList.add('active');
    const num = display.querySelector('.combo-number');
    num.textContent = comboCount + 'x';
    num.classList.remove('pop');
    void num.offsetWidth;
    num.classList.add('pop');

    clearTimeout(comboTimer);

    if (comboCount >= 5)  triggerScreenFlash('rgba(255,255,0,0.06)');
    if (comboCount >= 10) { shakeScreen(); triggerScreenFlash('rgba(255,0,255,0.1)'); }
    if (comboCount >= 15) triggerScreenTear();

    if (comboCount === 5)  unlockAchievement('combo5');
    if (comboCount === 10) unlockAchievement('combo10');

    comboTimer = setTimeout(() => {
        comboCount = 0;
        display.classList.remove('active');
    }, 1800);
}

/* ============================================================
   FLOATING MUSIC NOTES
   ============================================================ */

function initMusicNotes() {
    const NOTES  = ['♪', '♫', '♩', '♬'];
    const COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00', '#FF6600'];

    function spawn() {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.textContent = NOTES[Math.floor(Math.random() * NOTES.length)];
        note.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        note.style.left  = (5 + Math.random() * 90) + 'vw';
        note.style.bottom = '-40px';

        const dur  = 4 + Math.random() * 5;
        const rise = -(120 + Math.random() * 250);
        note.style.setProperty('--rise',  rise + 'px');
        note.style.setProperty('--rise2', (rise - 40) + 'px');
        note.style.animationDuration = dur + 's';

        document.body.appendChild(note);
        setTimeout(() => note.remove(), dur * 1000 + 200);
    }

    // Stagger initial spawns
    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 600);
    setInterval(spawn, isMobile() ? 2000 : 900);
}

/* ============================================================
   FLOATING GEOMETRIC SHAPES
   ============================================================ */

function initGeoShapes() {
    const SHAPES = ['◆', '▲', '●', '■', '★', '▶', '⬡'];
    const COLORS  = ['#00FFFF', '#FF00FF', '#FFFF00', '#00FF00'];

    function spawn() {
        const shape = document.createElement('div');
        shape.className = 'geo-shape';
        shape.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        shape.style.color    = COLORS[Math.floor(Math.random() * COLORS.length)];
        shape.style.fontSize = (16 + Math.random() * 36) + 'px';
        shape.style.left     = (Math.random() * 100) + 'vw';
        shape.style.bottom   = '-60px';

        const dur = 10 + Math.random() * 14;
        shape.style.animationDuration = dur + 's';

        document.body.appendChild(shape);
        setTimeout(() => shape.remove(), dur * 1000 + 200);
    }

    for (let i = 0; i < 3; i++) setTimeout(spawn, i * 1500);
    setInterval(spawn, 3200);
}

/* ============================================================
   BACKGROUND HUE SHIFT ON MOUSE MOVE
   ============================================================ */

function initBgHueShift() {
    const layers = document.querySelectorAll('.stars-layer-1, .stars-layer-2, .stars-layer-3');
    document.addEventListener('mousemove', throttle((e) => {
        const hue = Math.round((e.clientX / window.innerWidth) * 45);
        layers.forEach(l => { l.style.filter = `hue-rotate(${hue}deg)`; });
    }, 60));
}

/* ============================================================
   PAGE TRANSITION — SCANLINE WIPE
   ============================================================ */

function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (!href.endsWith('.html')) return;
        if (link.target === '_blank')   return;
        if (href.startsWith('http'))    return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = href;

            // Wipe overlay
            const wipe = document.createElement('div');
            wipe.className = 'page-exit-wipe';
            wipe.setAttribute('aria-hidden', 'true');
            document.body.appendChild(wipe);

            triggerScreenFlash('rgba(0,255,255,0.15)');

            // Fade body
            document.body.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
            document.body.style.opacity    = '0';
            document.body.style.filter     = 'brightness(4) saturate(4)';

            setTimeout(() => { window.location.href = target; }, 430);
        });
    });
}

/* ============================================================
   ACHIEVEMENT SYSTEM
   ============================================================ */

const ACHIEVEMENTS = {
    first_hover:  { icon: '🎮', header: 'ACHIEVEMENT UNLOCKED', name: 'First Contact!' },
    first_play:   { icon: '🎵', header: 'ACHIEVEMENT UNLOCKED', name: 'DJ Mode: ACTIVE' },
    char_select:  { icon: '⭐', header: 'ACHIEVEMENT UNLOCKED', name: 'Player 1 Ready!' },
    combo5:       { icon: '🔥', header: 'ACHIEVEMENT UNLOCKED', name: 'Combo x5!' },
    combo10:      { icon: '💥', header: 'SECRET ACHIEVEMENT',   name: 'Unstoppable!!' },
    konami:       { icon: '🕹️', header: 'SECRET FOUND',         name: '+30 Lives!!' },
};

const unlockedAchs = new Set(
    JSON.parse(localStorage.getItem('st_ach') || '[]')
);

function unlockAchievement(id) {
    if (unlockedAchs.has(id)) return;
    const def = ACHIEVEMENTS[id];
    if (!def) return;

    unlockedAchs.add(id);
    try { localStorage.setItem('st_ach', JSON.stringify([...unlockedAchs])); } catch (_) {}

    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <span class="ach-icon">${def.icon}</span>
        <div class="ach-header">${def.header}</div>
        <div class="ach-name">${def.name}</div>
    `;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5200);

    triggerScreenFlash('rgba(255,255,0,0.09)');
    createParticleBurst(window.innerWidth - 130, window.innerHeight - 140, 12);
}

/* ============================================================
   BOSS HP BAR
   ============================================================ */

function initBossBar() {
    const bar = document.createElement('div');
    bar.className = 'boss-bar';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = `
        <span class="boss-bar-label">♦ FINAL BOSS ♦</span>
        <div class="boss-bar-track">
            <div class="boss-bar-fill" style="width:100%"></div>
        </div>
        <span class="boss-bar-label">HP</span>
    `;
    document.body.appendChild(bar);

    const fill = bar.querySelector('.boss-bar-fill');
    let hp = 100;

    // Show 6 seconds after load
    setTimeout(() => {
        bar.classList.add('visible');
        triggerScreenFlash('rgba(255,0,0,0.12)');
        shakeScreen();

        const drain = setInterval(() => {
            hp = Math.max(0, hp - (0.4 + Math.random() * 1.2));
            fill.style.width = hp + '%';

            if (hp <= 25 && hp > 0) {
                fill.style.background = 'linear-gradient(90deg, #660000, #FF0000, #660000)';
            }

            if (hp <= 0) {
                clearInterval(drain);
                fill.style.background = '#00FF00';
                bar.querySelector('.boss-bar-label').textContent = '★ DEFEATED! ★';
                triggerScreenFlash('rgba(0,255,0,0.2)');
                createParticleBurst(window.innerWidth / 2, window.innerHeight - 30, 20);
                setTimeout(() => { bar.classList.remove('visible'); }, 2500);
            }
        }, 450);

        // Auto-dismiss after 40s if player is AFK
        setTimeout(() => {
            clearInterval(drain);
            bar.classList.remove('visible');
        }, 40000);

    }, 6000);
}

/* ============================================================
   RANDOM TEXT CORRUPTION GLITCH
   ============================================================ */

function initTextCorruption() {
    const GLITCH = '!@#$%&*?><][}{|;:~`/\\\'\"^0101';
    const targets = Array.from(
        document.querySelectorAll('h1:not(.glitch), h2:not(.glitch), h3:not(.glitch)')
    );
    if (!targets.length) return;

    function corrupt(el) {
        const original = el.textContent;
        let frame = 0;
        const id = setInterval(() => {
            el.textContent = original.split('').map(c =>
                c !== ' ' && Math.random() < 0.3
                    ? GLITCH[Math.floor(Math.random() * GLITCH.length)]
                    : c
            ).join('');
            if (++frame >= 7) { clearInterval(id); el.textContent = original; }
        }, 45);
    }

    setInterval(() => {
        if (targets.length && Math.random() < 0.35) {
            corrupt(targets[Math.floor(Math.random() * targets.length)]);
        }
    }, 4500);
}

/* ============================================================
   ELECTRIC SPARKS (on element borders)
   ============================================================ */

function initElectricSparks() {
    const SPARK_COLORS = ['#00FFFF', '#FFFFFF', '#FF00FF'];

    function spawnSparks(x, y) {
        for (let i = 0; i < 5; i++) {
            const s = document.createElement('div');
            s.className = 'spark-particle';
            const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
            const angle = Math.random() * Math.PI * 2;
            const dist  = 30 + Math.random() * 50;
            s.style.setProperty('--sx', Math.cos(angle) * dist + 'px');
            s.style.setProperty('--sy', Math.sin(angle) * dist + 'px');
            Object.assign(s.style, {
                left:       x + 'px',
                top:        y + 'px',
                background: color,
                boxShadow:  `0 0 4px ${color}`,
            });
            document.body.appendChild(s);
            setTimeout(() => s.remove(), 520);
        }
    }

    // Sparks on interactive element hover
    document.querySelectorAll('.menu-item, .level-item.unlocked, .character-card').forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const rect = el.getBoundingClientRect();
            spawnSparks(
                rect.left + Math.random() * rect.width,
                rect.top  + Math.random() * rect.height
            );
        });
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
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(el => obs.observe(el));
}

/* ============================================================
   STAGGERED GRID ENTRANCE
   ============================================================ */

function initStaggeredEntrance() {
    document.querySelectorAll('.menu-grid, .character-grid, .level-select-grid, .powerup-grid').forEach(grid => {
        Array.from(grid.children).forEach((child, i) => {
            child.style.opacity    = '0';
            child.style.transform  = 'translateY(28px)';
            child.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
            setTimeout(() => { child.style.opacity = ''; child.style.transform = ''; }, 60 + i * 110);
        });
    });
}

/* ============================================================
   PAGE TITLE UNDERLINE BARS
   ============================================================ */

function initTitleUnderlines() {
    document.querySelectorAll('.page-title').forEach(title => {
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
        let firstHover = true;
        item.addEventListener('mouseenter', () => {
            if (firstHover) { firstHover = false; unlockAchievement('first_hover'); }

            const idx = Math.floor(Math.random() * XP_VALUES.length);
            const xp  = document.createElement('div');
            xp.className   = 'xp-popup';
            xp.textContent = XP_VALUES[idx];
            xp.style.color = XP_COLORS[idx % XP_COLORS.length];

            const rect = item.getBoundingClientRect();
            xp.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 40) + 'px';
            xp.style.top  = (rect.top - 5) + 'px';
            document.body.appendChild(xp);
            setTimeout(() => xp.remove(), 1500);
        });
    });
}

/* ============================================================
   PERSPECTIVE TILT
   ============================================================ */

function initPerspectiveTilt() {
    document.querySelectorAll('.character-card, .game-box, .menu-item').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const r  = el.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
            const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
            el.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.02)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
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
   NEON SCAN CLASS
   ============================================================ */

function initNeonScan() {
    document.querySelectorAll('.level-item.unlocked, .powerup-item').forEach(el => {
        el.classList.add('neon-scan');
    });
}

/* ============================================================
   KONAMI CODE
   ============================================================ */

function initKonamiCode() {
    const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === CODE[idx]) { idx++; if (idx === CODE.length) { triggerKonami(); idx = 0; } }
        else { idx = e.key === CODE[0] ? 1 : 0; }
    });
}

function triggerKonami() {
    unlockAchievement('konami');
    document.body.classList.add('konami-active');
    triggerScreenFlash('rgba(255,255,255,0.25)');
    shakeScreen();

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createParticleBurst(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 18);
        }, i * 130);
    }

    const msg = document.createElement('div');
    msg.textContent = '★ +30 LIVES! ★';
    Object.assign(msg.style, {
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '999999',
        fontFamily: "'Press Start 2P', cursive",
        fontSize: 'clamp(0.9rem, 4vw, 1.5rem)',
        color: '#FFFF00',
        textShadow: '0 0 20px #FFFF00, 0 0 40px #FF00FF',
        pointerEvents: 'none', textAlign: 'center', lineHeight: '1.6',
        animation: 'score-pop 0.5s ease-out',
    });
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.style.transition = 'opacity 0.5s';
        msg.style.opacity = '0';
        setTimeout(() => msg.remove(), 550);
    }, 2200);

    setTimeout(() => document.body.classList.remove('konami-active'), 3000);
}

/* ============================================================
   RANDOM GLITCH EVENTS
   ============================================================ */

function initRandomGlitch() {
    const flashColors = ['rgba(0,255,255,0.07)', 'rgba(255,0,255,0.07)', 'rgba(255,255,0,0.05)'];

    setInterval(() => {
        const roll = Math.random();
        if (roll < 0.22) {
            triggerScreenFlash(flashColors[Math.floor(Math.random() * flashColors.length)]);
        } else if (roll < 0.28) {
            triggerScreenTear();
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
        btn.addEventListener('click', function () {
            const trackId   = this.dataset.trackId;
            const levelItem = this.closest('.level-item');
            const embed     = levelItem.querySelector('.spotify-embed');
            const isOpen    = embed.classList.contains('open');

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
                unlockAchievement('first_play');
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
        card.addEventListener('click', function () {
            cards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            shakeScreen();
            const r = this.getBoundingClientRect();
            createParticleBurst(r.left + r.width / 2, r.top + r.height / 2, 16);
            createShockwave(r.left + r.width / 2, r.top + r.height / 2, '#FFFF00');
            triggerScreenFlash('rgba(255,255,0,0.12)');
            unlockAchievement('char_select');
        });
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
    });
}

/* ============================================================
   HERO INTERACTION
   ============================================================ */

function initHeroInteraction() {
    const sub = document.querySelector('.hero-subtitle');
    if (!sub) return;
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            sub.textContent = 'Loading...';
            sub.style.animation = 'none';
            setTimeout(() => { window.location.href = 'about.html'; }, 500);
        }
    });
}

/* ============================================================
   MENU HOVER ANIMATION
   ============================================================ */

function initMenuHover() {
    document.querySelectorAll('.menu-item, .level-item, .powerup-item').forEach(item => {
        item.addEventListener('mouseenter', function () {
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
   BOOT SEQUENCE — fires everything in order
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
    initMusicNotes();
    initPageTransitions();
    initFloatingXP();
    initClickParticles();
    initBossBar();

    if (!isMobile()) {
        initMatrixRain();
        initCursorTrail();
        initPerspectiveTilt();
        initGeoShapes();
        initBgHueShift();
        initElectricSparks();
        initTextCorruption();
    }
});
