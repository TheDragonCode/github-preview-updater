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
