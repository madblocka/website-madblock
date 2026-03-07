function initNav() {
  var toggle = document.querySelector('[nav="toggle"]');
  var wrapper = document.querySelector('[nav="wrapper"]');
  var backdrop = document.querySelector('[nav="backdrop"]');
  var inner = document.querySelector('[nav="inner"]');

  if (!toggle || !wrapper || !backdrop || !inner) return;

  var navItems = inner.children;
  for (var i = 0; i < navItems.length; i++) {
    navItems[i].style.transitionDelay = 0.2 + i * 0.1 + "s";
  }

  function openNav() {
    wrapper.classList.add("is-open");
    backdrop.classList.add("is-open");
    inner.style.height = "auto";
    var h = inner.scrollHeight;
    inner.style.height = "0px";
    requestAnimationFrame(function () {
      inner.style.height = h + "px";
    });
  }

  function closeNav() {
    inner.style.height = inner.scrollHeight + "px";
    requestAnimationFrame(function () {
      inner.style.height = "0px";
    });
    wrapper.classList.remove("is-open");
    backdrop.classList.remove("is-open");
  }

  function toggleNav() {
    if (wrapper.classList.contains("is-open")) {
      closeNav();
    } else {
      openNav();
    }
  }

  var newToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(newToggle, toggle);
  newToggle.addEventListener("click", toggleNav);

  var newBackdrop = backdrop.cloneNode(true);
  backdrop.parentNode.replaceChild(newBackdrop, backdrop);
  newBackdrop.addEventListener("click", closeNav);
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    var wrapper = document.querySelector('[nav="wrapper"]');
    if (wrapper && wrapper.classList.contains("is-open")) {
      var backdrop = document.querySelector('[nav="backdrop"]');
      var inner = document.querySelector('[nav="inner"]');
      inner.style.height = inner.scrollHeight + "px";
      requestAnimationFrame(function () {
        inner.style.height = "0px";
      });
      wrapper.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
    }
  }
});
