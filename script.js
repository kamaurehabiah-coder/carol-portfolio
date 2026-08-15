const folderData = {
  photo: {
    title: "photography",
    body: `
      <p>Carol loves noticing quiet moments — light through windows, friends laughing after class, the way colours look after rain.</p>
      <p>This folder holds her photo studies and favourite captures so far:</p>
      <ul>
        <li><strong>Window light series</strong> — soft afternoon light on desks & notebooks</li>
        <li><strong>Campus walks</strong> — trees, pathways, quiet corners</li>
        <li><strong>Portrait studies</strong> — friends & classmates in natural light</li>
        <li><strong>Everyday details</strong> — shoes, books, sky between buildings</li>
      </ul>
      <p style="font-family:'Reenie Beanie',cursive;font-size:1.35rem;color:#8a6f55;">more photos coming as she keeps shooting ♡</p>
    `
  },
  design: {
    title: "designs",
    body: `
      <p>Posters, layouts, colour experiments and little visual ideas Carol has been playing with.</p>
      <ul>
        <li><strong>Club / event posters</strong> — concepts for school activities</li>
        <li><strong>Colour palette studies</strong> — soft pastels & school-uniform inspired tones</li>
        <li><strong>Simple layouts</strong> — type + photo experiments</li>
        <li><strong>Digital scrapbook pages</strong> — memory collages</li>
      </ul>
      <p style="font-family:'Reenie Beanie',cursive;font-size:1.35rem;color:#8a6f55;">still learning, still making — that’s the point</p>
    `
  },
  life: {
    title: "school life",
    body: `
      <p>Bits of everyday school life that feel worth keeping.</p>
      <ul>
        <li>Assembly & special days (like the one in the photo!)</li>
        <li>Friends & classmates</li>
        <li>Quiet corners of campus</li>
        <li>Moments that made her smile</li>
      </ul>
      <p style="font-family:'Reenie Beanie',cursive;font-size:1.35rem;color:#8a6f55;">a little archive of ordinary days</p>
    `
  }
};

const projectData = {
  light: { title: "light study", body: `<p>Soft window light after class — notebooks, hands, the edge of a desk. Carol is learning how light changes the mood of a simple moment.</p>` },
  poster: { title: "club poster concept", body: `<p>Early poster ideas for school events and clubs. Exploring type, soft colour blocks, and clean layouts that still feel friendly.</p>` },
  palette: { title: "colour notes", body: `<p>Palette explorations inspired by school uniforms, sky, and the pink flowers she likes. Soft greens, dusty pinks, warm creams.</p>` },
  friends: { title: "portraits", body: `<p>Friends and classmates in natural light. Carol is practising how to make people feel comfortable and look like themselves.</p>` },
  campus: { title: "campus walk", body: `<p>Quiet corners, trees, pathways and the sky between buildings. Small records of ordinary school days.</p>` },
  scrap: { title: "scrap pages", body: `<p>Digital memory pages — photos, notes, little doodles. A growing scrapbook of the year so far.</p>` }
};

const modal = document.getElementById("folder-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.querySelector(".modal-close");

function openModal(title, bodyHtml) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modal.classList.remove("hidden");
}

document.querySelectorAll(".folder").forEach((folder) => {
  folder.addEventListener("click", () => {
    const key = folder.dataset.folder;
    const data = folderData[key];
    if (!data) return;
    openModal(data.title, data.body);
  });
});

document.querySelectorAll(".scrap-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.project;
    const data = projectData[key];
    if (!data) return;
    openModal(data.title, data.body);
  });
});

modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") modal.classList.add("hidden");
});

const canvas = document.getElementById("doodle-canvas");
const ctx = canvas.getContext("2d");
const notesLayer = document.getElementById("notes-layer");

let drawing = false;
let currentColor = "#604734";
let isEraser = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  const wrap = canvas.parentElement;
  const rect = wrap.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const displayWidth = rect.width;
  const displayHeight = Math.min(420, Math.max(280, displayWidth * 0.45));
  canvas.style.width = displayWidth + "px";
  canvas.style.height = displayHeight + "px";
  canvas.width = displayWidth * ratio;
  canvas.height = displayHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function startDraw(e) {
  e.preventDefault();
  drawing = true;
  const pos = getPos(e);
  lastX = pos.x;
  lastY = pos.y;
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPos(e);
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(pos.x, pos.y);
  if (isEraser) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 18;
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
  }
  ctx.stroke();
  lastX = pos.x;
  lastY = pos.y;
}

function endDraw() { drawing = false; }

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mouseleave", endDraw);
canvas.addEventListener("touchstart", startDraw, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", endDraw);

document.querySelectorAll(".color-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".color-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentColor = btn.dataset.color;
    isEraser = false;
    document.getElementById("pencil-btn").classList.add("active");
    document.getElementById("eraser-btn").classList.remove("active");
  });
});

document.getElementById("pencil-btn").addEventListener("click", () => {
  isEraser = false;
  document.getElementById("pencil-btn").classList.add("active");
  document.getElementById("eraser-btn").classList.remove("active");
});

document.getElementById("eraser-btn").addEventListener("click", () => {
  isEraser = true;
  document.getElementById("eraser-btn").classList.add("active");
  document.getElementById("pencil-btn").classList.remove("active");
});

document.getElementById("clear-btn").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  notesLayer.innerHTML = "";
});

document.getElementById("add-note-btn").addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "user-note";
  note.contentEditable = true;
  note.textContent = "write something…";
  note.style.left = 40 + Math.random() * 140 + "px";
  note.style.top = 30 + Math.random() * 90 + "px";
  note.style.transform = `rotate(${(Math.random() * 10 - 5).toFixed(1)}deg)`;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  note.addEventListener("mousedown", (e) => {
    if (e.target !== note) return;
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    note.style.zIndex = 10;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const rect = notesLayer.getBoundingClientRect();
    note.style.left = e.clientX - rect.left - offsetX + "px";
    note.style.top = e.clientY - rect.top - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    note.style.zIndex = 1;
  });

  notesLayer.appendChild(note);
  note.focus();
});

document.body.addEventListener("touchmove", (e) => {
  if (e.target === canvas) e.preventDefault();
}, { passive: false });

const revealEls = document.querySelectorAll(".section, .scrapbook, .say-hi, .folders");
revealEls.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

revealEls.forEach((el) => observer.observe(el));

window.addEventListener("load", () => {
  setTimeout(() => {
    const intro = document.getElementById("intro");
    if (intro) intro.classList.add("hide");
  }, 1600);
});