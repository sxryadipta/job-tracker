export const ROLE_PATTERNS = [
  /\bSDE\s*-?\s*1\b/i,
  /\bSDE\s*-?\s*I\b/i,
  /software\s+(development\s+)?engineer\s*I\b/i,
  /\bSWE\s*-?\s*1\b/i,
  /\bSWE\s*-?\s*I\b/i,
  /new\s*grad/i,
  /entry.level/i,
  /\bfresher\b/i,
  /graduate\s+(engineer\s+)?trainee/i,
  /\bGET\b/,
  /associate\s+software\s+engineer/i,
  /\bintern(ship)?\b/i,
];

const NCR_LOCATIONS = [
  'delhi', 'new delhi', 'noida', 'greater noida',
  'gurugram', 'gurgaon', 'ncr', 'ghaziabad', 'faridabad',
];

// Broad enough to catch any India-based posting, across all major hiring hubs
const INDIA_LOCATIONS = [
  'india', 'bangalore', 'bengaluru', 'hyderabad', 'pune', 'chennai',
  'mumbai', 'delhi', 'new delhi', 'noida', 'gurugram', 'gurgaon', 'ncr',
  'ghaziabad', 'faridabad', 'kolkata', 'ahmedabad', 'jaipur', 'kochi',
  'chandigarh', 'indore', 'coimbatore', 'thiruvananthapuram', 'mysore',
  'remote india', 'india (remote)',
];

export function tagJob(job) {
  const title = job.title || '';
  const location = (job.location || '').toLowerCase();

  const relevant = ROLE_PATTERNS.some(re => re.test(title));
  const delhiNCR = NCR_LOCATIONS.some(loc => location.includes(loc));
  const india = INDIA_LOCATIONS.some(loc => location.includes(loc));
  const intern = /intern/i.test(title);

  return { ...job, tags: { relevant, delhiNCR, india, intern } };
}