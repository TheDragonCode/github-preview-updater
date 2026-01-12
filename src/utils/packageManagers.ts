import { fileExists } from './filesystem'

export const hasComposer = (): boolean => fileExists('composer.json')
export const hasNpm = (): boolean => fileExists('package.json')
export const hasYarn = (): boolean => fileExists('yarn.lock')
