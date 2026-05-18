// ── Custom Cursor ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; });
function animRing() { rx += (mx - rx) * .12; ry += (my - ry) * .12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(animRing); }
animRing();
document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '6px'; cursor.style.height = '6px'; ring.style.width = '56px'; ring.style.height = '56px'; ring.style.opacity = '0.3'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; ring.style.width = '36px'; ring.style.height = '36px'; ring.style.opacity = '0.6'; });
});

// ── Scroll Progress ──
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
});

// ── Navbar ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 60); });

// ── Hamburger ──
const ham = document.getElementById('hamburger');
const menu = document.getElementById('mobile-menu');
ham.addEventListener('click', () => { ham.classList.toggle('open'); menu.classList.toggle('open'); document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : ''; });
document.querySelectorAll('.mobile-link').forEach(a => {
    a.addEventListener('click', () => { ham.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = ''; });
});

// ── Reveal on Scroll ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ── Counter Animation ──
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const dur = 1800;
        const start = performance.now();
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const step = (now) => {
            const t = Math.min((now - start) / dur, 1);
            el.textContent = Math.floor(easeOut(t) * target);
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = target;
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Form Submit ──
function handleSubmit(btn) {
    const span = btn.querySelector('span');
    btn.disabled = true;
    span.textContent = 'Sending...';
    setTimeout(() => {
        span.textContent = '✓ Enquiry Sent!';
        btn.style.background = '#2d6a4f';
        setTimeout(() => { span.textContent = 'Send Enquiry →'; btn.disabled = false; btn.style.background = ''; }, 3000);
    }, 1800);
}

// ── Parallax Hero Grid ──
document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    document.querySelector('.hero-glow').style.transform = `translate(${x}px, ${y}px)`;
});