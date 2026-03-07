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
