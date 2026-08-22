const opts = document.currentScript.dataset;

fetch("/header.html")
  .then(r => r.text())
  .then(h => {
    document.body.insertAdjacentHTML("afterbegin", h);

    const musicButton = document.getElementById("music-toggle");
    const musicAudio = new Audio("/music/outofthere.ogg");
    musicAudio.loop = true;
    musicAudio.volume = 1;
    musicAudio.preload = "auto";

    const musicKey = "site-music-enabled";
    const musicTimeKey = "site-music-time";

    const saveMusicState = () => {
      try {
        localStorage.setItem(musicKey, String(musicAudio.paused ? "false" : "true"));
        localStorage.setItem(musicTimeKey, String(Math.max(0, musicAudio.currentTime || 0)));
      } catch (e) {}
    };

    const setMusicState = enabled => {
      if (!musicButton) return;

      const finished = localStorage.getItem("manegg2") === "true";

      musicButton.setAttribute("aria-pressed", String(enabled));
      musicButton.setAttribute("aria-label", "music");
      musicButton.title = "music";
      musicButton.textContent = finished
        ? (enabled ? "music" : "no music")
        : (enabled ? "music :D" : "no music :(");

      if (enabled) {
        const savedTime = Number(localStorage.getItem(musicTimeKey) || 0);
        if (!Number.isNaN(savedTime) && savedTime > 0 && musicAudio.currentTime < 1) {
          musicAudio.currentTime = savedTime;
        }
        musicAudio.play().catch(() => {});
      } else {
        musicAudio.pause();
        musicAudio.currentTime = 0;
      }

      saveMusicState();
    };

    musicAudio.addEventListener("timeupdate", saveMusicState);
    musicAudio.addEventListener("ended", saveMusicState);
    window.addEventListener("beforeunload", saveMusicState);

    if (musicButton) {
      musicButton.addEventListener("click", e => {
        e.preventDefault();
        const enabled = musicButton.getAttribute("aria-pressed") === "true";
        setMusicState(!enabled);
      });

      const storedEnabled = localStorage.getItem(musicKey) === "true";
      setMusicState(storedEnabled);
    }

    const h1 = document.getElementById("dynamic-title");
    if (h1 && document.title) {
      h1.textContent = document.title;
    }

    const homeLink = document.querySelector(".home-link a");

    if (opts.home === "0") {
      const homeContainer = document.querySelector(".home-link");
      if (homeContainer) homeContainer.style.pointerEvents = "none";
    }

    const theprotein = "manegg";
    const theprotein2 = "manegg2";
    const theroominbetween = "/man.html";
    const knockknock = "/door.html";

    const finished = localStorage.getItem(theprotein2) === "true";

    if (localStorage.getItem(theprotein) === "true" && finished) {
      const toolsLink = [...document.querySelectorAll(".main-nav > ul > li > a")]
        .find(link => link.title === "Random tools and other things");
      const toolsMenu = toolsLink && toolsLink.nextElementSibling;

      if (toolsMenu) {
        const goBackItem = document.createElement("li");
        const goBackLink = document.createElement("a");
        goBackLink.href = "/goaway.html";
        goBackLink.textContent = "Go Back";
        goBackItem.appendChild(goBackLink);
        toolsMenu.appendChild(goBackItem);
      }
    }

    if (!finished && homeLink && localStorage.getItem(theprotein) !== "true" && Math.random() < 0.02) {
      homeLink.addEventListener("click", e => {
        e.preventDefault();
        sessionStorage.setItem("returnUrl", location.href);
        location.href = theroominbetween;
      });
      homeLink.textContent = "home...?";
    }

    if (!finished && h1 && localStorage.getItem(theprotein) === "true" && localStorage.getItem(theprotein2) !== "true") {
      let title = document.title;

      if (Math.random() < 0.05) {
        const i = Math.floor(Math.random() * title.length);
        const char = title[i];

        h1.addEventListener("click", e => {
          e.preventDefault();
          sessionStorage.setItem("returnUrl", location.href);
          location.href = knockknock;
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

    if (finished && h1) {
      h1.style.color = "#a885a0";

      musicAudio.src = "/deltarune_piano_collections_by_trevor_alan_gomes.ogg";
      musicAudio.load();

      if (musicButton) {
        const enabled = musicButton.getAttribute("aria-pressed") === "true";
        musicButton.textContent = enabled ? "music" : "no music";
      }

      if (musicButton && musicButton.getAttribute("aria-pressed") === "true") {
        musicAudio.play().catch(() => {});
      }

      const originalTitle = document.title;
      let titleInterval;

      const scrambleTitle = () => {
        let title = originalTitle;
        const i = Math.floor(Math.random() * title.length);
        const char = title[i];

        if (/[a-z]/i.test(char)) {
          const replacement = String.fromCharCode(
            char.charCodeAt(0) + (Math.random() < 0.5 ? -1 : 1)
          );

          title = title.slice(0, i) + replacement + title.slice(i + 1);
        }

        h1.textContent = title;
      };

      h1.addEventListener("mouseenter", () => {
        scrambleTitle();
        titleInterval = setInterval(scrambleTitle, 150);
      });

      h1.addEventListener("mouseleave", () => {
        clearInterval(titleInterval);
        titleInterval = undefined;
        h1.textContent = originalTitle;
      });
    }
  });