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

    const g = String.fromCharCode(47, 100, 111, 111, 114, 46, 104, 116, 109, 108);
    if (h1 && localStorage.getItem(c) == "true") {
      let title = document.title;

      if (Math.random() < 0.05) {
        const i = Math.floor(Math.random() * title.length);
        const char = title[i];
        h1.addEventListener("click", e => {
          e.preventDefault();
          sessionStorage.setItem("returnUrl", location.href);
          location.href = g;
        });
        if (/[a-z]/i.test(char)) {
          const replacement = String.fromCharCode(
            char.charCodeAt(0) + (Math.random() < 0.5 ? -1 : 1)
          );

          title = title.slice(0, i) + replacement + title.slice(i + 1);
        }
      }

      h1.textContent = title;
    }
  });