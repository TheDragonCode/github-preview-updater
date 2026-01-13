import { Config, defaultConfig } from '../types/config'
import { deepmerge } from 'deepmerge-ts'
import * as yaml from 'js-yaml'
import { readFile } from './filesystem'

export const readConfig = (config: Config, userConfigPath: string): Config => {
    const content: string = readFile(config, userConfigPath);

    if (content === "") {
        return <Config>deepmerge(defaultConfig, config);
    }

    const userConfig = <Config>yaml.load(content);

    return <Config>deepmerge(defaultConfig, userConfig, config);
};
