async function fetchGreenhouse(token) {
  const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`);
  const data = await r.json();
  return data.jobs.map(j => ({
    id: `greenhouse-${token}-${j.id}`,
    company: token,
    title: j.title,
    location: j.location?.name ?? '',
    url: j.absolute_url,
    source: 'greenhouse',
    postedAt: j.updated_at,
  }));
}
