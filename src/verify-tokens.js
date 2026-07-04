const candidates2 = [
  'zohocorp', 'zoho', 'clearfeed', 'whatfix', 'hasura', 'apna',
  'vahak', 'spinny', 'cars24', 'urbancompany', 'housing', 'nobroker',
  'rentomojo', 'lenskart', 'purplle', 'nykaa', 'pharmeasy', 'curefit',
  'niyo', 'jupiter', 'fi-money', 'slice-it', 'kiwi', 'onecard',
  'setu', 'decentro', 'yubi', 'perfios', 'signzy', 'karza',
  'moengage', 'netcore', 'wingify', 'crownit', 'games24x7',
  'mpl', 'winzo', 'nazara', 'infoedge', 'naukri', 'quikr',
  'zetwerk', 'infra-market', 'udaan', 'ninjacart', 'bigbasket',
  'grofers', 'blinkit', 'zepto', 'swiggy-instamart',
];

async function testGreenhouse(token) {
  try {
    const r = await fetch(`https://boards-api.greenhouse.io/v1/boards/${token}/jobs`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.jobs?.length ? { ats: 'greenhouse', token, count: data.jobs.length } : null;
  } catch { return null; }
}

async function testLever(token) {
  try {
    const r = await fetch(`https://api.lever.co/v0/postings/${token}?mode=json`);
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data) && data.length ? { ats: 'lever', token, count: data.length } : null;
  } catch { return null; }
}

async function testAshby(token) {
  try {
    const r = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${token}`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.jobs?.length ? { ats: 'ashby', token, count: data.jobs.length } : null;
  } catch { return null; }
}

async function run() {
  for (const token of candidates2) {
    const [gh, lv, ab] = await Promise.all([
      testGreenhouse(token), testLever(token), testAshby(token),
    ]);
    const hits = [gh, lv, ab].filter(Boolean);
    if (hits.length) {
      hits.forEach(h => console.log(`✅ FOUND: "${token}" → ${h.ats} (${h.count} jobs)`));
    } else {
      console.log(`❌ no match: "${token}"`);
    }
  }
}

run();