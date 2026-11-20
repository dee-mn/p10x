(function () {
  function init() {
    var root = document.querySelector('.view-20 .block-582ad7f2');
    if (!root || root.querySelector('.p10x-mission-particles')) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'p10x-mission-particles';
    canvas.setAttribute('aria-hidden', 'true');
    root.prepend(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var w = 0,
      h = 0,
      points = [],
      raf = 0,
      last = 0,
      visible = false,
      mx = 0,
      my = 0,
      tx = 0,
      ty = 0,
      time = 0;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)');
    function resize() {
      if (!visible) return;
      var width = root.clientWidth, height = root.clientHeight;
      var d = Math.min(devicePixelRatio || 1, 1.5);
      if (w === width && h === height && canvas.width === Math.round(width * d)) return;
      w = width;
      h = height;
      canvas.width = Math.round(w * d);
      canvas.height = Math.round(h * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
      points = [];
      var gap = w < 768 ? 42 : 38;
      for (var row = 0; row < Math.ceil(h / gap) + 2; row++) {
        for (var col = 0; col < Math.ceil(w / gap) + 2; col++) {
          points.push({
            x: col * gap - gap,
            y: row * gap - gap,
            r: 0.8 + Math.random() * 0.8,
            p: Math.random() * 0.35,
            a: 0.16 + Math.random() * 0.16,
            teal: Math.random() < 0.6
          });
        }
      }
      draw(0);
    }
    function draw(dt) {
      time += dt;
      mx += (tx - mx) * Math.min(1, dt * 2);
      my += (ty - my) * Math.min(1, dt * 2);
      ctx.clearRect(0, 0, w, h);
      points.forEach(function (p) {
        var wave = Math.sin(p.x * 0.009 + time * 0.65 + p.y * 0.003);
        var cross = Math.cos(p.y * 0.011 - time * 0.4);
        var x = p.x + cross * 9 + mx * (p.r / 2),
          y = p.y + wave * 23 + my * (p.r / 2);
        var pulse =
          0.42 +
          0.58 *
            (0.5 + 0.5 * Math.sin(p.x * 0.006 + p.y * 0.004 - time * 1.15));
        var alpha = p.a * pulse;
        ctx.beginPath();
        ctx.fillStyle = p.teal
          ? 'rgba(3,196,213,' + alpha + ')'
          : 'rgba(57,78,81,' + alpha + ')';
        ctx.arc(x, y, p.r * (0.82 + pulse * 0.28), 0, Math.PI * 2);
        ctx.fill();
      });
    }
    function frame(now) {
      raf = 0;
      if (!visible || document.hidden || reduced.matches) return;
      // The slow background field needs fewer draws than the interactive globe.
      if (!last || now - last >= 32) {
        var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        draw(dt);
      }
      raf = requestAnimationFrame(frame);
    }
    function sync() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      if (visible && !document.hidden && !reduced.matches)
        raf = requestAnimationFrame(frame);
      else if (visible && reduced.matches) draw(0);
    }
    new ResizeObserver(resize).observe(root);
    new IntersectionObserver(
      function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) resize();
        sync();
      },
      { rootMargin: '80px' }
    ).observe(root);
    root.addEventListener(
      'pointermove',
      function (e) {
        if (e.pointerType === 'touch') return;
        var rect = root.getBoundingClientRect();
        tx = ((e.clientX - rect.left) / w - 0.5) * 14;
        ty = ((e.clientY - rect.top) / h - 0.5) * 10;
      },
      { passive: true }
    );
    root.addEventListener('pointerleave', function () {
      tx = ty = 0;
    });
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
