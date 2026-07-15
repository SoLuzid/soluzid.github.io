const ICONS = {
  folder: "/icons/Standard_Folders/imageres_3.ico",
  folderWithSub: "/icons/Important_Icons/Special_Folders/imageres_162.ico",
  back: "/icons/Important_Icons/Special_Folders/imageres_185.ico"
};

const COLORS = {
  cardBg: "#2b1f28",
  folderBg: "#251b22",
  border: "#58404f",
  accent: "#dba5ca",
  textSoft: "#c895b9",
  hover: "#ffffff"
};

const list = document.getElementById("gameList");
let currentFolder = "";
// this is bullshit why the fuck isn't it in a separate js like art-data.js
// TODO: make this less bullshit, oh and try to actually make the damn previews
const gameList = [{
    page: "Dodge Spinner/index.html",
    date: "2026-02-01 13:20",
    title: "Dodge Spinner",
    version: "0.2",
    description: "Move with arrow keys or touch the screen. Don’t get killed by the laser.",
    preview: "thumb/laserdodgethumb.png",
    changelog: ["0.2: Fixed mobile controls, made the bg nicer", "0.1: initial release"]
}, {
    page: "Swap",
    date: "2026-02-02 20:24",
    title: "Swap!",
    version: "1.0.0",
    description: "You are given scrambled words that you have to unscramble by swapping letters by the ones on their sides. you have 5 minutes to get as much score as you possibly can. im not sure if you can get more than 40 solved words tbh",
    preview: null,
    changelog: ["1.0.0: First non-beta Release. added just a new logo, that's all. that's all this damn update added. that's all. really.", "0.9.0: Original Beta Release. literally added the whole game itself"]
}, {
    page: "el pibe/index.html",
    date: "2026-01-17 12:00",
    title: "el pibe :v",
    version: "si",
    description: "un juegito de mierda que hice in 3 minutos en el scratch 1.4",
    preview: null,
    changelog: ["si: si"]
}, {
    page: "Santa's Adventure 2 web/index.html",
    date: "2025-8-4 12:00",
    title: "Santa's Adventure 2 demo",
    version: "0.5.2",
    description: "\"The Second game in the Santa's Adventure Saga. Each Xmas I’ll make a new Santa game, each one (hopefully) better than the last. the game's on indefinite hiatus, The entire demo is possible btw, Story: After returning home the elfs told him about Krampus's Presence and that it was causing chaos. Santa will go on another adventure to save the world from that demonic god. Controls: A and D to move, W to jump.\" - Gamejolt description i guess",
    preview: "thumb/sa2demothumb.png",
    changelog: ["0.5.2: oh i remember this one, fixed a bug where i forgot to export the windows version with the update level 1 song. i am not fucking joking. this is a real reason of an update. how? well, i have no fucking idea.", "0.5.1: tbh i dont remember what i did in this update", "0.5: initial release"],
    folder: "Old Games i dont care about anymore :3"
}];

function parseDate(str) {
  return new Date(str.replace(" ", "T"));
}

function clearList() {
  list.innerHTML = "";
}

function getFolders(listData) {
  const folders = new Map();
  listData.forEach(item => {
    if (!item.folder) return;
    const name = item.folder.split("/")[0];
    if (!folders.has(name)) folders.set(name, {});
  });
  return folders;
}

function createGameCard(game) {
  const li = document.createElement("li");
  li.style.background = COLORS.cardBg;
  li.style.padding = "16px";
  li.style.border = `2px solid ${COLORS.border}`;
  li.style.textAlign = "center";

  if (game.preview) {
    const img = document.createElement("img");
    img.src = game.preview;
    img.alt = game.title;
    img.loading = "lazy";
    img.style.imageRendering = "pixelated";
    img.style.width = "auto";
    img.style.height = "auto";
    img.style.maxWidth = "100%";
    img.style.marginBottom = "16px";
    li.appendChild(img);
  }

  const link = document.createElement("a");
  link.href = game.page;
  link.textContent = game.title || game.page;
  link.style.textDecoration = "none";
  link.style.color = COLORS.accent;
  link.style.fontWeight = "bold";
  link.style.fontSize = "1.25em";
  link.style.display = "block";
  link.style.marginBottom = "8px";

  link.onmouseover = () => (link.style.color = COLORS.hover);
  link.onmouseout = () => (link.style.color = COLORS.accent);

  li.appendChild(link);

  const meta = document.createElement("div");
  meta.textContent = `${game.date} — v${game.version}`;
  meta.style.color = COLORS.textSoft;
  meta.style.marginBottom = "10px";
  li.appendChild(meta);

  const desc = document.createElement("div");
  desc.textContent = game.description;
  desc.style.color = COLORS.textSoft;
  desc.style.marginBottom = "16px";
  desc.style.lineHeight = "1.4";
  li.appendChild(desc);

  if (game.changelog && game.changelog.length) {
    const changelogSection = document.createElement("div");
    changelogSection.style.textAlign = "left";
    changelogSection.style.marginTop = "12px";
    changelogSection.style.padding = "12px";
    changelogSection.style.background = "#1f171d";
    changelogSection.style.border = `1px solid ${COLORS.border}`;

    const title = document.createElement("div");
    title.textContent = "Changelog";
    title.style.color = COLORS.accent;
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";
    changelogSection.appendChild(title);

    const ul = document.createElement("ul");
    ul.style.paddingLeft = "20px";
    ul.style.margin = "0";
    game.changelog.forEach(entry => {
      const liEntry = document.createElement("li");
      liEntry.textContent = entry;
      liEntry.style.color = COLORS.textSoft;
      liEntry.style.marginBottom = "6px";
      liEntry.style.lineHeight = "1.3";
      ul.appendChild(liEntry);
    });
    changelogSection.appendChild(ul);
    li.appendChild(changelogSection);
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
    li.style.gap = "12px";
    li.style.background = COLORS.folderBg;
    li.style.padding = "8px 12px";
    li.style.marginBottom = "12px";
    li.style.border = `2px solid ${COLORS.border}`;

    const img = document.createElement("img");
    img.src = ICONS.back;
    img.style.width = "32px";
    img.style.height = "32px";
    img.style.objectFit = "contain";

    const span = document.createElement("span");
    span.textContent = "..";
    span.style.color = COLORS.accent;
    span.style.fontWeight = "bold";

    li.append(img, span);
    li.onclick = () => render("");
    list.appendChild(li);
  }

  const folders = getFolders(gameList);

  if (folder === "") {
    folders.forEach((props, name) => {
      const hasSub = gameList.some(i => i.folder && i.folder.startsWith(name + "/"));

      const li = document.createElement("li");
      li.className = "folder";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "12px";
      li.style.background = COLORS.folderBg;
      li.style.padding = "8px 12px";
      li.style.marginBottom = "12px";
      li.style.border = `2px solid ${COLORS.border}`;

      const img = document.createElement("img");
      img.src = hasSub ? ICONS.folderWithSub : ICONS.folder;
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.objectFit = "contain";

      const span = document.createElement("span");
      span.textContent = name;
      span.style.color = COLORS.accent;
      span.style.fontWeight = "bold";

      li.append(img, span);
      li.onclick = () => render(name);
      list.appendChild(li);
    });
  }

  gameList
    .filter(game => folder === "" ? !game.folder : game.folder === folder)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(game => list.appendChild(createGameCard(game)));
}

render("");