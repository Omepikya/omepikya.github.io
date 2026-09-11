(() => {
  "use strict";

  const root = document.documentElement;

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const menuButton =
    document.getElementById("menuButton");

  const menuClose =
    document.getElementById("menuClose");

  const sideMenu =
    document.getElementById("sideMenu");

  const backdrop =
    document.getElementById("menuBackdrop");

  function setMenu(open) {
    if (
      !menuButton ||
      !sideMenu ||
      !backdrop
    ) {
      return;
    }

    sideMenu.classList.toggle(
      "open",
      open
    );

    backdrop.classList.toggle(
      "open",
      open
    );

    document.body.classList.toggle(
      "menu-open",
      open
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );

    menuButton.setAttribute(
      "aria-label",
      open
        ? "Close menu"
        : "Open menu"
    );

    sideMenu.setAttribute(
      "aria-hidden",
      String(!open)
    );

    backdrop.setAttribute(
      "aria-hidden",
      String(!open)
    );

    if (open && menuClose) {
      requestAnimationFrame(() => {
        menuClose.focus();
      });
    }
  }

  if (menuButton) {
    menuButton.addEventListener(
      "click",
      () => {
        const isOpen =
          sideMenu &&
          sideMenu.classList.contains(
            "open"
          );

        setMenu(!isOpen);
      }
    );
  }

  if (menuClose) {
    menuClose.addEventListener(
      "click",
      () => setMenu(false)
    );
  }

  if (backdrop) {
    backdrop.addEventListener(
      "click",
      () => setMenu(false)
    );
  }

  document
    .querySelectorAll(
      '.side-menu a[href^="#"]'
    )
    .forEach((link) => {
      link.addEventListener(
        "click",
        () => setMenu(false)
      );
    });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        setMenu(false);
      }
    }
  );


  // ==========================================
  // SMOOTH NAVIGATION
  // ==========================================

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        (event) => {

          const selector =
            link.getAttribute("href");

          if (
            !selector ||
            selector === "#"
          ) {
            return;
          }

          const target =
            document.querySelector(
              selector
            );

          if (!target) {
            return;
          }

          event.preventDefault();

          const offset =
            window.innerWidth <= 850
              ? 18
              : 0;

          const targetTop =
            target.getBoundingClientRect()
              .top +
            window.scrollY -
            offset;

          window.scrollTo({
            top: Math.max(
              0,
              targetTop
            ),
            left: 0,
            behavior: "smooth"
          });

          try {
            history.replaceState(
              null,
              "",
              selector
            );
          } catch (_) {}
        }
      );

    });


  // ==========================================
  // DARK MODE
  // ==========================================

  const THEME_KEY =
    "omepikya-theme";

  const darkToggle =
    document.getElementById(
      "darkModeToggle"
    );

  function getSystemTheme() {
    return window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(
        THEME_KEY
      );
    } catch (_) {
      return null;
    }
  }

  function applyTheme(theme) {

    const actual =
      theme === "dark" ||
      theme === "light"
        ? theme
        : getSystemTheme();

    root.dataset.theme =
      actual;

    if (darkToggle) {
      darkToggle.checked =
        actual === "dark";
    }
  }

  applyTheme(
    getStoredTheme() ||
    getSystemTheme()
  );


  if (darkToggle) {

    darkToggle.addEventListener(
      "change",
      () => {

        const theme =
          darkToggle.checked
            ? "dark"
            : "light";

        try {
          localStorage.setItem(
            THEME_KEY,
            theme
          );
        } catch (_) {}

        applyTheme(theme);
      }
    );

  }


  const mediaQuery =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

  function handleSystemThemeChange() {

    if (!getStoredTheme()) {
      applyTheme(
        getSystemTheme()
      );
    }

  }

  if (
    mediaQuery.addEventListener
  ) {

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );

  } else if (
    mediaQuery.addListener
  ) {

    mediaQuery.addListener(
      handleSystemThemeChange
    );

  }


  // ==========================================
  // SCROLL REVEAL
  // ==========================================

  const revealElements =
    document.querySelectorAll(
      [
        ".feature",
        ".steps article",
        ".download-inner",
        ".security-art",
        ".privacy-inner",
        ".terms-inner"
      ].join(", ")
    );

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  if (
    !reduceMotion &&
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.08
        }
      );

    revealElements.forEach(
      (element) => {
        observer.observe(element);
      }
    );

  } else {

    revealElements.forEach(
      (element) => {
        element.classList.add(
          "visible"
        );
      }
    );

  }


  // ==========================================
  // VIEWPORT SAFETY
  // ==========================================

  function resetHorizontalScroll() {

    if (
      window.scrollX !== 0
    ) {
      window.scrollTo({
        left: 0,
        top: window.scrollY,
        behavior: "auto"
      });
    }

    document.documentElement.scrollLeft = 0;

    if (document.body) {
      document.body.scrollLeft = 0;
    }
  }


  window.addEventListener(
    "load",
    () => {
      resetHorizontalScroll();
    }
  );


  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );

      resizeTimer =
        setTimeout(() => {

          resetHorizontalScroll();

          if (
            window.innerWidth > 850 &&
            sideMenu &&
            sideMenu.classList.contains(
              "open"
            )
          ) {
            setMenu(false);
          }

        }, 100);

    }
  );

})();