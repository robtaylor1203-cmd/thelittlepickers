/* ============================================
   THE LITTLE PICKERS — Main JavaScript
   Custom cursor, scroll animations, interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    loadLiveStats();
    initCustomCursor();
    initScrollAnimations();
    initNavigation();
    initForm();
    initParallaxLeaves();

    // Set up counter animation AFTER loadLiveStats so data-target is already correct
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
    } else if (heroSection) {
        animateCounters();
    }
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

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        })
        .then(function (res) {
            if (res.ok) {
                // Count the new members: children entered + 1 adult
                var pickersVal = parseInt(form.querySelector('#pickers').value, 10) || 0;
                var newPeople = pickersVal + 1;
                var stored = parseInt(localStorage.getItem('tlp_member_count'), 10);
                // Seed from current data-target if nothing stored yet
                var current = isNaN(stored)
                    ? parseInt(document.getElementById('statMembers').getAttribute('data-target'), 10) || 6
                    : stored;
                localStorage.setItem('tlp_member_count', current + newPeople);
                // Refresh the live counter immediately
                loadLiveStats();
                form.style.display = 'none';
                success.style.display = 'block';
            } else {
                alert('Something went wrong. Please try again.');
            }
        })
        .catch(function () {
            alert('Could not submit — please check your connection and try again.');
        });
    });
}

/* ---------- Live Stats from localStorage ---------- */
function loadLiveStats() {
    // Streets Cleaned: count features in the saved GeoJSON
    var streetsEl = document.getElementById('statStreets');
    if (streetsEl) {
        var streetCount = 0;
        try {
            var gj = JSON.parse(localStorage.getItem('tlp_cleaned_streets') || 'null');
            if (gj && gj.features) streetCount = gj.features.length;
        } catch (e) {}
        // Use the max of the hardcoded baseline (1) and actual count
        var streetsVal = Math.max(1, streetCount);
        streetsEl.setAttribute('data-target', streetsVal);
        streetsEl.textContent = streetsVal;
    }

    // Members: use stored running total, seeded from data-target baseline
    var membersEl = document.getElementById('statMembers');
    if (membersEl) {
        var stored = parseInt(localStorage.getItem('tlp_member_count'), 10);
        var baseline = parseInt(membersEl.getAttribute('data-target'), 10) || 6;
        var membersVal = isNaN(stored) ? baseline : Math.max(baseline, stored);
        membersEl.setAttribute('data-target', membersVal);
        membersEl.textContent = membersVal;
    }

    // KG Litter Collected: tlp_total_kg IS the running total.
    // The HTML data-target is the manual seed. If it has changed since last load,
    // reset tlp_total_kg to that value (lets the user update the baseline by editing HTML).
    var kgEl = document.getElementById('statKg');
    if (kgEl) {
        var kgSeed = parseFloat(kgEl.getAttribute('data-target') || '0');
        var storedSeed = parseFloat(localStorage.getItem('tlp_kg_seed_val') || 'NaN');
        if (isNaN(storedSeed) || storedSeed !== kgSeed) {
            // First load ever, or user has updated the HTML baseline — reset to seed
            localStorage.setItem('tlp_total_kg', kgSeed.toFixed(1));
            localStorage.setItem('tlp_kg_seed_val', kgSeed.toFixed(1));
        }
        var kgVal = parseFloat(localStorage.getItem('tlp_total_kg')).toFixed(1);
        kgEl.setAttribute('data-target', kgVal);
        kgEl.textContent = kgVal;
    }
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
        const isKg = counter.id === 'statKg';
        const target = parseFloat(counter.getAttribute('data-target'));
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const val = target * eased; // always count up from 0
            counter.textContent = isKg ? val.toFixed(1) : Math.round(val);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// Wall of Fame: Gallery Upload
const galleryUploadForm = document.getElementById('galleryUploadForm');
if (galleryUploadForm) {
    galleryUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = document.getElementById('galleryFile').files[0];
        const caption = document.getElementById('galleryCaption').value;
        const status = document.getElementById('galleryUploadStatus');
        status.textContent = 'Uploading...';
        window.uploadImage(file, 'gallery', (window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.uid) || null, {caption})
            .then(() => {
                status.textContent = 'Upload successful!';
                loadGallery();
            })
            .catch(err => {
                status.textContent = 'Upload failed: ' + err.message;
            });
    });
}

// Wall of Fame: Art Upload
const artUploadForm = document.getElementById('artUploadForm');
if (artUploadForm) {
    artUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const file = document.getElementById('artFile').files[0];
        const caption = document.getElementById('artCaption').value;
        const status = document.getElementById('artUploadStatus');
        status.textContent = 'Uploading...';
        window.uploadImage(file, 'art', (window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.uid) || null, {caption})
            .then(() => {
                status.textContent = 'Upload successful!';
                loadArt();
            })
            .catch(err => {
                status.textContent = 'Upload failed: ' + err.message;
            });
    });
}

// Load Gallery Images
function loadGallery() {
    window.listImages('gallery', 6).then(images => {
        const galleryList = document.getElementById('galleryList');
        if (!galleryList) return;
        galleryList.innerHTML = images.map(img => `<div class="gallery-item"><img src="${img.url}" alt="Gallery"><div class="caption">${img.caption || ''}</div></div>`).join('');
    });
}
// Load Art Images
function loadArt() {
    window.listImages('art', 6).then(images => {
        const artList = document.getElementById('artList');
        if (!artList) return;
        artList.innerHTML = images.map(img => `<div class="gallery-item"><img src="${img.url}" alt="Art"><div class="caption">${img.caption || ''}</div></div>`).join('');
    });
}
// Top Picker
function loadTopPicker() {
    window.getRandomTopPicker().then(user => {
        const topPicker = document.getElementById('topPicker');
        if (!topPicker) return;
        if (user) {
            topPicker.innerHTML = `<div class="top-picker-card"><div class="top-picker-pic">${user.photoURL ? `<img src='${user.photoURL}' alt='Profile'>` : '👑'}</div><div class="top-picker-name">${user.displayName || user.email || 'Anonymous'}</div></div>`;
        } else {
                topPicker.innerHTML = '';
        }
    });
}
// Map (basic placeholder, can be replaced with Leaflet/Google Maps)
function loadCleanedMap() {
    window.listCleanedAreas().then(areas => {
        const mapDiv = document.getElementById('cleanedMap');
        const mapStatus = document.getElementById('cleanedMapStatus');
        if (mapDiv) mapDiv.innerHTML = `<div style='padding:20px;'>${areas.length} areas cleaned! (Map integration coming soon)</div>`;
        if (mapStatus) mapStatus.textContent = `${areas.length} cleaned`;
    });
}
// Add Cleaned Area (placeholder, real map UI can be added later)
const addAreaBtn = document.getElementById('addAreaBtn');
if (addAreaBtn) {
    addAreaBtn.addEventListener('click', function() {
        const userId = (window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.uid) || null;
        const fakeFeature = { type: 'Feature', geometry: { type: 'Point', coordinates: [0,0] }, properties: { note: 'Sample area' } };
        window.addCleanedArea(fakeFeature, userId).then(() => {
            loadCleanedMap();
            alert('Area marked as cleaned! (Demo)');
        });
    });
}
// Make placeholder cards interactive for uploads and map
const galleryUploadCard = document.getElementById('galleryUploadCard');
const artUploadCard = document.getElementById('artUploadCard');
const hiddenGalleryFile = document.getElementById('hiddenGalleryFile');
const hiddenArtFile = document.getElementById('hiddenArtFile');
const actionShotsCard = document.getElementById('actionShotsCard');
const cleanedMapCard = document.getElementById('cleanedMapCard');

if (galleryUploadCard && hiddenGalleryFile) {
    // Make the .upload-hint span a link to gallery, rest of card triggers upload
    const galleryHint = galleryUploadCard.querySelector('.upload-hint');
    if (galleryHint) {
        galleryHint.style.textDecoration = 'underline';
        galleryHint.style.cursor = 'pointer';
        galleryHint.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = 'gallery.html';
        });
    }
    galleryUploadCard.addEventListener('click', function(e) {
        // Only open file picker if not clicking the .upload-hint
        if (e.target.closest('.upload-hint')) return;
        hiddenGalleryFile.click();
    });
    hiddenGalleryFile.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const caption = prompt('Add a caption for your photo (optional):', '');
        galleryUploadCard.querySelector('.upload-hint').textContent = 'Uploading...';
        window.uploadImage(file, 'gallery', (window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.uid) || null, {caption})
            .then(() => {
                galleryUploadCard.querySelector('.upload-hint').textContent = 'Upload complete!';
                loadGallery();
            })
            .catch(err => {
                galleryUploadCard.querySelector('.upload-hint').textContent = 'Upload failed';
                alert('Upload failed: ' + err.message);
            });
    });
}
if (artUploadCard && hiddenArtFile) {
    const artHint = artUploadCard.querySelector('.upload-hint');
    if (artHint) {
        artHint.style.textDecoration = 'underline';
        artHint.style.cursor = 'pointer';
        artHint.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = 'artwork.html';
        });
    }
    artUploadCard.addEventListener('click', function(e) {
        if (e.target.closest('.upload-hint')) return;
        hiddenArtFile.click();
    });
    hiddenArtFile.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        const caption = prompt('Add a title for the artwork (optional):', '');
        artUploadCard.querySelector('.upload-hint').textContent = 'Uploading...';
        window.uploadImage(file, 'art', (window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.uid) || null, {caption})
            .then(() => {
                artUploadCard.querySelector('.upload-hint').textContent = 'Upload complete!';
                loadArt();
            })
            .catch(err => {
                artUploadCard.querySelector('.upload-hint').textContent = 'Upload failed';
                alert('Upload failed: ' + err.message);
            });
    });
}
if (actionShotsCard) {
    actionShotsCard.addEventListener('click', () => {
        window.location.href = 'action-shots.html';
    });
}
if (cleanedMapCard) {
    cleanedMapCard.addEventListener('click', () => {
        window.location.href = 'map.html';
    });
}
// Initial load
window.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    loadArt();
    loadTopPicker();
    loadCleanedMap();
});
