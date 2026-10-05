const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
revealItems.forEach((el) => revealObserver.observe(el));

// Project filters: when a category is selected, matching projects are re-ordered
// from the first slot instead of leaving empty spaces in their original positions.
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = Array.from(document.querySelectorAll('.project-card'));

const projectSlots = [
  { left: '0%',    top: '0px',   width: '53.0%' },
  { left: '57.3%', top: '0px',   width: '42.7%' },
  { left: '0%',    top: '222px', width: '47.1%' },
  { left: '52.4%', top: '222px', width: '47.6%' },
];

function clearProjectInlineLayout(card) {
  card.style.removeProperty('left');
  card.style.removeProperty('top');
  card.style.removeProperty('width');
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;

    if (filter === 'all') {
      projectCards.forEach((card) => {
        card.classList.remove('is-filtered');
        card.removeAttribute('aria-hidden');
        clearProjectInlineLayout(card);
      });
      return;
    }

    const visibleCards = projectCards.filter((card) => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      return categories.includes(filter);
    });

    projectCards.forEach((card) => {
      const visible = visibleCards.includes(card);
      card.classList.toggle('is-filtered', !visible);
      if (visible) {
        card.removeAttribute('aria-hidden');
      } else {
        card.setAttribute('aria-hidden', 'true');
        clearProjectInlineLayout(card);
      }
    });

    visibleCards.forEach((card, index) => {
      const slot = projectSlots[index] || projectSlots[projectSlots.length - 1];
      card.style.left = slot.left;
      card.style.top = slot.top;
      card.style.width = slot.width;
    });
  });
});

// Mobile menu.
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Requested navbar behavior: hide while the page is moving and softly return when scrolling stops.
const header = document.querySelector('.site-header');
let scrollTimer;
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  const mobileMenuOpen = mainNav?.classList.contains('open');
  clearTimeout(scrollTimer);

  if (!mobileMenuOpen && currentY > 18 && Math.abs(currentY - lastScrollY) > 1) {
    header?.classList.add('is-hidden');
    header?.classList.remove('is-resting');
  }

  scrollTimer = setTimeout(() => {
    header?.classList.remove('is-hidden');
    header?.classList.add('is-resting');
  }, 260);

  lastScrollY = currentY;
}, { passive: true });

// A service button preselects the corresponding service before the contact section is reached.
const serviceSelect = document.getElementById('serviceSelect');
document.querySelectorAll('.service-request').forEach((button) => {
  button.addEventListener('click', () => {
    const service = button.dataset.service;
    if (serviceSelect && service) {
      serviceSelect.value = service;
      serviceSelect.classList.remove('service-selected');
      requestAnimationFrame(() => serviceSelect.classList.add('service-selected'));
      setTimeout(() => serviceSelect.classList.remove('service-selected'), 850);
    }
  });
});

const form = document.getElementById('contactForm');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  const name = form.elements.nombre.value.trim();
  status.textContent = `Gracias${name ? `, ${name}` : ''}. Tu mensaje está listo para ser enviado.`;
});

// Subtle parallax, preserving the same base position shown in the reference.
const heroArt = document.querySelector('.hero-art img');
window.addEventListener('pointermove', (event) => {
  if (!heroArt || window.innerWidth < 900) return;
  const x = (event.clientX / window.innerWidth - .5) * 4;
  const y = (event.clientY / window.innerHeight - .5) * 4;
  heroArt.style.translate = `${x}px ${y}px`;
}, { passive: true });
