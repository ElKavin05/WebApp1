(function () {
  "use strict";
  const header = document.querySelector(".navbar");
  const toggle = header.querySelector(".nav-toggle");
  const navigation = header.querySelector(".site-nav");
  const mobile = window.matchMedia("(max-width: 900px)");

  function setOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    navigation.hidden = mobile.matches && !open;
  }

  function syncViewport() {
    toggle.hidden = !mobile.matches;
    setOpen(false);
  }

  toggle.addEventListener("click", function () {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });
  header.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobile.matches && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
  navigation.addEventListener("click", function (event) {
    if (event.target.closest("a") && mobile.matches) {
      setOpen(false);
      toggle.focus();
    }
  });
  mobile.addEventListener("change", syncViewport);
  syncViewport();
})();
