/**
 * BEST METALL - MAIN APPLICATION
 * Application logic, smooth scroll, language toggle, mobile nav
 */

// Initialize Lenis smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP ScrollTrigger integration with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Language Management
const LanguageManager = {
  currentLang: localStorage.getItem('bestmetall-lang') || 'ru',
  
  init() {
    this.applyLanguage(this.currentLang);
    this.setupToggle();
    this.updateToggleUI();
  },
  
  setupToggle() {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        this.currentLang = this.currentLang === 'ru' ? 'en' : 'ru';
        localStorage.setItem('bestmetall-lang', this.currentLang);
        this.applyLanguage(this.currentLang);
        this.updateToggleUI();
      });
    }
  },
  
  updateToggleUI() {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      const current = toggle.querySelector('.lang-toggle__current');
      const other = toggle.querySelector('.lang-toggle__other');
      if (current && other) {
        current.textContent = this.currentLang.toUpperCase();
        other.textContent = this.currentLang === 'ru' ? 'EN' : 'RU';
      }
    }
  },
  
  applyLanguage(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.getTranslation(lang, key);
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.textContent = translation;
        }
      }
    });
    
    // Re-trigger text animations if needed
    if (window.splitTextAnimations) {
      window.splitTextAnimations.refresh();
    }
  },
  
  getTranslation(lang, key) {
    const keys = key.split('.');
    let value = translations[lang];
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
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        if (!name || !phone) {
          this.showMessage('Пожалуйста, заполните все обязательные поля', 'error');
          return;
        }
        
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
        setTimeout(() => {
          this.showMessage('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
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

// Spark effect for hero
const SparkEffect = {
  init() {
    const container = document.getElementById('sparks');
    if (!container) return;
    
    const createSpark = () => {
      const spark = document.createElement('div');
      spark.className = 'spark';
      
      // Random position
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      spark.style.left = `${x}%`;
      spark.style.top = `${y}%`;
      
      container.appendChild(spark);
      
      // Animate
      gsap.fromTo(spark,
        { 
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0
        },
        {
          opacity: 1,
          scale: 1,
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          duration: 1 + Math.random(),
          ease: 'power2.out',
          onComplete: () => spark.remove()
        }
      );
    };
    
    // Create sparks periodically
    setInterval(createSpark, 300);
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
  
  // Initialize cursor (if not touch device)
  if (!window.matchMedia('(pointer: coarse)').matches) {
    Cursor.init();
  }
  
  // Initialize animations
  if (window.Animations) {
    window.Animations.init();
  }
  
  console.log('🦊 Best Metall - Forged Precision');
});