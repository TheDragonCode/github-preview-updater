import { Config, defaultConfig } from '../../src/types/config'
import { deepmerge } from 'deepmerge-ts'

export const testConfig: Config = <Config>deepmerge(defaultConfig, {
    directory: process.cwd()
})
