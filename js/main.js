/* ===== SHOTBYTEDDY.COM — Main JavaScript ===== */

// --- Mobile Navigation ---
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Lightbox Gallery ---
class Lightbox {
  constructor() {
    this.overlay = document.querySelector('.lightbox-overlay');
    if (!this.overlay) return;

    this.image = this.overlay.querySelector('.lightbox-image');
    this.counter = this.overlay.querySelector('.lightbox-counter');
    this.closeBtn = this.overlay.querySelector('.lightbox-close');
    this.prevBtn = this.overlay.querySelector('.lightbox-prev');
    this.nextBtn = this.overlay.querySelector('.lightbox-next');

    this.items = [];
    this.currentIndex = 0;

    this.init();
  }

  init() {
    // Collect all gallery items on the page
    document.querySelectorAll('.grid-item[data-lightbox]').forEach((item, i) => {
      this.items.push({
        src: item.dataset.lightbox,
        alt: item.querySelector('img')?.alt || ''
      });
      item.addEventListener('click', () => this.open(i));
    });

    if (this.items.length === 0) return;

    // Controls
    this.closeBtn?.addEventListener('click', () => this.close());
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    // Click outside image to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch/swipe support
    let touchStartX = 0;
    this.overlay.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.overlay.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.prev() : this.next();
      }
    }, { passive: true });
  }

  open(index) {
    this.currentIndex = index;
    this.update();
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.update();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.update();
  }

  update() {
    const item = this.items[this.currentIndex];
    this.image.src = item.src;
    this.image.alt = item.alt;
    if (this.counter) {
      this.counter.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
  }
}

// --- Lazy Loading ---
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => imageObserver.observe(img));
}

// --- Active Nav Link ---
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
    link.classList.add('active');
  } else if (currentPath.startsWith('/portfolio') && href === '/portfolio') {
    link.classList.add('active');
  }
});

// --- Initialize Lightbox ---
document.addEventListener('DOMContentLoaded', () => {
  new Lightbox();
});
