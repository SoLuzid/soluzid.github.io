const opts = document.currentScript.dataset;

fetch("/header.html")
  .then(r => r.text())
  .then(h => {
    document.body.insertAdjacentHTML("afterbegin", h);

    const h1 = document.getElementById("dynamic-title");
    if (h1 && document.title) {
      h1.textContent = document.title;
    }

    const a = document.querySelector(".home-link a");

    if (opts.home === "0") {
      const b = document.querySelector(".home-link");
      if (b) b.style.pointerEvents = "none";
    }

    const c = [109, 97, 110, 101, 103, 103].map(n => String.fromCharCode(n)).join("");
    const d = String.fromCharCode(47, 109, 97, 110, 46, 104, 116, 109, 108);

    if (a && localStorage.getItem(c) !== "true" && Math.random() < 0.02) {
      a.addEventListener("click", e => {
        e.preventDefault();
        sessionStorage.setItem("returnUrl", location.href);
        location.href = d;
      });
      a.textContent = "home...?";
    }
  });