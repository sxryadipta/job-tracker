const candidates = [
  'razorpay', 'zomato', 'swiggy', 'freshworks', 'browserstack', 'unacademy',
  'zerodha', 'upgrad', 'licious', 'lenskart', 'nykaa', 'pharmeasy', 'udaan',
  'blinkit', 'zepto', 'games24x7', 'mpl', 'winzo', 'nazara', 'apna', 'hasura',
  'whatfix', 'spinny', 'cars24', 'housing', 'nobroker', 'rentomojo', 'purplle',
  'niyo', 'jupiter', 'setu', 'yubi', 'perfios', 'signzy', 'moengage', 'netcore',
  'infoedge', 'naukri', 'quikr', 'zetwerk', 'ninjacart', 'bigbasket',
  'clevertap', 'juspay', 'darwinbox', 'innovaccer', 'amagi', 'khatabook',
  'urbancompany', 'cultfit', 'dunzo', 'sharechat', 'gojek', 'dream11',
  'chargebee', 'freecharge', 'paytm', 'policybazaar', 'ola', 'olacabs',
  'delhivery', 'meesho', 'flipkart', 'myntra', 'cleartrip', 'makemytrip',
  'yatra', 'redbus', 'urbanladder', 'firstcry', 'bluestone', 'mamaearth',
  'wakefit', 'boat', 'oyo', 'rapido', 'porter', 'shadowfax', 'shiprocket',
  'razorpayx', 'instamojo', 'cashfree', 'billdesk', 'phonepe', 'mobikwik',
  'simpl', 'lazypay', 'kredx', 'lendingkart', 'capitalfloat', 'indifi',
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

async function testWorkable(token) {
  try {
    const r = await fetch(`https://apply.workable.com/api/v3/accounts/${token}/jobs`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.results?.length ? { ats: 'workable', token, count: data.results.length } : null;
  } catch { return null; }
}

async function testSmartRecruiters(token) {
  try {
    const r = await fetch(`https://api.smartrecruiters.com/v1/companies/${token}/postings`);
    if (!r.ok) return null;
    const data = await r.json();
    return data.content?.length ? { ats: 'smartrecruiters', token, count: data.content.length } : null;
  } catch { return null; }
}

async function run() {
  const results = [];
  for (const token of candidates) {
    const hits = (await Promise.all([
      testGreenhouse(token), testLever(token), testAshby(token),
      testWorkable(token), testSmartRecruiters(token),
    ])).filter(Boolean);

    if (hits.length) {
      hits.forEach(h => {
        console.log(`✅ FOUND: "${token}" → ${h.ats} (${h.count} jobs)`);
        results.push({ name: token, ats: h.ats, token });
      });
    } else {
      console.log(`❌ no match: "${token}"`);
    }
  }
  console.log(`\n--- ${results.length} hits found ---`);
}

run();