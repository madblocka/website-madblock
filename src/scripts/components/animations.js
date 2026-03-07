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
