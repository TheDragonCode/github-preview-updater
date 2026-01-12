import * as fs from 'node:fs'
import { Config, defaultConfig } from '../types/config'
import * as yaml from 'js-yaml'

export const readFile = (path: string): string => {
    if (! fs.existsSync(path)) {
        return ''
    }

    return fs.readFileSync(path, 'utf-8')
}

export const writeFile = (path: string, content: string): void => {
    fs.writeFileSync(path, content)
}

export const cwd = (): string => {
    const path = process.env.GITHUB_WORKSPACE

    if (path === undefined) {
        throw new Error('GitHub Actions has not set the working directory')
    }

    return path
}

export const readConfig = (path: string = ''): Config => {
    const content = readFile(path || '.github/preview-updater.yml')

    if (content === '') {
        return defaultConfig
    }

    return <Config>yaml.load(content)
}
