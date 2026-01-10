import * as fs from 'node:fs'

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
