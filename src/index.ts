import core from '@actions/core'
import previewUpdater from './main'

previewUpdater().catch(error => {
    const message = error instanceof Error ? error.message : String(error)

    core.setFailed(`💥 Preview Updater failed with error: ${ message }`)
})
