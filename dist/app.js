function killScrollTriggers() {
  ScrollTrigger.getAll().forEach(function (t) {
    t.kill();
  });
}

function reinitWebflow() {
  if (typeof Webflow === "undefined") return;
  Webflow.destroy();
  Webflow.ready();
  if (Webflow.require) {
    var ix2 = Webflow.require("ix2");
    if (ix2) ix2.init();
  }
  document.dispatchEvent(new Event("readystatechange"));
}

function splitLines(el) {
  var text = el.textContent.trim();
  var style = window.getComputedStyle(el);
  var width = el.offsetWidth;

  el.textContent = "";

  var measure = document.createElement("div");
  measure.style.cssText =
    "position:absolute;visibility:hidden;white-space:nowrap;" +
    "font:" + style.font + ";" +
    "letter-spacing:" + style.letterSpacing + ";" +
    "word-spacing:" + style.wordSpacing + ";" +
    "text-transform:" + style.textTransform + ";";
  document.body.appendChild(measure);

  var words = text.split(/\s+/);
  var lines = [];
  var current = [];

  words.forEach(function (word) {
    current.push(word);
    measure.textContent = current.join(" ");
    if (measure.offsetWidth > width && current.length > 1) {
      current.pop();
      lines.push(current.join(" "));
      current = [word];
    }
  });
  if (current.length) lines.push(current.join(" "));

  document.body.removeChild(measure);

  var inners = [];

  lines.forEach(function (line) {
    var wrapper = document.createElement("span");
    wrapper.style.cssText = "display:block;overflow:hidden;";

    var inner = document.createElement("span");
    inner.style.cssText = "display:block;will-change:transform,opacity;";
    inner.textContent = line;

    wrapper.appendChild(inner);
    el.appendChild(wrapper);
    inners.push(inner);
  });

  return inners;
}

function initAnimations() {
  // Stagger title
  document.querySelectorAll('[data-title="stagger"]').forEach(function (el) {
    var inners = splitLines(el);

    gsap.set(inners, { yPercent: 110, opacity: 0 });

    gsap.to(inners, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Blur reveal
  document.querySelectorAll('[data-reveal="blur"]').forEach(function (el) {
    gsap.set(el, { opacity: 0, filter: "blur(12px)" });

    gsap.to(el, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Mask reveal
  document.querySelectorAll('[data-reveal="mask"]').forEach(function (el) {
    gsap.set(el, { clipPath: "inset(0 100% 0 0)" });

    gsap.to(el, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Bot to top reveal
  document.querySelectorAll('[data-reveal="bot-to-top"]').forEach(function (el) {
    var shape = el.querySelector('[data-reveal="shape"]');

    gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
    if (shape) gsap.set(shape, { opacity: 0, filter: "blur(24px)" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    tl.to(el, {
      clipPath: "inset(0% 0 0 0)",
      duration: 1.4,
      ease: "power2.out",
    });

    if (shape) {
      tl.to(
        shape,
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "power2.out",
        },
        0.3
      );
    }
  });
}

function initBarba() {
  barba.init({
    preventRunning: true,
    transitions: [
      {
        name: "default",
        leave: function (data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            filter: "blur(16px)",
            duration: 0.5,
            ease: "power2.in",
          });
        },
        enter: function (data) {
          return gsap.fromTo(
            data.next.container,
            { opacity: 0, filter: "blur(16px)" },
            { opacity: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }
          );
        },
        afterLeave: function () {
          killScrollTriggers();
        },
        beforeEnter: function () {
          window.scrollTo(0, 0);
        },
        after: function () {
          initPage();
        },
      },
    ],
  });
}

function initStagger() {
  document.querySelectorAll("[data-hover-stagger]").forEach(function (el) {
    if (el.querySelector(".stagger-inner")) return;

    var text = el.innerText.trim();
    if (!text) return;

    var delay = el.getAttribute("data-hover-stagger") || "0.015";
    var delayNum = parseFloat(delay);

    el.innerHTML = "";

    var wrapper = document.createElement("span");
    wrapper.classList.add("stagger-inner");

    [...text].forEach(function (char, i) {
      var wrap = document.createElement("span");
      wrap.classList.add("char-wrap");

      var top = document.createElement("span");
      top.textContent = char === " " ? "\u00A0" : char;
      top.style.transitionDelay = i * delayNum + "s";

      var bottom = document.createElement("span");
      bottom.textContent = char === " " ? "\u00A0" : char;
      bottom.style.transitionDelay = i * delayNum + "s";

      wrap.appendChild(top);
      wrap.appendChild(bottom);
      wrapper.appendChild(wrap);
    });

    el.appendChild(wrapper);
  });
}

var lenis = null;

function initLenis() {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }

  lenis = new Lenis({
    duration: 1.4,
    easing: function (t) {
      return Math.min(1, 1.002 - Math.pow(2, -10 * t));
    },
    touchMultiplier: 2,
    infinite: false,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add(function (time) {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function getLenis() {
  return lenis;
}

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

var prefetched = new Set();

document.addEventListener("mouseover", function (e) {
  var anchor = e.target.closest("a[href]");
  if (!anchor) return;
  if (anchor.hostname !== location.hostname) return;
  if (anchor.hasAttribute("data-barba-prevent")) return;
  if (prefetched.has(anchor.href)) return;

  prefetched.add(anchor.href);
  var link = document.createElement("link");
  link.rel = "prefetch";
  link.href = anchor.href;
  document.head.appendChild(link);
});

// app entry
function initPage() {
  reinitWebflow();
  initLenis();
  initNav();
  initStagger();
  initAnimations();
}

document.addEventListener("DOMContentLoaded", function () {
  initPage();
  initBarba();
});
