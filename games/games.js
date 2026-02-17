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
    page: "Swap",
    date: "2026-02-02 20:24",
    title: "Swap!",
    version: "1.0.0",
    description: "You are given scrambled words that you have to unscramble by swapping letters by the ones on their sides. you have 5 minutes to get as much score as you possibly can. im not sure if you can get more than 40 solved words tbh",
    preview: null,
    changelog: [
      "1.0.0: First non-beta Release. added just a new logo, that's all. that's all this damn update added. that's all. really.",
      "0.9.0: Original Beta Release. literally added the whole game itself"
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
    ],
    folder: "Old Games i dont care about anymore :3"
  },
];

const ICONS = {
  folder: "/icons/Standard_Folders/imageres_3.ico",
  folderWithSub: "/icons/Important_Icons/Special_Folders/imageres_162.ico",
  back: "/icons/Important_Icons/Special_Folders/imageres_185.ico"
};

const list = document.getElementById("gameList");
let currentFolder = "";

function parseDate(str) {
  return new Date(str.replace(" ", "T"));
}

function clearList() {
  list.innerHTML = "";
}

function getFolders(listData) {
  const folders = new Set();
  listData.forEach(item => {
    if (item.folder) folders.add(item.folder.split("/")[0]);
  });
  return [...folders];
}

function createCard(game) {
  const li = document.createElement("li");
  li.style.background = "#2c2c44";
  li.style.padding = "16px";
  li.style.border = "2px solid #444";
  li.style.borderRadius = "12px";
  li.style.textAlign = "left";

  if (game.preview) {
    const img = document.createElement("img");
    img.src = game.preview;
    img.alt = game.title + " preview";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    img.style.display = "block";
    img.style.marginBottom = "12px";
    li.appendChild(img);
  }

  const link = document.createElement("a");
  link.href = game.page;
  link.textContent = game.title || game.page;
  link.style.color = "#9db4ff";
  link.style.fontWeight = "bold";
  link.style.fontSize = "1.2em";
  link.style.textDecoration = "none";
  link.onmouseover = () => link.style.color = "#ffffff";
  link.onmouseout = () => link.style.color = "#9db4ff";
  li.appendChild(link);

  const meta = document.createElement("div");
  meta.textContent = `${game.date} — v${game.version}`;
  meta.style.color = "#ccccff";
  meta.style.marginTop = "8px";
  li.appendChild(meta);

  const desc = document.createElement("div");
  desc.textContent = game.description;
  desc.style.color = "#ccccff";
  desc.style.marginTop = "8px";
  li.appendChild(desc);

  if (game.changelog?.length) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "Changelog";
    summary.style.color = "#9db4ff";
    summary.style.cursor = "pointer";
    const ul = document.createElement("ul");
    game.changelog.forEach(entry => {
      const liEntry = document.createElement("li");
      liEntry.textContent = entry;
      liEntry.style.color = "#ccccff";
      ul.appendChild(liEntry);
    });
    details.append(summary, ul);
    li.appendChild(details);
  }

  return li;
}

function render(folder = "") {
  clearList();
  currentFolder = folder;

  if (folder !== "") {
    const li = document.createElement("li");
    li.className = "folder";
    li.style.cursor = "pointer";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.background = "#1f1f3a";
    li.style.padding = "8px 12px";
    li.style.borderRadius = "8px";
    li.style.marginBottom = "12px";

    const img = document.createElement("img");
    img.src = ICONS.back;
    img.style.width = "32px";
    img.style.height = "32px";
    img.style.objectFit = "contain";

    const span = document.createElement("span");
    span.textContent = "..";
    span.style.color = "#9db4ff";
    span.style.fontWeight = "bold";
    span.style.marginLeft = "8px";

    li.append(img, span);
    li.onclick = () => render("");
    list.appendChild(li);
  }

  if (folder === "") {
    getFolders(gameList).forEach(name => {
      const hasSub = gameList.some(g => g.folder && g.folder.startsWith(name + "/"));
      const li = document.createElement("li");
      li.className = "folder";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.background = "#1f1f3a";
      li.style.padding = "8px 12px";
      li.style.borderRadius = "8px";
      li.style.marginBottom = "12px";

      const img = document.createElement("img");
      img.src = hasSub ? ICONS.folderWithSub : ICONS.folder;
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.objectFit = "contain";

      const span = document.createElement("span");
      span.textContent = name;
      span.style.color = "#9db4ff";
      span.style.fontWeight = "bold";
      span.style.marginLeft = "8px";

      li.append(img, span);
      li.onclick = () => render(name);
      list.appendChild(li);
    });
  }

  gameList
    .filter(game => folder === "" ? !game.folder : game.folder === folder)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(game => list.appendChild(createCard(game)));
}

render();
