// main.js — component loading, nav behavior, scroll reveals, animated
// counters/bars, and the contact questionnaire logic.

function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return Promise.resolve();
    return fetch(file)
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load ' + file);
            return response.text();
        })
        .then((data) => {
            element.innerHTML = data;
        })
        .catch((err) => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('footer-placeholder', 'components/footer.html'),
    ]).then(() => {
        initNav();
        initActiveLink();
    });

    initRevealObserver();
    initCounters();
    initFAQ();

    // ---- Contact page multi-step form ----
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');
    let currentStep = 0;

    if (steps.length > 0) {
        function updateFormDisplay() {
            steps.forEach((step, index) => {
                step.classList.toggle('step-active', index === currentStep);
            });
            const stepCount = steps.length;
            const progressPercentage = ((currentStep + 1) / stepCount) * 100;
            if (progressFill) progressFill.style.width = `${progressPercentage}%`;
            if (progressText) {
                const stepTitles = [
                    'Municipality Profile',
                    'Fiscal Objectives',
                    'Infrastructure & Challenges',
                    'Timeline & Finalize',
                ];
                progressText.innerText = `Step ${currentStep + 1} of ${stepCount}: ${stepTitles[currentStep]}`;
            }
        }

        nextBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateFormDisplay();
                }
            });
        });

        prevBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateFormDisplay();
                }
            });
        });
    }

    const form = document.getElementById('ms-questionnaire');
    const formCard = document.querySelector('.form-card');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const status = document.getElementById('p-text');
            if (status) status.innerText = 'Sending your request...';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: data,
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    formCard.innerHTML = `
                        <div style="text-align:center; padding: 40px 10px;">
                            <div class="icon-badge" style="margin: 0 auto 22px; width:64px; height:64px; font-size:1.6rem;">
                                <i class="fas fa-check"></i>
                            </div>
                            <h2 style="margin-bottom: 10px;">Submission Received</h2>
                            <p style="color: var(--text-dim);">Thank you. A MuniBlock representative will contact you within 24 hours.</p>
                            <a href="index.html" class="btn" style="margin-top: 30px;">Return Home</a>
                        </div>
                    `;
                } else {
                    const result = await response.json();
                    alert(result.errors ? result.errors.map((error) => error.message).join(', ') : 'Submission error');
                }
            } catch (error) {
                alert('Connection error. Please try again.');
            }
        });
    }
});

// Close mobile menu when a link is clicked
document.addEventListener('click', (e) => {
    if (e.target.closest('nav ul li a')) {
        const toggle = document.getElementById('nav-toggle');
        if (toggle) toggle.checked = false;
    }
});

function initNav() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

function initActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach((a) => {
        const href = a.getAttribute('href');
        if (href === path) a.classList.add('active');
    });
}

// ---- Scroll reveals (fade/slide-in) + bar-chart growth trigger ----
function initRevealObserver() {
    const targets = document.querySelectorAll('.reveal, .reveal-stagger, .bar-chart');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach((t) => t.classList.add('in-view'));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    targets.forEach((t) => io.observe(t));
}

// ---- Animated stat counters: <span class="counter" data-target="91" data-suffix="%"> ----
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                io.unobserve(entry.target);
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach((c) => io.observe(c));
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = prefix + value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
}

// ---- Simple FAQ accordion ----
function initFAQ() {
    document.querySelectorAll('.faq-item').forEach((item) => {
        const q = item.querySelector('.faq-q');
        if (!q) return;
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            item.closest('.faq-list').querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}
