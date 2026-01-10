import core from '@actions/core'
import github from '@actions/github'

import { resolveRepository, loadConfig } from './config'
import { PreviewConfig } from './types/config'
import { Repository } from './types/repository'
import { setPreview } from './utils/preview'

const DEFAULT_CONFIG_PATH = '.github/preview.yml'
const DEFAULT_COMMIT_MESSAGE = 'docs: update preview banner'

const resolveBranch = async (octokit: ReturnType<typeof github.getOctokit>, repo: Repository) => {
    if (repo.branch) {
        return repo.branch
    }

    const { data } = await octokit.rest.repos.get({
        owner: repo.owner,
        repo: repo.name
    })

    return data.default_branch
}

const loadReadme = async (octokit: ReturnType<typeof github.getOctokit>, repo: Repository, branch: string) => {
    const { data } = await octokit.rest.repos.getContent({
        owner: repo.owner,
        repo: repo.name,
        path: repo.path,
        ref: branch
    })

    if (Array.isArray(data) || data.type !== 'file') {
        throw new Error(`Path ${ repo.path } is not a file`)
    }

    return {
        sha: data.sha,
        content: Buffer.from(data.content, data.encoding as BufferEncoding).toString()
    }
}

const updatePreview = async (octokit: ReturnType<typeof github.getOctokit>, repo: Repository, commitMessage: string) => {
    const branch = await resolveBranch(octokit, repo)
    const { sha, content } = await loadReadme(octokit, repo, branch)

    const updatedContent = setPreview(content, repo, repo.image)

    if (updatedContent === content) {
        core.info(`No preview changes for ${ repo.owner }/${ repo.name }`)

        return
    }

    await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.owner,
        repo: repo.name,
        path: repo.path,
        message: commitMessage,
        content: Buffer.from(updatedContent).toString('base64'),
        sha,
        branch
    })

    core.info(`Preview updated for ${ repo.owner }/${ repo.name } (${ repo.path })`)
}

const ensureToken = () => {
    const token = core.getInput('token') || process.env.GITHUB_TOKEN

    if (!token) {
        throw new Error('GitHub token is required. Provide it via the "token" input or GITHUB_TOKEN env.')
    }

    return token
}

const loadConfiguration = (): PreviewConfig => {
    const configPath = core.getInput('config-path') || DEFAULT_CONFIG_PATH

    core.info(`Using config: ${ configPath }`)

    return loadConfig(configPath)
}

const previewUpdater = async () => {
    const commitMessage = core.getInput('commit-message') || DEFAULT_COMMIT_MESSAGE
    const token = ensureToken()
    const config = loadConfiguration()

    const octokit = github.getOctokit(token)

    const failures: string[] = []

    for (const repoConfig of config.repositories) {
        const repository = resolveRepository(config, repoConfig)

        try {
            await updatePreview(octokit, repository, commitMessage)
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error)

            failures.push(`${ repository.owner }/${ repository.name }: ${ message }`)

            core.warning(`Failed to update ${ repository.owner }/${ repository.name }: ${ message }`)
        }
    }

    if (failures.length > 0) {
        throw new Error(`Preview update finished with errors: ${ failures.join('; ') }`)
    }
}

export default previewUpdater
