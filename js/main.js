/* =====================================================
   VANTAGE AI GROUP — main.js
   ===================================================== */
(function () {
  'use strict';

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = ['home', 'about', 'services', 'agents', 'pricing', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navLinkEls = Array.prototype.slice.call(links.querySelectorAll('.nav__link'));

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navLinkEls.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(function (s) { spy.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObs = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = (Math.min(i, 4) * 0.07) + 's';
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObs.observe(el); });

  /* ---------- Animated stat counters ---------- */
  function formatNum(n) {
    return n >= 1000 ? Math.round(n).toLocaleString() : String(Math.round(n));
  }
  var counted = false;
  var statObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || counted) return;
      counted = true;
      document.querySelectorAll('.stat__num').forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var dur = 1500, start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = formatNum(target * eased);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = formatNum(target);
        }
        requestAnimationFrame(tick);
      });
    });
  }, { threshold: 0.4 });
  var statsSection = document.querySelector('.stats');
  if (statsSection) statObs.observe(statsSection);

  /* ---------- Booking form ---------- */
  var form = document.getElementById('bookingForm');
  if (form) {
    // Set min date to today
    var dateInput = document.getElementById('date');
    if (dateInput) {
      var today = new Date();
      var iso = today.toISOString().split('T')[0];
      dateInput.min = iso;
    }

    function validateField(field) {
      var wrap = field.closest('.field');
      var valid = field.checkValidity() && field.value.trim() !== '';
      if (wrap) wrap.classList.toggle('is-invalid', !valid);
      return valid;
    }

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        var wrap = field.closest('.field');
        if (wrap && wrap.classList.contains('is-invalid')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        if (!validateField(field)) ok = false;
      });
      if (!ok) {
        var firstBad = form.querySelector('.field.is-invalid');
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      // Success state (front-end demo — wire to your booking backend / Calendly here)
      var success = document.getElementById('formSuccess');
      if (success) success.hidden = false;
      form.querySelector('.btn').disabled = true;
    });
  }

  /* ---------- Voice agent demos ----------
     NOTE: This is a front-end placeholder. It uses the browser's built-in
     speech synthesis so each robot "speaks" a sample line — no backend.
     Swap this out for your real voice-agent integration when ready. */
  var demoBtns = document.querySelectorAll('.agent-demo');
  if (demoBtns.length) {
    var synth = window.speechSynthesis;

    function clearSpeaking() {
      document.querySelectorAll('.agent-card.is-speaking').forEach(function (c) {
        c.classList.remove('is-speaking');
        var b = c.querySelector('.agent-demo');
        if (b) b.setAttribute('aria-pressed', 'false');
      });
    }

    function pickVoice(gender) {
      if (!synth) return null;
      var voices = synth.getVoices() || [];
      if (!voices.length) return null;
      var en = voices.filter(function (v) { return /^en/i.test(v.lang); });
      var pool = en.length ? en : voices;
      var female = ['female', 'samantha', 'victoria', 'zira', 'aria', 'jenny', 'susan', 'karen', 'moira', 'tessa', 'fiona', 'female'];
      var male = ['male', 'david', 'mark', 'daniel', 'alex', 'fred', 'rishi', 'arthur', 'george', 'guy'];
      var hints = gender === 'male' ? male : female;
      var match = pool.find(function (v) {
        var n = v.name.toLowerCase();
        return hints.some(function (h) { return n.indexOf(h) > -1; });
      });
      if (match) return match;
      // fallback: spread voices so agents don't all sound identical
      return gender === 'male' ? (pool[1] || pool[0]) : pool[0];
    }

    demoBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.agent-card');
        var wasSpeaking = card.classList.contains('is-speaking');
        if (synth) synth.cancel();
        clearSpeaking();
        if (wasSpeaking) return; // second click = stop

        card.classList.add('is-speaking');
        btn.setAttribute('aria-pressed', 'true');

        var safety;
        function finish() {
          card.classList.remove('is-speaking');
          btn.setAttribute('aria-pressed', 'false');
          clearTimeout(safety);
        }

        if (synth && 'SpeechSynthesisUtterance' in window) {
          var u = new SpeechSynthesisUtterance(btn.getAttribute('data-line') || 'Hello!');
          u.pitch = parseFloat(btn.getAttribute('data-pitch') || '1');
          u.rate = parseFloat(btn.getAttribute('data-rate') || '1');
          var v = pickVoice(btn.getAttribute('data-gender') || 'female');
          if (v) u.voice = v;
          u.onend = finish;
          u.onerror = finish;
          safety = setTimeout(finish, 9000); // in case onend never fires
          synth.speak(u);
        } else {
          // no speech support — just play the animation briefly
          safety = setTimeout(finish, 2600);
        }
      });
    });

    // Voices can load asynchronously in some browsers
    if (synth && typeof synth.onvoiceschanged !== 'undefined') {
      synth.onvoiceschanged = function () { synth.getVoices(); };
    }
    // Stop talking if the user navigates away
    window.addEventListener('beforeunload', function () { if (synth) synth.cancel(); });
  }
})();
