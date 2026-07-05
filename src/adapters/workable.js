export async function fetchWorkable(company) {
  try {
    const r = await fetch(`https://apply.workable.com/api/v3/accounts/${company.token}/jobs`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();

    return (data.results || []).map(j => ({
      id: `workable-${company.token}-${j.shortcode}`,
      company: company.name,
      title: j.title,
      location: j.location?.city || j.location?.location_str || '',
      url: j.url,
      source: 'workable',
      postedAt: j.published_on || null,
    }));
  } catch (err) {
    console.error(`[workable:${company.token}] failed: ${err.message}`);
    return [];
  }
}