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
