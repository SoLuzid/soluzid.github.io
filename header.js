const opts = document.currentScript.dataset;

fetch("/header.html")
  .then(r => r.text())
  .then(h => {
    document.body.insertAdjacentHTML("afterbegin", h);

    const h1 = document.getElementById("dynamic-title");
    if (h1 && document.title) {
      h1.textContent = document.title;
    }

    const homeAnchor = document.querySelector(".home-link a");

    if (opts.home === "0") {
      const homeLink = document.querySelector(".home-link");
      if (homeLink) homeLink.style.pointerEvents = "none";
    }

    if (
      homeAnchor &&
      localStorage.getItem("manegg") !== "true" &&
      Math.random() < 0.02
    ) {
      homeAnchor.addEventListener("click", e => {
        e.preventDefault();
        sessionStorage.setItem("returnUrl", location.href);
        location.href = "/man.html";
      });
    }
  });