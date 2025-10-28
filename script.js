document.addEventListener('DOMContentLoaded', () => {
    // === 0. Mobilní optimalizace ===
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    // Detekce scrollování pro header
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Přidání efektu při scrollování
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Detekce orientace zařízení
    window.addEventListener('orientationchange', () => {
        // Počkáme na dokončení změny orientace
        setTimeout(() => {
            // Přepočítáme velikost canvasu a částic
            if (canvas) {
                resizeCanvas();
                initParticles();
            }
        }, 200);
    });

    // Optimalizace dotykových událostí
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
            e.target.classList.add('touch-active');
        }
    }, { passive: true });

    document.addEventListener('touchend', function(e) {
        const activeElements = document.querySelectorAll('.touch-active');
        activeElements.forEach(el => el.classList.remove('touch-active'));
    }, { passive: true });

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

    // Check if EmailJS is available
    if (!window.emailjs) {
        console.error('EmailJS library not loaded!');
        if (contactForm) {
            contactForm.innerHTML += '<p style="color: red;">Contact form temporarily unavailable</p>';
        }
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Zabráníme obnovení stránky
            
            // Disable button during submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // 1. Získáme data z formuláře
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            console.log('Sending data via EmailJS:', data);

            // Check if EmailJS is available
            if (!window.emailjs) {
                console.error('EmailJS is not available');
                formStatus.textContent = 'Error: Email service not available';
                formStatus.className = '';
                formStatus.style.backgroundColor = '#dc3545';
                formStatus.style.color = '#ffffff';
                formStatus.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                return;
            }

            // 2. Odešleme email přes EmailJS
            window.emailjs.send(
                'service_7bnr8fs',        // Your EmailJS service ID
                'template_portfolio',       // Your EmailJS template ID
                {
                    from_name: data.name,
                    from_email: data.email,
                    message: data.message,
                    to_email: 'habiballahportfolioweb@gmail.com'  // Your recipient email
                }
            )
            .then(result => {
                console.log('Email sent successfully:', result);

                // 3. Zobrazíme zprávu o úspěchu
                formStatus.textContent = 'Thank you! Your message has been sent.';
                formStatus.className = 'status-success';
                formStatus.style.backgroundColor = '#28a745';
                formStatus.style.color = '#ffffff';
                formStatus.style.display = 'block';
                formStatus.style.padding = '15px';
                formStatus.style.borderRadius = '4px';
                formStatus.style.marginTop = '15px';
                contactForm.reset();
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';

                // Vyčištění zprávy po čase
                if (statusTimeoutId) { clearTimeout(statusTimeoutId); }
                statusTimeoutId = setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.className = '';
                    formStatus.style.backgroundColor = '';
                    formStatus.style.color = '';
                    formStatus.style.display = 'none';
                    statusTimeoutId = null;
                }, statusTimeoutDuration);
            })
            .catch((error) => {
                console.error('Error sending email:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });

                // 4. Zobrazíme chybovou zprávu uživateli
                formStatus.textContent = `Error: ${error.message || 'Failed to send message'}`;
                formStatus.className = '';
                formStatus.style.backgroundColor = '#dc3545';
                formStatus.style.color = '#ffffff';
                formStatus.style.display = 'block';
                formStatus.style.padding = '15px';
                formStatus.style.borderRadius = '4px';
                formStatus.style.marginTop = '15px';
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';

                // Necháme chybovou zprávu déle viditelnou
                if (statusTimeoutId) { clearTimeout(statusTimeoutId); }
                statusTimeoutId = setTimeout(() => {
                    formStatus.textContent = '';
                    formStatus.style.backgroundColor = '';
                    formStatus.style.color = '';
                    formStatus.style.display = 'none';
                    statusTimeoutId = null;
                }, 8000);
            });
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