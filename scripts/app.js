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
    // Only bind counters that haven't been wired yet (safe to call repeatedly,
    // e.g. after the CMS loader rebuilds stat/metric nodes).
    const counters = document.querySelectorAll('[data-count]:not([data-counter-bound])');

    counters.forEach(counter => {
      counter.setAttribute('data-counter-bound', '1');
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

// ── Lead delivery config ─────────────────────────────────────────────
// Point this at your serverless proxy (Cloudflare Worker / Vercel function).
// The proxy holds the Telegram bot token; the page never sees it.
// Leave empty ('') to run in demo mode (no network call, just shows success).
const LEAD_ENDPOINT = '';

// Form Handling
const FormHandler = {
  init() {
    this.form = document.getElementById('contactForm');
    if (!this.form) return;

    // Inline validation on blur for required fields
    ['name', 'phone'].forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.form__group').classList.contains('form__group--invalid')) {
          this.validateField(input);
        }
      });
    });

    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  validateField(input) {
    const group = input.closest('.form__group');
    const errorEl = group.querySelector('.form__error');
    const value = input.value.trim();
    let error = '';

    if (input.id === 'name') {
      if (!value) error = 'Ismingizni kiriting';
      else if (value.length < 2) error = 'Ism juda qisqa';
    } else if (input.id === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (!value) error = 'Telefon raqamini kiriting';
      else if (digits.length < 9) error = 'To\'liq raqam kiriting, masalan +998 90 123 45 67';
    }

    if (error) {
      group.classList.add('form__group--invalid');
      if (errorEl) errorEl.textContent = error;
      return false;
    }
    group.classList.remove('form__group--invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const form = this.form;

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const okName = this.validateField(nameInput);
    const okPhone = this.validateField(phoneInput);

    if (!okName || !okPhone) {
      (okName ? phoneInput : nameInput).focus();
      return;
    }

    const data = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      projectType: document.getElementById('projectType')?.value || '',
      message: document.getElementById('message')?.value.trim() || '',
      company: document.getElementById('company')?.value || '', // honeypot
      page: location.href,
    };

    const submitBtn = document.getElementById('contactSubmit');
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    try {
      if (LEAD_ENDPOINT) {
        const res = await fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Request failed: ' + res.status);
      } else {
        // Demo mode — no endpoint configured yet
        await new Promise((r) => setTimeout(r, 900));
      }

      this.showMessage('Rahmat! Arizangiz qabul qilindi — tez orada bog\'lanamiz.', 'success');
      form.reset();
    } catch (err) {
      this.showMessage(
        'Yuborishda xatolik. Iltimos, Telegram yoki qo\'ng\'iroq orqali bog\'laning.',
        'error'
      );
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
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

// Ember effect for hero — slow rising embers, like heat off forged metal.
// Deliberately calm and sparse (not a firework burst): one particle at a time,
// drifting upward with a gentle horizontal sway and a long fade.
const SparkEffect = {
  init() {
    const container = document.getElementById('sparks');
    if (!container) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const createEmber = () => {
      const ember = document.createElement('div');
      const hot = Math.random() < 0.3;
      ember.className = hot ? 'spark spark--hot' : 'spark';

      // Spawn anywhere across the lower band of the hero, near the bottom edge
      const startX = 8 + Math.random() * 84;        // 8%–92% across
      ember.style.left = `${startX}%`;
      ember.style.top = `${90 + Math.random() * 8}%`; // just above the bottom

      // Smaller, calmer particles
      const size = 1.5 + Math.random() * 1.5;
      ember.style.width = `${size}px`;
      ember.style.height = `${size}px`;

      container.appendChild(ember);

      // Rise straight up over a long distance with a slow, eased drift
      const rise = 180 + Math.random() * 220;        // px upward
      const sway = (Math.random() - 0.5) * 60;       // gentle left/right drift
      const peakOpacity = 0.35 + Math.random() * 0.4;
      const dur = 4 + Math.random() * 3;             // slow: 4–7s

      gsap.fromTo(ember,
        { opacity: 0, x: 0, y: 0, scale: 0.6 },
        {
          keyframes: [
            { opacity: peakOpacity, duration: dur * 0.2, ease: 'sine.out' },
            { opacity: peakOpacity, scale: 1, duration: dur * 0.5, ease: 'none' },
            { opacity: 0, scale: 0.4, duration: dur * 0.3, ease: 'sine.in' }
          ],
          y: -rise,
          x: sway,
          duration: dur,
          ease: 'sine.out',
          onComplete: () => ember.remove()
        }
      );
    };

    // Sparse, irregular emission — one ember at a time, well spaced out
    const tick = () => {
      createEmber();
      const next = 600 + Math.random() * 900; // every ~0.6–1.5s
      setTimeout(tick, next);
    };
    tick();
  }
};

// Initialize everything on DOM ready
// Photo gallery + lightbox
// Each .photo-slot[data-photo] tries to load its image. If the file exists,
// it overlays the CAD placeholder and becomes clickable → lightbox. If the
// file is missing, the placeholder stays. Drop photos into images/projects/
// to light them up — no markup changes needed.
const Gallery = {
  items: [], // { src, alt, slot }

  init() {
    this.scan();
    if (!this.lightboxBuilt) {
      this.buildLightbox();
      this.lightboxBuilt = true;
    }
  },

  scan() {
    const slots = document.querySelectorAll('.photo-slot[data-photo]:not([data-photo-scanned])');
    slots.forEach((slot) => {
      slot.setAttribute('data-photo-scanned', '1');
      const src = slot.getAttribute('data-photo');
      const alt = slot.getAttribute('data-alt') || '';
      if (!src) return;

      const probe = new Image();
      probe.onload = () => this.activate(slot, src, alt);
      probe.onerror = () => {}; // leave placeholder
      probe.src = src;
    });
  },

  activate(slot, src, alt) {
    const img = document.createElement('img');
    img.className = 'photo-slot__img';
    img.src = src;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    slot.insertBefore(img, slot.firstChild);

    const zoom = document.createElement('span');
    zoom.className = 'photo-slot__zoom';
    zoom.setAttribute('aria-hidden', 'true');
    zoom.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">' +
      '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>';
    slot.appendChild(zoom);

    slot.classList.add('has-photo');

    const index = this.items.length;
    this.items.push({ src, alt });

    slot.setAttribute('role', 'button');
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('aria-label', (alt || 'Loyiha rasmi') + ' — kattalashtirish');
    slot.addEventListener('click', () => this.open(index));
    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.open(index); }
    });
  },

  buildLightbox() {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.id = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Loyiha rasmi');
    lb.innerHTML =
      '<figure class="lightbox__figure">' +
      '  <img class="lightbox__img" id="lightboxImg" src="" alt="">' +
      '  <figcaption class="lightbox__caption" id="lightboxCaption"></figcaption>' +
      '  <button class="lightbox__btn lightbox__close" id="lightboxClose" aria-label="Yopish">' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '  </button>' +
      '  <button class="lightbox__btn lightbox__prev" id="lightboxPrev" aria-label="Oldingi">' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>' +
      '  </button>' +
      '  <button class="lightbox__btn lightbox__next" id="lightboxNext" aria-label="Keyingi">' +
      '    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18l6-6-6-6"/></svg>' +
      '  </button>' +
      '</figure>';
    document.body.appendChild(lb);

    this.el = lb;
    this.imgEl = lb.querySelector('#lightboxImg');
    this.capEl = lb.querySelector('#lightboxCaption');

    lb.querySelector('#lightboxClose').addEventListener('click', () => this.close());
    lb.querySelector('#lightboxPrev').addEventListener('click', () => this.step(-1));
    lb.querySelector('#lightboxNext').addEventListener('click', () => this.step(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) this.close(); });
    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('is-open')) return;
      if (e.key === 'Escape') this.close();
      else if (e.key === 'ArrowLeft') this.step(-1);
      else if (e.key === 'ArrowRight') this.step(1);
    });
  },

  open(index) {
    if (!this.items.length) return;
    this.current = index;
    this.render();
    this.el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    this.el.querySelector('#lightboxClose').focus();
  },

  step(dir) {
    this.current = (this.current + dir + this.items.length) % this.items.length;
    this.render();
  },

  render() {
    const item = this.items[this.current];
    this.imgEl.src = item.src;
    this.imgEl.alt = item.alt;
    this.capEl.textContent = item.alt;
    const multi = this.items.length > 1;
    this.el.querySelector('#lightboxPrev').style.display = multi ? 'grid' : 'none';
    this.el.querySelector('#lightboxNext').style.display = multi ? 'grid' : 'none';
  },

  close() {
    this.el.classList.remove('is-open');
    document.body.style.overflow = '';
  }
};

// Floating contact dock — reveal after the user scrolls past the hero
const ContactDock = {
  init() {
    const dock = document.getElementById('contactDock');
    if (!dock) return;
    const toggle = () => {
      const scrolled = (window.scrollY || document.documentElement.scrollTop) > 400;
      dock.classList.toggle('is-visible', scrolled);
    };
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LanguageManager.init();
  MobileNav.init();
  Navigation.init();
  CounterAnimation.init();
  FormHandler.init();
  ContactDock.init();
  Gallery.init();
  SparkEffect.init();

  // Initialize animations
  if (window.Animations) {
    window.Animations.init();
  }

  console.log('Best Metall - Forged Precision');
});

// When the CMS loader rebuilds repeater nodes (stats, metrics, projects, etc.),
// re-run the counter and gallery wiring so the new nodes animate and load photos.
document.addEventListener('cms:content-applied', () => {
  CounterAnimation.init();
  Gallery.scan();
  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
});
