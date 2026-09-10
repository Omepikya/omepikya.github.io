(() => {
"use strict";

const root = document.documentElement;

const menuButton = document.getElementById("menuButton");
const menuClose = document.getElementById("menuClose");
const sideMenu = document.getElementById("sideMenu");
const backdrop = document.getElementById("menuBackdrop");

const THEME_KEY = "omepikya-theme";
const VALID_THEMES = new Set(["light", "dark", "system"]);

const reduceMotion = window.matchMedia(
"(prefers-reduced-motion: reduce)"
).matches;

/* =========================
MOBILE MENU
========================= */

let lastFocused = null;

function getMenuFocusables() {
if (!sideMenu) return [];

return Array.from(
  sideMenu.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
).filter((element) => {
  return !element.hasAttribute("hidden") &&
    element.getAttribute("aria-hidden") !== "true";
});

}

function setMenu(open, returnFocus = true) {
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

if (open) {
  lastFocused = document.activeElement;

  sideMenu.removeAttribute("inert");

  requestAnimationFrame(() => {
    if (menuClose) {
      menuClose.focus();
    }
  });
} else {
  sideMenu.setAttribute("inert", "");

  if (
    returnFocus &&
    lastFocused &&
    typeof lastFocused.focus === "function"
  ) {
    requestAnimationFrame(() => lastFocused.focus());
  }

  lastFocused = null;
}

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

/*

* Close menu after selecting an internal navigation link.
  */
  document
  .querySelectorAll('.side-menu a[href^="#"]')
  .forEach((link) => {
  link.addEventListener("click", () => {
  setMenu(false, false);
  });
  });

/*

* Escape closes the menu.
  */
  document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && sideMenu?.classList.contains("open")) {
  setMenu(false);
  }
  });

/*

* Focus trap.
  */
  document.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  if (!sideMenu?.classList.contains("open")) return;

const focusables = getMenuFocusables();

if (!focusables.length) return;

const first = focusables[0];
const last = focusables[focusables.length - 1];

if (event.shiftKey && document.activeElement === first) {
  event.preventDefault();
  last.focus();
  return;
}

if (!event.shiftKey && document.activeElement === last) {
  event.preventDefault();
  first.focus();
}

});

/*

* Prevent accidental focus escaping the menu.
  */
  document.addEventListener("focusin", (event) => {
  if (!sideMenu?.classList.contains("open")) return;
  if (sideMenu.contains(event.target)) return;

const focusables = getMenuFocusables();

if (focusables.length) {
  event.preventDefault();
  focusables[0].focus();
}

});

/* =========================
SMOOTH SCROLL
========================= */

document
.querySelectorAll('a[href^="#"]')
.forEach((link) => {
link.addEventListener("click", (event) => {
const selector = link.getAttribute("href");

    if (!selector || selector === "#") return;

    let target = null;

    try {
      target = document.querySelector(selector);
    } catch (error) {
      return;
    }

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });

    /*
     * Update URL without causing an additional browser jump.
     */
    if (history.replaceState) {
      try {
        history.replaceState(null, "", selector);
      } catch (error) {
        // Ignore unsupported history operations.
      }
    }
  });
});

/* =========================
THEME
========================= */

const themeButtons = document.querySelectorAll(
"button[data-theme]"
);

const themeLabel = document.getElementById("themeLabel");

function getSystemTheme() {
return window.matchMedia(
"(prefers-color-scheme: light)"
).matches
? "light"
: "dark";
}

function normaliseTheme(theme) {
return VALID_THEMES.has(theme) ? theme : "system";
}

function applyTheme(theme) {
const preference = normaliseTheme(theme);

const actualTheme =
  preference === "system"
    ? getSystemTheme()
    : preference;

root.dataset.theme = actualTheme;
root.dataset.themePreference = preference;

themeButtons.forEach((button) => {
  const active = button.dataset.theme === preference;

  button.classList.toggle("active", active);
  button.setAttribute("aria-pressed", String(active));
});

if (themeLabel) {
  themeLabel.textContent =
    preference.charAt(0).toUpperCase() +
    preference.slice(1);
}

}

let savedTheme = "system";

try {
const storedTheme = localStorage.getItem(THEME_KEY);

if (storedTheme && VALID_THEMES.has(storedTheme)) {
  savedTheme = storedTheme;
}

} catch (error) {
savedTheme = "system";
}

applyTheme(savedTheme);

themeButtons.forEach((button) => {
button.addEventListener("click", () => {
const theme = normaliseTheme(button.dataset.theme);

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Theme still works for the current session.
  }

  applyTheme(theme);
});

});

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

const revealElements = document.querySelectorAll(
".feature, .steps article, .download-inner, .security-art, .privacy-grid article"
);

if (
!reduceMotion &&
"IntersectionObserver" in window
) {
const observer = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.08,
    rootMargin: "0px 0px -30px 0px"
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

const desktopBreakpoint = window.matchMedia(
"(min-width: 900px)"
);

function handleDesktopBreakpoint(event) {
if (
event.matches &&
sideMenu?.classList.contains("open")
) {
setMenu(false, false);
}
}

if (desktopBreakpoint.addEventListener) {
desktopBreakpoint.addEventListener(
"change",
handleDesktopBreakpoint
);
} else if (desktopBreakpoint.addListener) {
desktopBreakpoint.addListener(
handleDesktopBreakpoint
);
}

/*

* If the page loads at desktop width, make sure
* the mobile menu starts in a closed/inert state.
  */
  if (sideMenu && !sideMenu.classList.contains("open")) {
  sideMenu.setAttribute("inert", "");
  }
  })();