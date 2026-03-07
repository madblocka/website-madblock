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
