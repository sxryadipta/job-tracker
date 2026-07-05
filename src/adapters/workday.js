export async function fetchWorkday(company) {
  try {
    const url = `https://${company.workdaySite}.${company.workdayTenant}.myworkdayjobs.com/wday/cxs/${company.workdaySite}/${company.workdayBoard}/jobs`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appliedFacets: {}, limit: 100, offset: 0, searchText: '' }),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();

    return (data.jobPostings || []).map(j => ({
      id: `workday-${company.workdaySite}-${j.externalPath}`,
      company: company.name,
      title: j.title,
      location: j.locationsText || '',
      url: `https://${company.workdaySite}.${company.workdayTenant}.myworkdayjobs.com${j.externalPath}`,
      source: 'workday',
      postedAt: j.postedOn || null,
    }));
  } catch (err) {
    console.error(`[workday:${company.name}] failed: ${err.message}`);
    return [];
  }
}