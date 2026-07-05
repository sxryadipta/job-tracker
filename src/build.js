import { readFileSync, writeFileSync } from 'fs';
import pLimit from 'p-limit';
import { fetchGreenhouse } from './adapters/greenhouse.js';
import { fetchLever } from './adapters/lever.js';
import { fetchAshby } from './adapters/ashby.js';
import { fetchWorkable } from './adapters/workable.js';
import { fetchSmartRecruiters } from './adapters/smartrecruiters.js';
import { fetchWorkday } from './adapters/workday.js';
import { fetchAdzunaDelhiNCR } from './adapters/adzuna.js';
import { tagJob } from './filter.js';
import { loadState, saveState, diffAndMark } from './state.js';
import { renderPage, renderIndex } from './render.js';

const limit = pLimit(15);

async function fetchAllTrackedCompanies() {
  const { companies } = JSON.parse(readFileSync('companies.json', 'utf-8'));

  const fetchers = {
  greenhouse: fetchGreenhouse,
  lever: fetchLever,
  ashby: fetchAshby,
  workable: fetchWorkable,
  smartrecruiters: fetchSmartRecruiters,
  workday: fetchWorkday,
  };

  const results = await Promise.allSettled(
    companies.map(c => limit(() => {
      const fn = fetchers[c.ats];
      if (!fn) {
        console.error(`Unknown ats type "${c.ats}" for ${c.name}, skipping`);
        return [];
      }
      return fn(c);
    }))
  );

  return results.flatMap(r => (r.status === 'fulfilled' ? r.value : []));
}

async function build() {
  console.log('Fetching tracked companies...');
  const trackedRaw = await fetchAllTrackedCompanies();

  console.log('Fetching Delhi NCR discovery feed (Adzuna)...');
  const ncrRaw = await fetchAdzunaDelhiNCR(process.env.ADZUNA_APP_ID, process.env.ADZUNA_APP_KEY);

  const trackedTagged = trackedRaw.map(tagJob).filter(j => j.tags.relevant && j.tags.india);
  const ncrTagged = ncrRaw.map(tagJob).filter(j => j.tags.relevant && j.tags.delhiNCR);

  const state = loadState();
  const trackedMarked = diffAndMark(trackedTagged, state);
  const ncrMarked = diffAndMark(ncrTagged, state);
  saveState(state);

  writeFileSync('docs/tracked.html', renderPage({
    pageTitle: 'Tracked Companies — SDE 1 / Fresher',
    jobs: trackedMarked,
    active: 'tracked',
  }));

  writeFileSync('docs/delhi-ncr.html', renderPage({
    pageTitle: 'Delhi NCR — Any Company',
    jobs: ncrMarked,
    extraNote: 'Auto-discovered via Adzuna. Verify listings before applying — not hand-curated.',
    active: 'ncr',
  }));

  writeFileSync('docs/index.html', renderIndex({
    trackedCount: trackedMarked.length,
    ncrCount: ncrMarked.length,
  }));

  writeFileSync('docs/tracked.json', JSON.stringify(trackedMarked, null, 2));
  writeFileSync('docs/ncr.json', JSON.stringify(ncrMarked, null, 2));

  console.log(`Done. Tracked: ${trackedMarked.length}, NCR: ${ncrMarked.length}`);
}

build();