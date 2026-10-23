(function () {
  "use strict";

  try {
    var savedTheme = localStorage.getItem("omepikya-theme");
    var prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    var useDarkTheme = savedTheme ? savedTheme === "dark" : prefersDark;

    if (useDarkTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (error) {
    // Theme initialization must never prevent the page from rendering.
  }
}());
