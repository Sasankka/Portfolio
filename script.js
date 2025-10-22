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

});