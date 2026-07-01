const heroVideo = document.getElementById('hero-video');
const heroFallback = document.getElementById('hero-fallback');

if (window.innerWidth > 760) {
    const source = document.createElement('source');
    source.src = 'Assets/coffee_beans.mp4';
    source.type = 'video/mp4';
    heroVideo.appendChild(source);
    heroVideo.load();
    heroVideo.play();

    heroVideo.classList.remove('hidden');
    heroFallback.classList.add('hidden');
}

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach((el) => observer.observe(el));

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    status.textContent = 'Please fill in every field before sending.';
    return;
  }

  const name = form.name.value.trim();

  status.textContent = `Thanks, ${name} — we'll be in touch soon.`;
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});