const ICONS = {
  folder: "/icons/Standard_Folders/imageres_3.ico",
  folderWithSub: "/icons/Important_Icons/Special_Folders/imageres_162.ico",
  back: "/icons/Important_Icons/Special_Folders/imageres_185.ico"
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
  return Object.entries(ART_DATA).map(([id, data]) => ({ id, ...data }));
}

function getFolders(list) {
  const folders = new Map();
  list.forEach(item => {
    if (!item.folder) return;
    const name = item.folder.split("/")[0];
    if (!folders.has(name)) {
      folders.set(name, { warning: false, warningtext: "", customicon: null });
    }
    if (FOLDER_DATA[name]) {
      folders.set(name, { ...folders.get(name), ...FOLDER_DATA[name] });
    }
  });
  return folders;
}

function showWarning(text, callback) {
  const modal = document.createElement("div");
  modal.style = `
    position: fixed; top:0; left:0; width:100%; height:100%;
    display:flex; justify-content:center; align-items:center;
    background-color: rgba(0,0,0,0.7); color:white; z-index:9999; text-align:center;
  `;
  modal.innerHTML = `
    <div style="background:#333; padding:30px; border-radius:10px; max-width:400px;">
      <p>${text}</p>
      <button id="goBack" style="margin:10px;padding:5px 10px;">Go Back</button>
      <button id="continue" style="margin:10px;padding:5px 10px;">Continue</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector("#goBack").onclick = () => document.body.removeChild(modal);
  modal.querySelector("#continue").onclick = () => {
    skipWarning = true;
    document.body.removeChild(modal);
    callback();
  };
}

const DEFAULT_WARNING_TEXT =
  "Hey uh, these arts i made contain slightly suggestive content, so if you dont wanna see that then uh leave";

function createArtCard(item) {
  const li = document.createElement("li");
  li.style.background = "#2c2c44";
  li.style.padding = "16px";
  li.style.border = "2px solid #444";
  li.style.borderRadius = "12px";
  li.style.textAlign = "center";

  const link = document.createElement("a");
  link.href = "art.html?id=" + item.id;
  link.style.textDecoration = "none";
  link.style.color = "#9db4ff";
  link.onmouseover = () => link.style.color = "#ffffff";
  link.onmouseout = () => link.style.color = "#9db4ff";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.caption;
  img.loading = "lazy";
  img.style.imageRendering = "pixelated";
  img.style.borderRadius = "8px";
  img.style.width = "auto";
  img.style.height = "auto";
  img.style.maxWidth = "100%";

  link.appendChild(img);
  li.appendChild(link);

  const date = document.createElement("div");
  date.textContent = item.date;
  date.style.color = "#ccccff";
  date.style.marginTop = "8px";
  li.appendChild(date);

  const desc = document.createElement("div");
  desc.textContent = item.caption;
  desc.style.color = "#ccccff";
  desc.style.marginTop = "8px";
  li.appendChild(desc);

  return li;
}

function render(folder = "") {
  clearGallery();
  currentFolder = folder;

  const artList = getArtArray();

  if (folder !== "") {
    const li = document.createElement("li");
    li.className = "folder";
    li.style.cursor = "pointer";
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "12px";
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

    li.append(img, span);
    li.onclick = () => render("");
    gallery.appendChild(li);
  }

  const folders = getFolders(artList);

  if (folder === "") {
    folders.forEach((props, name) => {
      const hasSub = artList.some(i => i.folder && i.folder.startsWith(name + "/"));
      const li = document.createElement("li");
      li.className = "folder";
      li.style.cursor = "pointer";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "12px";
      li.style.background = "#1f1f3a";
      li.style.padding = "8px 12px";
      li.style.borderRadius = "8px";
      li.style.marginBottom = "12px";

      const img = document.createElement("img");
      img.src = props.customicon || (hasSub ? ICONS.folderWithSub : ICONS.folder);
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.objectFit = "contain";

      const span = document.createElement("span");
      span.textContent = name;
      span.style.color = "#9db4ff";
      span.style.fontWeight = "bold";

      li.append(img, span);
      li.onclick = () => {
        if (props.warning && !skipWarning) {
          showWarning(props.warningtext || DEFAULT_WARNING_TEXT, () => render(name));
        } else {
          render(name);
        }
      };

      gallery.appendChild(li);
    });
  }

  artList
    .filter(item => (folder === "" ? !item.folder : item.folder === folder))
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .forEach(item => gallery.appendChild(createArtCard(item)));
}

render("");
