document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector(".menu-close");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileOverlay = document.querySelector(".mobile-overlay");

  function openMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    if (mobileOverlay) {
      mobileOverlay.classList.add("active");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    if (mobileOverlay) {
      mobileOverlay.classList.remove("active");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener("click", closeMenu);
  }

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });



  /* =========================================================
     DARK MODE
  ========================================================= */

  const themeButtons = document.querySelectorAll(".theme-toggle");

  const savedTheme = localStorage.getItem("omepikya-theme");

  const systemDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  function applyTheme(theme) {

    if (theme === "dark") {
      document.documentElement.setAttribute(
        "data-theme",
        "dark"
      );
    } else {
      document.documentElement.removeAttribute(
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

    button.addEventListener("click", () => {

      const isDark =
        document.documentElement.getAttribute(
          "data-theme"
        ) === "dark";

      applyTheme(
        isDark ? "light" : "dark"
      );

    });

  });



  /* =========================================================
     APP GALLERY
     Real Omepikya Expense screenshots
  ========================================================= */

  const privacySection =
    document.querySelector("#privacy");

  if (
    privacySection &&
    !document.querySelector("#app-gallery")
  ) {

    /* -------------------------------------------------------
       GALLERY STYLES
    ------------------------------------------------------- */

    const galleryStyle =
      document.createElement("style");

    galleryStyle.textContent = `

      #app-gallery {
        overflow: hidden;
      }

      .app-gallery-heading {
        max-width: 760px;
      }

      .app-gallery-heading h2 {
        margin-bottom: 16px;
      }

      .app-gallery-heading p {
        max-width: 680px;
      }

      .app-gallery-track {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 28px;
        padding: 8px 4px 24px;
      }

      .app-gallery-card {
        flex: 0 0 220px;
        position: relative;
        padding: 9px;
        border: 1px solid var(--border);
        border-radius: 28px;
        background: var(--bg-card);
        box-shadow: var(--shadow);
        cursor: pointer;
        transition:
          transform .25s ease,
          box-shadow .25s ease;
      }

      .app-gallery-card:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
      }

      .app-gallery-card:nth-child(3) {
        flex-basis: 250px;
        transform: translateY(-12px);
        box-shadow: var(--shadow-lg);
      }

      .app-gallery-card:nth-child(3):hover {
        transform: translateY(-18px);
      }

      .app-gallery-card img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 21px;
        background: var(--bg-soft);
      }

      .app-gallery-label {
        padding: 12px 5px 4px;
        text-align: center;
        color: var(--text-dark);
        font-size: 13px;
        font-weight: 700;
      }

      .app-gallery-hint {
        margin: 12px 0 0;
        text-align: center;
        color: var(--text-muted);
        font-size: 12px;
      }


      /* -------------------------------------------------------
         FULL SCREEN GALLERY
      ------------------------------------------------------- */

      .app-gallery-lightbox {
        position: fixed;
        inset: 0;
        z-index: 3000;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 24px;

        background: rgba(0, 0, 0, .88);

        opacity: 0;
        visibility: hidden;

        transition:
          opacity .25s ease,
          visibility .25s ease;

        touch-action: pan-y;
      }

      .app-gallery-lightbox.active {
        opacity: 1;
        visibility: visible;
      }


      /* -------------------------------------------------------
         SLIDE AREA
      ------------------------------------------------------- */

      .app-gallery-viewer {
        position: relative;

        width: min(92vw, 560px);
        height: 92vh;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden;

        touch-action: pan-y;
      }

      .app-gallery-slide {
        position: absolute;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        transition:
          transform .28s ease,
          opacity .28s ease;
      }

      .app-gallery-slide img {
        display: block;

        max-width: 100%;
        max-height: 88vh;

        width: auto;
        height: auto;

        border-radius: 24px;

        box-shadow:
          0 25px 80px
          rgba(0, 0, 0, .5);

        user-select: none;
        -webkit-user-drag: none;
      }


      /* -------------------------------------------------------
         TOP INFORMATION
      ------------------------------------------------------- */

      .app-gallery-info {
        position: absolute;

        top: 18px;
        left: 50%;

        transform: translateX(-50%);

        z-index: 10;

        display: flex;
        align-items: center;
        gap: 12px;

        padding: 9px 16px;

        border: 1px solid
          rgba(255,255,255,.18);

        border-radius: 999px;

        background:
          rgba(0,0,0,.42);

        backdrop-filter: blur(10px);

        color: #fff;

        white-space: nowrap;
      }

      .app-gallery-counter {
        font-size: 12px;
        opacity: .75;
      }

      .app-gallery-title {
        font-size: 14px;
        font-weight: 700;
      }


      /* -------------------------------------------------------
         CLOSE BUTTON
      ------------------------------------------------------- */

      .app-gallery-close {
        position: absolute;

        top: 18px;
        right: 18px;

        z-index: 20;

        width: 46px;
        height: 46px;

        border:
          1px solid
          rgba(255,255,255,.25);

        border-radius: 50%;

        background:
          rgba(0,0,0,.45);

        color: #fff;

        font-size: 30px;
        line-height: 1;

        cursor: pointer;
      }


      /* -------------------------------------------------------
         PREVIOUS / NEXT
      ------------------------------------------------------- */

      .app-gallery-prev,
      .app-gallery-next {
        position: absolute;

        top: 50%;

        z-index: 20;

        width: 48px;
        height: 48px;

        transform: translateY(-50%);

        border:
          1px solid
          rgba(255,255,255,.25);

        border-radius: 50%;

        background:
          rgba(0,0,0,.45);

        color: #fff;

        font-size: 30px;
        line-height: 1;

        cursor: pointer;

        transition:
          background .2s ease,
          transform .2s ease;
      }

      .app-gallery-prev {
        left: 18px;
      }

      .app-gallery-next {
        right: 18px;
      }

      .app-gallery-prev:hover,
      .app-gallery-next:hover {
        background:
          rgba(255,255,255,.18);
      }

      .app-gallery-prev:active {
        transform:
          translateY(-50%) scale(.94);
      }

      .app-gallery-next:active {
        transform:
          translateY(-50%) scale(.94);
      }


      /* -------------------------------------------------------
         MOBILE
      ------------------------------------------------------- */

      @media (max-width: 900px) {

        .app-gallery-track {
          justify-content: flex-start;

          overflow-x: auto;

          scroll-snap-type: x mandatory;

          scroll-padding-inline: 24px;

          gap: 18px;

          padding:
            8px 24px 22px;

          margin-inline: -24px;

          -webkit-overflow-scrolling: touch;

          scrollbar-width: none;
        }

        .app-gallery-track::-webkit-scrollbar {
          display: none;
        }

        .app-gallery-card,
        .app-gallery-card:nth-child(3) {

          flex-basis:
            min(76vw, 270px);

          transform: none;

          scroll-snap-align: center;
        }

        .app-gallery-card:hover,
        .app-gallery-card:nth-child(3):hover {

          transform: none;
        }

        .app-gallery-viewer {
          width: 100vw;
          height: 100vh;
        }

        .app-gallery-slide img {
          max-width: 92vw;
          max-height: 86vh;
          border-radius: 22px;
        }

        .app-gallery-info {
          top: 16px;
        }

        .app-gallery-prev,
        .app-gallery-next {
          display: none;
        }

        .app-gallery-close {
          top: 14px;
          right: 14px;
        }

      }


      @media (max-width: 520px) {

        .app-gallery-track {
          margin-inline: -16px;
          padding-inline: 16px;
        }

        .app-gallery-card,
        .app-gallery-card:nth-child(3) {
          flex-basis: 78vw;
        }

      }

    `;

    document.head.appendChild(galleryStyle);



    /* -------------------------------------------------------
       CREATE GALLERY
    ------------------------------------------------------- */

    const gallery =
      document.createElement("section");

    gallery.id = "app-gallery";

    gallery.className =
      "section section-soft";

    gallery.innerHTML = `

      <div class="container">

        <div
          class="section-heading app-gallery-heading"
        >

          <span class="section-eyebrow">
            App Gallery
          </span>

          <h2>
            See Omepikya in action.
          </h2>

          <p>
            Explore real screens from the
            Omepikya Expense app — from
            everyday transactions to deeper
            financial insights.
          </p>

        </div>


        <div
          class="app-gallery-track"
          aria-label="Omepikya app screenshots"
        >

          <button
            class="app-gallery-card"
            type="button"
            data-gallery-title="Home / Dashboard"
            data-gallery-src="assets/app-gallery/app-home.jpg"
          >
            <img
              src="assets/app-gallery/app-home.jpg"
              alt="Omepikya Expense Home dashboard"
              loading="lazy"
            >

            <div class="app-gallery-label">
              Home / Dashboard
            </div>
          </button>


          <button
            class="app-gallery-card"
            type="button"
            data-gallery-title="Add Expense"
            data-gallery-src="assets/app-gallery/app-add-expense.jpg"
          >
            <img
              src="assets/app-gallery/app-add-expense.jpg"
              alt="Omepikya Expense Add Expense screen"
              loading="lazy"
            >

            <div class="app-gallery-label">
              Add Expense
            </div>
          </button>


          <button
            class="app-gallery-card"
            type="button"
            data-gallery-title="Spending Analytics"
            data-gallery-src="assets/app-gallery/app-analytics.jpg"
          >
            <img
              src="assets/app-gallery/app-analytics.jpg"
              alt="Omepikya Expense Spending Analytics screen"
              loading="lazy"
            >

            <div class="app-gallery-label">
              Spending Analytics
            </div>
          </button>


          <button
            class="app-gallery-card"
            type="button"
            data-gallery-title="Cash-Flow Calendar"
            data-gallery-src="assets/app-gallery/app-cash-flow.jpg"
          >
            <img
              src="assets/app-gallery/app-cash-flow.jpg"
              alt="Omepikya Expense Cash-Flow Calendar screen"
              loading="lazy"
            >

            <div class="app-gallery-label">
              Cash-Flow Calendar
            </div>
          </button>


          <button
            class="app-gallery-card"
            type="button"
            data-gallery-title="My Profile"
            data-gallery-src="assets/app-gallery/app-profile.jpg"
          >
            <img
              src="assets/app-gallery/app-profile.jpg"
              alt="Omepikya Expense My Profile screen"
              loading="lazy"
            >

            <div class="app-gallery-label">
              My Profile
            </div>
          </button>

        </div>


        <p class="app-gallery-hint">
          Tap a screen to view the full gallery.
        </p>

      </div>

    `;

    privacySection.parentNode.insertBefore(
      gallery,
      privacySection
    );



    /* =======================================================
       CREATE FULL SCREEN VIEWER
    ======================================================= */

    const lightbox =
      document.createElement("div");

    lightbox.className =
      "app-gallery-lightbox";

    lightbox.setAttribute(
      "role",
      "dialog"
    );

    lightbox.setAttribute(
      "aria-modal",
      "true"
    );

    lightbox.innerHTML = `

      <button
        class="app-gallery-close"
        type="button"
        aria-label="Close gallery"
      >
        ×
      </button>


      <div class="app-gallery-info">

        <span class="app-gallery-title"></span>

        <span class="app-gallery-counter"></span>

      </div>


      <button
        class="app-gallery-prev"
        type="button"
        aria-label="Previous screen"
      >
        ‹
      </button>


      <div class="app-gallery-viewer">

        <div class="app-gallery-slide">

          <img
            src=""
            alt=""
          >

        </div>

      </div>


      <button
        class="app-gallery-next"
        type="button"
        aria-label="Next screen"
      >
        ›
      </button>

    `;

    document.body.appendChild(lightbox);



    /* =======================================================
       GALLERY DATA
    ======================================================= */

    const cards = Array.from(
      gallery.querySelectorAll(
        ".app-gallery-card"
      )
    );

    const galleryItems = cards.map(card => ({
      title:
        card.getAttribute(
          "data-gallery-title"
        ),

      src:
        card.getAttribute(
          "data-gallery-src"
        )
    }));

    let currentIndex = 0;



    /* =======================================================
       VIEWER ELEMENTS
    ======================================================= */

    const viewer =
      lightbox.querySelector(
        ".app-gallery-viewer"
      );

    const slide =
      lightbox.querySelector(
        ".app-gallery-slide"
      );

    const image =
      slide.querySelector("img");

    const title =
      lightbox.querySelector(
        ".app-gallery-title"
      );

    const counter =
      lightbox.querySelector(
        ".app-gallery-counter"
      );

    const closeButton =
      lightbox.querySelector(
        ".app-gallery-close"
      );

    const previousButton =
      lightbox.querySelector(
        ".app-gallery-prev"
      );

    const nextButton =
      lightbox.querySelector(
        ".app-gallery-next"
      );



    /* =======================================================
       SHOW SLIDE
    ======================================================= */

    function showSlide(index, direction = 0) {

      if (!galleryItems.length) return;

      if (index < 0) {
        index =
          galleryItems.length - 1;
      }

      if (index >= galleryItems.length) {
        index = 0;
      }

      currentIndex = index;

      const item =
        galleryItems[currentIndex];


      /*
       * Small slide transition.
       */

      if (direction !== 0) {

        slide.style.transition =
          "none";

        slide.style.transform =
          `translateX(${direction * 35}px)`;

        slide.style.opacity =
          "0";

        requestAnimationFrame(() => {

          image.src =
            item.src;

          image.alt =
            item.title;

          title.textContent =
            item.title;

          counter.textContent =
            `${currentIndex + 1} / ${galleryItems.length}`;

          requestAnimationFrame(() => {

            slide.style.transition =
              "transform .28s ease, opacity .28s ease";

            slide.style.transform =
              "translateX(0)";

            slide.style.opacity =
              "1";

          });

        });

      } else {

        image.src =
          item.src;

        image.alt =
          item.title;

        title.textContent =
          item.title;

        counter.textContent =
          `${currentIndex + 1} / ${galleryItems.length}`;

        slide.style.transform =
          "translateX(0)";

        slide.style.opacity =
          "1";

      }

    }



    /* =======================================================
       OPEN GALLERY
    ======================================================= */

    cards.forEach((card, index) => {

      card.addEventListener(
        "click",
        () => {

          currentIndex = index;

          showSlide(
            currentIndex
          );

          lightbox.classList.add(
            "active"
          );

          document.body.classList.add(
            "menu-open"
          );

        }
      );

    });



    /* =======================================================
       CLOSE GALLERY
    ======================================================= */

    function closeGallery() {

      lightbox.classList.remove(
        "active"
      );

      document.body.classList.remove(
        "menu-open"
      );

      setTimeout(() => {

        if (
          !lightbox.classList.contains(
            "active"
          )
        ) {

          image.removeAttribute(
            "src"
          );

        }

      }, 250);

    }

    closeButton.addEventListener(
      "click",
      closeGallery
    );



    /* =======================================================
       PREVIOUS
    ======================================================= */

    function showPrevious() {

      showSlide(
        currentIndex - 1,
        -1
      );

    }

    previousButton.addEventListener(
      "click",
      showPrevious
    );



    /* =======================================================
       NEXT
    ======================================================= */

    function showNext() {

      showSlide(
        currentIndex + 1,
        1
      );

    }

    nextButton.addEventListener(
      "click",
      showNext
    );



    /* =======================================================
       BACKDROP CLICK
    ======================================================= */

    lightbox.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {

          closeGallery();

        }

      }
    );



    /* =======================================================
       KEYBOARD CONTROLS
    ======================================================= */

    document.addEventListener(
      "keydown",
      event => {

        if (
          !lightbox.classList.contains(
            "active"
          )
        ) {
          return;
        }

        if (event.key === "Escape") {
          closeGallery();
        }

        if (
          event.key === "ArrowLeft"
        ) {
          showPrevious();
        }

        if (
          event.key === "ArrowRight"
        ) {
          showNext();
        }

      }
    );



    /* =======================================================
       TOUCH / SWIPE CONTROLS
    ======================================================= */

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const SWIPE_THRESHOLD = 55;

    viewer.addEventListener(
      "touchstart",
      event => {

        if (
          !lightbox.classList.contains(
            "active"
          )
        ) {
          return;
        }

        const touch =
          event.changedTouches[0];

        touchStartX =
          touch.clientX;

        touchStartY =
          touch.clientY;

        touchEndX =
          touch.clientX;

        touchEndY =
          touch.clientY;

      },
      {
        passive: true
      }
    );


    viewer.addEventListener(
      "touchmove",
      event => {

        if (
          !lightbox.classList.contains(
            "active"
          )
        ) {
          return;
        }

        const touch =
          event.changedTouches[0];

        touchEndX =
          touch.clientX;

        touchEndY =
          touch.clientY;

      },
      {
        passive: true
      }
    );


    viewer.addEventListener(
      "touchend",
      () => {

        if (
          !lightbox.classList.contains(
            "active"
          )
        ) {
          return;
        }

        const deltaX =
          touchEndX -
          touchStartX;

        const deltaY =
          touchEndY -
          touchStartY;


        /*
         * Only treat it as a swipe when
         * horizontal movement is dominant.
         */

        if (
          Math.abs(deltaX) >
            SWIPE_THRESHOLD &&
          Math.abs(deltaX) >
            Math.abs(deltaY)
        ) {

          if (deltaX < 0) {
            showNext();
          } else {
            showPrevious();
          }

        }

      },
      {
        passive: true
      }
    );

  }



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
            target.getBoundingClientRect().top +
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

    if (
      window.scrollY > 500
    ) {

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

  if (
    "serviceWorker" in navigator
  ) {

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