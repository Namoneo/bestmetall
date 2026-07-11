/**
 * BEST METALL - GSAP ANIMATIONS
 * Cinematic scroll animations and effects
 */

window.Animations = {
  init() {
    this.initHeroAnimations();
    this.initSectionReveals();
    this.initParallax();
    this.initProcessTimeline();
    this.initServiceCards();
    this.initProjectCards();
    this.initMetricsAnimation();
    this.initEquipment();
    this.initMarquee();
  },

  // Hero entrance animations
  initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Tech bar badges
    tl.fromTo('.hero__tech-bar',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6 }
    );

    // Label (legacy)
    tl.fromTo('.hero__label',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.2'
    );

    // Title lines
    const titleLines = document.querySelectorAll('.hero__title-line');
    titleLines.forEach((line) => {
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

    // Weld line under title
    tl.fromTo('.hero__content .weld-line',
      { opacity: 0, scaleX: 0 },
      { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'center center' },
      '-=0.3'
    );

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
    // About visual
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
    // Blueprint parallax in about (target the wrap not the svg)
    const aboutBlueprint = document.querySelector('.about__blueprint, .about__blueprint-wrap');
    if (aboutBlueprint) {
      gsap.to(aboutBlueprint, {
        scrollTrigger: {
          trigger: '.about',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: -40
      });
    }

    // Metrics blueprint
    document.querySelectorAll('.metric-card__blueprint').forEach((bp, i) => {
      gsap.to(bp, {
        scrollTrigger: {
          trigger: bp.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        rotation: 10 + (i * 5)
      });
    });
  },

  // Vertical timeline process section (replaces horizontal scroll)
  initProcessTimeline() {
    const timeline = document.querySelector('.process__timeline');
    if (!timeline) return;

    const steps = timeline.querySelectorAll('.process__step');

    steps.forEach((step, i) => {
      const marker = step.querySelector('.process__step-marker');
      const content = step.querySelector('.process__step-content');

      gsap.fromTo(step,
        { opacity: 0, y: 40 },
        {
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            once: true
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out'
        }
      );

      if (marker) {
        gsap.fromTo(marker,
          { scale: 0.4, opacity: 0 },
          {
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              once: true
            },
            scale: 1,
            opacity: 1,
            duration: 0.7,
            delay: 0.1,
            ease: 'back.out(1.6)'
          }
        );
      }

      if (content) {
        gsap.fromTo(content,
          { x: 24, opacity: 0 },
          {
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              once: true
            },
            x: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.15,
            ease: 'power3.out'
          }
        );
      }
    });

    // Animate the connecting vertical line itself
    const line = document.querySelector('.process__line');
    if (line) {
      gsap.fromTo(line,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scrollTrigger: {
            trigger: timeline,
            start: 'top 70%',
            end: 'bottom 70%',
            scrub: 0.5
          },
          scaleY: 1
        }
      );
    }
  },

  // Service cards
  initServiceCards() {
    const cards = document.querySelectorAll('.service-card');

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

    cards.forEach(card => {
      const shine = card.querySelector('.service-card__shine');

      card.addEventListener('mouseenter', () => {
        if (shine) {
          gsap.fromTo(shine,
            { x: '-100%' },
            { x: '100%', duration: 0.6, ease: 'power2.inOut' }
          );
        }

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

      // Mouse position for radial glow
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  },

  // Project cards
  initProjectCards() {
    const cards = document.querySelectorAll('.project-card');

    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.97 },
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
  },

  // Equipment cards (stagger reveal)
  initEquipment() {
    const cards = document.querySelectorAll('.equipment-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
      { opacity: 0, y: 40 },
      {
        scrollTrigger: {
          trigger: '.equipment__grid',
          start: 'top 80%',
          once: true
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      }
    );
  },

  // Marquee: fade-in only (animation itself is CSS-driven)
  initMarquee() {
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(m => {
      gsap.fromTo(m,
        { opacity: 0 },
        {
          scrollTrigger: {
            trigger: m,
            start: 'top 95%',
            once: true
          },
          opacity: 1,
          duration: 1,
          ease: 'power2.out'
        }
      );
    });
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
