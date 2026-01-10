import { resolveRepository } from '../src/config'
import { defaultImage, Image } from '../src/types/image'
import { PreviewConfig } from '../src/types/config'
import { Repository } from '../src/types/repository'
import { getImages } from '../src/utils/image'
import { setPreview } from '../src/utils/preview'

const baseImage: Image = {
    ...defaultImage,
    title: 'Preview Updater',
    description: 'Preview Updater for repositories',
    packageManager: 'npm',
    packageName: 'preview-updater',
    packageGlobal: false,
    icon: 'https://example.com/icon.svg'
}

const repository: Repository = {
    name: 'preview-updater',
    owner: 'TheDragonCode',
    branch: 'main',
    path: 'README.md',
    image: baseImage
}

describe('setPreview', () => {
    it('inserts header and preview when missing', () => {
        const content = 'Project description'

        const updated = setPreview(content, repository, baseImage)

        expect(updated.startsWith('# Preview Updater')).toBe(true)
        expect((updated.match(/!\[Preview Updater banner]/g) ?? []).length).toBe(2)
        expect(updated).toContain('theme=light')
        expect(updated).toContain('theme=dark')
    })

    it('replaces existing preview block', () => {
        const content = '# Preview Updater\n![Old preview](old-light.png)\n![Old preview](old-dark.png)\n\nMore text'

        const updated = setPreview(content, repository, { ...baseImage, canDark: false, theme: 'dark' })
        const matches = updated.match(/!\[Preview Updater banner]/g) ?? []

        expect(matches.length).toBe(1)
        expect(updated).not.toContain('old-light.png')
        expect(updated).toContain('theme=dark')
        expect(updated).not.toContain('theme=light')
    })
})

describe('getImages', () => {
    it('builds banner urls with package info', () => {
        const preview = getImages({ ...baseImage, packageManager: 'npm', packageName: 'preview-updater', packageGlobal: true })

        expect(preview).toHaveLength(2)
        expect(preview[0]).toContain('packageManager=npm%2520global%2520install')
        expect(preview[0]).toContain('packageName=preview-updater')
        expect(preview[0]).toContain('#gh-light-mode-only')
        expect(preview[1]).toContain('#gh-dark-mode-only')
    })
})

describe('resolveRepository', () => {
    it('fills defaults from config', () => {
        const config: PreviewConfig = {
            owner: 'dragon',
            defaults: {
                description: 'Default description',
                packageManager: 'composer'
            },
            repositories: [{ name: 'awesome-package' }]
        }

        const repo = resolveRepository(config, config.repositories[0])

        expect(repo.owner).toBe('dragon')
        expect(repo.path).toBe('README.md')
        expect(repo.image.title).toBe('awesome-package')
        expect(repo.image.packageName).toBe('awesome-package')
        expect(repo.image.description).toBe('Default description')
        expect(repo.image.packageManager).toBe('composer')
    })
})
