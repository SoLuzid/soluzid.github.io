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
  }
];

const ICONS = {
  folder: "/Icons/imageres_3.ico",
  folderWithSub: "/Icons/imageres_162.ico",
  back: "/Icons/imageres_185.ico"
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