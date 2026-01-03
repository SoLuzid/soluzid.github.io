const artList = [
  {
    page: "Beach.html",
    date: "2025-12-26 12:34",
    description: "first art that I'm not posting on Twitter, just a simple remake of beach day",
    preview: "beach.png"
  },
  {
    page: "mountains.html",
    date: "2025-12-26 20:04",
    description: "testing depth and stuff on pixel art, there's no reference to any game in this picture, trust me",
    preview: "mountains.png",
    folder: "pixel art"
  },
  {
    page: "xitrarobotarm.html",
    date: "2026-01-03 19:27",
    description: "Xitra never shows her robotic arm. so i forced her to show it",
    preview: "xitrasarm.png",
    folder: "silly :3"
  }
];

const ICONS = {
  folder: "/Icons/imageres_3.ico",
  folderWithSub: "/Icons/imageres_162.ico",
  back: "/Icons/imageres_185.ico"
};

const gallery = document.getElementById("gallery");

let currentFolder = "";

// Convert string → Date
function parseDate(str) {
  return new Date(str.replace(" ", "T"));
}

function clearGallery() {
  gallery.innerHTML = "";
}

function getFolders(list) {
  const folders = new Set();
  list.forEach(item => {
    if (item.folder) {
      const parts = item.folder.split("/");
      folders.add(parts[0]);
    }
  });
  return [...folders];
}

function render(folder) {
  clearGallery();
  currentFolder = folder;

  // Back button
  if (folder !== "") {
    const li = document.createElement("li");
    li.className = "folder";

    const img = document.createElement("img");
    img.src = ICONS.back;

    const span = document.createElement("span");
    span.textContent = "..";

    li.appendChild(img);
    li.appendChild(span);
    li.onclick = () => render("");

    gallery.appendChild(li);
  }

  // Folders
  if (folder === "") {
    getFolders(artList).forEach(name => {
      const hasSub = artList.some(i => i.folder && i.folder.startsWith(name + "/"));

      const li = document.createElement("li");
      li.className = "folder";

      const img = document.createElement("img");
      img.src = hasSub ? ICONS.folderWithSub : ICONS.folder;

      const span = document.createElement("span");
      span.textContent = name;

      li.appendChild(img);
      li.appendChild(span);
      li.onclick = () => render(name);

      gallery.appendChild(li);
    });
  }

  // Files
  artList
    .filter(item => (folder === "" ? !item.folder : item.folder === folder))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(item => {
      const li = document.createElement("li");

      if (item.preview) {
        const link = document.createElement("a");
        link.href = item.page;

        const img = document.createElement("img");
        img.src = item.preview;
        img.alt = item.description || item.page;
        img.loading = "lazy";
        img.style.imageRendering = "pixelated";

        img.addEventListener("load", () => {
          img.style.width = img.naturalWidth <= 400 ? "70%" : "auto";
          img.style.maxWidth = "100%";
        });

        link.appendChild(img);
        li.appendChild(link);
      } else {
        const link = document.createElement("a");
        link.href = item.page;
        link.textContent = item.page;
        li.appendChild(link);
      }

      const date = document.createElement("div");
      date.textContent = item.date;

      const desc = document.createElement("div");
      desc.textContent = item.description;

      li.appendChild(date);
      li.appendChild(desc);
      gallery.appendChild(li);
    });
}

// Initial render
render("");