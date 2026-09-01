/* ====================================================
   NOSHERWAN ADIL — PORTFOLIO INTERACTIONS
   Preloader, Aurora, Theme, Scroll, Counters, Menu
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------
     1. PRELOADER
     ------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  const nodes = document.querySelectorAll('.preloader-node');
  const lines = document.querySelectorAll('.preloader-line');
  const statusText = document.querySelector('.preloader-status');

  const labels = ['Initializing...', 'Loading Modules...', 'Preparing Portfolio...', 'System Ready'];
  let step = 0;

  function advancePreloader() {
    if (step < nodes.length) {
      nodes[step].classList.add('active');
      if (step > 0 && lines[step - 1]) {
        lines[step - 1].classList.add('filled');
      }
      statusText.textContent = labels[step] || labels[labels.length - 1];
      step++;
      setTimeout(advancePreloader, 700);
    } else {
      statusText.textContent = labels[labels.length - 1];
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
      }, 500);
    }
  }

  document.body.style.overflow = 'hidden';
  setTimeout(advancePreloader, 400);

  /* ------------------------------------------------
     2. AURORA BOREALIS CANVAS
     ------------------------------------------------ */
  const canvas = document.getElementById('aurora-canvas');
  const ctx = canvas.getContext('2d');
  let w, h;
  const blobs = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create blobs
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  function getColors() {
    if (isDark()) {
      return [
        { r: 30, g: 60, b: 180, a: 0.12 },
        { r: 60, g: 120, b: 235, a: 0.08 },
        { r: 20, g: 40, b: 120, a: 0.1 },
        { r: 100, g: 60, b: 200, a: 0.06 },
      ];
    }
    return [
      { r: 180, g: 210, b: 255, a: 0.18 },
      { r: 200, g: 230, b: 255, a: 0.12 },
      { r: 160, g: 190, b: 240, a: 0.15 },
      { r: 210, g: 200, b: 255, a: 0.1 },
    ];
  }

  for (let i = 0; i < 4; i++) {
    blobs.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 250 + Math.random() * 200,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.3,
    });
  }

  function drawAurora() {
    ctx.clearRect(0, 0, w, h);
    const colors = getColors();
    blobs.forEach((b, i) => {
      b.x += b.dx;
      b.y += b.dy;
      if (b.x < -b.r) b.x = w + b.r;
      if (b.x > w + b.r) b.x = -b.r;
      if (b.y < -b.r) b.y = h + b.r;
      if (b.y > h + b.r) b.y = -b.r;

      const c = colors[i % colors.length];
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${c.a})`);
      grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
    requestAnimationFrame(drawAurora);
  }
  drawAurora();

  /* ------------------------------------------------
     3. THEME TOGGLE
     ------------------------------------------------ */
  const themeBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('na-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('na-theme', next);
  });

  /* ------------------------------------------------
     4. READING PROGRESS BAR
     ------------------------------------------------ */
  const progressBar = document.getElementById('reading-progress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  });

  /* ------------------------------------------------
     5. SCROLL ANIMATIONS (Intersection Observer)
     ------------------------------------------------ */
  const animateEls = document.querySelectorAll('.animate-in');

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  animateEls.forEach(el => scrollObserver.observe(el));

  /* ------------------------------------------------
     6. COUNTER ANIMATION
     ------------------------------------------------ */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        let current = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ------------------------------------------------
     7. MOBILE MENU
     ------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ------------------------------------------------
     8. ACTIVE NAV LINK ON SCROLL
     ------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(sec => navObserver.observe(sec));

});
