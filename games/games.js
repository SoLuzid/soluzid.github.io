const gameList = [
  {
    page: "Dodge Spinner/index.html",
    date: "2026-02-01 13:20",
    title: "Dodge Spinner",
    version: "0.2",
    description: "Move with arrow keys or touch the screen. Don’t get killed by the laser.",
    preview: "thumb/laserdodgethumb.png",
    changelog: [
      "0.2: Fixed mobile controls, made the bg nicer",
      "0.1: initial release"
    ]
  },
  {
    page: "Santa's Adventure 2 web/index.html",
    date: "2025-8-4 12:00",
    title: "Santa's Adventure 2 demo",
    version: "0.5.2",
    description: "\"The Second game in the Santa's Adventure Saga. Each Xmas I’ll make a new Santa game, each one (hopefully) better than the last. the game's on indefinite hiatus, The entire demo is possible btw, Story: After returning home the elfs told him about Krampus's Presence and that it was causing chaos. Santa will go on another adventure to save the world from that demonic god. Controls: A and D to move, W to jump.\" - Gamejolt description i guess",
    preview: "thumb/sa2demothumb.png",
    changelog: [
      "0.5.2: oh i remember this one, fixed a bug where i forgot to export the windows version with the update level 1 song. i am not fucking joking. this is a real reason of an update. how? well, i have no fucking idea.",
      "0.5.1: tbh i dont remember what i did in this update",
      "0.5: initial release"
    ]
  },
];

const ICONS = {
  folder: "/icons/Standard Folders/imagesres_3.ico",
  folderWithSub: "/icons/Important Icons/Special Folders/162.ico",
  back: "/icons/Important Icons/Special Folders/185.ico"
};

const list = document.getElementById("gameList");
let currentFolder = "";

/* ================= helpers ================= */

function parseDate(str) {
  return new Date(str.replace(" ", "T"));
}

function clearList() {
  list.innerHTML = "";
}

function getFolders(listData) {
  const folders = new Set();
  listData.forEach(item => {
    if (item.folder) {
      folders.add(item.folder.split("/")[0]);
    }
  });
  return [...folders];
}

/* ================= render ================= */

function render(folder = "") {
  clearList();
  currentFolder = folder;

  /* back button */
  if (folder !== "") {
    const li = document.createElement("li");
    li.className = "folder";

    const img = document.createElement("img");
    img.src = ICONS.back;

    const span = document.createElement("span");
    span.textContent = "..";

    li.append(img, span);
    li.onclick = () => render("");

    list.appendChild(li);
  }

  /* folders */
  if (folder === "") {
    getFolders(gameList).forEach(name => {
      const hasSub = gameList.some(
        g => g.folder && g.folder.startsWith(name + "/")
      );

      const li = document.createElement("li");
      li.className = "folder";

      const img = document.createElement("img");
      img.src = hasSub ? ICONS.folderWithSub : ICONS.folder;

      const span = document.createElement("span");
      span.textContent = name;

      li.append(img, span);
      li.onclick = () => render(name);

      list.appendChild(li);
    });
  }

  /* games */
  gameList
    .filter(game =>
      folder === ""
        ? !game.folder
        : game.folder === folder
    )
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(game => {
      const li = document.createElement("li");

      if (game.preview) {
        const img = document.createElement("img");
        img.src = game.preview;
        img.alt = game.title + " preview";
        img.style.maxWidth = "200px";
        img.style.display = "block";
        li.appendChild(img);
      }

      const link = document.createElement("a");
      link.href = game.page;
      link.textContent = game.title || game.page;
      li.appendChild(link);

      const meta = document.createElement("div");
      meta.textContent = `${game.date} — v${game.version}`;
      li.appendChild(meta);

      const desc = document.createElement("div");
      desc.textContent = game.description;
      li.appendChild(desc);

      /* changelog */
      if (game.changelog?.length) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "Changelog";

        const ul = document.createElement("ul");
        game.changelog.forEach(entry => {
          const liEntry = document.createElement("li");
          liEntry.textContent = entry;
          ul.appendChild(liEntry);
        });

        details.append(summary, ul);
        li.appendChild(details);
      }

      list.appendChild(li);
    });
}

/* ================= init ================= */

render();