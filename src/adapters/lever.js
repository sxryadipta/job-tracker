export async function fetchLever(company) {
  try {
    const url = `https://api.lever.co/v0/postings/${company.token}?mode=json`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const jobs = await r.json();

    return (jobs || []).map(j => ({
      id: `lever-${company.token}-${j.id}`,
      company: company.name,
      title: j.text,
      location: j.categories?.location ?? '',
      url: j.hostedUrl,
      source: 'lever',
      postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
    }));
  } catch (err) {
    console.error(`[lever:${company.token}] failed: ${err.message}`);
    return [];
  }
}