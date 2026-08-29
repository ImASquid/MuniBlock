// network.js — lightweight animated blockchain "node network" backdrop.
// Renders inside any <canvas class="network-canvas"> element.
// No dependencies. Respects prefers-reduced-motion.

(function () {
    const canvases = document.querySelectorAll('.network-canvas');
    if (!canvases.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    canvases.forEach((canvas) => initNetwork(canvas));

    function initNetwork(canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, nodes, dpr;
        let animationId = null;

        const density = parseFloat(canvas.dataset.density) || 9000; // px^2 per node
        const linkDist = parseFloat(canvas.dataset.linkDist) || 150;
        const cyan = '0, 229, 255';
        const violet = '124, 92, 255';

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = rect.width;
            height = rect.height;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            seed();
        }

        function seed() {
            const count = Math.max(18, Math.min(70, Math.floor((width * height) / density)));
            nodes = new Array(count).fill(0).map(() => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                r: Math.random() * 1.6 + 1,
                violet: Math.random() > 0.72,
                pulse: Math.random() * Math.PI * 2,
            }));
        }

        function step() {
            ctx.clearRect(0, 0, width, height);

            // update positions
            nodes.forEach((n) => {
                n.x += n.vx;
                n.y += n.vy;
                n.pulse += 0.02;
                if (n.x < -20) n.x = width + 20;
                if (n.x > width + 20) n.x = -20;
                if (n.y < -20) n.y = height + 20;
                if (n.y > height + 20) n.y = -20;
            });

            // links
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < linkDist) {
                        const alpha = (1 - dist / linkDist) * 0.5;
                        ctx.strokeStyle = `rgba(${cyan}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }

            // nodes
            nodes.forEach((n) => {
                const glow = 0.55 + Math.sin(n.pulse) * 0.25;
                const color = n.violet ? violet : cyan;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${color}, ${glow})`;
                ctx.shadowColor = `rgba(${color}, 0.9)`;
                ctx.shadowBlur = 6;
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.shadowBlur = 0;

            animationId = requestAnimationFrame(step);
        }

        function drawStatic() {
            // single calm frame for reduced-motion users
            ctx.clearRect(0, 0, width, height);
            nodes.forEach((n) => {
                const color = n.violet ? violet : cyan;
                ctx.beginPath();
                ctx.fillStyle = `rgba(${color}, 0.6)`;
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        resize();
        window.addEventListener('resize', () => {
            cancelAnimationFrame(animationId);
            resize();
            if (reduceMotion) drawStatic(); else step();
        });

        // pause when off-screen or tab hidden, for performance
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !reduceMotion) {
                    if (!animationId) step();
                } else {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            });
        }, { threshold: 0.01 });
        io.observe(canvas);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
                animationId = null;
            } else if (!reduceMotion) {
                step();
            }
        });

        if (reduceMotion) drawStatic(); else step();
    }
})();
