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
