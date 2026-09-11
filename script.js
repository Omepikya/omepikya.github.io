document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     MOBILE MENU
  ====================================================== */

  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('menu-overlay');

  function openMenu() {
    if (!mobileMenu || !overlay || !menuToggle) return;

    mobileMenu.classList.add('active');
    overlay.classList.add('active');

    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!mobileMenu || !overlay || !menuToggle) return;

    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');

    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }


  /* =====================================================
     CLOSE MENU WHEN LINK IS CLICKED
  ====================================================== */

  const menuLinks = document.querySelectorAll('.mobile-menu a');

  menuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });


  /* =====================================================
     ESCAPE KEY
  ====================================================== */

  document.addEventListener('keydown', event => {

    if (
      event.key === 'Escape' &&
      mobileMenu &&
      mobileMenu.classList.contains('active')
    ) {
      closeMenu();
    }

  });


  /* =====================================================
     CLOSE MENU WHEN RESIZED TO DESKTOP
  ====================================================== */

  window.addEventListener('resize', () => {

    if (
      window.innerWidth >= 768 &&
      mobileMenu &&
      mobileMenu.classList.contains('active')
    ) {
      closeMenu();
    }

  });


  /* =====================================================
     DARK MODE
  ====================================================== */

  const darkModeCheckbox =
    document.getElementById('dark-mode-checkbox');

  const themeKey = 'omepikya-theme';

  const savedTheme =
    localStorage.getItem(themeKey);

  const prefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme =
    savedTheme || (prefersDark ? 'dark' : 'light');


  function applyTheme(theme) {

    if (theme === 'dark') {

      document.documentElement.setAttribute(
        'data-theme',
        'dark'
      );

      if (darkModeCheckbox) {
        darkModeCheckbox.checked = true;
      }

    } else {

      document.documentElement.removeAttribute(
        'data-theme'
      );

      if (darkModeCheckbox) {
        darkModeCheckbox.checked = false;
      }

    }

  }


  applyTheme(initialTheme);


  if (darkModeCheckbox) {

    darkModeCheckbox.addEventListener(
      'change',
      event => {

        const theme =
          event.target.checked
            ? 'dark'
            : 'light';

        applyTheme(theme);

        localStorage.setItem(
          themeKey,
          theme
        );

      }
    );

  }


  /* =====================================================
     SYSTEM THEME CHANGES
  ====================================================== */

  if (
    window.matchMedia &&
    !savedTheme
  ) {

    const mediaQuery =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

    const handleSystemThemeChange =
      event => {

        applyTheme(
          event.matches
            ? 'dark'
            : 'light'
        );

      };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener(
        'change',
        handleSystemThemeChange
      );
    }

  }


  /* =====================================================
     SMOOTH ANCHOR SCROLLING
  ====================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

      anchor.addEventListener(
        'click',
        event => {

          const targetId =
            anchor.getAttribute('href');

          if (
            !targetId ||
            targetId === '#'
          ) {
            return;
          }

          const target =
            document.querySelector(targetId);

          if (!target) {
            return;
          }

          event.preventDefault();

          const header =
            document.querySelector('.mobile-header');

          const headerOffset =
            header &&
            window.innerWidth < 768
              ? header.offsetHeight
              : 0;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerOffset -
            12;

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });

        }
      );

    });


  /* =====================================================
     BACK TO TOP BUTTON
  ====================================================== */

  const backToTopBtn =
    document.getElementById('back-to-top');


  if (backToTopBtn) {

    const updateBackToTop =
      () => {

        if (window.scrollY > 500) {

          backToTopBtn.classList.add(
            'visible'
          );

        } else {

          backToTopBtn.classList.remove(
            'visible'
          );

        }

      };


    window.addEventListener(
      'scroll',
      updateBackToTop,
      { passive: true }
    );


    backToTopBtn.addEventListener(
      'click',
      () => {

        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

      }
    );


    updateBackToTop();

  }


  /* =====================================================
     SERVICE WORKER REGISTRATION
  ====================================================== */

  if ('serviceWorker' in navigator) {

    window.addEventListener(
      'load',
      () => {

        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {

            console.log(
              'Omepikya ServiceWorker registered:',
              registration.scope
            );

          })
          .catch(error => {

            console.log(
              'Omepikya ServiceWorker registration failed:',
              error
            );

          });

      }
    );

  }

});