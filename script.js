/* Omepikya Expense Web — interaction layer */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const body = document.body;

  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  let menuReturnFocus = null;

  if (menuToggle && mobileMenu) {
    if (!mobileMenu.id) mobileMenu.id = "mobile-navigation";
    menuToggle.setAttribute("aria-controls", mobileMenu.id);
    mobileMenu.setAttribute("aria-hidden", "true");
  }

  function openMenu() {
    if (!mobileMenu) return;
    menuReturnFocus = document.activeElement;
    mobileMenu.classList.add("active");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileOverlay?.classList.add("active");
    body.classList.add("menu-open");
    menuToggle?.setAttribute("aria-expanded", "true");
    menuClose?.focus();
  }

  function closeMenu(restoreFocus = true) {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("active");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileOverlay?.classList.remove("active");
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    if (restoreFocus && menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus();
    menuReturnFocus = null;
  }

  menuToggle?.addEventListener("click", () => {
    const open = mobileMenu?.classList.contains("active");
    open ? closeMenu() : openMenu();
  });
  menuClose?.addEventListener("click", () => closeMenu());
  mobileOverlay?.addEventListener("click", () => closeMenu());

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => closeMenu(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mobileMenu?.classList.contains("active")) closeMenu(false);
  });

  const themeButtons = document.querySelectorAll(".theme-toggle, .mobile-theme-toggle");
  const savedTheme = localStorage.getItem("omepikya-theme");
  const systemDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme, persist = true) {
    const dark = theme === "dark";
    if (dark) root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    if (persist) localStorage.setItem("omepikya-theme", dark ? "dark" : "light");
    themeButtons.forEach(button => button.setAttribute("aria-pressed", dark ? "true" : "false"));
  }

  if (savedTheme) applyTheme(savedTheme, false);
  else if (systemDark) applyTheme("dark", false);
  else applyTheme("light", false);

  themeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const dark = root.getAttribute("data-theme") === "dark";
      applyTheme(dark ? "light" : "dark");
    });
  });

  const privacySection = document.querySelector("#privacy");
  const gallerySources = [
    ["Home / Dashboard", "assets/app-gallery/app-home.jpg", "Omepikya Expense Home dashboard"],
    ["Add Expense", "assets/app-gallery/app-add-expense.jpg", "Omepikya Expense Add Expense screen"],
    ["Spending Analytics", "assets/app-gallery/app-analytics.jpg", "Omepikya Expense Spending Analytics screen"],
    ["Cash-Flow Calendar", "assets/app-gallery/app-cash-flow.jpg", "Omepikya Expense Cash-Flow Calendar screen"],
    ["My Profile", "assets/app-gallery/app-profile.jpg", "Omepikya Expense My Profile screen"]
  ];

  if (privacySection) {
    let gallery = document.querySelector("#app-gallery");
    if (!gallery) {
      gallery = document.createElement("section");
      gallery.id = "app-gallery";
      gallery.className = "section section-soft";
      gallery.innerHTML = `
        <div class="container">
          <div class="section-heading app-gallery-heading">
            <span class="section-eyebrow">App Gallery</span>
            <h2>See Omepikya in action.</h2>
            <p>Explore real screens from the Omepikya Expense app — from everyday transactions to deeper financial insights.</p>
          </div>
          <div class="app-gallery-track" aria-label="Omepikya app screenshots"></div>
          <p class="app-gallery-hint">Tap a screen to view the full gallery.</p>
        </div>`;
      privacySection.parentNode.insertBefore(gallery, privacySection);
    }

    const track = gallery.querySelector(".app-gallery-track");
    if (!track) return;
    if (!track.children.length) {
      gallerySources.forEach(([title, src, alt]) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "app-gallery-card";
        card.setAttribute("aria-label", `View ${title} screenshot`);
        card.innerHTML = `<img src="${src}" alt="${alt}" loading="lazy" draggable="false"><div class="app-gallery-label">${title}</div>`;
        track.appendChild(card);
      });
    }

    const lightbox = document.createElement("div");
    lightbox.className = "app-gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Omepikya app screenshot gallery");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.hidden = true;
    lightbox.innerHTML = `
      <button class="app-gallery-close" type="button" aria-label="Close gallery">×</button>
      <div class="app-gallery-info"><span class="app-gallery-title"></span><span class="app-gallery-counter"></span></div>
      <button class="app-gallery-prev" type="button" aria-label="Previous screen">‹</button>
      <div class="app-gallery-viewer">
        <div class="app-gallery-slide-track">
          <div class="app-gallery-slide" data-slide="0"><img src="" alt="" draggable="false"></div>
          <div class="app-gallery-slide" data-slide="1"><img src="" alt="" draggable="false"></div>
        </div>
      </div>
      <button class="app-gallery-next" type="button" aria-label="Next screen">›</button>`;
    body.appendChild(lightbox);

    const cards = Array.from(gallery.querySelectorAll(".app-gallery-card"));
    const slides = Array.from(lightbox.querySelectorAll(".app-gallery-slide"));
    const images = slides.map(slide => slide.querySelector("img"));
    const title = lightbox.querySelector(".app-gallery-title");
    const counter = lightbox.querySelector(".app-gallery-counter");
    const closeButton = lightbox.querySelector(".app-gallery-close");
    const previousButton = lightbox.querySelector(".app-gallery-prev");
    const nextButton = lightbox.querySelector(".app-gallery-next");
    const viewer = lightbox.querySelector(".app-gallery-viewer");
    let currentIndex = 0;
    let activeSlide = 0;
    let galleryReturnFocus = null;
    let isAnimating = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerActive = false;
    const reducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    function updateInfo() {
      const item = gallerySources[currentIndex];
      title.textContent = item[0];
      counter.textContent = `${currentIndex + 1} / ${gallerySources.length}`;
    }

    function setImage(index, item) {
      images[index].src = item[1];
      images[index].alt = item[2];
    }

    function prepareSlides() {
      slides.forEach((slide, i) => {
        slide.style.transition = "none";
        slide.style.transform = "translateX(0)";
        slide.style.opacity = i === activeSlide ? "1" : "0";
        slide.style.zIndex = i === activeSlide ? "2" : "1";
      });
    }

    function openGallery(index) {
      currentIndex = index;
      activeSlide = 0;
      galleryReturnFocus = document.activeElement;
      setImage(0, gallerySources[currentIndex]);
      images[1].removeAttribute("src");
      images[1].alt = "";
      prepareSlides();
      updateInfo();
      lightbox.hidden = false;
      lightbox.classList.add("active");
      lightbox.setAttribute("aria-hidden", "false");
      body.classList.add("menu-open");
      closeButton.focus();
    }

    function closeGallery(restoreFocus = true) {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.hidden = true;
      body.classList.remove("menu-open");
      isAnimating = false;
      if (restoreFocus && galleryReturnFocus instanceof HTMLElement) galleryReturnFocus.focus();
      galleryReturnFocus = null;
    }

    function navigateTo(nextIndex, direction) {
      if (isAnimating || nextIndex === currentIndex) return;
      nextIndex = (nextIndex + gallerySources.length) % gallerySources.length;
      isAnimating = true;
      const incoming = activeSlide === 0 ? 1 : 0;
      const current = activeSlide;
      setImage(incoming, gallerySources[nextIndex]);
      slides[incoming].style.transition = "none";
      slides[current].style.transition = "none";
      slides[incoming].style.zIndex = "3";
      slides[incoming].style.transform = `translateX(${direction * 100}%)`;
      slides[incoming].style.opacity = "1";
      void slides[incoming].offsetWidth;
      const transition = reducedMotion() ? "none" : "transform .32s cubic-bezier(.22,.61,.36,1), opacity .32s ease";
      slides[current].style.transition = transition;
      slides[incoming].style.transition = transition;
      slides[current].style.transform = `translateX(${direction * -100}%)`;
      slides[current].style.opacity = "0";
      slides[incoming].style.transform = "translateX(0)";
      currentIndex = nextIndex;
      activeSlide = incoming;
      updateInfo();
      const finish = () => {
        slides[current].style.transition = "none";
        slides[current].style.transform = "translateX(0)";
        slides[current].style.opacity = "0";
        slides[current].style.zIndex = "1";
        slides[incoming].style.transition = "none";
        slides[incoming].style.transform = "translateX(0)";
        slides[incoming].style.opacity = "1";
        slides[incoming].style.zIndex = "2";
        isAnimating = false;
      };
      if (reducedMotion()) finish(); else window.setTimeout(finish, 340);
    }

    cards.forEach((card, index) => card.addEventListener("click", () => openGallery(index)));
    nextButton.addEventListener("click", () => navigateTo(currentIndex + 1, 1));
    previousButton.addEventListener("click", () => navigateTo(currentIndex - 1, -1));
    closeButton.addEventListener("click", () => closeGallery());
    lightbox.addEventListener("click", event => {
      if (event.target === lightbox) closeGallery();
    });

    document.addEventListener("keydown", event => {
      if (lightbox.classList.contains("active")) {
        if (event.key === "Escape") { event.preventDefault(); closeGallery(); return; }
        if (event.key === "ArrowLeft") { event.preventDefault(); navigateTo(currentIndex - 1, -1); return; }
        if (event.key === "ArrowRight") { event.preventDefault(); navigateTo(currentIndex + 1, 1); return; }
        if (event.key === "Tab") {
          const focusables = [closeButton, previousButton, nextButton].filter(el => el && getComputedStyle(el).display !== "none");
          if (!focusables.length) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }

      if (mobileMenu?.classList.contains("active") && event.key === "Escape") {
        event.preventDefault(); closeMenu();
      }
    });

    viewer.addEventListener("pointerdown", event => {
      if (isAnimating) return;
      pointerActive = true;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      try { viewer.setPointerCapture(event.pointerId); } catch (_) {}
    });
    viewer.addEventListener("pointerup", event => {
      if (!pointerActive) return;
      pointerActive = false;
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) navigateTo(currentIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    viewer.addEventListener("pointercancel", () => { pointerActive = false; });

    
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const header = document.querySelector(".site-header");
      const top = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 16;
      window.scrollTo({ top, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      history.replaceState(null, "", targetId);
    });
  });

  const backToTop = document.querySelector(".back-to-top");
  function updateBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("visible", window.scrollY > 500);
  }
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(error => console.error("Service worker registration failed:", error));
    });
  }
});
