/* =====================================================
   THE LITTLE PICKERS - Interactive JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. MOBILE HAMBURGER MENU
  ----------------------------------------------- */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* -----------------------------------------------
     2. ACTIVE NAV LINK HIGHLIGHT
  ----------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -----------------------------------------------
     3. SMOOTH SCROLL for anchor links
  ----------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* -----------------------------------------------
     4. ANIMATED STAT COUNTERS
  ----------------------------------------------- */
  const counters = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // Intersection Observer for stats
  if (counters.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => statsObserver.observe(c));
  }

  /* -----------------------------------------------
     5. CONFETTI CELEBRATION on stat hover
  ----------------------------------------------- */
  const CONFETTI_COLORS = ['#4CAF50','#42A5F5','#FFD54F','#FF80AB','#CE93D8','#FFA726'];

  function launchConfetti(originX, originY, count = 28) {
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${originX}px;
        top:  ${originY}px;
        background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
        width:  ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${0.8 + Math.random() * 1.2}s;
        animation-delay: ${Math.random() * 0.3}s;
        transform: translateX(${(Math.random() - 0.5) * 200}px);
      `;
      document.body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  }

  document.querySelectorAll('.stat-item').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      launchConfetti(cx, cy, 22);
    });
  });

  /* -----------------------------------------------
     6. BACK TO TOP BUTTON
  ----------------------------------------------- */
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    const toggleBackToTop = () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------
     7. NOTIFICATION FILTER BUTTONS
  ----------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const noticeCards = document.querySelectorAll('.notice-card[data-category]');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        noticeCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease both';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* -----------------------------------------------
     8. SCHEDULE FILTER
  ----------------------------------------------- */
  const scheduleFilterBtns = document.querySelectorAll('.schedule-filter-btn');
  const sessionCards = document.querySelectorAll('.session-card[data-location]');

  if (scheduleFilterBtns.length > 0) {
    scheduleFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scheduleFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.location;
        sessionCards.forEach(card => {
          if (filter === 'all' || card.dataset.location === filter) {
            card.style.display = '';
            card.style.animation = 'fadeInUp 0.4s ease both';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* -----------------------------------------------
     9. ACCORDION / TOGGLE
  ----------------------------------------------- */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------------------
     10. NOTIFICATION DISMISSAL (badge close)
  ----------------------------------------------- */
  document.querySelectorAll('.notice-dismiss').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.notice-card');
      if (card) {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => card.remove(), 300);
      }
    });
  });

  /* -----------------------------------------------
     11. FADE-IN ON SCROLL (Intersection Observer)
  ----------------------------------------------- */
  const revealElements = document.querySelectorAll(
    '.card, .session-card, .notice-card, .step-card, .team-card, .value-block, .bring-item'
  );

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.animation = 'fadeInUp 0.5s ease both';
            entry.target.style.opacity = '1';
          }, 60 * (entry.target.dataset.revealDelay || 0));
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.dataset.revealDelay = i % 4;
      revealObserver.observe(el);
    });
  }

  /* -----------------------------------------------
     12. CTA BUTTON FUN EFFECT
  ----------------------------------------------- */
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    });
  });

  /* -----------------------------------------------
     13. HERO BADGE FUN CLICK
  ----------------------------------------------- */
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    heroBadge.style.cursor = 'pointer';
    heroBadge.addEventListener('click', (e) => {
      const rect = heroBadge.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 30);
    });
  }

});
