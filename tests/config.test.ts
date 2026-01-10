import * as fs from 'node:fs'
import * as path from 'node:path'
import os from 'node:os'

import { loadConfig } from '../src/config'

describe('loadConfig', () => {
    let workspace: string

    beforeEach(() => {
        workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'preview-config-'))
        process.env.GITHUB_WORKSPACE = workspace
    })

    afterEach(() => {
        if (fs.existsSync(workspace)) {
            fs.rmSync(workspace, { recursive: true, force: true })
        }

        delete process.env.GITHUB_WORKSPACE
    })

    it('loads config from workspace when relative path is provided', () => {
        const configDir = path.join(workspace, '.github')
        const configPath = path.join(configDir, 'preview.yml')

        fs.mkdirSync(configDir, { recursive: true })
        fs.writeFileSync(configPath, 'repositories:\n  - name: demo')

        const config = loadConfig('.github/preview.yml')

        expect(config.repositories[0].name).toBe('demo')
    })

    it('throws when config file is missing', () => {
        expect(() => loadConfig('.github/missing.yml')).toThrow('Config file not found at .github/missing.yml')
    })
})
