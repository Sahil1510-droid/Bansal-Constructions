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
/* ══════════════════════════════════════════════
   EMAILJS CONFIG — paste your own keys here
══════════════════════════════════════════════ */
const EJS = {
    publicKey: 'KxJV2DE1l1P-2dxRk',    // from EmailJS → Account → General
    serviceId: 'service_gb0il0d',    // from EmailJS → Email Services
    templateId: 'template_hcqb64u',  // from EmailJS → Email Templates
};

/* ── Init EmailJS ── */
(function () {
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded. Add the CDN script to <head>.');
        return;
    }
    emailjs.init({ publicKey: EJS.publicKey });
})();

/* ══════════════════════════════════════════════
   FORM SUBMISSION
══════════════════════════════════════════════ */
document.getElementById('cf-submit')?.addEventListener('click', function () {
    sendEnquiry();
});

function sendEnquiry() {
    /* ── Gather values ── */
    const fname = document.getElementById('cf-fname').value.trim();
    const lname = document.getElementById('cf-lname').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const service = document.getElementById('cf-service').value;
    const message = document.getElementById('cf-message').value.trim();

    const errBox = document.getElementById('cf-error');
    const sucBox = document.getElementById('cf-success');
    const btn = document.getElementById('cf-submit');
    const btnSpan = btn.querySelector('span');

    /* ── Hide previous messages ── */
    errBox.style.display = 'none';
    sucBox.style.display = 'none';

    /* ── Validation ── */
    const errors = [];
    if (!fname) errors.push('First name is required.');
    if (!email) errors.push('Email address is required.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errors.push('Please enter a valid email address.');
    if (!phone) errors.push('Phone number is required.');
    else if (!/^[\d\s\+\-\(\)]{8,}$/.test(phone))
        errors.push('Please enter a valid phone number.');
    if (!service) errors.push('Please select a project type.');
    if (!message) errors.push('Please tell us about your project.');

    if (errors.length) {
        errBox.innerHTML = errors.join('<br>');
        errBox.style.display = 'block';
        errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    /* ── Loading state ── */
    btn.disabled = true;
    btnSpan.textContent = 'Sending...';
    btn.style.opacity = '0.7';

    /* ── Send via EmailJS ── */
    const templateParams = {
        from_name: fname + ' ' + lname,
        from_email: email,
        phone: phone,
        project_type: service,
        message: message,
        reply_to: email,          // lets you reply directly in Gmail
    };

    emailjs.send(EJS.serviceId, EJS.templateId, templateParams)
        .then(function (response) {
            console.log('EmailJS success:', response.status, response.text);

            /* ── Show success ── */
            sucBox.style.display = 'block';
            sucBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            /* ── Reset form ── */
            ['cf-fname', 'cf-lname', 'cf-email', 'cf-phone', 'cf-message'].forEach(id => {
                document.getElementById(id).value = '';
            });
            document.getElementById('cf-service').value = '';

            /* ── Reset button ── */
            btn.disabled = false;
            btnSpan.textContent = 'Send Enquiry →';
            btn.style.opacity = '1';
        })
        .catch(function (error) {
            console.error('EmailJS error:', error);

            errBox.innerHTML = '⚠ Something went wrong. Please try again or call us directly at <strong>+91 89689 67835</strong>.';
            errBox.style.display = 'block';

            btn.disabled = false;
            btnSpan.textContent = 'Send Enquiry →';
            btn.style.opacity = '1';
        });
}

// ── Parallax Hero Grid ──
document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    document.querySelector('.hero-glow').style.transform = `translate(${x}px, ${y}px)`;
});

/* ── Visitor Counter with rolling digit animation (Local Storage Version) ── */
(function () {
    const POLL_MS = 1000;
    const DIGITS = 5;
    const CELL_H = 22; // Must match the height of .vc-cell in CSS

    let current = 0;
    let firstLoad = true;
    let pollTimer = null;

    // --- Local Storage Logic ---
    function getStoredCount() {
        const stored = localStorage.getItem("local_visitor_count");
        // If nothing is stored yet, default to our starting baseline of 13150
        return stored ? parseInt(stored, 10) : 13150;
    }

    function incrementAndGetCount() {
        // Check if this session has already registered a hit
        if (!sessionStorage.getItem("session_counted")) {
            let count = getStoredCount();
            count += 1;
            localStorage.setItem("local_visitor_count", count);
            sessionStorage.setItem("session_counted", "true");
            return count;
        }
        return getStoredCount();
    }

    // --- Visual Animation Logic ---
    function buildRoller(count) {
        const roller = document.getElementById("vc-roller");
        if (!roller) return;
        roller.innerHTML = "";
        const str = String(count).padStart(DIGITS, "0");

        str.split("").forEach((ch, i) => {
            const fromRight = DIGITS - 1 - i;
            if (fromRight > 0 && fromRight % 3 === 0) {
                const sep = document.createElement("span");
                sep.className = "vc-comma-sep"; 
                sep.textContent = ",";
                roller.appendChild(sep);
            }
            const box = document.createElement("div");
            box.className = "vc-dbox"; 
            box.id = "vcd-" + i;
            box.innerHTML = `<div class="vc-tape" id="vct-${i}">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `<div class="vc-cell">${n}</div>`).join("")}</div>`;
            roller.appendChild(box);
            
            requestAnimationFrame(() => {
                const t = document.getElementById("vct-" + i);
                if (t) { 
                    t.style.transition = "none"; 
                    t.style.transform = `translateY(${-parseInt(ch, 10) * CELL_H}px)`; 
                }
            });
        });
    }

    function rollTo(newCount) {
        const oldStr = String(current).padStart(DIGITS, "0");
        const newStr = String(newCount).padStart(DIGITS, "0");
        newStr.split("").forEach((ch, i) => {
            if (ch !== oldStr[i]) {
                const t = document.getElementById("vct-" + i);
                if (!t) return;
                t.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
                t.style.transform = `translateY(${-parseInt(ch, 10) * CELL_H}px)`;
            }
        });
    }

    function updateCounterUI() {
        // Fetch current count state from local storage
        const n = getStoredCount();
        
        const fallbackTextEl = document.getElementById("visitorCount");
        if (fallbackTextEl) fallbackTextEl.innerText = n;

        if (firstLoad) { 
            buildRoller(n); 
            firstLoad = false; 
        } else { 
            rollTo(n); 
        }
        current = n;
    }

    function handleInitialLoad() {
        // Increment count only when the user opens a fresh session
        incrementAndGetCount();
        updateCounterUI();
    }

    function startPolling() { 
        clearInterval(pollTimer); 
        // This simulates checking for updates (useful if they have multiple tabs of your site open)
        pollTimer = setInterval(updateCounterUI, POLL_MS); 
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearInterval(pollTimer);
        } else { 
            updateCounterUI(); 
            startPolling(); 
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => { handleInitialLoad(); startPolling(); });
    } else {
        handleInitialLoad();
        startPolling();
    }
})();
