import { info } from '@actions/core'
import { context } from '@actions/github'
import { parse } from './utils/inputs'

module.exports = (): void => {
    const cwd = process.cwd()

    if (cwd === undefined) {
        throw new Error('GitHub Actions has not set the working directory')
    }

    info(`Working directory: ${ cwd }`)

    // Inputs
    const { owner, repo: RepoName } = context.repo

    const {
        token,
        commitTitle,
        commitBody,
        commitAuthorName,
        commitAuthorEmail,
        prTitle,
        prBody,
        assignees,
        labels
    } = parse()
}
