const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const pad = (n: number) => String(n).padStart(2, "0");

export function postParams(p: { id: string; data: { date: Date } }) {
  const d = p.data.date;
  return {
    year: String(d.getUTCFullYear()),
    month: pad(d.getUTCMonth() + 1),
    day: pad(d.getUTCDate()),
    slug: p.id,
  };
}

export function postUrl(p: { id: string; data: { date: Date } }) {
  const { year, month, day, slug } = postParams(p);
  return `${base}/${year}/${month}/${day}/${slug}/`;
}

export const pageUrl = (p: { id: string }) => `${base}/${p.id}/`;
export const homeUrl = `${base}/`;