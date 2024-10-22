#!/usr/bin/env node
// @ts-check4785838a-0a9e-41fa-a217-4bd234c00c9e

// TODO: resolve paths like described here
// https://www.typescriptlang.org/docs/handbook/modules/reference.html#paths

import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { writeFileSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import ts from "typescript";
import { parse } from "acorn";
import jxpath from "@mangos/jxpath";
import { generate } from "escodegen";
import { verifyPaths, rankPaths, resolveToFullPath } from "./helpers.mjs";

function removeSafeDir(dir) {
	try {
		rmSync(dir, { recursive: true });
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}

/**
 * Compiles files to JavaScript.
 *
 * @param {string[]} files
 * @param {ts.CompilerOptions} options
 */
function createCompiler(config, sourceDir) {
	return function compile(files, targetDIR, options, possibleExtensions) {
		const compilerOptions = { ...config.compilerOptions, ...options };
		const { baseUrl, paths } = compilerOptions;

		if (paths) {
			const pathVerifyResult = verifyPaths(paths);
			if (Array.isArray(pathVerifyResult)) {
				const messages = pathVerifyResult.join("\n");
				throw new Error(message);
			}
		}

		const { exactPaths = [], wildCardPaths = [] } = paths
			? rankPaths(paths)
			: {};

		const host = ts.createCompilerHost(compilerOptions);
		host.writeFile = (
			fileName,
			contents,
			_writeByteOrderMark,
			onError,
			_sourceFiles,
		) => {
			let contentFromAst = contents;
			const isDts = fileName.endsWith(".d.ts");
			const relativeToSourceDir = relative(sourceDir, fileName);
			const altDir = dirname(relativeToSourceDir);
			const subDir = join(targetDIR, altDir);

			mkdirSync(subDir, { recursive: true });

			let path = join(targetDIR, relativeToSourceDir);

			if (!isDts && !fileName.endsWith(".map")) {
				const astTree = parse(contents, {
					ecmaVersion: "latest",
					sourceType: "module",
					ranges: true,
					locations: false,
				});

				switch (compilerOptions.module) {
					case ts.ModuleKind.ES2020: {
						const importStatements = Array.from(
							jxpath("/**/[type=ImportDeclaration]/source/", astTree),
						);
						for (const node of importStatements) {
							if (node !== null && node !== undefined) {
								node.value = resolveToFullPath(
									fileName,
									node.value,
									baseUrl,
									paths,
									exactPaths,
									wildCardPaths,
									".mjs",
									possibleExtensions,
								);
							}
						}
						const exportStatements = Array.from(
							jxpath(
								"/**/[type=/ExportAllDeclaration|ExportNamedDeclaration/]/source",
								astTree,
							),
						);
						try {
							for (const node of exportStatements) {
								if (node !== null && node !== undefined) {
									node.value = resolveToFullPath(
										fileName,
										node.value,
										baseUrl,
										paths,
										exactPaths,
										wildCardPaths,
										".mjs",
										possibleExtensions,
									);
								}
							}
						} catch (err) {
							console.log(err);
						}
						contentFromAst = generate(astTree);
						path =
							extname(path) === ""
								? `${path}.mjs`
								: `${path.slice(0, -extname(path).length)}.mjs`;
						break;
					}
					default:
						throw Error("Unhandled module type");
				}
			}

			try {
				writeFileSync(path, contentFromAst, "utf-8");
				// eslint-disable-next-line no-console
				console.log("Built", path);
			} catch (err) {
				onError?.(err.message);
				// eslint-disable-next-line no-console
				console.log("Fail", path);
			}
		}; // host.writeFile function definition end

		const program = ts.createProgram(files, compilerOptions, host);
		program.emit();
	};
}

function init(targetDir, roots) {
	removeSafeDir(targetDir);
	mkdirSync(targetDir, { recursive: true });
	// Read the TypeScript config file.
	const { config } = ts.readConfigFile("tsconfig.json", (fileName) =>
		readFileSync(fileName, "utf-8"),
	);
	const sourceDir = join("./src");
	const { baseUrl, paths } = config.compilerOptions;

	const compile = createCompiler(config, sourceDir);

	compile(
		roots,
		targetDir,
		{
			module: ts.ModuleKind.ES2020,
			moduleResolution: ts.ModuleResolutionKind.NodeJs,
			declaration: true,
			declarationDir: "./dist/types", // this becomes ./dist/types
			declarationMap: false,
			removeComments: true,
			sourceMap: false,
			importHelpers: false,
			outDir: undefined,
			target: ts.ModuleKind.ESNext,
		},
		[".ts"],
	);
}

init("./dist", ["./src/index.ts"]);
