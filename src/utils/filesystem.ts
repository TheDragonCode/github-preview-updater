import * as fs from "node:fs";
import * as yaml from "js-yaml";
import { deepmerge } from "deepmerge-ts";
import { exec as nodeExec } from "node:child_process";
import { promisify } from "node:util";
import { type Config, defaultConfig } from "../types/config";

export const cwd = (): string => {
    const path = process.env.GITHUB_WORKSPACE;

    if (path === undefined) {
        throw new Error("GitHub Actions has not set the working directory");
    }

    return path;
};

const filePath = (config: Config, filename: string): string =>
    `${config.directory}/${filename}`;

export const fileExists = (config: Config, filename: string): boolean =>
    fs.existsSync(filePath(config, filename));

export const readFile = (config: Config, filename: string): string => {
    if (!fs.existsSync(filePath(config, filename))) {
        return "";
    }

    return fs.readFileSync(filePath(config, filename), "utf-8");
};

export const writeFile = (
    config: Config,
    filename: string,
    content: string,
): void => {
    fs.writeFileSync(filePath(config, filename), content);
};

export const exec = async (command: string): Promise<string> => {
    const execAsync = promisify(nodeExec);

    const { stdout } = await execAsync(command);

    return stdout.toString().trim();
};
