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

  const disclosure = document.querySelector('.disclosure-modal');
  const disclosurePanel = disclosure?.querySelector('.disclosure-modal__panel');
  const disclosureClosers = disclosure?.querySelectorAll('[data-disclosure-close]');
  let lastFocusedElement;
  const closeDisclosure = () => {
    if (!disclosure || disclosure.hidden) return;
    disclosure.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocusedElement?.focus();
  };
  const openDisclosure = () => {
    if (!disclosure || !disclosure.hidden) return;
    lastFocusedElement = document.activeElement;
    disclosure.hidden = false;
    document.body.classList.add('modal-open');
    disclosurePanel?.focus();
  };
  disclosureClosers?.forEach(closer => closer.addEventListener('click', closeDisclosure));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeDisclosure();
  });
  openDisclosure();

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

  const disclaimerToggle = document.querySelector('[data-disclaimer-toggle]');
  const disclaimerMore = document.querySelector('#disclaimer-more');
  disclaimerToggle?.addEventListener('click', () => {
    const isExpanded = disclaimerToggle.getAttribute('aria-expanded') === 'true';
    disclaimerToggle.setAttribute('aria-expanded', String(!isExpanded));
    disclaimerMore.hidden = isExpanded;
    disclaimerToggle.innerHTML = isExpanded ? 'Read More <b aria-hidden="true">→</b>' : 'Read Less <b aria-hidden="true">↑</b>';
  });

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

  const marquee = document.querySelector('.comment-marquee');
  const marqueeTrack = marquee?.querySelector('.comment-marquee__track');
  let marqueeRateFrame;
  const easeMarqueeRate = targetRate => {
    const animation = marqueeTrack?.getAnimations().find(item => item.animationName === 'comment-marquee');
    if (!animation) return;
    cancelAnimationFrame(marqueeRateFrame);
    const initialRate = animation.playbackRate || 1;
    const startedAt = performance.now();
    const duration = 420;
    const updateRate = now => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.playbackRate = initialRate + (targetRate - initialRate) * eased;
      if (progress < 1) marqueeRateFrame = requestAnimationFrame(updateRate);
    };
    marqueeRateFrame = requestAnimationFrame(updateRate);
  };
  marquee?.addEventListener('pointerenter', () => easeMarqueeRate(0.62));
  marquee?.addEventListener('pointerleave', () => easeMarqueeRate(1));

  document.querySelector('.newsletter-form').addEventListener('submit', event => {
    event.preventDefault();
    const message = document.querySelector('.form-message');
    message.textContent = 'Thank you â€” youâ€™re on the list.';
    event.currentTarget.reset();
  });
});
