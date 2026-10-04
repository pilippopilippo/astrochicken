// Demo mode of the writing panel: while site.config.mjs still has the placeholder repository, the
// panel at /admin/ works on a test repository in the visitor's browser instead of GitHub. After the
// build, this copies the published sample posts (text and images) to /admin/demo/, with a list in
// /admin/demo/files.json, so the panel can load them into that test repository on the first visit.
import { copyFile, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/** Folders whose files are copied, relative to the project root */
const FOLDERS = ["src/content/blog", "src/assets/images"];

const files = async (folder) => {
	try {
		return (await readdir(folder, { recursive: true, withFileTypes: true }))
			.filter((entry) => entry.isFile() && !entry.name.startsWith("."))
			.map((entry) => join(entry.parentPath, entry.name));
	} catch {
		return []; // the folder doesn't exist
	}
};

export default function demoContent({ enabled }) {
	return {
		name: "demo-content",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				if (!enabled) return;
				const root = process.cwd();
				const out = join(fileURLToPath(dir), "admin", "demo");
				const all = (await Promise.all(FOLDERS.map((folder) => files(join(root, folder))))).flat();
				// Leave out the folders of draft posts: their text and images aren't published
				const drafts = new Set();
				for (const file of all) {
					if (/index\.mdx?$/.test(file) && /^draft:\s*true\s*$/m.test(await readFile(file, "utf8"))) {
						drafts.add(dirname(file));
					}
				}
				const published = all.filter((file) => ![...drafts].some((folder) => file.startsWith(folder + "/")));
				const paths = [];
				for (const file of published) {
					const path = relative(root, file).split("\\").join("/");
					await mkdir(dirname(join(out, path)), { recursive: true });
					await copyFile(file, join(out, path));
					paths.push(path);
				}
				await writeFile(join(out, "files.json"), JSON.stringify(paths));
				logger.info(`writing panel demo: ${paths.length} files`);
			},
		},
	};
}
