(() => {
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.querySelector('#navMenu');
  const navLinks = Array.from(document.querySelectorAll('.nav__link'));

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((a) => {
      a.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside = navMenu.contains(target) || navToggle.contains(target);
      if (!clickedInside && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scroll animations
  const animateEls = Array.from(document.querySelectorAll('[data-animate]'));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  animateEls.forEach((el) => io.observe(el));

  // Active section highlighting
  const sectionIds = ['home', 'about', 'portfolio', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`));
  };

  const ioSections = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { threshold: [0.2, 0.35, 0.5, 0.65] }
  );
  sections.forEach((s) => ioSections.observe(s));

  // Contact form: client-side only (no backend)
  const form = document.getElementById('contactForm');
  const hint = document.getElementById('formHint');
  if (form && hint) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      // Generate a mailto link
      const subject = encodeURIComponent(`Contact Portfolio — ${name}`);
      const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailto = `mailto:hello@example.com?subject=${subject}&body=${body}`;

      hint.textContent = "Ouverture de votre client email…";
      window.location.href = mailto;

      setTimeout(() => {
        hint.textContent = "Si rien ne s'ouvre, vérifiez que vous avez un client email configuré. Sinon, utilisez les liens (LinkedIn/GitHub) à gauche.";
      }, 900);
    });
  }
})();
