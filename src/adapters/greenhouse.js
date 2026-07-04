export async function fetchGreenhouse(company) {
  try {
    const url = `https://boards-api.greenhouse.io/v1/boards/${company.token}/jobs?content=true`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();

    return (data.jobs || []).map(j => ({
      id: `greenhouse-${company.token}-${j.id}`,
      company: company.name,
      title: j.title,
      location: j.location?.name ?? '',
      url: j.absolute_url,
      source: 'greenhouse',
      postedAt: j.updated_at || j.created_at || null,
    }));
  } catch (err) {
    console.error(`[greenhouse:${company.token}] failed: ${err.message}`);
    return [];
  }
}