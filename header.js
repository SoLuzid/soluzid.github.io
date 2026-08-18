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

      musicButton.setAttribute("aria-pressed", String(enabled));
      musicButton.setAttribute("aria-label", "music");
      musicButton.title = "music";
      musicButton.textContent = enabled ? "music :D" : "no music :(";

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