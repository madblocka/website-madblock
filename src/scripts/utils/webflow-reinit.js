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
