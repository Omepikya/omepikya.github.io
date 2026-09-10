(() => {
  "use strict";

  const root = document.documentElement;

  /* =========================
     MOBILE MENU
     ========================= */

  const menuButton = document.getElementById("menuButton");
  const menuClose = document.getElementById("menuClose");
  const sideMenu = document.getElementById("sideMenu");
  const backdrop = document.getElementById("menuBackdrop");

  function setMenu(open) {
    if (!sideMenu || !backdrop || !menuButton) return;

    sideMenu.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );

    sideMenu.setAttribute("aria-hidden", String(!open));
    backdrop.setAttribute("aria-hidden", String(!open));
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const isOpen = sideMenu?.classList.contains("open");
      setMenu(!isOpen);
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", () => {
      setMenu(false);
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => {
      setMenu(false);
    });
  }

  /* Close menu after selecting a section */
  document
    .querySelectorAll('.side-menu a[href^="#"]')
    .forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
      });
    });

  /* Close menu with Escape */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  /* =========================
     SMOOTH SCROLL
     ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");

      if (!selector || selector === "#") return;

      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  /* =========================
     THEME
     ========================= */

  const themeButtons =
    document.querySelectorAll("[data-theme]");

  const themeLabel =
    document.getElementById("themeLabel");

  const THEME_KEY = "omepikya-theme";

  function getSystemTheme() {
    return window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    const actualTheme =
      theme === "system"
        ? getSystemTheme()
        : theme;

    root.dataset.theme = actualTheme;
    root.dataset.themePreference = theme;

    themeButtons.forEach((button) => {
      const active =
        button.dataset.theme === theme;

      button.classList.toggle("active", active);

      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    });

    if (themeLabel) {
      themeLabel.textContent =
        theme.charAt(0).toUpperCase() +
        theme.slice(1);
    }
  }

  const savedTheme =
    localStorage.getItem(THEME_KEY) || "system";

  applyTheme(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;

      if (!theme) return;

      localStorage.setItem(THEME_KEY, theme);

      applyTheme(theme);
    });
  });

  /* React to system theme changes */
  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: light)"
  );

  function handleSystemThemeChange() {
    const preference =
      root.dataset.themePreference || "system";

    if (preference === "system") {
      applyTheme("system");
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(
      handleSystemThemeChange
    );
  }

  /* =========================
     SCROLL REVEAL
     ========================= */

  const revealElements =
    document.querySelectorAll(
      ".feature, .steps article, .download-inner, .security-art"
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
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.08
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  /* =========================
     RESPONSIVE MENU SAFETY
     ========================= */

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 850 &&
      sideMenu?.classList.contains("open")
    ) {
      setMenu(false);
    }
  });

})();