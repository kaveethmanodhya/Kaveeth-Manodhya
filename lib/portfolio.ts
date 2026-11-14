import defaults from '../data/portfolio.json';
export type PortfolioContent = typeof defaults;
export const defaultContent: PortfolioContent = defaults;
export async function getPortfolioContent(): Promise<PortfolioContent> {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  const repo = process.env.GITHUB_CONTENT_REPO || 'kaveethmanodhya/Kaveeth-Manodhya';
  const branch = process.env.GITHUB_CONTENT_BRANCH || 'redesign/scroll-film-portfolio';
  if (!token) return defaults;
  try {
    const response = await fetch('https://api.github.com/repos/' + repo + '/contents/data/portfolio.json?ref=' + encodeURIComponent(branch), {
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json' }, cache: 'no-store'
    });
    if (!response.ok) return defaults;
    const result = await response.json();
    const encoded = String(result.content).replace(/\s/g, '');
    const raw = Buffer.from(encoded, 'base64').toString('utf8');
    return JSON.parse(raw) as PortfolioContent;
  } catch { return defaults; }
}
export function safeContent(input: unknown): PortfolioContent {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid portfolio data');
  const result = input as PortfolioContent;
  const necessary = ['intro','navigation','about','expertise','work','manifesto','journey','contact','footer','seo'];
  for (const name of necessary) if (!(name in result)) throw new Error('Missing section: ' + name);
  if (JSON.stringify(result).length > 250000) throw new Error('Portfolio data exceeds size limit');
  const arrays = [];
  for (const key of arrays) if (!Array.isArray((result as unknown as Record<string, unknown>)[key])) throw new Error('Invalid list: ' + key);
  return result;
}
