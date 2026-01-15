import type { Config } from "../types/config";
import * as yaml from "js-yaml";
import { readFile } from "./filesystem";
import { merge } from "./merge";
import { info } from "@actions/core";
import * as url from "node:url";
import { defaultConfig } from "../libs/defaults";
import type { Repository } from "./repository";

export const readConfig = async (
    config: Config,
    userConfigPath: string,
    repo?: Repository,
): Promise<Config> => {
    const content: string = readFile(config, userConfigPath);

    const remoteConfig: Config = await readRemoteConfig(
        config,
        repo,
        userConfigPath,
    );

    if (content === "") {
        return <Config>merge(defaultConfig, remoteConfig, config);
    }

    const userConfig = <Config>yaml.load(content);

    return <Config>merge(defaultConfig, remoteConfig, userConfig, config);
};

export const readRemoteConfig = async (
    config: Config,
    repo: Repository | undefined,
    filename: string,
): Promise<Config> => {
    try {
        if (repo === undefined) {
            return <Config>{};
        }

        const response1: string = await repo.getRawFile(".github", filename);

        if (response1 !== "") {
            return <Config>yaml.load(response1);
        }

        const response2: string = await repo.getRawFile(
            config.repository?.owner || ".github",
            filename,
        );

        if (response2 !== "") {
            return <Config>yaml.load(response2);
        }

        return <Config>{};
    } catch (error) {
        // @ts-expect-error
        info(`Failed to fetch remote config from ${url}: ${error.message}`);

        return <Config>{};
    }
};
