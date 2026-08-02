/* Hero node network. A drifting dependency graph, in the site palette. */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PALETTE = [
    [110, 155, 240], // blue
    [155, 151, 232], // violet
    [212, 143, 196], // magenta
    [79, 216, 245]   // cyan
  ];

  var nodes = [];
  var w = 0, h = 0, dpr = 1;
  var linkDist = 0;
  var rafId = null;
  var running = false;

  function mix(t) {
    // t in [0,1] across the first three palette stops
    var s = t * 2;
    var i = s < 1 ? 0 : 1;
    var f = s - i;
    var a = PALETTE[i], b = PALETTE[i + 1];
    return [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f)
    ];
  }

  function build() {
    var rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var area = w * h;
    var count = Math.max(28, Math.min(78, Math.round(area / 15000)));
    linkDist = Math.max(120, Math.min(210, Math.sqrt(area) / 4.4));

    nodes = [];
    for (var i = 0; i < count; i++) {
      var x = Math.random() * w;
      var depth = 0.35 + Math.random() * 0.65; // fakes distance from camera
      var rgb = mix(Math.min(1, Math.max(0, x / w * 0.85 + Math.random() * 0.15)));
      nodes.push({
        x: x,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: (0.9 + Math.random() * 1.9) * depth,
        depth: depth,
        hub: Math.random() < 0.13,
        rgb: rgb
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // edges
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > linkDist) continue;
        var alpha = (1 - d / linkDist) * 0.30 * Math.min(a.depth, b.depth);
        if (alpha < 0.01) continue;
        var g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, 'rgba(' + a.rgb.join(',') + ',' + alpha.toFixed(3) + ')');
        g.addColorStop(1, 'rgba(' + b.rgb.join(',') + ',' + alpha.toFixed(3) + ')');
        ctx.strokeStyle = g;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // nodes
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      var c = 'rgba(' + n.rgb.join(',') + ',';
      ctx.shadowBlur = n.hub ? 16 : 8;
      ctx.shadowColor = c + '0.55)';
      ctx.fillStyle = c + (0.35 + n.depth * 0.5).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.hub ? n.r * 1.9 : n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (n.hub) {
        ctx.strokeStyle = c + '0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -40) n.x = w + 40;
      if (n.x > w + 40) n.x = -40;
      if (n.y < -40) n.y = h + 40;
      if (n.y > h + 40) n.y = -40;
    }
    draw();
    rafId = window.requestAnimationFrame(step);
  }

  var inView = true;

  function start() {
    if (running || reduced || !inView || document.hidden) return;
    running = true;
    rafId = window.requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  build();
  draw();

  // Only animate while the hero is on screen.
  if (!reduced && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        inView = e.isIntersecting;
        inView ? start() : stop();
      });
    }, { threshold: 0 }).observe(canvas);
  } else {
    start();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      build();
      draw();
    }, 180);
  });

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
})();
