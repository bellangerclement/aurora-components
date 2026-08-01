const DATA_FILES = {
  status: "data/status.json",
  indicators: "data/indicators.json",
  officialPending: "data/official-pending.json",
  steps: "data/steps.json",
  timeline: "data/timeline.json",
  news: "data/news.json",
  methodology: "data/methodology.json",
  visitors: "data/visitors.json"
};

async function fetchJSON(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Erreur de chargement : ${url}`);
  }
  return response.json();
}

function formatDate(value, withTime = false) {
  if (!value) return "Non communiquée";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    ...(withTime ? { timeStyle: "short" } : {})
  }).format(date);
}

function safeText(value) {
  return value ?? "";
}

function renderStatus(data) {
  const badge = document.getElementById("global-status");
  badge.textContent = data.statusLabel;
  badge.className = `status-badge status-badge--${data.statusLevel || "in-progress"}`;

  document.getElementById("last-update").textContent =
    `Dernière mise à jour : ${formatDate(data.lastUpdate, true)}`;

  document.getElementById("progress-summary").textContent = data.summary;

  const container = document.getElementById("progress-steps");
  container.innerHTML = data.steps.map((step, index) => `
    <article class="progress-step progress-step--${step.status}">
      <div class="progress-step__top">
        <div>
          <span class="progress-step__index">${index + 1}</span>
        </div>
        <div>
          <h3>${safeText(step.label)}</h3>
          <p>${safeText(step.description)}</p>
        </div>
      </div>
      <div class="progress-step__status">${safeText(step.statusLabel)}</div>
    </article>
  `).join("");
}

function renderIndicators(items) {
  const visibleItems = items.filter(item => item.value !== null && item.value !== "");
  const container = document.getElementById("indicators-grid");

  container.innerHTML = visibleItems.map(item => `
    <article class="indicator-card">
      <strong>${safeText(item.value)}</strong>
      <h3>${safeText(item.label)}</h3>
      ${item.description ? `<p>${safeText(item.description)}</p>` : ""}
      ${item.source ? `<small>Source : ${safeText(item.source)}</small>` : ""}
    </article>
  `).join("");
}

function renderOfficialPending(data) {
  document.getElementById("official-list").innerHTML =
    data.official.map(item => `<li>${safeText(item)}</li>`).join("");

  document.getElementById("pending-list").innerHTML =
    data.pending.map(item => `<li>${safeText(item)}</li>`).join("");
}

function renderSteps(items) {
  document.getElementById("steps-grid").innerHTML = items.map(item => `
    <article class="step-card">
      <div class="step-card__head">
        <span class="tag">${safeText(item.authority)}</span>
        <span class="tag ${item.status === "Publié" ? "tag--official" : ""}">
          ${safeText(item.status)}
        </span>
      </div>
      <h3>${safeText(item.title)}</h3>
      <p>${safeText(item.description)}</p>
      <p><strong>Date :</strong> ${safeText(item.date || "Non communiquée")}</p>
      ${item.sourceUrl ? `
        <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">
          Consulter la source
        </a>` : ""}
    </article>
  `).join("");
}

function renderTimeline(items) {
  document.getElementById("timeline-list").innerHTML = items.map(item => `
    <article class="timeline-item">
      <div class="timeline-item__date">${formatDate(item.date)}</div>
      <div class="timeline-item__card">
        <div class="news-card__meta">
          <span class="tag ${item.type === "officiel" ? "tag--official" : "tag--market"}">
            ${safeText(item.category)}
          </span>
        </div>
        <h3>${safeText(item.title)}</h3>
        <p>${safeText(item.summary)}</p>
        ${item.sourceUrl ? `
          <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">
            Source
          </a>` : ""}
      </div>
    </article>
  `).join("");
}

function renderNews(items) {
  document.getElementById("news-grid").innerHTML = items.map(item => `
    <article class="news-card">
      <div class="news-card__meta">
        <span class="tag ${item.type === "officiel" ? "tag--official" : "tag--market"}">
          ${safeText(item.category)}
        </span>
        <span>${formatDate(item.date)}</span>
      </div>
      <h3>${safeText(item.title)}</h3>
      <p>${safeText(item.summary)}</p>
      ${item.sourceUrl ? `
        <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer">
          Lire la source
        </a>` : ""}
    </article>
  `).join("");
}

function renderMethodology(data) {
  document.getElementById("methodology-content").innerHTML = `
    <p>${safeText(data.introduction)}</p>
    <h3>Sources suivies</h3>
    <ul>${data.sources.map(item => `<li>${safeText(item)}</li>`).join("")}</ul>
    <h3>Méthode</h3>
    <p>${safeText(data.method)}</p>
    <h3>Limites</h3>
    <p>${safeText(data.limitations)}</p>
  `;
}

async function renderVisitors() {
  const target = document.getElementById("visitor-count");

  try {
    // Remplacez ce chargement local par votre endpoint public lorsque le backend sera prêt.
    const data = await fetchJSON(DATA_FILES.visitors);
    target.textContent = new Intl.NumberFormat("fr-FR").format(data.totalViews || 0);
  } catch (error) {
    target.textContent = "—";
  }
}

function showError(error) {
  console.error(error);
  const main = document.querySelector(".page-shell");
  const alert = document.createElement("div");
  alert.className = "error-state";
  alert.textContent = "Certaines données du baromètre n’ont pas pu être chargées.";
  main.prepend(alert);
}

async function init() {
  try {
    const [
      status,
      indicators,
      officialPending,
      steps,
      timeline,
      news,
      methodology
    ] = await Promise.all([
      fetchJSON(DATA_FILES.status),
      fetchJSON(DATA_FILES.indicators),
      fetchJSON(DATA_FILES.officialPending),
      fetchJSON(DATA_FILES.steps),
      fetchJSON(DATA_FILES.timeline),
      fetchJSON(DATA_FILES.news),
      fetchJSON(DATA_FILES.methodology)
    ]);

    renderStatus(status);
    renderIndicators(indicators);
    renderOfficialPending(officialPending);
    renderSteps(steps);
    renderTimeline(timeline);
    renderNews(news);
    renderMethodology(methodology);
    renderVisitors();
  } catch (error) {
    showError(error);
  }
}

document.addEventListener("DOMContentLoaded", init);
