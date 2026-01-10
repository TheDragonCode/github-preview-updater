import { getInput } from '@actions/core'

const TOKEN = {
    name: 'token',
    env: 'INPUT_TOKEN'
}

const PATH = {
    name: 'path',
    env: 'INPUT_PATH',
    defaultValue: 'README.md'
}

const BRANCH_NAME = {
    name: 'branchName',
    env: 'INPUT_BRANCHNAME',
    defaultValue: 'preview/update-{timestamp}'
}

const COMMIT_TITLE = {
    name: 'commitTitle',
    env: 'INPUT_COMMITTITLE',
    defaultValue: 'docs(preview): Update preview'
}

const COMMIT_BODY = {
    name: 'commitBody',
    env: 'INPUT_COMMITBODY',
    defaultValue: ''
}

const COMMIT_AUTHOR_NAME = {
    name: 'commitAuthorName',
    env: 'INPUT_COMMITAUTHORNAME',
    defaultValue: 'github-actions'
}

const COMMIT_AUTHOR_EMAIL = {
    name: 'commitAuthorEmail',
    env: 'INPUT_COMMITAUTHOREMAIL',
    defaultValue: 'github-actions@github.com'
}

const PR_TITLE = {
    name: 'prTitle',
    env: 'INPUT_PRTITLE',
    defaultValue: 'Update preview'
}

const PR_BODY = {
    name: 'prBody',
    env: 'INPUT_PRBODY',
    defaultValue: ''
}

const ASSIGNEES = {
    name: 'assignees',
    env: 'INPUT_ASSIGNEES',
    defaultValue: ''
}

const LABELS = {
    name: 'labels',
    env: 'INPUT_LABELS',
    defaultValue: ''
}

const parse = () => {
    const token = getInput(TOKEN.name, { required: true })
    const path = getInput(PATH.name) || PATH.defaultValue
    const branchName = getInput(BRANCH_NAME.name) || BRANCH_NAME.defaultValue

    const commitTitle = getInput(COMMIT_TITLE.name) || COMMIT_TITLE.defaultValue
    const commitBody = getInput(COMMIT_BODY.name) || COMMIT_BODY.defaultValue

    const commitAuthorName = getInput(COMMIT_AUTHOR_NAME.name) || COMMIT_AUTHOR_NAME.defaultValue
    const commitAuthorEmail = getInput(COMMIT_AUTHOR_EMAIL.name) || COMMIT_AUTHOR_EMAIL.defaultValue

    const prTitle = getInput(PR_TITLE.name) || PR_TITLE.defaultValue
    const prBody = getInput(PR_BODY.name) || PR_BODY.defaultValue

    const assignees = splitCsv(getInput(ASSIGNEES.name) || ASSIGNEES.defaultValue)
    const labels = splitCsv(getInput(LABELS.name) || LABELS.defaultValue)
}

const splitCsv = (values: string) => {
    return values
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value !== '')
}

module.exports = {
    parse,
    TOKEN,
    PATH,
    BRANCH_NAME,
    COMMIT_TITLE,
    COMMIT_BODY,
    COMMIT_AUTHOR_NAME,
    COMMIT_AUTHOR_EMAIL,
    PR_TITLE,
    PR_BODY,
    ASSIGNEES,
    LABELS
}
