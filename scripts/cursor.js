/**
 * BEST METALL - CUSTOM CURSOR
 * CMM Probe / Stylus cursor (precision manufacturing aesthetic)
 */

class CustomCursor {
  constructor() {
    this.cursor = null;
    this.tip = null;
    this.shaft = null;
    this.glow = null;
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.isActive = false;
    this.isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    // Animation frame ID
    this.rafId = null;

    this.init();
  }

  init() {
    // Don't initialize on touch devices
    if (this.isTouch) return;

    this.createCursor();
    this.bindEvents();
    this.animate();
  }

  createCursor() {
    // Main cursor container
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor';

    // Ambient glow (behind everything)
    this.glow = document.createElement('div');
    this.glow.className = 'cursor__glow';

    // Stylus shaft (thin diagonal line)
    this.shaft = document.createElement('div');
    this.shaft.className = 'cursor__shaft';

    // Probe tip (ruby sphere)
    this.tip = document.createElement('div');
    this.tip.className = 'cursor__tip';

    this.cursor.appendChild(this.glow);
    this.cursor.appendChild(this.shaft);
    this.cursor.appendChild(this.tip);
    document.body.appendChild(this.cursor);

    this.isActive = true;
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.target.x = e.clientX;
      this.target.y = e.clientY;
    }, { passive: true });

    // Mouse down/up
    document.addEventListener('mousedown', () => {
      this.cursor?.classList.add('cursor--click');
    });

    document.addEventListener('mouseup', () => {
      this.cursor?.classList.remove('cursor--click');
    });

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"], .service-card, .project-card, .btn'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor?.classList.add('cursor--hover');
      });

      el.addEventListener('mouseleave', () => {
        this.cursor?.classList.remove('cursor--hover');
      });
    });

    // Handle visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isActive = false;
      } else {
        this.isActive = true;
        this.animate();
      }
    });

    // Cleanup on page hide
    window.addEventListener('beforeunload', () => {
      this.destroy();
    });
  }

  animate() {
    if (!this.isActive || !this.cursor) return;

    // Smooth interpolation
    const ease = 0.18;
    this.pos.x += (this.target.x - this.pos.x) * ease;
    this.pos.y += (this.target.y - this.pos.y) * ease;

    // Apply transform
    this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.cursor) {
      this.cursor.remove();
    }
    this.isActive = false;
  }

  // Public method to update hover targets (call after dynamic content load)
  refreshHoverTargets() {
    if (this.isTouch) return;

    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"], .service-card, .project-card, .btn'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor?.classList.add('cursor--hover');
      });

      el.addEventListener('mouseleave', () => {
        this.cursor?.classList.remove('cursor--hover');
      });
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.customCursor = new CustomCursor();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomCursor;
}
