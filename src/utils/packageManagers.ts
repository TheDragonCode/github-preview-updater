import { fileExists, readFile } from "./filesystem";
import type { Config } from "../types/config";
import type { Package } from "../types/package";

export const hasComposer = (config: Config): boolean =>
    fileExists(config, "composer.json");

export const hasNpm = (config: Config): boolean =>
    fileExists(config, "package.json");

export const hasYarn = (config: Config): boolean =>
    fileExists(config, "yarn.lock");

export const getComposer = (config: Config): Package =>
    <Package>JSON.parse(readFile(config, "composer.json"));

export const getNpm = (config: Config): Package =>
    <Package>JSON.parse(readFile(config, "package.json"));

export const getPackageManager = (config: Config): Package => {
    if (hasComposer(config)) {
        return getComposer(config);
    }

    return getNpm(config);
};
