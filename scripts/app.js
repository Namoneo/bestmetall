/**
 * BEST METALL - MAIN APPLICATION
 * Application logic, smooth scroll, mobile nav
 */

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

// GSAP ScrollTrigger integration with Lenis (single ticker, no manual raf loop)
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Language Management — Uzbek only
const LanguageManager = {
  init() {
    this.applyLanguage();
  },

  applyLanguage() {
    document.documentElement.lang = 'uz';
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.getTranslation(key);
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
  },

  getTranslation(key) {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  }
};

// Mobile Navigation
const MobileNav = {
  init() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const nav = document.getElementById('nav');

    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        nav.classList.toggle('nav--open');
        document.body.classList.toggle('nav-open');
      });

      // Close on link click
      const links = menu.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          toggle.classList.remove('active');
          menu.classList.remove('active');
          nav.classList.remove('nav--open');
          document.body.classList.remove('nav-open');
        });
      });
    }
  }
};

// Navigation scroll behavior
const Navigation = {
  init() {
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    lenis.on('scroll', ({ scroll }) => {
      // Add solid background after scrolling
      if (scroll > 100) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }

      // Hide/show on scroll direction
      if (scroll > lastScroll && scroll > 500) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }

      lastScroll = scroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });
  }
};

// Counter Animation
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000;

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          gsap.to(counter, {
            innerHTML: target,
            duration: duration / 1000,
            ease: 'power2.out',
            snap: { innerHTML: 1 },
            onUpdate: function() {
              counter.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
            }
          });
        }
      });
    });
  }
};

// Form Handling
const FormHandler = {
  init() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simple validation
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        if (!name || !phone) {
          this.showMessage(
            'Iltimos, barcha majburiy maydonlarni to\'ldiring',
            'error'
          );
          return;
        }

        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Yuborilmoqda...';

        setTimeout(() => {
          this.showMessage(
            'Rahmat! Tez orada siz bilan bog\'lanamiz.',
            'success'
          );
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      });
    }
  },

  showMessage(text, type) {
    // Remove existing messages
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();

    // Create message
    const message = document.createElement('div');
    message.className = `form-message form-message--${type}`;
    message.textContent = text;

    const form = document.getElementById('contactForm');
    form.appendChild(message);

    // Animate in
    gsap.fromTo(message,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    // Remove after delay
    setTimeout(() => {
      gsap.to(message, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => message.remove()
      });
    }, 5000);
  }
};

// Spark effect for hero — welding-style particles from a focal point
const SparkEffect = {
  init() {
    const container = document.getElementById('sparks');
    if (!container) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Focal point: anchor near the hero weld-line if present, else center bottom
    const getOrigin = () => {
      const rect = container.getBoundingClientRect();
      const weldEl = container.parentElement?.querySelector('.hero__content .weld-line');
      if (weldEl) {
        const wRect = weldEl.getBoundingClientRect();
        return {
          x: ((wRect.left + wRect.width / 2 - rect.left) / rect.width) * 100,
          y: ((wRect.top + wRect.height / 2 - rect.top) / rect.height) * 100
        };
      }
      return { x: 50, y: 65 };
    };

    const createSpark = () => {
      const origin = getOrigin();
      const burstSize = 1 + Math.floor(Math.random() * 3); // 1-3 per tick

      for (let i = 0; i < burstSize; i++) {
        const spark = document.createElement('div');
        const hot = Math.random() < 0.4;
        spark.className = hot ? 'spark spark--hot' : 'spark';

        // Tiny jitter around origin
        const jitterX = (Math.random() - 0.5) * 4;
        const jitterY = (Math.random() - 0.5) * 2;
        spark.style.left = `${origin.x + jitterX}%`;
        spark.style.top = `${origin.y + jitterY}%`;

        container.appendChild(spark);

        // Direction: mostly upward in a cone, sometimes sideways
        const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 1.3; // -90deg ± ~37deg
        const distance = 60 + Math.random() * 140;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        const midX = endX * 0.5 + (Math.random() - 0.5) * 10;
        const midY = endY * 0.4;

        gsap.fromTo(spark,
          {
            opacity: 0,
            scale: 0.4,
            x: 0,
            y: 0
          },
          {
            keyframes: [
              { opacity: 1, scale: 1, x: midX, y: midY, duration: 0.25, ease: 'power2.out' },
              { opacity: 0, scale: 0.2, x: endX, y: endY + 40, duration: 0.7 + Math.random() * 0.4, ease: 'power1.in' }
            ],
            onComplete: () => spark.remove()
          }
        );
      }
    };

    // Periodic bursts — slightly irregular timing for natural feel
    const tick = () => {
      createSpark();
      const next = 110 + Math.random() * 220;
      setTimeout(tick, next);
    };
    tick();
  }
};

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
  MobileNav.init();
  Navigation.init();
  CounterAnimation.init();
  FormHandler.init();
  SparkEffect.init();

  // Initialize animations
  if (window.Animations) {
    window.Animations.init();
  }

  console.log('Best Metall - Forged Precision');
});
