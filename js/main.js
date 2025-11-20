// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navList = document.getElementById("navList");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("show");
  });

  navList.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navList.classList.remove("show");
    }
  });
}

// Dynamic year in footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

async function loadProjects() {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  try {
    const res = await fetch("content/projects.json");
    if (!res.ok) throw new Error("Failed to fetch projects");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    container.innerHTML = items
      .map((item, index) => {
        const title = item.title || "";
        const kicker = item.kicker || "";
        const summary = item.summary || "";
        const bullets = normalizeBullets(item.bullets);

        const imgs = normalizeImages(item);
        const thumb = imgs.length ? imgs[0] : "";

        return `
          <article class="card card-clickable" data-index="${index}">
            ${
              thumb
                ? `<div class="card-image-wrapper">
                     <img src="${thumb}" alt="${title} thumbnail">
                   </div>`
                : ""
            }
            ${
              kicker
                ? `<p class="card-kicker">${kicker}</p>`
                : ""
            }
            <h3>${title}</h3>
            ${
              summary
                ? `<p>${summary}</p>`
                : ""
            }
            ${
              bullets.length
                ? `<ul class="card-list">
                     ${bullets.map((b) => `<li>${b}</li>`).join("")}
                   </ul>`
                : ""
            }
          </article>
        `;
      })
      .join("");

    // event listener click card tetap seperti semula
  } catch (err) {
    console.error("Error loading projects:", err);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // kode nav toggle + year sebelumnya
  loadProjects();
});


// --- existing nav + year code tetap ---

function normalizeBullets(list) {
  if (!Array.isArray(list)) return [];
  return list
    .map((b) =>
      typeof b === "string" ? b : (b && (b.item || b.value || b.text)) || ""
    )
    .filter((x) => x);
}

// ---------- Projects + modal ----------

const projectModal = document.getElementById("projectModal");
const projectModalBackdrop = document.getElementById("projectModalBackdrop");
const projectModalClose = document.getElementById("projectModalClose");
const modalTitle = document.getElementById("projectModalTitle");
const modalKicker = document.getElementById("projectModalKicker");
const modalSummary = document.getElementById("projectModalSummary");
const modalDetails = document.getElementById("projectModalDetails");
const modalBullets = document.getElementById("projectModalBullets");
const modalImage = document.getElementById("projectModalImage");
const modalMedia = document.getElementById("projectModalMedia");
const modalCount = document.getElementById("projectModalCount");
const modalPrev = document.getElementById("projectModalPrev");
const modalNext = document.getElementById("projectModalNext");

let currentImages = [];
let currentImageIndex = 0;


function openProjectModal(item) {
  if (!projectModal) return;

  modalTitle.textContent = item.title || "";
  modalKicker.textContent = item.kicker || "";
  modalKicker.style.display = item.kicker ? "block" : "none";

  modalSummary.textContent = item.summary || "";
  modalSummary.style.display = item.summary ? "block" : "none";

  modalDetails.textContent = item.details || "";
  modalDetails.style.display = item.details ? "block" : "none";

  const bullets = normalizeBullets(item.bullets);
  if (bullets.length) {
    modalBullets.innerHTML = bullets.map((b) => `<li>${b}</li>`).join("");
    modalBullets.style.display = "block";
  } else {
    modalBullets.innerHTML = "";
    modalBullets.style.display = "none";
  }

  // images
  currentImages = normalizeImages(item);
  currentImageIndex = 0;
  renderProjectModalImage();

  projectModal.classList.add("show");
  projectModal.setAttribute("aria-hidden", "false");
}


function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("show");
  projectModal.setAttribute("aria-hidden", "true");
}

if (projectModalBackdrop) {
  projectModalBackdrop.addEventListener("click", closeProjectModal);
}
if (projectModalClose) {
  projectModalClose.addEventListener("click", closeProjectModal);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProjectModal();
});

async function loadProjects() {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  try {
    const res = await fetch("content/projects.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load projects.json");
    const data = await res.json();
    const items = data.items || [];

    container.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card card-clickable";

      const bulletsHtml = normalizeBullets(item.bullets)
        .map((b) => `<li>${b}</li>`)
        .join("");

      card.innerHTML = `
        <h3>${item.title || ""}</h3>
        ${item.kicker ? `<p class="card-kicker">${item.kicker}</p>` : ""}
        ${item.summary ? `<p>${item.summary}</p>` : ""}
        ${
          bulletsHtml
            ? `<ul class="card-list">
                 ${bulletsHtml}
               </ul>`
            : ""
        }
      `;

      card.addEventListener("click", () => openProjectModal(item));
      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p style="color:#f87171;font-size:0.9rem;">Failed to load projects.</p>';
  }
}

// ---------- Research ----------

async function loadResearch() {
  const container = document.getElementById("researchList");
  if (!container) return;

  try {
    const res = await fetch("content/research.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load research.json");
    const data = await res.json();
    const items = data.items || [];

    container.innerHTML = "";

    items.forEach((item) => {
      const el = document.createElement("article");
      el.className = "research-item";

      const tagsHtml = normalizeBullets(item.tags)
        .map((t) => `<span class="tag-pill">${t}</span>`)
        .join("");

      el.innerHTML = `
        <h3>${item.title || ""}</h3>
        <p class="research-meta">
          ${item.venue || ""}${item.year ? " · " + item.year : ""}
        </p>
        <p>${item.summary || ""}</p>
        ${
          item.link
            ? `<p><a href="${item.link}" target="_blank" rel="noopener noreferrer">View publication</a></p>`
            : ""
        }
        ${
          tagsHtml
            ? `<div class="tag-row">
                 ${tagsHtml}
               </div>`
            : ""
        }
      `;

      container.appendChild(el);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p style="color:#f87171;font-size:0.9rem;">Failed to load research.</p>';
  }
}

// ---------- Experience ----------

async function loadExperience() {
  const container = document.getElementById("experienceTimeline");
  if (!container) return;

  try {
    const res = await fetch("content/experience.json", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load experience.json");
    const data = await res.json();
    const items = data.items || [];

    container.innerHTML = "";

    items.forEach((item) => {
      const el = document.createElement("div");
      el.className = "timeline-item";

      const bulletsHtml = normalizeBullets(item.bullets)
        .map((b) => `<li>${b}</li>`)
        .join("");

      el.innerHTML = `
        <h3>${item.role || ""}</h3>
        <p class="timeline-org">${item.org || ""}</p>
        <p class="timeline-meta">
          ${item.period || ""}${
        item.location ? " | " + item.location : ""
      }</p>
        ${
          bulletsHtml
            ? `<ul>
                 ${bulletsHtml}
               </ul>`
            : ""
        }
      `;

      container.appendChild(el);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      '<p style="color:#f87171;font-size:0.9rem;">Failed to load experience.</p>';
  }
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  // nav toggle + year yang sudah ada
  loadProjects();
  loadResearch();
  loadExperience();
});

function normalizeImages(item) {
  const imgs = [];

  if (item.image) {
    imgs.push(item.image);
  }

  if (Array.isArray(item.images)) {
    item.images.forEach((img) => {
      if (typeof img === "string") {
        if (!imgs.includes(img)) imgs.push(img);
      } else if (img && (img.src || img.path || img.url)) {
        const src = img.src || img.path || img.url;
        if (!imgs.includes(src)) imgs.push(src);
      }
    });
  }

  return imgs;
}



function renderProjectModalImage() {
  if (!modalImage || !modalMedia) return;

  if (!currentImages.length) {
    modalMedia.style.display = "none";
    return;
  }

  modalMedia.style.display = "flex";

  if (currentImageIndex < 0) currentImageIndex = 0;
  if (currentImageIndex >= currentImages.length)
    currentImageIndex = currentImages.length - 1;

  const src = currentImages[currentImageIndex];
  modalImage.src = src;
  modalImage.alt = modalTitle.textContent || "Project image";

  // counter
  if (currentImages.length > 1) {
    modalCount.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
  } else {
    modalCount.textContent = "";
  }

  // tombol prev/next
  if (currentImages.length > 1) {
    modalPrev.style.display = "flex";
    modalNext.style.display = "flex";
  } else {
    modalPrev.style.display = "none";
    modalNext.style.display = "none";
  }
}

if (modalPrev) {
  modalPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!currentImages.length) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    renderProjectModalImage();
  });
}

if (modalNext) {
  modalNext.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!currentImages.length) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    renderProjectModalImage();
  });
}

function normalizeBullets(list) {
  if (!list) return [];
  if (Array.isArray(list)) {
    return list.map((item) =>
      typeof item === "string" ? item : item.item || ""
    ).filter(Boolean);
  }
  return [];
}

async function loadEducation() {
  const container = document.getElementById("educationTimeline");
  if (!container) return;

  try {
    const res = await fetch("content/education.json");
    if (!res.ok) throw new Error("Failed to fetch education");
    const data = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];

    container.innerHTML = items
      .map((item) => {
        const degree = item.degree || "";
        const school = item.school || "";
        const location = item.location || "";
        const period = item.period || "";

        const bullets = normalizeBullets(item.details);

        return `
          <article class="timeline-item">
            <h3>${degree}</h3>
            <p class="timeline-org">${school}</p>
            <p class="timeline-meta">
              ${[period, location].filter(Boolean).join(" · ")}
            </p>
            ${
              bullets.length
                ? `<ul>${bullets.map((b) => `<li>${b}</li>`).join("")}</ul>`
                : ""
            }
          </article>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Error loading education:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  loadResearch();
  loadExperience();
  loadEducation();   // baru
  // fungsi init lain tetap
});
