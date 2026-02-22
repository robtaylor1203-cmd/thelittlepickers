/* ============================================
   THE LITTLE PICKERS — Main JavaScript
   Custom cursor, scroll animations, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollAnimations();
    initNavigation();
    initForm();
    initParallaxLeaves();
});

/* ---------- Custom Cursor ---------- */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const trailContainer = document.getElementById('cursorTrail');
    if (!cursor || !trailContainer) return;

    // Don't run on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Responsive cursor
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
        cursor.classList.add('visible');
    });

    // Detect hover on interactive elements
    const interactiveEls = 'a, button, input, textarea, select, .btn, .step-card, .impact-card, .event-card, .badge-item, .placeholder-card, .join-option, .matter-item';
    document.querySelectorAll(interactiveEls).forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    // Animate cursor and ring
    function animateCursor() {
        // Cursor follows mouse instantly
        cursorX = mouseX;
        cursorY = mouseY;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Confetti explosion animation
    document.addEventListener('click', (e) => {
        const burstCount = 24;
        const burstEmojis = ['⭐', '✨', '🌟', '💚', '🍃', '🟡', '🟢', '🔵', '🟣', '🟠', '❤️', '💙', '💛', '💜'];
        for (let i = 0; i < burstCount; i++) {
            const confetti = document.createElement('div');
            confetti.textContent = burstEmojis[Math.floor(Math.random() * burstEmojis.length)];
            const angle = (Math.PI * 2 * i) / burstCount;
            const distance = 60 + Math.random() * 60;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            confetti.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: ${12 + Math.random() * 12}px;
                pointer-events: none;
                z-index: 10001;
                transform: translate(-50%, -50%);
                animation: confettiBurst 1s ease-out forwards;
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rot: ${(Math.random() - 0.5) * 360}deg;
            `;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 1200);
        }
    });
}

function createSparkle(x, y) {
    const sparkleEmojis = ['✨', '⭐', '🌟', '💚', '🍃'];
    const count = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        const emoji = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        spark.textContent = emoji;
        spark.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${12 + Math.random() * 14}px;
            pointer-events: none;
            z-index: 10001;
            transform: translate(-50%, -50%);
            animation: sparkBurst ${0.6 + Math.random() * 0.4}s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 120}px;
            --ty: ${-30 - Math.random() * 80}px;
            --rot: ${(Math.random() - 0.5) * 360}deg;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1200);
    }
}

// Inject confetti and sparkle burst keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1);
        }
        80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3);
        }
    }
    @keyframes sparkBurst {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0);
        }
    }
`;
document.head.appendChild(style);


/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
    const animatedEls = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        animatedEls.forEach(el => observer.observe(el));
    } else {
        // Fallback: show everything
        animatedEls.forEach(el => el.classList.add('visible'));
    }
}


/* ---------- Navigation ---------- */
function initNavigation() {
    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!nav) return;

    // Scroll behavior
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Add scrolled class
        if (scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }, { passive: true });

    // Mobile toggle
    if (toggle && links) {
        const closeBtn = toggle.querySelector('.nav-close');
        toggle.addEventListener('click', (e) => {
            // If clicking the cross, close menu
            if (e.target.closest('.nav-close')) {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.classList.remove('menu-open');
                closeBtn.style.display = 'none';
                toggle.querySelectorAll('.hamburger').forEach(h => h.style.display = 'block');
                return;
            }
            toggle.classList.toggle('active');
            links.classList.toggle('active');
            if (links.classList.contains('active')) {
                document.body.classList.add('menu-open');
                closeBtn.style.display = 'block';
                toggle.querySelectorAll('.hamburger').forEach(h => h.style.display = 'none');
            } else {
                document.body.classList.remove('menu-open');
                closeBtn.style.display = 'none';
                toggle.querySelectorAll('.hamburger').forEach(h => h.style.display = 'block');
            }
        });

        // Close on link click
        links.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.classList.remove('menu-open');
                closeBtn.style.display = 'none';
                toggle.querySelectorAll('.hamburger').forEach(h => h.style.display = 'block');
            });
        });

        // Close menu when cross is clicked
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toggle.classList.remove('active');
                links.classList.remove('active');
                document.body.classList.remove('menu-open');
                closeBtn.style.display = 'none';
                toggle.querySelectorAll('.hamburger').forEach(h => h.style.display = 'block');
            });
        }
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = nav.offsetHeight + 10;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = links?.querySelector(`a[href="#${id}"]`);

            if (navLink) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLink.style.opacity = '1';
                } else {
                    navLink.style.opacity = '';
                }
            }
        });
    }, { passive: true });
}


/* ---------- Form Handling ---------- */
function initForm() {
    const form = document.getElementById('joinForm');
    const success = document.getElementById('formSuccess');
    if (!form || !success) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather data (in a real app, send to API)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        console.log('New Little Picker registration:', data);

        // Show success
        form.style.display = 'none';
        success.classList.add('show');

        // Sparkle celebration!
        const rect = success.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createSparkle(
                    centerX + (Math.random() - 0.5) * 200,
                    centerY + (Math.random() - 0.5) * 100
                );
            }, i * 200);
        }
    });
}


/* ---------- Parallax Floating Leaves ---------- */
function initParallaxLeaves() {
    const leaves = document.querySelectorAll('.floating-leaf');
    if (!leaves.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        leaves.forEach((leaf, i) => {
            const speed = 0.02 + (i * 0.01);
            const yOffset = scrollY * speed;
            leaf.style.transform = `translateY(${-yOffset}px)`;
        });
    }, { passive: true });
}


/* ---------- Counter Animation ---------- */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1500;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            counter.textContent = Math.round(startVal + (target - startVal) * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger counter when hero is visible
const heroSection = document.getElementById('hero');
if (heroSection && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(heroSection);
}
