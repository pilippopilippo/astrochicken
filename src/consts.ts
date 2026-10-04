// Site-wide values, set in site.config.mjs at the root of the project.
import config from '../site.config.mjs';

export const SITE_TITLE = config.title;
export const SITE_DESCRIPTION = config.description;
export const GITHUB_REPO = config.github.repo;
export const GITHUB_BRANCH = config.github.branch;
export const FOOTER_TEXT = config.footer;
export const CLOUDFLARE_ANALYTICS_TOKEN = config.cloudflareAnalyticsToken;
