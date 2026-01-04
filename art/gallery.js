const ICONS = {
  folder: "/icons/Standard Folders/imagesres_3.ico",
  folderWithSub: "/icons/Important Icons/Special Folders/162.ico",
  back: "/icons/Important Icons/Special Folders/185.ico"
};

const gallery = document.getElementById("gallery");
let currentFolder = "";
let skipWarning = false;

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
  const folders = new Map();
  list.forEach(item => {
    if (!item.folder) return;
    const name = item.folder.split("/")[0];
    if (!folders.has(name)) folders.set(name, { suggestive: false, customicon: null });

    if (FOLDER_DATA[name]) {
      folders.set(name, { ...folders.get(name), ...FOLDER_DATA[name] });
    }
  });
  return folders;
}

function showSuggestiveWarning(folderName, callback) {
  const modal = document.createElement("div");
  modal.style = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    display:flex; justify-content:center; align-items:center;
    background-color: rgba(0,0,0,0.7); color:white; z-index:9999; text-align:center;
  `;
  modal.innerHTML = `
    <div style="background:#333; padding:30px; border-radius:10px; max-width:400px;">
      <p>Hey uh, these arts i made contain slightly suggestive content, so if you dont wanna see that then uh leave</p>
      <button id="goBack" style="margin:10px;padding:5px 10px;">Go Back</button>
      <button id="continue" style="margin:10px;padding:5px 10px;">Continue</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector("#goBack").onclick = () => {
    document.body.removeChild(modal);
  };
  modal.querySelector("#continue").onclick = () => {
    skipWarning = true;
    document.body.removeChild(modal);
    callback();
  };
}

function render(folder) {
  clearGallery();
  currentFolder = folder;

  const artList = getArtArray();

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

  const folders = getFolders(artList);

  // folders
  if (folder === "") {
    folders.forEach((props, name) => {
      const hasSub = artList.some(
        i => i.folder && i.folder.startsWith(name + "/")
      );

      const li = document.createElement("li");
      li.className = "folder";

      const img = document.createElement("img");
      img.src = props.customicon || (hasSub ? ICONS.folderWithSub : ICONS.folder);

      const span = document.createElement("span");
      span.textContent = name;

      li.appendChild(img);
      li.appendChild(span);
      li.onclick = () => {
        if (props.suggestive && !skipWarning) {
          showSuggestiveWarning(name, () => render(name));
        } else {
          render(name);
        }
      };

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
