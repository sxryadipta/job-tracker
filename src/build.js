import pLimit from 'p-limit';
const limit = pLimit(15); // 15 concurrent requests max

const results = await Promise.allSettled(
  companies.map(c => limit(() => fetchCompanyJobs(c)))
);
// allSettled = one broken company never kills the run