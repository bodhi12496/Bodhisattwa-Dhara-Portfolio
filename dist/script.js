'use strict';
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  if (returnFocus) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = expanded;
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) closeMenu(true); });
document.addEventListener('click', e => { if (!mobileNav.hidden && !e.target.closest('.site-header')) closeMenu(); });
window.matchMedia('(min-width: 601px)').addEventListener('change', e => { if (e.matches) closeMenu(); });
const progress = document.querySelector('.reading-progress');
let scrollPending = false;
function updateProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${distance > 0 ? Math.min(100, window.scrollY / distance * 100) : 0}%`;
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress, { passive: true });
updateProgress();
document.getElementById('year').textContent = String(new Date().getFullYear());
const links = [...document.querySelectorAll('.desktop-nav a')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(a => {
        if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-5% 0px -60% 0px', threshold: 0 });
  ['home', 'work', 'research', 'experience', 'about', 'contact'].forEach(id => navObserver.observe(document.getElementById(id)));
}
const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
let copyTimer;
copyButton.addEventListener('click', async () => {
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText('f20213081@hyderabad.bits-pilani.ac.in');
    copyButton.textContent = 'Copied ✓';
    copyStatus.textContent = 'Email address copied to clipboard.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-link'));
    if (selection) { selection.removeAllRanges(); selection.addRange(range); }
    copyButton.textContent = 'Email selected';
    copyStatus.textContent = 'Copy is unavailable. The email is selected; use your device’s copy command.';
  }
  copyTimer = setTimeout(() => { copyButton.textContent = 'Copy email'; }, 3500);
});
// A mathematical surface, not a claim about project results.
// A fixed wireframe and sample points use an orthographic projection.
(() => {
  const canvas = document.getElementById('landscape');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motionButton = document.getElementById('motion-toggle');
  const resetButton = document.getElementById('reset-model');
  const coordinate = document.getElementById('rotation-value');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let angle = .56, pitch = .53, width = 0, height = 0;
  let dragging = false, lastX = 0, lastY = 0, inView = true;
  let animationFrame = 0, lastTime = 0, lastDraw = 0;
  const size = 33, points = [];
  function surface(x, z) {
    return 1.35 * Math.exp(-((x + .75) ** 2 + (z - .3) ** 2) / 1.5)
      - .8 * Math.exp(-((x - .8) ** 2 + (z + .55) ** 2) / .75)
      + .13 * Math.sin(x * 2.2 + z);
  }
  for (let z = 0; z < size; z++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      const px = (x / (size - 1) - .5) * 4.8;
      const pz = (z / (size - 1) - .5) * 4.8;
      row.push({ x: px, y: surface(px, pz), z: pz });
    }
    points.push(row);
  }
  function project(p) {
    const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
    const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
    const scale = Math.min(width / 7.05, height / 4.5);
    return { x: width * .5 + x * scale,
      y: height * .6 + (z * Math.sin(pitch) - p.y * Math.cos(pitch)) * scale,
      depth: z * Math.cos(pitch) + p.y * Math.sin(pitch) };
  }
  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const projected = points.map(row => row.map(project));
    const edges = [];
    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        const p = projected[z][x];
        if (x < size - 1) edges.push([p, projected[z][x + 1], points[z][x].y]);
        if (z < size - 1) edges.push([p, projected[z + 1][x], points[z][x].y]);
      }
    }
    edges.sort((a, b) => a[0].depth - b[0].depth);
    ctx.lineWidth = .7;
    for (const [a, b, y] of edges) {
      const opacity = Math.max(.18, Math.min(.8, .42 + a.depth * .052 + y * .11));
      ctx.strokeStyle = `rgba(192,233,116,${opacity})`;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let z = 3; z < size - 2; z += 7) {
      for (let x = 3; x < size - 2; x += 7) {
        const p = projected[z][x];
        ctx.fillStyle = '#d7fb72'; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
    }
    coordinate.textContent = `θ ${Math.round(((angle * 180 / Math.PI) % 360 + 360) % 360)}°`;
  }
  function frame(time) {
    animationFrame = 0;
    if (paused || dragging || !inView || document.hidden) { lastTime = 0; return; }
    const dt = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time; angle += dt * .000065;
    if (time - lastDraw > 32) { draw(); lastDraw = time; }
    animationFrame = requestAnimationFrame(frame);
  }
  function syncAnimation() {
    motionButton.textContent = paused ? 'Play' : 'Pause';
    motionButton.setAttribute('aria-label', paused ? 'Play model rotation' : 'Pause model rotation');
    motionButton.setAttribute('aria-pressed', String(paused));
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0; lastTime = 0;
    if (!paused && !dragging && inView && !document.hidden) animationFrame = requestAnimationFrame(frame);
    draw();
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width; height = box.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); draw();
  }
  motionButton.addEventListener('click', () => { paused = !paused; syncAnimation(); });
  resetButton.addEventListener('click', () => { angle = .56; pitch = .53; draw(); });
  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId); syncAnimation();
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    angle += (e.clientX - lastX) * .008;
    if (e.pointerType !== 'touch') pitch = Math.max(.2, Math.min(.95, pitch + (e.clientY - lastY) * .004));
    lastX = e.clientX; lastY = e.clientY; draw();
  });
  const stopDrag = () => { dragging = false; syncAnimation(); };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('lostpointercapture', () => { if (dragging) stopDrag(); });
  canvas.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
    e.preventDefault(); paused = true;
    if (e.key === 'ArrowLeft') angle -= .13;
    if (e.key === 'ArrowRight') angle += .13;
    if (e.key === 'ArrowUp') pitch = Math.min(.95, pitch + .07);
    if (e.key === 'ArrowDown') pitch = Math.max(.2, pitch - .07);
    if (e.key === 'Home') { angle = .56; pitch = .53; }
    syncAnimation();
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; syncAnimation();
  }).observe(canvas);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', e => { if (e.matches) { paused = true; syncAnimation(); } });
  resize(); syncAnimation();
})();
