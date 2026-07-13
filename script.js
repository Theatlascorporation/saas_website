'use strict';

(function () {
  var COUNTER_DURATION = 2000;
  var TESTIMONIAL_AUTO_INTERVAL = 5000;

  function debounce(fn, delay) {
    var timer;
    return function () {
      var args = arguments;
      var ctx = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, delay);
    };
  }

  function sanitizeInput(value) {
    return String(value).trim().replace(/[<>"'`]/g, function (c) {
      var map = { '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '`': '&#x60;' };
      return map[c] || c;
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;

    var onLoad = function () {
      loader.classList.add('loader--done');
      setTimeout(function () {
        loader.setAttribute('hidden', '');
        loader.setAttribute('aria-hidden', 'true');
      }, 650);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad, { once: true });
    }
  }

  function initTheme() {
    var toggle = document.getElementById('themeToggle');
    var html = document.documentElement;
    if (!toggle) return;

    var saved = localStorage.getItem('nexus-theme');
    if (saved === 'light' || saved === 'dark') {
      html.setAttribute('data-theme', saved);
    }

    function updateLabel() {
      var current = html.getAttribute('data-theme');
      toggle.setAttribute('aria-label', current === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    updateLabel();

    toggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      try {
        localStorage.setItem('nexus-theme', next);
      } catch (_) {}
      updateLabel();
    });
  }

  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('navMenu');
    if (!hamburger || !menu) return;

    function closeMenu() {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open mobile menu');
      hamburger.classList.remove('nav__hamburger--open');
      menu.classList.remove('nav__menu--open');
    }

    function openMenu() {
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close mobile menu');
      hamburger.classList.add('nav__hamburger--open');
      menu.classList.add('nav__menu--open');
    }

    hamburger.addEventListener('click', function () {
      if (hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        hamburger.focus();
      }
    });
  }

  function initHeader() {
    var header = document.getElementById('header');
    if (!header) return;

    function onScroll() {
      if (window.scrollY > 48) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initSmoothScroll() {
    var header = document.getElementById('header');

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    if (!sections.length || !navLinks.length) return;

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            link.classList.toggle('nav__link--active', href === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stats__number[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) {
        var count = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        el.textContent = count.toLocaleString() + suffix;
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var start = performance.now();

    function update(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / COUNTER_DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  function initTestimonials() {
    var track = document.getElementById('testimonialsTrack');
    var dotsContainer = document.getElementById('testimonialDots');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    if (!track || !dotsContainer || !prevBtn || !nextBtn) return;

    var cards = Array.from(track.querySelectorAll('.testimonial-card'));
    var current = 0;
    var perView = 1;
    var maxIndex = 0;
    var autoTimer = null;

    function getPerView() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640) return 2;
      return 1;
    }

    function slide() {
      var gap = 24;
      var cardWidth = cards[0] ? cards[0].offsetWidth : 0;
      var offset = current * (cardWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';

      prevBtn.disabled = current === 0;
      nextBtn.disabled = current >= maxIndex;
      prevBtn.setAttribute('aria-disabled', String(current === 0));
      nextBtn.setAttribute('aria-disabled', String(current >= maxIndex));

      var dots = dotsContainer.querySelectorAll('.testimonials__dot');
      dots.forEach(function (dot, i) {
        dot.classList.toggle('testimonials__dot--active', i === current);
        dot.setAttribute('aria-selected', String(i === current));
        dot.setAttribute('tabindex', i === current ? '0' : '-1');
      });
    }

    function buildDots() {
      dotsContainer.innerHTML = '';
      for (var i = 0; i <= maxIndex; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('role', 'tab');
        btn.className = 'testimonials__dot' + (i === current ? ' testimonials__dot--active' : '');
        btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        btn.setAttribute('aria-selected', String(i === current));
        btn.setAttribute('tabindex', i === current ? '0' : '-1');
        (function (index) {
          btn.addEventListener('click', function () {
            current = index;
            resetAutoPlay();
            slide();
          });
        })(i);
        dotsContainer.appendChild(btn);
      }
    }

    function setup() {
      perView = getPerView();
      maxIndex = Math.max(0, cards.length - perView);
      current = Math.min(current, maxIndex);

      var gap = 24;
      var trackWidth = track.parentElement.offsetWidth;
      var cardWidth = Math.floor((trackWidth - gap * (perView - 1)) / perView);

      cards.forEach(function (card) {
        card.style.width = cardWidth + 'px';
        card.style.minWidth = cardWidth + 'px';
      });

      buildDots();
      slide();
    }

    function resetAutoPlay() {
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        current = current >= maxIndex ? 0 : current + 1;
        slide();
      }, TESTIMONIAL_AUTO_INTERVAL);
    }

    prevBtn.addEventListener('click', function () {
      if (current > 0) { current--; resetAutoPlay(); slide(); }
    });

    nextBtn.addEventListener('click', function () {
      if (current < maxIndex) { current++; resetAutoPlay(); slide(); }
    });

    var touchStartX = 0;
    var touchStartY = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var dx = touchStartX - e.changedTouches[0].clientX;
      var dy = Math.abs(touchStartY - e.changedTouches[0].clientY);
      if (Math.abs(dx) > 45 && Math.abs(dx) > dy) {
        if (dx > 0 && current < maxIndex) { current++; }
        else if (dx < 0 && current > 0) { current--; }
        resetAutoPlay();
        slide();
      }
    }, { passive: true });

    dotsContainer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' && current < maxIndex) { current++; resetAutoPlay(); slide(); }
      if (e.key === 'ArrowLeft' && current > 0) { current--; resetAutoPlay(); slide(); }
    });

    window.addEventListener('resize', debounce(setup, 200));

    setup();
    resetAutoPlay();

    track.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
    track.addEventListener('mouseleave', resetAutoPlay);
  }

  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var question = item.querySelector('.faq-item__question');
      var answer = item.querySelector('.faq-item__answer');
      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isOpen = question.getAttribute('aria-expanded') === 'true';

        items.forEach(function (other) {
          var q = other.querySelector('.faq-item__question');
          var a = other.querySelector('.faq-item__answer');
          if (q && a) {
            q.setAttribute('aria-expanded', 'false');
            a.style.maxHeight = null;
            other.classList.remove('faq-item--open');
          }
        });

        if (!isOpen) {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          item.classList.add('faq-item--open');
        }
      });
    });
  }

  function initPricing() {
    var toggle = document.getElementById('pricingSwitch');
    var amounts = document.querySelectorAll('.pricing-card__amount');
    if (!toggle || !amounts.length) return;

    var isAnnual = false;

    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      toggle.setAttribute('aria-pressed', String(isAnnual));
      toggle.classList.toggle('pricing__switch--active', isAnnual);

      amounts.forEach(function (el) {
        var price = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
        el.textContent = price;
      });
    });
  }

  function initForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var submitBtn = document.getElementById('submitBtn');
    var successEl = document.getElementById('formSuccess');

    function getErrorEl(inputId) {
      return document.getElementById(inputId + '-error');
    }

    function showError(input, message) {
      var errorEl = getErrorEl(input.id);
      if (errorEl) {
        errorEl.textContent = message;
      }
      input.classList.add('form__input--error');
      input.setAttribute('aria-invalid', 'true');
    }

    function clearError(input) {
      var errorEl = getErrorEl(input.id);
      if (errorEl) {
        errorEl.textContent = '';
      }
      input.classList.remove('form__input--error');
      input.setAttribute('aria-invalid', 'false');
    }

    function showConsentError(message) {
      var errorEl = document.getElementById('consent-error');
      if (errorEl) errorEl.textContent = message;
    }

    function clearConsentError() {
      var errorEl = document.getElementById('consent-error');
      if (errorEl) errorEl.textContent = '';
    }

    function validateField(input) {
      var rawValue = input.value;
      var value = sanitizeInput(rawValue);

      if (input.type === 'checkbox') {
        if (!input.checked) {
          showConsentError('You must agree to the terms to continue.');
          return false;
        }
        clearConsentError();
        return true;
      }

      if (input.required && !value) {
        showError(input, 'This field is required.');
        return false;
      }

      if (input.id === 'name') {
        if (value.length < 2) {
          showError(input, 'Name must be at least 2 characters.');
          return false;
        }
        if (!/^[a-zA-ZÀ-ÿ\s'-]{2,80}$/.test(value)) {
          showError(input, 'Please enter a valid name.');
          return false;
        }
      }

      if (input.type === 'email') {
        if (!isValidEmail(value)) {
          showError(input, 'Please enter a valid email address.');
          return false;
        }
      }

      if (input.id === 'message') {
        if (value.length < 20) {
          showError(input, 'Message must be at least 20 characters.');
          return false;
        }
        if (value.length > 2000) {
          showError(input, 'Message must be under 2000 characters.');
          return false;
        }
      }

      if (input.tagName === 'SELECT' && input.required && !value) {
        showError(input, 'Please select an option.');
        return false;
      }

      clearError(input);
      return true;
    }

    var fields = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    fields.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('form__input--error')) {
          validateField(input);
        }
      });
    });

    var consentInput = form.querySelector('#consent');
    if (consentInput) {
      consentInput.addEventListener('change', function () { validateField(consentInput); });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allInputs = Array.from(form.querySelectorAll('input, select, textarea'));
      var isValid = true;

      allInputs.forEach(function (input) {
        if (input.name && !validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        var firstError = form.querySelector('.form__input--error, input[aria-invalid="true"]');
        if (firstError) firstError.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn--loading');
      }

      setTimeout(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn--loading');
        }
        form.reset();

        if (successEl) {
          successEl.innerHTML = '<svg width="18" height="18" stroke-width="2.5" aria-hidden="true"><use href="#icon-check"/></svg><span>Thank you! We\'ll be in touch within 24 hours.</span>';
          successEl.classList.add('form__success--visible');

          setTimeout(function () {
            successEl.classList.remove('form__success--visible');
            setTimeout(function () { successEl.innerHTML = ''; }, 400);
          }, 6000);
        }
      }, 1600);
    });
  }

  function initRipple() {
    document.querySelectorAll('.btn--primary, .btn--outline').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var x = e.clientX - rect.left - size / 2;
        var y = e.clientY - rect.top - size / 2;

        var ripple = document.createElement('span');
        ripple.classList.add('btn__ripple');
        ripple.style.cssText = [
          'width:' + size + 'px',
          'height:' + size + 'px',
          'left:' + x + 'px',
          'top:' + y + 'px'
        ].join(';');

        var existing = btn.querySelector('.btn__ripple');
        if (existing) existing.remove();

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', function () { ripple.remove(); });
      });
    });
  }

  function initLazyLoad() {
    var images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(function (img) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          img.classList.add('img--loaded');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    images.forEach(function (img) { observer.observe(img); });
  }

  function initFooterYear() {
    var el = document.getElementById('currentYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });

    document.addEventListener('mousedown', function () {
      document.body.classList.remove('using-keyboard');
    });
  }

  function init() {
    initLoader();
    initTheme();
    initMobileMenu();
    initHeader();
    initSmoothScroll();
    initScrollReveal();
    initActiveNav();
    initCounters();
    initTestimonials();
    initFAQ();
    initPricing();
    initForm();
    initRipple();
    initLazyLoad();
    initFooterYear();
    initKeyboardNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
