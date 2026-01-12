import { fileExists } from './filesystem'

export const hasComposer = (directory: string = ''): boolean => fileExists(directory + '/composer.json')
export const hasNpm = (directory: string = ''): boolean => fileExists(directory + '/package.json')
export const hasYarn = (directory: string = ''): boolean => fileExists(directory + '/yarn.lock')
