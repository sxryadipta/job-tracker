function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderCard(job) {
  return `
    <a class="job-card" href="${job.url}" target="_blank" rel="noopener noreferrer">
      <div class="job-card-top">
        <span class="company">${escapeHtml(job.company)}</span>
        <div class="badges">
          ${job.isNew ? '<span class="badge badge-new">NEW</span>' : ''}
          ${job.tags?.intern ? '<span class="badge badge-intern">Intern</span>' : ''}
        </div>
      </div>
      <h3 class="title">${escapeHtml(job.title)}</h3>
      <div class="meta">
        <span class="location">📍 ${escapeHtml(job.location || 'Not specified')}</span>
        <span class="source">${job.source}</span>
      </div>
    </a>`;
}

export function renderPage({ pageTitle, jobs, extraNote, active }) {
  const sorted = [...jobs].sort((a, b) => {
    if (a.isNew !== b.isNew) return b.isNew - a.isNew;
    return new Date(b.postedAt || 0) - new Date(a.postedAt || 0);
  });

  const nav = (page) => `
    <a href="index.html" class="${page === 'home' ? 'active' : ''}">Home</a>
    <a href="tracked.html" class="${page === 'tracked' ? 'active' : ''}">Tracked Companies</a>
    <a href="delhi-ncr.html" class="${page === 'ncr' ? 'active' : ''}">Delhi NCR Discovery</a>
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="topnav">${nav(active)}</nav>
  <header>
    <h1>${pageTitle}</h1>
    <p class="updated">Last updated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} · ${sorted.length} roles</p>
    ${extraNote ? `<p class="note">${extraNote}</p>` : ''}
  </header>
  <main class="job-grid">
    ${sorted.length ? sorted.map(renderCard).join('\n') : '<p class="empty">No matching roles right now. Check back soon.</p>'}
  </main>
</body>
</html>`;
}

export function renderIndex({ trackedCount, ncrCount }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Tracker</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="topnav">
    <a href="index.html" class="active">Home</a>
    <a href="tracked.html">Tracked Companies</a>
    <a href="delhi-ncr.html">Delhi NCR Discovery</a>
  </nav>
  <header>
    <h1>SDE 1 / Fresher Job Tracker</h1>
    <p class="updated">Last updated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
  </header>
  <main class="landing-grid">
    <a class="landing-card" href="tracked.html">
      <h2>Tracked Companies</h2>
      <p class="count">${trackedCount}</p>
      <p class="desc">Roles from your hand-picked company list</p>
    </a>
    <a class="landing-card" href="delhi-ncr.html">
      <h2>Delhi NCR Discovery</h2>
      <p class="count">${ncrCount}</p>
      <p class="desc">Auto-discovered roles across any company in Delhi NCR</p>
    </a>
  </main>
</body>
</html>`;
}