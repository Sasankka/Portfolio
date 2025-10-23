document.addEventListener('DOMContentLoaded', () => {

    // === 1. Plynulé skrolování ===
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // === 2. Zvýraznění aktivní sekce ===
    const sections = document.querySelectorAll('main section');
    const navObserverOptions = { root: null, threshold: 0.6, rootMargin: '-60px 0px 0px 0px' };
    const navObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`nav a[href="#${targetId}"]`);
                navLinks.forEach(link => link.classList.remove('active'));
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, navObserverOptions);
    sections.forEach(section => { navObserver.observe(section); });

    // === 3. Kontaktní formulář ===
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const statusTimeoutDuration = 5000;
    let statusTimeoutId = null;

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Thank you! Your message has been sent.';
            formStatus.className = 'status-success';
            formStatus.style.display = 'block';
            contactForm.reset();
            if (statusTimeoutId) { clearTimeout(statusTimeoutId); }
            statusTimeoutId = setTimeout(() => {
                formStatus.textContent = ''; formStatus.className = '';
                formStatus.style.display = 'none'; statusTimeoutId = null;
            }, statusTimeoutDuration);
        });
    }

    // === 4. Canvas Síť Bodů (Oranžová) ===
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray;

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        class Particle {
            constructor(x, y, size, speedX, speedY) {
                this.x = x; this.y = y; this.size = size; this.speedX = speedX; this.speedY = speedY;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) { this.speedX = -this.speedX; }
                if (this.y > canvas.height || this.y < 0) { this.speedY = -this.speedY; }
                this.x += this.speedX; this.y += this.speedY;
                this.draw();
            }
        }

        function initParticles() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 9000;
            if (numberOfParticles > 150) numberOfParticles = 150;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let speedX = (Math.random() * 1) - 0.5;
                let speedY = (Math.random() * 1) - 0.5;
                particlesArray.push(new Particle(x, y, size, speedX, speedY));
            }
        }

        function connectParticles() {
            let maxDistance = 100;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                               + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (maxDistance * maxDistance)) {
                        ctx.strokeStyle = `rgba(255, 102, 0, ${1 - (distance / (maxDistance * maxDistance))})`; // Oranžová
                        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }

        let animationFrameId = null;
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            connectParticles();
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        window.addEventListener('resize', () => {
             if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
             try {
                resizeCanvas();
                initParticles();
                animate();
             } catch (error) { console.error('Chyba při resize:', error); }
        });

        try {
            resizeCanvas();
            initParticles();
            if (animationFrameId) { cancelAnimationFrame(animationFrameId); }
            animate();
        } catch (error) { console.error('Chyba při inicializaci canvasu:', error); }

    } else {
        console.warn('Canvas element #hero-canvas nebyl nalezen.'); // Upozornění, pokud nenajde canvas
    }

    

}); // <-- Úplně poslední závorka