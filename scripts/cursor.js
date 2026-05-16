/**
 * BEST METALL - CUSTOM CURSOR
 * Industrial ring cursor with magnetic hover effect
 */

class CustomCursor {
  constructor() {
    this.cursor = null;
    this.ring = null;
    this.dot = null;
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.isActive = false;
    this.isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    
    // Magnetic effect settings
    this.magneticStrength = 0.3;
    this.magneticElements = [];
    
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
    // Create cursor elements
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor';
    
    this.ring = document.createElement('div');
    this.ring.className = 'cursor__ring';
    
    this.dot = document.createElement('div');
    this.dot.className = 'cursor__dot';
    
    this.cursor.appendChild(this.ring);
    this.cursor.appendChild(this.dot);
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
    
    // Magnetic effect for buttons
    this.initMagneticEffect();
    
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
  
  initMagneticEffect() {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * this.magneticStrength;
        const deltaY = (e.clientY - centerY) * this.magneticStrength;
        
        el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  animate() {
    if (!this.isActive || !this.cursor) return;
    
    // Smooth interpolation
    const ease = 0.15;
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
  
  // Public method to update magnetic elements (call after dynamic content load)
  refreshMagnetic() {
    if (!this.isTouch) {
      this.initMagneticEffect();
    }
  }
  
  // Public method to update hover targets (call after dynamic content load)
  refreshHoverTargets() {
    if (this.isTouch) return;
    
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [data-cursor="pointer"], .service-card, .project-card, .btn'
    );
    
    interactiveElements.forEach(el => {
      // Remove existing listeners to prevent duplicates
      const newEl = el.cloneNode(true);
      el.parentNode.replaceChild(newEl, el);
      
      newEl.addEventListener('mouseenter', () => {
        this.cursor?.classList.add('cursor--hover');
      });
      
      newEl.addEventListener('mouseleave', () => {
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
