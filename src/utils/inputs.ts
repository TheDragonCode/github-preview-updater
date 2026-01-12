import { getInput } from '@actions/core'

export const TOKEN = {
    name: 'token',
    env: 'INPUT_TOKEN'
}

export const PATH = {
    name: 'path',
    env: 'INPUT_PATH',
    defaultValue: 'README.md'
}

export const BRANCH_NAME = {
    name: 'branchName',
    env: 'INPUT_BRANCHNAME',
    defaultValue: 'preview/update-{timestamp}'
}

export const COMMIT_TITLE = {
    name: 'commitTitle',
    env: 'INPUT_COMMITTITLE',
    defaultValue: 'docs(preview): Update preview'
}

export const COMMIT_BODY = {
    name: 'commitBody',
    env: 'INPUT_COMMITBODY',
    defaultValue: ''
}

export const COMMIT_AUTHOR_NAME = {
    name: 'commitAuthorName',
    env: 'INPUT_COMMITAUTHORNAME',
    defaultValue: 'github-actions'
}

export const COMMIT_AUTHOR_EMAIL = {
    name: 'commitAuthorEmail',
    env: 'INPUT_COMMITAUTHOREMAIL',
    defaultValue: 'github-actions@github.com'
}

export const PR_TITLE = {
    name: 'prTitle',
    env: 'INPUT_PRTITLE',
    defaultValue: 'Update preview'
}

export const PR_BODY = {
    name: 'prBody',
    env: 'INPUT_PRBODY',
    defaultValue: ''
}

export const ASSIGNEES = {
    name: 'assignees',
    env: 'INPUT_ASSIGNEES',
    defaultValue: ''
}

export const LABELS = {
    name: 'labels',
    env: 'INPUT_LABELS',
    defaultValue: ''
}

export const parse = () => {
    const token = getInput(TOKEN.name, { required: true })
    const path = getInput(PATH.name) || PATH.defaultValue
    const branchName = (getInput(BRANCH_NAME.name) || BRANCH_NAME.defaultValue).replace('{timestamp}', Date.now().toString())

    const commitTitle = getInput(COMMIT_TITLE.name) || COMMIT_TITLE.defaultValue
    const commitBody = getInput(COMMIT_BODY.name) || COMMIT_BODY.defaultValue

    const commitAuthorName = getInput(COMMIT_AUTHOR_NAME.name) || COMMIT_AUTHOR_NAME.defaultValue
    const commitAuthorEmail = getInput(COMMIT_AUTHOR_EMAIL.name) || COMMIT_AUTHOR_EMAIL.defaultValue

    const pullRequestTitle = getInput(PR_TITLE.name) || PR_TITLE.defaultValue
    const pullRequestBody = getInput(PR_BODY.name) || PR_BODY.defaultValue

    const assignees = splitCsv(getInput(ASSIGNEES.name) || ASSIGNEES.defaultValue)
    const labels = splitCsv(getInput(LABELS.name) || LABELS.defaultValue)

    return {
        token,
        path,
        branchName,
        commitTitle,
        commitBody,
        commitAuthorName,
        commitAuthorEmail,
        pullRequestTitle,
        pullRequestBody,
        assignees,
        labels
    }
}

const splitCsv = (values: string) => {
    return values
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value !== '')
}
