import gitChangelog from "@changesets/changelog-git";

const { getReleaseLine: defaultGetReleaseLine } = gitChangelog;

export async function getReleaseLine(changeset, type, changelogOpts) {
	const line = await defaultGetReleaseLine(changeset, type, changelogOpts);

	if (!line) {
		return "";
	}

	// Clean up commit hashes and colons (e.g., "- 76e9840:" or "- [76e9840]:")
	const cleaned = line.replace(/^-+\s*\[?[0-9a-f]{6,8}\]?:?\s*/i, "- ");

	return cleaned.trim();
}

export function getDependencyReleaseLine() {
	return "";
}

export default {
	getReleaseLine,
	getDependencyReleaseLine,
};
