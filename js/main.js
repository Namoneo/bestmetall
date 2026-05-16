/* ========================================
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initNavigation();
  initScrollAnimations();
  initCounters();
  initForms();
  initModal();
  initSmoothScroll();
});

/* Navigation */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  
  // Header scroll effect
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Scroll Animations */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  animatedElements.forEach(el => observer.observe(el));
}

/* Counter Animation */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString() + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + suffix;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => observer.observe(counter));
}

/* Forms */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const callbackForm = document.getElementById('callbackForm');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetForm');
  
  // Phone input mask
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 0) {
        if (value[0] === '9' || value[0] === '7') {
          value = '998' + value.substring(0, 9);
        }
        
        let formattedValue = '+' + value.substring(0, 3);
        if (value.length > 3) {
          formattedValue += ' (' + value.substring(3, 5);
        }
        if (value.length > 5) {
          formattedValue += ') ' + value.substring(5, 8);
        }
        if (value.length > 8) {
          formattedValue += '-' + value.substring(8, 10);
        }
        if (value.length > 10) {
          formattedValue += '-' + value.substring(10, 12);
        }
        
        e.target.value = formattedValue;
      }
    });
  });
  
  // Contact form
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Simple validation
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      
      if (name && phone) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }
  
  // Reset form button
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', function() {
      contactForm.reset();
      contactForm.style.display = 'block';
      formSuccess.style.display = 'none';
    });
  }
  
  // Callback form
  if (callbackForm) {
    callbackForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = callbackForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Отправка...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        alert('Заявка принята! Мы свяжемся с вами в ближайшее время.');
        callbackForm.reset();
        closeModal();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
}

/* Modal */
function initModal() {
  const openCallbackBtn = document.getElementById('openCallbackModal');
  const closeCallbackBtn = document.getElementById('closeCallbackModal');
  const modal = document.getElementById('callbackModal');
  
  if (openCallbackBtn && modal) {
    openCallbackBtn.addEventListener('click', openModal);
  }
  
  if (closeCallbackBtn && modal) {
    closeCallbackBtn.addEventListener('click', closeModal);
  }
  
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal || e.target.classList.contains('modal__backdrop')) {
        closeModal();
      }
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal() {
  const modal = document.getElementById('callbackModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('callbackModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* Smooth Scroll */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerHeight = document.getElementById('header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          const navMenu = document.getElementById('navMenu');
          const navToggle = document.getElementById('navToggle');
          
          if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }
      }
    });
  });
}

/* Utility: Throttle function */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* Utility: Debounce function */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* Handle resize */
window.addEventListener('resize', debounce(() => {
  // Recalculate any layout-dependent values
}, 250));
