import type { Config } from "../../src/types/config";
import { deepmerge } from "deepmerge-ts";
import { readConfig } from "../../src/utils/config";
import { defaultConfig } from "../../src/libs/defaults";

export const rawTestConfig: Config = <Config>{
    directory: process.cwd(),

    data: {
        title: "Some title",
        description: "Some description",
    },

    package: {
        name: "foo/bar-baz",
    },
};

export const testConfig: Config = <Config>(
    deepmerge(defaultConfig, rawTestConfig)
);

export const readTestConfig = async (filename: string): Promise<Config> =>
    await readConfig(<Config>{ directory: process.cwd() }, filename);
