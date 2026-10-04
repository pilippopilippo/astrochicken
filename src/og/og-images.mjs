// Social preview images (Open Graph): after the build, every page whose og:image points to /og/…
// (a page without a cover, see src/components/BaseHead.astro) gets a 1200x630 PNG with its title.
// The text is drawn as vector shapes with the site font, so the result doesn't depend on the fonts
// installed where the site is built.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 80;
const TEXT_WIDTH = WIDTH - 2 * MARGIN;
const COLORS = { text: "#161616", muted: "#52524f", accent: "#b84a12", from: "#fffaf3", to: "#ffe4c4" };

const here = dirname(fileURLToPath(import.meta.url));
const loadFont = async (file) => {
	const data = await readFile(join(here, file));
	return opentype.parse(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
};

/** Text of an HTML attribute value, with the entities Astro escapes decoded */
const decode = (text) =>
	text
		.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&amp;/g, "&");

const meta = (html, property) => {
	const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`));
	return match ? decode(match[1]) : undefined;
};

/** Drop the characters the font can't draw (e.g. emoji), which would show as empty boxes */
const drawable = (font, text) =>
	[...text]
		.filter((char) => /\s/.test(char) || font.charToGlyphIndex(char) > 0)
		.join("")
		.replace(/\s+/g, " ")
		.trim();

/** Split text into lines no wider than `width`, breaking long words if needed */
const wrap = (font, text, size, width) => {
	const lines = [];
	let line = "";
	for (const word of text.split(" ")) {
		const candidate = line ? `${line} ${word}` : word;
		if (font.getAdvanceWidth(candidate, size) <= width) {
			line = candidate;
			continue;
		}
		if (line) lines.push(line);
		line = word;
		while (font.getAdvanceWidth(line, size) > width) {
			let cut = line.length - 1;
			while (cut > 1 && font.getAdvanceWidth(line.slice(0, cut), size) > width) cut--;
			lines.push(line.slice(0, cut));
			line = line.slice(cut);
		}
	}
	if (line) lines.push(line);
	return lines;
};

/** Lines of the title at the largest size that fits in `maxLines`, shortened with "…" otherwise */
const fitTitle = (font, text, maxLines) => {
	for (const size of [76, 68, 60, 54]) {
		const lines = wrap(font, text, size, TEXT_WIDTH);
		if (lines.length <= maxLines) return { size, lines };
	}
	const size = 54;
	const lines = wrap(font, text, size, TEXT_WIDTH).slice(0, maxLines);
	let last = lines[maxLines - 1];
	while (last && font.getAdvanceWidth(`${last}…`, size) > TEXT_WIDTH) last = last.slice(0, -1);
	lines[maxLines - 1] = `${last.trimEnd()}…`;
	return { size, lines };
};

const path = (font, text, x, y, size, color) =>
	`<path fill="${color}" d="${font.getPath(text, x, y, size).toPathData(2)}"/>`;

const render = ({ bold, regular, icon, title, subtitle, site, host }) => {
	const heading = fitTitle(bold, drawable(bold, title), subtitle ? 2 : 3);
	const lineHeight = Math.round(heading.size * 1.15);
	let y = 150 + heading.size;
	const shapes = heading.lines.map((line, i) => path(bold, line, MARGIN, y + i * lineHeight, heading.size, COLORS.text));
	y += (heading.lines.length - 1) * lineHeight;
	if (subtitle) {
		const lines = wrap(regular, drawable(regular, subtitle), 36, TEXT_WIDTH).slice(0, 2);
		lines.forEach((line, i) => shapes.push(path(regular, line, MARGIN, y + 70 + i * 48, 36, COLORS.muted)));
	}
	// Footer: emoji icon, site name and address
	const footerY = HEIGHT - MARGIN;
	const siteName = drawable(bold, site);
	shapes.push(path(bold, siteName, MARGIN + 76, footerY, 36, COLORS.text));
	const address = drawable(regular, host);
	const addressWidth = regular.getAdvanceWidth(address, 30);
	shapes.push(path(regular, address, WIDTH - MARGIN - addressWidth, footerY, 30, COLORS.muted));
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.from}"/><stop offset="1" stop-color="${COLORS.to}"/></linearGradient></defs>
<rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
<rect width="16" height="${HEIGHT}" fill="${COLORS.accent}"/>
<svg x="${MARGIN}" y="${footerY - 46}" width="58" height="58" ${icon.viewBox}>${icon.body}</svg>
${shapes.join("\n")}
</svg>`;
};

/** All the .html files under a folder */
const htmlFiles = async (folder) =>
	(await readdir(folder, { recursive: true, withFileTypes: true }))
		.filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
		.map((entry) => join(entry.parentPath, entry.name));

export default function ogImages() {
	return {
		name: "og-images",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const out = fileURLToPath(dir);
				const [bold, regular, favicon] = await Promise.all([
					loadFont("AtkinsonHyperlegible-Bold.ttf"),
					loadFont("AtkinsonHyperlegible-Regular.ttf"),
					readFile(join(out, "favicon.svg"), "utf8"),
				]);
				const icon = {
					viewBox: favicon.match(/viewBox="[^"]*"/)?.[0] ?? 'viewBox="0 0 36 36"',
					body: favicon.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""),
				};
				let count = 0;
				for (const file of await htmlFiles(out)) {
					const html = await readFile(file, "utf8");
					const image = meta(html, "og:image");
					if (!image) continue;
					const url = new URL(image);
					if (!url.pathname.startsWith("/og/")) continue;
					const site = meta(html, "og:site_name") ?? "";
					let title = meta(html, "og:title") ?? site;
					// "Tags · Site" → "Tags": the site name is already at the bottom
					if (site && title.endsWith(` · ${site}`)) title = title.slice(0, -` · ${site}`.length);
					// The home page shows the site name with its description
					const subtitle = title === site ? meta(html, "og:description") : undefined;
					const svg = render({ bold, regular, icon, title, subtitle, site, host: url.host });
					const target = join(out, decodeURIComponent(url.pathname));
					await mkdir(dirname(target), { recursive: true });
					await writeFile(target, await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer());
					count++;
				}
				logger.info(`${count} social preview images generated`);
			},
		},
	};
}
