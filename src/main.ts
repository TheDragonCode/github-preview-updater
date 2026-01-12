import { cwd, readConfig, readFile, writeFile } from './utils/filesystem'
import { context, getOctokit } from '@actions/github'
import { parse } from './utils/inputs'
import { info } from '@actions/core'
import { Config } from './types/config'
import { Repository } from './utils/repository'
import { setPreview } from './utils/preview'
import { setOutputs } from './utils/outputs'

const previewUpdater = async () => {
    // Welcome
    info(`Working directory: ${ cwd }`)

    // Inputs
    const {
        token,
        configPath
    } = parse()

    // Load Config
    const config: Config = readConfig(<Config>{
        repository: {
            owner: context.repo.owner,
            repo: context.repo.repo,
            octokit: getOctokit(token)
        }
    }, configPath)

    // Authenticate
    const repo = new Repository(config)
    await repo.authenticate()

    // Checkout branch
    const branchExists = await repo.branchExists()
    info(`Checkout ${ branchExists ? 'existing' : 'new' } branch named "${ repo.branchName() }"`)
    await repo.checkoutBranch(! branchExists)

    console.log('aaaa', branchExists)

    // Read file
    const content = readFile(config, config.path.readme)
    const preview = setPreview(content, config)

    if (content !== preview) {
        info(`Update readme in "${ config.path.readme }" file`)
        writeFile(config, config.path.readme, preview)
    } else {
        info(`File "${ config.path.readme }" is up to date`)
    }

    // Stage and commit changes
    await repo.stage()
    await repo.commit()
    await repo.push()

    // Create a Pull Request
    const pullRequest = await repo.createPullRequest()

    // Variables
    const pullRequestNumber: number = pullRequest.data.number
    const pullRequestUrl: string = pullRequest.data.html_url

    if (config.repository.pullRequest.assignees.length > 0) {
        await repo.assignee(pullRequestNumber, config.repository.pullRequest.assignees)
    }

    if (config.repository.pullRequest.labels.length > 0) {
        await repo.addLabels(pullRequestNumber, config.repository.pullRequest.labels)
    }

    info(`Preview created in pull request #${ pullRequestNumber }: ${ pullRequestUrl }`)

    setOutputs(repo.branchName(), pullRequestNumber, pullRequestUrl)
}

export default previewUpdater
