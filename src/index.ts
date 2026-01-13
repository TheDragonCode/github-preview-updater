import * as core from "@actions/core";
import previewUpdater from "./main";

previewUpdater().catch((error: Error) => {
    core.setFailed(`💥 Preview Updater failed with error: ${error.message}`);
});
