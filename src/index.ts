const core = require('@actions/core')
const previewUpdater = require('./main')

import { run } from '@probot/adapter-github-actions'

run(previewUpdater).catch(error => {
    core.setFailed(`💥 Preview Updater failed with error: ${ error.message }`)
})
