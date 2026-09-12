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
     APP GALLERY
     Real Omepikya Expense app screenshots
  ========================================================= */

  const privacySection =
    document.querySelector(
      "#privacy"
    );


  if (
    privacySection &&
    !document.querySelector(
      "#app-gallery"
    )
  ) {


    /* ---------------------------------------------------------
       GALLERY STYLES
    --------------------------------------------------------- */

    const galleryStyle =
      document.createElement(
        "style"
      );


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
        cursor: zoom-in;
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
         LIGHTBOX
      ------------------------------------------------------- */

      .app-gallery-lightbox {
        position: fixed;
        inset: 0;
        z-index: 3000;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 24px;

        background:
          rgba(0, 0, 0, .80);

        opacity: 0;
        visibility: hidden;

        transition:
          opacity .2s ease,
          visibility .2s ease;
      }


      .app-gallery-lightbox.active {
        opacity: 1;
        visibility: visible;
      }


      .app-gallery-lightbox img {
        display: block;

        max-width:
          min(92vw, 520px);

        max-height:
          90vh;

        width: auto;
        height: auto;

        border-radius: 24px;

        box-shadow:
          0 25px 80px
          rgba(0, 0, 0, .45);
      }


      .app-gallery-close {
        position: absolute;

        top: 18px;
        right: 18px;

        width: 44px;
        height: 44px;

        border:
          1px solid
          rgba(255,255,255,.25);

        border-radius: 50%;

        background:
          rgba(0,0,0,.35);

        color: #fff;

        font-size: 28px;
        line-height: 1;

        cursor: pointer;
      }


      /* -------------------------------------------------------
         TABLET / MOBILE
      ------------------------------------------------------- */

      @media (max-width: 900px) {

        .app-gallery-track {

          justify-content: flex-start;

          overflow-x: auto;

          scroll-snap-type:
            x mandatory;

          scroll-padding-inline:
            24px;

          gap: 18px;

          padding:
            8px 24px 22px;

          margin-inline:
            -24px;

          -webkit-overflow-scrolling:
            touch;

          scrollbar-width:
            none;
        }


        .app-gallery-track::-webkit-scrollbar {
          display: none;
        }


        .app-gallery-card,
        .app-gallery-card:nth-child(3) {

          flex-basis:
            min(76vw, 270px);

          transform: none;

          scroll-snap-align:
            center;
        }


        .app-gallery-card:hover,
        .app-gallery-card:nth-child(3):hover {

          transform: none;
        }

      }


      @media (max-width: 520px) {

        .app-gallery-track {

          margin-inline:
            -16px;

          padding-inline:
            16px;
        }


        .app-gallery-card,
        .app-gallery-card:nth-child(3) {

          flex-basis:
            78vw;
        }

      }

    `;


    document.head.appendChild(
      galleryStyle
    );



    /* ---------------------------------------------------------
       CREATE GALLERY
    --------------------------------------------------------- */

    const gallery =
      document.createElement(
        "section"
      );


    gallery.id =
      "app-gallery";


    gallery.className =
      "section section-soft";


    gallery.innerHTML = `

      <div class="container">


        <div
          class="section-heading
                 app-gallery-heading"
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


          <!-- HOME -->

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



          <!-- ADD EXPENSE -->

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



          <!-- ANALYTICS -->

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



          <!-- CASH FLOW -->

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



          <!-- PROFILE -->

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
          Tap a screen to view it larger.
        </p>


      </div>

    `;



    /* ---------------------------------------------------------
       INSERT BEFORE PRIVACY SECTION
    --------------------------------------------------------- */

    privacySection.parentNode.insertBefore(
      gallery,
      privacySection
    );



    /* ---------------------------------------------------------
       CREATE LIGHTBOX
    --------------------------------------------------------- */

    const lightbox =
      document.createElement(
        "div"
      );


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


    lightbox.setAttribute(
      "aria-label",
      "App screenshot preview"
    );


    lightbox.innerHTML = `

      <button
        class="app-gallery-close"
        type="button"
        aria-label="Close screenshot"
      >
        ×
      </button>


      <img
        src=""
        alt=""
      >

    `;


    document.body.appendChild(
      lightbox
    );



    const lightboxImage =
      lightbox.querySelector(
        "img"
      );


    const lightboxClose =
      lightbox.querySelector(
        ".app-gallery-close"
      );



    /* ---------------------------------------------------------
       CLOSE LIGHTBOX
    --------------------------------------------------------- */

    function closeGalleryPreview() {

      lightbox.classList.remove(
        "active"
      );

      document.body.classList.remove(
        "menu-open"
      );

      lightboxImage.removeAttribute(
        "src"
      );

    }



    /* ---------------------------------------------------------
       OPEN LIGHTBOX
    --------------------------------------------------------- */

    gallery
      .querySelectorAll(
        ".app-gallery-card"
      )
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            lightboxImage.src =
              card.getAttribute(
                "data-gallery-src"
              );


            lightboxImage.alt =
              card.getAttribute(
                "data-gallery-title"
              ) ||
              "Omepikya app screenshot";


            lightbox.classList.add(
              "active"
            );


            document.body.classList.add(
              "menu-open"
            );

          }
        );

      });



    /* ---------------------------------------------------------
       LIGHTBOX CLOSE BUTTON
    --------------------------------------------------------- */

    lightboxClose.addEventListener(
      "click",
      closeGalleryPreview
    );



    /* ---------------------------------------------------------
       CLOSE BY CLICKING BACKDROP
    --------------------------------------------------------- */

    lightbox.addEventListener(
      "click",
      event => {

        if (
          event.target ===
          lightbox
        ) {

          closeGalleryPreview();

        }

      }
    );



    /* ---------------------------------------------------------
       CLOSE WITH ESCAPE
    --------------------------------------------------------- */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          lightbox.classList.contains(
            "active"
          )
        ) {

          closeGalleryPreview();

        }

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
            target
              .getBoundingClientRect()
              .top +
            window.scrollY -
            headerHeight -
            16;


          window.scrollTo({

            top:
              position,

            behavior:
              "smooth"

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
      window.scrollY >
      500
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

          top:
            0,

          behavior:
            "smooth"

        });

      }
    );

  }



  /* =========================================================
     SERVICE WORKER
  ========================================================= */

  if (
    "serviceWorker" in
    navigator
  ) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register(
            "/sw.js"
          )
          .catch(
            error => {

              console.error(
                "Service worker registration failed:",
                error
              );

            }
          );

      }
    );

  }

});