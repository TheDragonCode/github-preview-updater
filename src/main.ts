import { cwd, readFile, writeFile } from "./utils/filesystem";
import { context, getOctokit } from "@actions/github";
import { parse } from "./utils/inputs";
import { info } from "@actions/core";
import type { Config } from "./types/config";
import { Repository } from "./utils/repository";
import { setPreview } from "./utils/preview";
import { setOutputs } from "./utils/outputs";
import { getPackageManager } from "./utils/packageManagers";
import { titleCase } from "./utils/strings";
import { readConfig } from "./utils/config";
import type { LockFile } from "./types/lockFile";
import type { Data } from "./types/data";
import type { Repository as Credentials } from "./types/repository";
import { defaultPackage, defaultPullRequest } from "./libs/defaults";
import type { GitHub } from "@actions/github/lib/utils";

const previewUpdater = async () => {
    // Inputs
    const { token, configPath, readmePath } = parse();

    // Credentials
    const credentials: Credentials = {
        owner: context.repo.owner,
        repo: context.repo.repo,
    };

    // API
    const github: InstanceType<typeof GitHub> = getOctokit(token);

    // Load Config
    const _repo = new Repository(
        <Config>{
            repository: credentials,
        },
        github,
    );

    const config: Config = await readConfig(
        <Config>{
            directory: cwd(),

            repository: credentials,
        },
        configPath,
        _repo,
    );

    // Read names
    const packageLock: LockFile = getPackageManager(config);

    config.readme = readmePath;

    config.package ||= defaultPackage;
    config.data ||= <Data>{};

    config.package.name ||= packageLock.name;
    config.data.title ||= titleCase(config.repository?.repo);
    config.data.description ||=
        packageLock.description || config.repository?.owner;

    // Show working directory
    info(`Working directory: ${config.directory}`);

    // Authenticate
    const repo = new Repository(config, github);
    await repo.authenticate();

    // Read file
    const content: string = readFile(config, config.readme);
    const preview: string = setPreview(content, config, packageLock);

    if (content === preview) {
        info(`File "${config.readme}" is up to date`);

        return;
    }

    // Checkout branch
    const branchExists: boolean = await repo.branchExists();
    info(
        `Checkout ${branchExists ? "existing" : "new"} branch named "${repo.branchName()}"`,
    );
    await repo.checkoutBranch(!branchExists);

    // Write a file
    info(`Update readme in "${config.readme}" file`);
    writeFile(config, config.readme, preview);

    // Stage and commit changes
    await repo.stage();
    await repo.commit();
    await repo.push();

    // Create a Pull Request
    const pullRequest = await repo.createPullRequest();

    // Variables
    const pullRequestNumber: number = pullRequest.data.number;
    const pullRequestUrl: string = pullRequest.data.html_url;

    // Set labels and assignees
    await repo.assignee(
        pullRequestNumber,
        config.repository?.pullRequest?.assignees ||
            defaultPullRequest.assignees ||
            [],
    );
    await repo.addLabels(
        pullRequestNumber,
        config.repository?.pullRequest?.labels ||
            defaultPullRequest.labels ||
            [],
    );

    info(
        `Preview created in Pull Request #${pullRequestNumber}: ${pullRequestUrl}`,
    );

    setOutputs(repo.branchName(), pullRequestNumber, pullRequestUrl);
};

export default previewUpdater;
