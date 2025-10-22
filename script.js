document.addEventListener('DOMContentLoaded', () => {

    // Fáze 3.1: Plynulé skrolování
    const navLinks = document.querySelectorAll('header nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fáze 3.2: Zvýraznění aktivní sekce
    const sections = document.querySelectorAll('main section');

    const observerOptions = {
        root: null,
        threshold: 0.6,
        rootMargin: '-60px 0px 0px 0px' // Zohlednění výšky menu
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`nav a[href="#${targetId}"]`);

                // Nejdřív odstraníme .active ze všech
                navLinks.forEach(link => link.classList.remove('active'));

                // A přidáme ji jen tomu správnému
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Sledování všech sekcí
    sections.forEach(section => {
        observer.observe(section);
    });

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    // Konfigurovatelná doba zobrazení zprávy (v milisekundách)
    const statusTimeoutDuration = 5000;
    let statusTimeoutId = null;

    contactForm.addEventListener('submit', (e) => {
        // 1. Zabráníme výchozímu odeslání (obnovení stránky)
        e.preventDefault();

        // 2. Zobrazíme zprávu o úspěchu
        formStatus.textContent = 'Thank you! Your message has been sent.';
        formStatus.className = 'status-success'; // Přidá zelený styl
        formStatus.style.display = 'block'; // Ujistíme se, že je viditelná

        // 3. Vyčistíme formulář
        contactForm.reset();

        // 4. (Volitelné) Skryjeme zprávu po uplynutí statusTimeoutDuration
        if (statusTimeoutId) {
            clearTimeout(statusTimeoutId);
        }
        statusTimeoutId = setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = '';
            formStatus.style.display = 'none'; // Skryjeme zprávu po vypršení časovače
            statusTimeoutId = null;
        }, statusTimeoutDuration);
    });

    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d'); // Náš "štětec" pro 2D kreslení

    // Funkce pro nastavení velikosti plátna
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // Zavoláme funkci poprvé při načtení
    resizeCanvas();
    
    // A znovu při každé změně velikosti okna
    window.addEventListener('resize', resizeCanvas);
    let particlesArray;

    // Třída (šablona) pro jeden bod (Particle)
    class Particle {
        constructor(x, y, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
        }
        
        // Metoda pro kreslení bodu
        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Poloprůhledná bílá
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Metoda pro pohyb bodu
        update() {
            // Odražení od okrajů
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
            
            // Pohyb
            this.x += this.speedX;
            this.y += this.speedY;
            
            this.draw();
        }
    }

    // Funkce pro vytvoření pole s body
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1; // Velikost 1px až 3px
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let speedX = (Math.random() * 1) - 0.5; // Pohyb -0.5 až +0.5 px/snímek
            let speedY = (Math.random() * 1) - 0.5;
            
            particlesArray.push(new Particle(x, y, size, speedX, speedY));
        }
    }

    // Funkce pro kreslení spojnic mezi body
    function connectParticles() {
        let maxDistance = 100; // Maximální vzdálenost pro spojení
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                           + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (maxDistance * maxDistance)) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - (distance / (maxDistance * maxDistance))})`; // Čím dál, tím průhlednější
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Hlavní animovaná smyčka
    function animate() {
        requestAnimationFrame(animate); // Řekne prohlížeči, aby to opakoval
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Smaže starý snímek
        
        connectParticles(); // Nakreslí čáry
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update(); // Přepočítá a nakreslí každý bod
        }
    }

    // Musíme znovu inicializovat body, když se změní velikost okna
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles(); // Znovu vytvoří body pro novou velikost
    });

    // Start!
    initParticles(); // Vytvoří body
    animate(); // Spustí animaci

});