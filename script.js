// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Reveal elements as they enter the screen
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    threshold: 0.08
  }
);

// Elements that should animate
document
  .querySelectorAll(
    '.feature, .steps article, .download-inner, .security-art'
  )
  .forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(18px)';
    element.style.transition =
      'opacity 0.6s ease, transform 0.6s ease';

    observer.observe(element);
  });

// Animation state
const animationStyle = document.createElement('style');

animationStyle.textContent = `
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;

document.head.appendChild(animationStyle);