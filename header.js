const opts = document.currentScript.dataset;

fetch("/header.html")
  .then(r => r.text())
  .then(h => {
    document.body.insertAdjacentHTML("afterbegin", h);

    const h1 = document.querySelector("header h1");
    if (h1) h1.textContent = document.title;

    if (opts.home === "0") {
      const homeLink = document.querySelector(".home-link");
      if (homeLink) {
        homeLink.style.pointerEvents = "none";
      }
    }
  });
