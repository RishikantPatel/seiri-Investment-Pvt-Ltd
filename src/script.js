/* Global site interactions: menu, scroll reveals, accordion, carousel and form feedback. */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('aureon-theme');
  const setTheme = theme => {
    const isDark = theme === 'dark';
    document.body.classList.toggle('light-mode', !isDark);
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.querySelector('.theme-toggle__label').textContent = isDark ? 'Dark' : 'Light';
    localStorage.setItem('aureon-theme', theme);
  };
  setTheme(savedTheme || 'dark');
  themeToggle.addEventListener('click', () => setTheme(document.body.classList.contains('light-mode') ? 'dark' : 'light'));

  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 16);
  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-in').forEach((el, index) => {
    if (el.classList.contains('fade-up') && el.closest('.service-grid, .course-list, .registration-grid')) el.style.transitionDelay = `${(index % 3) * 0.1}s`;
    observer.observe(el);
  });

  document.querySelectorAll('.faq-item button').forEach(button => button.addEventListener('click', () => {
    const item = button.parentElement;
    const willOpen = !item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(faq => { faq.classList.remove('active'); faq.querySelector('button').setAttribute('aria-expanded', 'false'); });
    if (willOpen) { item.classList.add('active'); button.setAttribute('aria-expanded', 'true'); }
  }));

  const track = document.querySelector('.testimonial-track');
  const dots = [...document.querySelectorAll('.carousel-dots button')];
  const carousel = document.querySelector('.carousel');
  let index = 0, timer;
  const showSlide = next => { index = (next + dots.length) % dots.length; track.style.transform = `translateX(-${index * 100}%)`; dots.forEach((dot, i) => dot.classList.toggle('active', i === index)); };
  const start = () => { timer = setInterval(() => showSlide(index + 1), 4000); };
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); clearInterval(timer); start(); }));
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', start);
  start();

  document.querySelector('.newsletter-form').addEventListener('submit', event => {
    event.preventDefault();
    const message = document.querySelector('.form-message');
    message.textContent = 'Thank you â€” youâ€™re on the list.';
    event.currentTarget.reset();
  });
});
