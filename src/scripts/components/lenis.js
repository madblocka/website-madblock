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
