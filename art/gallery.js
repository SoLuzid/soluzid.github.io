const ICONS = {
  folder: "/icons/imageres_3.ico",
  folderWithSub: "/icons/imageres_162.ico",
  back: "/icons/imageres_185.ico"
};

const gallery = document.getElementById("gallery");
let currentFolder = "";

function parseDate(str) {
  return new Date(str.replace(" ", "T"));
}

function clearGallery() {
  gallery.innerHTML = "";
}

function getArtArray() {
  return Object.entries(ART_DATA).map(([id, data]) => ({
    id,
    ...data
  }));
}

function getFolders(list) {
  const folders = new Set();
  list.forEach(item => {
    if (item.folder) {
      folders.add(item.folder.split("/")[0]);
    }
  });
  return [...folders];
}

function render(folder) {
  clearGallery();
  currentFolder = folder;

  const artList = getArtArray();

  // back button
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

  // folders
  if (folder === "") {
    getFolders(artList).forEach(name => {
      const hasSub = artList.some(
        i => i.folder && i.folder.startsWith(name + "/")
      );

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

  // files
  artList
    .filter(item => (folder === "" ? !item.folder : item.folder === folder))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(item => {
      const li = document.createElement("li");

      const link = document.createElement("a");
      link.href = "art.html?id=" + item.id;

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.caption;
      img.loading = "lazy";
      img.style.imageRendering = "pixelated";

      img.addEventListener("load", () => {
        img.style.width = img.naturalWidth <= 400 ? "70%" : "auto";
        img.style.maxWidth = "100%";
      });

      link.appendChild(img);
      li.appendChild(link);

      const date = document.createElement("div");
      date.textContent = item.date;

      const desc = document.createElement("div");
      desc.textContent = item.caption;

      li.appendChild(date);
      li.appendChild(desc);

      gallery.appendChild(li);
    });
}

render("");
