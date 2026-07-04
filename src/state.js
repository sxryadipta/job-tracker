import { readFileSync, writeFileSync, existsSync } from 'fs';

const STATE_PATH = 'state/seen.json';

export function loadState() {
  if (!existsSync(STATE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

export function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// Marks each job isNew, and adds any new ones into state. Never deletes old entries.
export function diffAndMark(jobs, state) {
  const marked = jobs.map(job => {
    const isNew = !state[job.id];
    if (isNew) {
      state[job.id] = {
        firstSeen: new Date().toISOString(),
        title: job.title,
        company: job.company,
        url: job.url,
      };
    }
    return { ...job, isNew };
  });
  return marked;
}