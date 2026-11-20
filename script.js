(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Theme toggle */
  var themeBtn = document.getElementById('theme');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  themeBtn.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* Hyderabad clock */
  var clock = document.getElementById('clock');
  var fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' });
  } catch (e) { fmt = null; }
  function tick() { if (fmt) clock.textContent = fmt.format(new Date()); }
  tick();
  setInterval(tick, 15000);

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Header border on scroll */
  var bar = document.querySelector('.bar');
  var firstSection = document.getElementById('experience');
  function onScroll() {
    bar.classList.toggle('is-scrolled', window.scrollY > 8);
    if (firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * 0.5) {
      document.querySelectorAll('.nav a.is-active').forEach(function (l) { l.classList.remove('is-active'); });
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Reveal on scroll */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      // stagger siblings that enter together
      el.style.transitionDelay = (el.parentElement.classList.contains('numbers__grid') ? (i % 4) * 80 : 0) + 'ms';
      io.observe(el);
    });
  }

  /* Count-up numbers */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target, end = +el.getAttribute('data-count'), t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min((t - t0) / 1100, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = '0'; co.observe(el); });
  }

  /* Pipeline pulse */
  var steps = document.querySelector('.pipeline__steps');
  if (steps && !reduce) {
    var pulse = document.createElement('span');
    pulse.className = 'pulse';
    steps.appendChild(pulse);
    function size() { steps.style.setProperty('--travel', Math.max(steps.offsetWidth - 60, 0) + 'px'); }
    size();
    window.addEventListener('resize', size);
  }

  /* Active nav link */
  var links = document.querySelectorAll('.nav a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = map[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) so.observe(s);
    });
  }

  /* Copy email */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { showToast('Email copied'); }, function () { showToast(text); });
      } else {
        showToast(text);
      }
    });
  });
})();
