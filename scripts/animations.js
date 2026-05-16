/**
 * BEST METALL - GSAP ANIMATIONS
 * Cinematic scroll animations and effects
 */

window.Animations = {
  init() {
    this.initHeroAnimations();
    this.initSectionReveals();
    this.initParallax();
    this.initProcessHorizontalScroll();
    this.initServiceCards();
    this.initProjectCards();
    this.initMetricsAnimation();
  },

  // Hero entrance animations
  initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Label
    tl.fromTo('.hero__label', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
    
    // Title lines with SplitType effect
    const titleLines = document.querySelectorAll('.hero__title-line');
    titleLines.forEach((line, i) => {
      tl.fromTo(line,
        { 
          opacity: 0, 
          y: 100,
          rotateX: -45
        },
        { 
          opacity: 1, 
          y: 0,
          rotateX: 0,
          duration: 1,
          ease: 'power4.out'
        },
        `-=${0.6}`
      );
    });
    
    // Subtitle
    tl.fromTo('.hero__subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    );
    
    // Buttons
    tl.fromTo('.hero__actions .btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    );
    
    // Scroll indicator
    tl.fromTo('.hero__scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2'
    );
    
    // Stats
    tl.fromTo('.hero__stat',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    );
    
    // Hero parallax on scroll
    gsap.to('.hero__title', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      y: 200,
      opacity: 0
    });
    
    gsap.to('.hero__bg', {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      },
      scale: 1.2
    });
  },

  // Section reveal animations
  initSectionReveals() {
    // About section
    gsap.fromTo('.about__visual',
      { opacity: 0, x: -50 },
      {
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          once: true
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
      }
    );
    
    gsap.fromTo('.about__content',
      { opacity: 0, x: 50 },
      {
        scrollTrigger: {
          trigger: '.about',
          start: 'top 70%',
          once: true
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out'
      }
    );
    
    gsap.fromTo('.about__feature',
      { opacity: 0, y: 30 },
      {
        scrollTrigger: {
          trigger: '.about__features',
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
    
    // Section labels and titles
    document.querySelectorAll('.section__label, .section__title').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out'
        }
      );
    });
  },

  // Parallax effects
  initParallax() {
    // Blueprint parallax in about
    gsap.to('.about__blueprint', {
      scrollTrigger: {
        trigger: '.about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      rotation: 15,
      y: -50
    });
    
    // Metrics blueprint
    document.querySelectorAll('.metric-card__blueprint').forEach((bp, i) => {
      gsap.to(bp, {
        scrollTrigger: {
          trigger: bp.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        rotation: 10 + (i * 5),
        scale: 1.1
      });
    });
  },

  // Horizontal scroll process section
  initProcessHorizontalScroll() {
    const wrapper = document.getElementById('processWrapper');
    const track = document.getElementById('processTrack');
    const progress = document.getElementById('processProgress');
    
    if (!wrapper || !track) return;
    
    const steps = track.querySelectorAll('.process__step');
    const totalWidth = track.scrollWidth - window.innerWidth;
    
    // Horizontal scroll animation
    const scrollTween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (progress) {
            progress.style.width = `${self.progress * 100}%`;
          }
        }
      }
    });
    
    // Step animations
    steps.forEach((step, i) => {
      gsap.fromTo(step.querySelector('.process__step-number'),
        { scale: 0.8, opacity: 0.5 },
        {
          scrollTrigger: {
            trigger: step,
            containerAnimation: scrollTween,
            start: 'left center',
            end: 'right center',
            scrub: true
          },
          scale: 1,
          opacity: 1
        }
      );
    });
  },

  // Service cards hover and reveal
  initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    
    // Reveal animation
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: '.services__grid',
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
    
    // Shine effect on hover
    cards.forEach(card => {
      const shine = card.querySelector('.service-card__shine');
      
      card.addEventListener('mouseenter', () => {
        gsap.fromTo(shine,
          { x: '-100%' },
          { x: '100%', duration: 0.6, ease: 'power2.inOut' }
        );
        
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  },

  // Project cards
  initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        scrollTrigger: {
          trigger: '.projects__grid',
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      }
    );
    
    // Grayscale to color on hover
    cards.forEach(card => {
      const image = card.querySelector('.project-card__image');
      
      card.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.1,
          filter: 'grayscale(0%)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          filter: 'grayscale(100%)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
    });
  },

  // Metrics section
  initMetricsAnimation() {
    gsap.fromTo('.metric-card',
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: '.metrics__grid',
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      }
    );
  }
};

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Refresh ScrollTrigger on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});