import { context } from '@actions/github'
import yaml from 'js-yaml'

import { readFile } from './utils/filesystem'
import { defaultImage, Image } from './types/image'
import { PreviewConfig } from './types/config'
import { Repository, RepositoryConfig } from './types/repository'

const normalizeImage = (configDefaults: Partial<Image> = {}, image: Partial<Image> = {}, name: string): Image => {
    const merged = { ...defaultImage, ...configDefaults, ...image }

    merged.title = image.title ?? configDefaults.title ?? name
    merged.description = image.description ?? configDefaults.description ?? merged.description
    merged.packageName = image.packageName ?? configDefaults.packageName ?? name

    return merged
}

export const loadConfig = (configPath: string): PreviewConfig => {
    const content = readFile(configPath)

    if (!content) {
        throw new Error(`Config file not found at ${ configPath }`)
    }

    const config = yaml.load(content) as PreviewConfig

    if (!config || !Array.isArray(config.repositories) || config.repositories.length === 0) {
        throw new Error('Config file must contain a non-empty "repositories" list')
    }

    return config
}

export const resolveRepository = (config: PreviewConfig, repository: RepositoryConfig): Repository => {
    const owner = repository.owner ?? config.owner ?? context.repo.owner
    const branch = repository.branch ?? config.branch
    const path = repository.path ?? config.path ?? 'README.md'
    const image = normalizeImage(config.defaults, repository.image, repository.name)

    if (!owner) {
        throw new Error(`Owner is not set for repository ${ repository.name }`)
    }

    return {
        owner,
        name: repository.name,
        branch,
        path,
        image
    }
}
