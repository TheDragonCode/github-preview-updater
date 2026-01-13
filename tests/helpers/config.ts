import { type Config, defaultConfig } from "../../src/types/config";
import { deepmerge } from "deepmerge-ts";

export const rawTestConfig: Config = <Config>{
    directory: process.cwd(),

    image: {
        parameters: {
            packageName: "TheDragonCode/preview-updater",
            title: "Preview Updater",
            description: "Lightweight preview update in your repository",
        },
    },
};

export const testConfig: Config = <Config>(
    deepmerge(defaultConfig, rawTestConfig)
);
