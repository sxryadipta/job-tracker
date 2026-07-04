export async function fetchAshby(company) {
  try {
    const url = `https://api.ashbyhq.com/posting-api/job-board/${company.token}`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();

    return (data.jobs || []).map(j => ({
      id: `ashby-${company.token}-${j.id}`,
      company: company.name,
      title: j.title,
      location: j.location ?? '',
      url: j.jobUrl,
      source: 'ashby',
      postedAt: j.publishedAt || null,
    }));
  } catch (err) {
    console.error(`[ashby:${company.token}] failed: ${err.message}`);
    return [];
  }
}