import { cwd, readConfig, readFile, writeFile } from "./utils/filesystem";
import { context, getOctokit } from "@actions/github";
import { parse } from "./utils/inputs";
import { info } from "@actions/core";
import type { Config } from "./types/config";
import { Repository } from "./utils/repository";
import { setPreview } from "./utils/preview";
import { setOutputs } from "./utils/outputs";
import { getPackageManager } from "./utils/packageManagers";
import { titleCase } from "./utils/strings";

const previewUpdater = async () => {
    // Inputs
    const { token, configPath } = parse();

    // Load Config
    const config: Config = readConfig(
        <Config>{
            directory: cwd(),

            repository: {
                owner: context.repo.owner,
                repo: context.repo.repo,
            },
        },
        configPath,
    );

    // Read names
    const packageManager = getPackageManager(config);

    config.image.parameters.packageName = packageManager.name;
    config.image.parameters.title = titleCase(config.repository.repo);
    config.image.parameters.description =
        packageManager.description || config.repository.owner;

    // Show working directory
    info(`Working directory: ${config.directory}`);

    // Authenticate
    const repo = new Repository(config, getOctokit(token));
    await repo.authenticate();

    // Read file
    const content = readFile(config, config.path.readme);
    const preview = setPreview(content, config);

    if (content === preview) {
        info(`File "${config.path.readme}" is up to date`);

        return;
    }

    // Checkout branch
    const branchExists = await repo.branchExists();
    info(
        `Checkout ${branchExists ? "existing" : "new"} branch named "${repo.branchName()}"`,
    );
    await repo.checkoutBranch(!branchExists);

    // Write a file
    info(`Update readme in "${config.path.readme}" file`);
    writeFile(config, config.path.readme, preview);

    // Stage and commit changes
    await repo.stage();
    await repo.commit();
    await repo.push();

    // Create a Pull Request
    const pullRequest = await repo.createPullRequest();

    // Variables
    const pullRequestNumber: number = pullRequest.data.number;
    const pullRequestUrl: string = pullRequest.data.html_url;

    if (config.repository.pullRequest.assignees.length > 0) {
        await repo.assignee(
            pullRequestNumber,
            config.repository.pullRequest.assignees,
        );
    }

    if (config.repository.pullRequest.labels.length > 0) {
        await repo.addLabels(
            pullRequestNumber,
            config.repository.pullRequest.labels,
        );
    }

    info(
        `Preview created in Pull Request #${pullRequestNumber}: ${pullRequestUrl}`,
    );

    setOutputs(repo.branchName(), pullRequestNumber, pullRequestUrl);
};

export default previewUpdater;
