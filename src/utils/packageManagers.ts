import { fileExists } from './filesystem'
import { Config } from '../types/config'

export const hasComposer = (config: Config): boolean => fileExists(config, 'composer.json')
export const hasNpm = (config: Config): boolean => fileExists(config, 'package.json')
export const hasYarn = (config: Config): boolean => fileExists(config, 'yarn.lock')
