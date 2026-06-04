/* Lebendiges Wissen — Shared JS */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll Reveal ---- */
  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (reduce) { els.forEach(function (el) { el.classList.add('visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = parseInt(e.target.getAttribute('data-delay') || '0', 10);
          e.target.style.transitionDelay = d + 'ms';
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () { els.forEach(function (el) { el.classList.add('visible'); }); }, 2500);
  }

  /* ---- Count-Up Numbers ---- */
  function initCountUp() {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduce) { el.textContent = target.toLocaleString('de-DE') + suffix; return; }
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && !started) {
            started = true; io.disconnect();
            var t0 = performance.now();
            function tick(now) {
              var p = Math.min(1, (now - t0) / 1400);
              var eased = 1 - Math.pow(1 - p, 3);
              el.textContent = Math.round(target * eased).toLocaleString('de-DE') + suffix;
              if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
        });
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }

  /* ---- FAQ Accordion (single-open) ---- */
  function initFaq() {
    var allBtns = document.querySelectorAll('.faq-question');
    allBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        allBtns.forEach(function (other) {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            var a = other.nextElementSibling;
            if (a) a.classList.remove('open');
          }
        });
        btn.setAttribute('aria-expanded', String(!expanded));
        var answer = btn.nextElementSibling;
        if (answer) answer.classList.toggle('open', !expanded);
      });
    });
  }

  /* ---- Mobile Nav Toggle ---- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var open = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    // Close on link click
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  /* ---- Init ---- */
  function init() { initReveals(); initCountUp(); initFaq(); initNav(); initSmoothScroll(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
