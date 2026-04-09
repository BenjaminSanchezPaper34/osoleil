/* ============================================
   Brasserie O'Soleil — JS principal
   Menu mobile + Scroll reveal + Header effect
   ============================================ */
(function () {
  'use strict';

  /* --- Menu mobile --- */
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  var overlay = document.getElementById('nav-overlay');

  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav && overlay) {
    toggle.addEventListener('click', function () {
      nav.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
  }

  /* --- Header scroll effect --- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Scroll reveal animations --- */
  var reveals = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reveals.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback : tout visible si pas d'IntersectionObserver */
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();
