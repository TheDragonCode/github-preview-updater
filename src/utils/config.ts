import type { Config } from "../types/config";
import * as yaml from "js-yaml";
import { readFile, readRemoteFile } from "./filesystem";
import { merge } from "./merge";
import { info } from "@actions/core";
import * as url from "node:url";
import { defaultConfig } from "../libs/defaults";

export const readConfig = async (
    config: Config,
    userConfigPath: string,
): Promise<Config> => {
    const content: string = readFile(config, userConfigPath);
    const remoteConfig: Config = await readRemoteConfig(
        config.repository?.owner,
        userConfigPath,
    );

    if (content === "") {
        return <Config>merge(defaultConfig, remoteConfig, config);
    }

    const userConfig = <Config>yaml.load(content);

    return <Config>merge(defaultConfig, remoteConfig, userConfig, config);
};

export const readRemoteConfig = async (
    owner: string | undefined,
    filename: string,
): Promise<Config> => {
    try {
        if (owner === undefined) {
            return <Config>{};
        }

        const data: string = await readRemoteFile(
            `https://raw.githubusercontent.com/${owner}/.github/refs/heads/main/${filename}`,
        );

        if (data === "") {
            return <Config>{};
        }

        return <Config>yaml.load(data);
    } catch (error) {
        // @ts-expect-error
        info(`Failed to fetch remote config from ${url}: ${error.message}`);

        return <Config>{};
    }
};
