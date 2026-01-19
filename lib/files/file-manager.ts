import * as fs from "node:fs";
import { dirname } from "node:path";
import type { EnvironmentModels } from "@kontent-ai/management-sdk";
import chalk from "chalk";
import { coreConfig } from "../config.js";
import { getEnvironmentInfoComment } from "../core/comment.utils.js";
import type { GeneratedFile, GeneratedSet, ModuleFileExtension } from "../core/core.models.js";
import { toOutputDirPath } from "../core/core.utils.js";
import { getImporter } from "../core/importer.js";
import { type FormatOptions, formatCodeAsync } from "../format/formatter.js";

export function getFileManager(config: {
	readonly moduleFileExtension: ModuleFileExtension;
	readonly outputDir?: string;
	readonly formatOptions?: FormatOptions;
	readonly environmentInfo: Readonly<EnvironmentModels.EnvironmentInformationModel>;
	readonly addTimestamp: boolean;
}) {
	const fixedOutputDir = toOutputDirPath(config.outputDir);
	const importer = getImporter(config.moduleFileExtension);

	const createFileOnFs = (text: string, filePath: string): void => {
		const fullFilePath = `${fixedOutputDir.endsWith("/") ? fixedOutputDir : `${fixedOutputDir}/`}${filePath}`;
		const fileContent = removeFirstEmptyLine(
			`${getEnvironmentInfoComment({
				environmentInfo: config.environmentInfo,
				timestampDate: config.addTimestamp ? new Date() : undefined,
			})}\n\n${text}`,
		);

		ensureDirectoryExistence(fullFilePath);
		fs.writeFileSync(`./${fullFilePath}`, fileContent, {});
		console.log(`Created '${chalk.yellow(fullFilePath)}'`);
	};

	const getFormattedCodeAsync = async (code: string, filePath: string): Promise<string> => {
		try {
			if (filePath.endsWith(".ts")) {
				return await formatCodeAsync(code, config.formatOptions);
			}
			return code;
		} catch {
			console.log(`Failed to format file '${chalk.red(filePath)}'. Skipping code formatting.`);
			return code;
		}
	};

	const removeFirstEmptyLine = (code: string): string => {
		if (code.startsWith("\n")) {
			return code.substring(1);
		}
		return code;
	};

	const ensureDirectoryExistence = (filePath: string): void => {
		const resolvedDirname = dirname(filePath);
		if (fs.existsSync(resolvedDirname)) {
			return;
		}
		ensureDirectoryExistence(resolvedDirname);
		fs.mkdirSync(resolvedDirname);
	};

	const createFiles = (files: readonly GeneratedFile[]): void => {
		for (const file of files) {
			createFileOnFs(file.text, file.filename);
		}
	};

	const getSetFolder = (set: GeneratedSet): string => {
		return set.folderName ? `${set.folderName}/` : "";
	};

	const getSetFiles = (set: GeneratedSet): readonly GeneratedFile[] => {
		const setFolder = getSetFolder(set);
		const setFiles: readonly GeneratedFile[] = set.files.map<GeneratedFile>((file) => {
			return {
				filename: `${setFolder}${file.filename}`,
				text: file.text,
			};
		});

		return setFiles;
	};

	const getSetsBarrelExportFiles = (sets: readonly GeneratedSet[]): GeneratedFile => {
		return {
			filename: coreConfig.barrelExportFilename,
			text: importer.getBarrelExportCode(
				sets.flatMap((set) => {
					return set.files.map((file) => importer.getGeneratedFilename(`./${getSetFolder(set)}${file.filename}`));
				}),
			),
		};
	};

	return {
		getSetFilesAsync: async (sets: readonly GeneratedSet[]): Promise<readonly GeneratedFile[]> => {
			return await Promise.all(
				[...sets.flatMap((set) => getSetFiles(set)), getSetsBarrelExportFiles(sets)].map<Promise<GeneratedFile>>(async (file) => {
					const generatedFilename = importer.getGeneratedFilename(file.filename);
					return {
						filename: generatedFilename,
						text: await getFormattedCodeAsync(file.text, generatedFilename),
					};
				}),
			);
		},
		createFiles,
	};
}
