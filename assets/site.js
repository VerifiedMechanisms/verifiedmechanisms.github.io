/* Nav behaviour, theme toggle, scroll reveal. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */

  function currentTheme() {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#FDF8EE' : '#05081F');
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  applyTheme(currentTheme());

  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('vm-theme', next); } catch (e) {}
      applyTheme(next);
    });
  }

  // Follow the OS only while the visitor has not chosen for themselves.
  var osLight = window.matchMedia('(prefers-color-scheme: light)');
  var onOsChange = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('vm-theme'); } catch (err) {}
    if (!stored) applyTheme(e.matches ? 'light' : 'dark');
  };
  if (osLight.addEventListener) osLight.addEventListener('change', onOsChange);
  else if (osLight.addListener) osLight.addListener(onOsChange);

  /* ---------- nav ---------- */

  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- reveal ---------- */

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
})();
