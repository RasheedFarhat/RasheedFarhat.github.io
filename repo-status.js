(() => {
  const owner = "RasheedFarhat";
  const cacheTtlMs = 60 * 60 * 1000;

  const nodes = document.querySelectorAll("[data-repo]");
  if (nodes.length === 0) return;

  const repos = new Map();
  nodes.forEach((node) => {
    const repo = node.dataset.repo;
    if (!repos.has(repo)) repos.set(repo, node.dataset.ci === "true");
  });

  const formatRelative = (isoDate) => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const day = 24 * 60 * 60 * 1000;
    const days = Math.round(diffMs / day);
    if (days <= 0) return "today";
    if (days === 1) return "1 day ago";
    if (days < 30) return `${days} days ago`;
    const months = Math.round(days / 30);
    if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;
    const years = Math.round(months / 12);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  };

  const readCache = (repo) => {
    try {
      const raw = window.localStorage.getItem(`rf-repo-status:${repo}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.fetchedAt > cacheTtlMs) return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const writeCache = (repo, data) => {
    try {
      window.localStorage.setItem(
        `rf-repo-status:${repo}`,
        JSON.stringify({ ...data, fetchedAt: Date.now() })
      );
    } catch {
      // Cache is a convenience, not a requirement. A visitor with storage
      // disabled still gets a live fetch on every page, just no reuse.
    }
  };

  const fetchRepo = async (repo, hasCi) => {
    const cached = readCache(repo);
    if (cached) return cached;

    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoResponse.ok) throw new Error("repo lookup failed");
    const repoJson = await repoResponse.json();
    const data = { pushedAt: repoJson.pushed_at, ci: null };

    if (hasCi) {
      const runsResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=1`
      );
      if (runsResponse.ok) {
        const runsJson = await runsResponse.json();
        const latest = runsJson.workflow_runs && runsJson.workflow_runs[0];
        // A null conclusion means the run is still in progress. Leave data.ci
        // unset rather than guess, so a mid-run visit shows recency only.
        if (latest && latest.conclusion) data.ci = latest.conclusion;
      }
    }

    writeCache(repo, data);
    return data;
  };

  const render = (repo, data) => {
    const time = `<span class="repo-live__time">Updated ${formatRelative(data.pushedAt)}</span>`;
    document.querySelectorAll(`[data-repo="${repo}"]`).forEach((node) => {
      if (node.dataset.ci === "true" && data.ci) {
        const passing = data.ci === "success";
        const lampClass = passing ? "lamp--sig" : "lamp--amb";
        const label = passing ? "CI passing" : "CI failing";
        node.innerHTML = `<span class="lamp ${lampClass}">${label}</span>${time}`;
      } else {
        node.innerHTML = time;
      }
      node.hidden = false;
    });
  };

  repos.forEach((hasCi, repo) => {
    fetchRepo(repo, hasCi)
      .then((data) => render(repo, data))
      .catch(() => {
        // GitHub unreachable, rate-limited, or offline. The page already
        // reads correctly without a live signal, so fail silent.
      });
  });
})();
