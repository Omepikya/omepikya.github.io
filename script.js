(() => {
  "use strict";

  const root = document.documentElement;

  const menuButton = document.getElementById("menuButton");
  const menuClose = document.getElementById("menuClose");
  const sideMenu = document.getElementById("sideMenu");
  const backdrop = document.getElementById("menuBackdrop");

  const THEME_KEY = "omepikya-theme";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =========================
     MOBILE MENU
     ========================= */

  let lastFocused = null;

  function setMenu(open, returnFocus = true) {
    if (!sideMenu || !backdrop || !menuButton) return;

    sideMenu.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);

    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");

    sideMenu.setAttribute("aria-hidden", String(!open));
    backdrop.setAttribute("aria-hidden", String(!open));

    if (open) {
      lastFocused = document.activeElement;
      sideMenu.removeAttribute("inert");
      if (menuClose) menuClose.focus();
    } else {
      sideMenu.setAttribute("inert", "");
      if (returnFocus && lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }
  }

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const isOpen = sideMenu?.classList.contains("open");
      setMenu(!isOpen);
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", () => setMenu(false));
  }

  if (backdrop) {
    backdrop.addEventListener("click", () => setMenu(false));
  }

  // Close menu after selecting a section, but don't steal focus back
  document.querySelectorAll('.side-menu a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => setMenu(false, false));
  });

  // Escape closes menu
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Trap focus inside the menu while it is open
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    if (!sideMenu || !sideMenu.classList.contains("open")) return;

    const focusables = sideMenu.querySelectorAll(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
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
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* =========================
     THEME
     ========================= */

  const themeButtons = document.querySelectorAll("button[data-theme]");
  const themeLabel = document.getElementById("themeLabel");

  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function applyTheme(theme) {
    const actualTheme = theme === "system" ? getSystemTheme() : theme;

    root.dataset.theme = actualTheme;
    root.dataset.themePreference = theme;

    themeButtons.forEach((button) => {
      const active = button.dataset.theme === theme;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    if (themeLabel) {
      themeLabel.textContent =
        theme.charAt(0).toUpperCase() + theme.slice(1);
    }
  }

  let savedTheme = "system";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "system";
  } catch (e) {
    // localStorage may be unavailable (private mode, etc.)
  }

  applyTheme(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.dataset.theme;
      if (!theme) return;

      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        // ignore
      }

      applyTheme(theme);
    });
  });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  function handleSystemThemeChange() {
    const preference = root.dataset.themePreference || "system";
    if (preference === "system") applyTheme("system");
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  /* =========================
     SCROLL REVEAL
     ========================= */

  const revealElements = document.querySelectorAll(
    ".feature, .steps article, .download-inner, .security-art"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* =========================
     RESPONSIVE MENU SAFETY
     ========================= */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850 && sideMenu?.classList.contains("open")) {
      setMenu(false);
    }
  });
})();