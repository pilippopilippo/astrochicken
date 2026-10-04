// Site-wide values, set in site.config.mjs at the root of the project.
import config from '../site.config.mjs';

export const SITE_TITLE = config.title;
export const SITE_DESCRIPTION = config.description;
export const GITHUB_REPO = config.github.repo;
export const GITHUB_BRANCH = config.github.branch;
/** Demo mode of the writing panel, while the repository is still the placeholder */
export const PANEL_DEMO = config.github.repo === 'your-name/your-blog';
export const FOOTER_TEXT = config.footer;
export const CLOUDFLARE_ANALYTICS_TOKEN = config.cloudflareAnalyticsToken;
