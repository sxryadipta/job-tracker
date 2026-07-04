const MAX_PAGES = 10; // cap so a broad query can't spiral into hundreds of calls

export async function fetchAdzunaDelhiNCR(appId, appKey) {
  if (!appId || !appKey) {
    console.error('[adzuna] missing ADZUNA_APP_ID / ADZUNA_APP_KEY, skipping');
    return [];
  }

  const what = 'software engineer OR SDE OR developer OR intern';
  const where = 'Delhi NCR';
  let all = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const url =
        `https://api.adzuna.com/v1/api/jobs/in/search/${page}` +
        `?app_id=${appId}&app_key=${appKey}` +
        `&results_per_page=50` +
        `&what=${encodeURIComponent(what)}` +
        `&where=${encodeURIComponent(where)}`;

      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      const results = data.results || [];
      if (results.length === 0) break;

      all = all.concat(
        results.map(j => ({
          id: `adzuna-${j.id}`,
          company: j.company?.display_name ?? 'Unknown',
          title: j.title,
          location: j.location?.display_name ?? '',
          url: j.redirect_url,
          source: 'adzuna',
          postedAt: j.created || null,
        }))
      );
    } catch (err) {
      console.error(`[adzuna] page ${page} failed: ${err.message}`);
      break;
    }
  }

  return all;
}