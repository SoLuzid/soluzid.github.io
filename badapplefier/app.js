const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const upload = document.getElementById('upload');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

const music = document.getElementById('music');
const lyricsSelect = document.getElementById('lyricsSelect');
const subtitleDiv = document.getElementById('subtitle');

const resSlider = document.getElementById('resolution');
const resLabel = document.getElementById('resLabel');

const threshold = 50;
const totalFrames = 6572;
const duration = 217;

let pixelSize = parseInt(resSlider.value, 10);
let uploadedImg = null;
let running = false;
let subtitles = [];
let currentLyrics = "none";

resLabel.textContent = pixelSize;

upload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    uploadedImg = new Image();
    uploadedImg.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

resSlider.addEventListener('input', () => {
  pixelSize = parseInt(resSlider.value, 10);
  resLabel.textContent = pixelSize;
});

lyricsSelect.addEventListener('change', () => {
  currentLyrics = lyricsSelect.value;
  subtitles = [];
  subtitleDiv.innerHTML = '';
  if (currentLyrics === "jp") loadSRT('bad_apple.srt');
  if (currentLyrics === "en") loadSRT('bad_apple_en.srt');
});

function loadSRT(file) {
  fetch(file).then(r => r.text()).then(parseSRT);
}

function parseSRT(data) {
  const lines = data.split(/\r?\n/);
  subtitles = [];
  let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) { i++; continue; }
    i++;
    const time = lines[i++].trim();
    const text = [];
    while (i < lines.length && lines[i].trim()) {
      text.push(lines[i++].trim());
    }
    const [start, end] = time.split(' --> ').map(srtTime);
    subtitles.push({ start, end, text: text.join('<br>') });
  }
}

function srtTime(s) {
  const m = s.match(/(\d+):(\d+):(\d+),(\d+)/);
  return m ? (+m[1]*3600 + +m[2]*60 + +m[3] + +m[4]/1000) : 0;
}

playBtn.addEventListener('click', () => {
  if (!uploadedImg) return alert('upload image');
  if (!running) {
    running = true;
    music.play();
    requestAnimationFrame(loop);
  }
});

pauseBtn.addEventListener('click', () => {
  running = false;
  music.pause();
});

restartBtn.addEventListener('click', () => {
  running = false;
  music.pause();
  music.currentTime = 0;
  subtitleDiv.innerHTML = '';
});

function loop() {
  if (!running) return;

  const t = music.currentTime;
  let frame = Math.floor((t / duration) * totalFrames) + 1;
  if (frame > totalFrames) frame = totalFrames;

  const img = new Image();
  img.src = `images/output_${String(frame).padStart(4,'0')}.jpg`;

  img.onload = () => {
    if (canvas.width !== img.width || canvas.height !== img.height) {
      canvas.width = img.width;
      canvas.height = img.height;
    }

    const tmp = document.createElement('canvas');
    tmp.width = canvas.width;
    tmp.height = canvas.height;
    const tctx = tmp.getContext('2d');
    tctx.drawImage(img, 0, 0);
    const data = tctx.getImageData(0, 0, canvas.width, canvas.height).data;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += pixelSize) {
      for (let x = 0; x < canvas.width; x += pixelSize) {
        const i = (y * canvas.width + x) * 4;
        const b = (data[i] + data[i+1] + data[i+2]) / 3;
        if (b <= threshold) {
          ctx.globalAlpha = 1 - b / threshold;
          ctx.drawImage(uploadedImg, x, y, pixelSize, pixelSize);
        }
      }
    }

    ctx.globalAlpha = 1;

    if (currentLyrics !== "none") {
      const line = subtitles.find(s => t >= s.start && t <= s.end);
      subtitleDiv.innerHTML = line ? line.text : '';
    } else {
      subtitleDiv.innerHTML = '';
    }

    requestAnimationFrame(loop);
  };

  img.onerror = () => requestAnimationFrame(loop);
}
