const requestedFilter = new URLSearchParams(window.location.search).get("filter");
const activePage = requestedFilter === "saved" ? "saved" : document.body.dataset.activePage;
const completedFoundations = ["ecosystemComplete", "paymentComplete", "workflowComplete"]
  .filter((key) => localStorage.getItem(key) === "true").length;
const savedReadingCount = JSON.parse(localStorage.getItem("savedReading") || "[]").length;
const readingHistoryCount = localStorage.getItem("readingHistory")
  ? JSON.parse(localStorage.getItem("readingHistory")).length
  : 2;
const readingLibraryCount = localStorage.getItem("readingLibraryCount") || "29";
const companyDatabaseCount = localStorage.getItem("companyDatabaseCount") || "68";

const navItem = (page, href, icon, label, count = "") => `
  <a class="nav-item ${activePage === page ? "active" : ""}" href="${href}">
    ${icon}${label}${count ? `<span class="nav-count">${count}</span>` : ""}
  </a>`;

document.body.insertAdjacentHTML("afterbegin", `
  <aside class="sidebar">
    <a class="brand" href="index.html" aria-label="The Trek to Healthtech home">
      <span class="brand-mark"><span></span><span></span><span></span><span></span><span></span><span></span></span><span>The Trek to Healthtech</span>
    </a>
    <nav class="primary-nav" aria-label="Main navigation">
      <p class="nav-label">Workspace</p>
      ${navItem("dashboard", "index.html", '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>', "Dashboard")}
      ${navItem("learning", "learning-path.html", '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z"/><path d="M4 6.5v13M8 8h8M8 12h6"/></svg>', "Learning Path", `${completedFoundations}/8`)}
      ${navItem("reading", "reading-library.html", '<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>', "Reading Library", readingLibraryCount)}
      ${navItem("companies", "companies.html", '<svg viewBox="0 0 24 24"><path d="M4 21V8l8-5 8 5v13M8 21v-7h8v7M9 9h.01M15 9h.01"/></svg>', "Companies", companyDatabaseCount)}
      <p class="nav-label">Library</p>
      ${navItem("saved", "reading-library.html?filter=saved", '<svg viewBox="0 0 24 24"><path d="M5 4h14v16l-7-4-7 4z"/></svg>', "Saved Reading", savedReadingCount)}
      ${navItem("history", "reading-history.html", '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M7 3 4 6M17 3l3 3"/></svg>', "Reading History", readingHistoryCount)}
      <a class="nav-item muted" href="#"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m12 8 2.5 2.5L12 16l-2.5-5.5z"/></svg>Glossary<span class="soon">Soon</span></a>
    </nav>
    <div class="profile">
      <div class="avatar"><svg viewBox="0 0 48 48"><circle class="avatar-bg" cx="24" cy="24" r="23"/><path class="avatar-hair-back" d="M12 24c0-11 5-17 12-17s12 6 12 17v15H12z"/><ellipse class="avatar-face" cx="24" cy="24" rx="9" ry="11"/><path class="avatar-hair-front" d="M15 21c1-9 5-12 10-12 6 0 10 5 10 12-4-1-8-4-10-7-2 4-5 6-10 7z"/><path class="avatar-eye" d="M19 24h1M28 24h1"/><path class="avatar-smile" d="M20 29c2 2 6 2 8 0"/><path class="avatar-shirt" d="M10 43c1-7 6-11 14-11s13 4 14 11"/></svg></div>
      <div><strong>Phan Su</strong><span>Product Designer</span></div><button aria-label="Profile options">•••</button>
    </div>
  </aside>`);

document.querySelectorAll("[data-history-back]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (window.history.length <= 1) return;
    event.preventDefault();
    window.history.back();
  });
});
