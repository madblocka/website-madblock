function killScrollTriggers() {
  ScrollTrigger.getAll().forEach(function (t) {
    t.kill();
  });
}
