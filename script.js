document.addEventListener("DOMContentLoaded", () => {


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle =
    document.querySelector(".menu-toggle");

  const menuClose =
    document.querySelector(".menu-close");

  const mobileMenu =
    document.querySelector(".mobile-menu");

  const mobileOverlay =
    document.querySelector(".mobile-overlay");


  function openMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    if (mobileOverlay) {
      mobileOverlay.classList.add("active");
    }

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    document.body.classList.add(
      "menu-open"
    );

  }


  function closeMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove(
      "active"
    );

    if (mobileOverlay) {
      mobileOverlay.classList.remove(
        "active"
      );
    }

    if (menuToggle) {
      menuToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }

    document.body.classList.remove(
      "menu-open"
    );

  }


  if (menuToggle) {

    menuToggle.addEventListener(
      "click",
      openMenu
    );

  }


  if (menuClose) {

    menuClose.addEventListener(
      "click",
      closeMenu
    );

  }


  if (mobileOverlay) {

    mobileOverlay.addEventListener(
      "click",
      closeMenu
    );

  }


  document
    .querySelectorAll(
      ".mobile-menu a"
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeMenu();
      }

    }
  );


  window.addEventListener(
    "resize",
    () => {

      if (window.innerWidth > 900) {
        closeMenu();
      }

    }
  );



  /* =========================================================
     DARK MODE
  ========================================================= */

  const themeButtons =
    document.querySelectorAll(
      ".theme-toggle"
    );


  const savedTheme =
    localStorage.getItem(
      "omepikya-theme"
    );


  const systemDark =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;


  function applyTheme(theme) {

    if (theme === "dark") {

      document.documentElement
        .setAttribute(
          "data-theme",
          "dark"
        );

    } else {

      document.documentElement
        .removeAttribute(
          "data-theme"
        );

    }

    localStorage.setItem(
      "omepikya-theme",
      theme
    );

  }


  if (savedTheme) {

    applyTheme(savedTheme);

  } else if (systemDark) {

    applyTheme("dark");

  }



  themeButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const isDark =
          document.documentElement
            .getAttribute(
              "data-theme"
            ) === "dark";


        applyTheme(
          isDark
            ? "light"
            : "dark"
        );

      }
    );

  });



  /* =========================================================
     SMOOTH ANCHOR SCROLL
  ========================================================= */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const targetId =
            link.getAttribute(
              "href"
            );


          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          const header =
            document.querySelector(
              ".site-header"
            );


          const headerHeight =
            header
              ? header.offsetHeight
              : 0;


          const position =
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            headerHeight -
            16;


          window.scrollTo({
            top: position,
            behavior: "smooth"
          });

        }
      );

    });



  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const backToTop =
    document.querySelector(
      ".back-to-top"
    );


  function updateBackToTop() {

    if (!backToTop) {
      return;
    }


    if (window.scrollY > 500) {

      backToTop.classList.add(
        "visible"
      );

    } else {

      backToTop.classList.remove(
        "visible"
      );

    }

  }


  window.addEventListener(
    "scroll",
    updateBackToTop,
    {
      passive: true
    }
  );


  updateBackToTop();


  if (backToTop) {

    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }



  /* =========================================================
     SERVICE WORKER
  ========================================================= */

  if ("serviceWorker" in navigator) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register("/sw.js")
          .catch(error => {

            console.error(
              "Service worker registration failed:",
              error
            );

          });

      }
    );

  }

});