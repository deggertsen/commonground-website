/* ========================================================
   Common Ground — Scripts
   ======================================================== */
(function () {
  'use strict';

  /* --- Smooth scroll for anchor links --- */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var id = anchor.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Close mobile nav if open
    closeMobileNav();

    // Update URL without jump
    history.pushState(null, '', id);
  });

  /* --- Fade-in-on-scroll (IntersectionObserver) --- */
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* --- Mobile hamburger nav toggle --- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.hidden = true;
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      mobileNav.hidden = expanded;
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!mobileNav.hidden && !mobileNav.contains(e.target) && !toggle.contains(e.target)) {
        closeMobileNav();
      }
    });
  }

  /* --- Header background change on scroll (elevate effect) --- */
  var header = document.querySelector('[data-elevate]');

  if (header) {
    var elevateThreshold = 40;

    function checkScroll() {
      if (window.scrollY > elevateThreshold) {
        header.classList.add('elevated');
      } else {
        header.classList.remove('elevated');
      }
    }

    // Use passive listener for performance
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll(); // Run on load
  }

  /* --- Form validation / UX --- */
  var form = document.getElementById('leadForm');
  var status = document.getElementById('formStatus');

  if (form) {
    // Clear invalid state on input
    form.addEventListener('input', function (e) {
      var field = e.target;
      if (field.classList.contains('invalid')) {
        field.classList.remove('invalid');
      }
      if (status) {
        status.textContent = '';
        status.className = 'form-status';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll('[required]');
      var firstInvalid = null;

      fields.forEach(function (field) {
        field.classList.remove('invalid');

        var isEmpty = !field.value.trim();
        var isEmailBad = field.type === 'email' && field.value.trim() && !isValidEmail(field.value);
        var isNumberBad = field.type === 'number' && field.value.trim() && Number(field.value) < 1;

        if (isEmpty || isEmailBad || isNumberBad) {
          field.classList.add('invalid');
          if (!firstInvalid) firstInvalid = field;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        if (status) {
          status.textContent = 'Please fill in all required fields correctly.';
          status.className = 'form-status error';
        }
        return;
      }

      // Simulate submission (replace with real endpoint)
      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      setTimeout(function () {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = 'Schedule a Free Audit';
        }
        if (status) {
          status.textContent = 'Thank you! We\'ll be in touch shortly.';
          status.className = 'form-status success';
        }
        showToast();
      }, 800);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --- Toast --- */
  function showToast() {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.hidden = false;
    setTimeout(function () {
      toast.hidden = true;
    }, 5000);
  }

  /* --- Footer year --- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
