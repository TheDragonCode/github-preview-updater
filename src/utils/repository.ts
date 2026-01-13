import type { Config } from "../types/config";
import { exec } from "./filesystem";
import { randomizer } from "./randomizer";

export class Repository {
    private _config: Config;
    private _currentBranch: string = "";
    private _newBranch: boolean = false;

    constructor(config: Config) {
        this._config = config;
    }

    async authenticate() {
        try {
            const author = this._config.repository.commit.author;

            await exec(`git config user.name "${author.name}"`);
            await exec(`git config user.email "${author.email}"`);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error authenticating user "${author.name}" with e-mail "${author.email}": ${error.message}`;

            throw error;
        }
    }

    async branchExists() {
        try {
            const hasLocalBranch = async () => {
                const result = await exec(
                    `git branch --list "${this.branchName()}"`,
                );

                return result.includes(this.branchName());
            };

            const hasRemoteBranch = async () => {
                const result = await exec(
                    `git ls-remote --heads origin "${this.branchName()}"`,
                );

                return result.includes(this.branchName());
            };

            return (await hasLocalBranch()) || (await hasRemoteBranch());
        } catch (error) {
            // @ts-expect-error
            error.message = `Error searching for branch "${this.branchName()}": ${error.message}`;

            throw error;
        }
    }

    async checkoutBranch(isNew: boolean) {
        try {
            this._newBranch = isNew;

            await exec(
                `git switch ${isNew ? "-c" : ""} "${this.branchName()}"`,
            );
        } catch (error) {
            // @ts-expect-error
            error.message = `Error checking out ${isNew ? "new" : "existing"} branch "${this.branchName()}": ${error.message}`;

            throw error;
        }
    }

    async stage() {
        try {
            await exec("git add " + this._config.path.readme);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error staging file "${this._config.path.readme}": ${error.message}`;

            throw error;
        }
    }

    async commit() {
        try {
            const message =
                this._config.repository.commit.title +
                "\n" +
                this._config.repository.commit.body;

            exec(`git commit -m "${message}"`);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error committing file "${this._config.path.readme}": ${error.message}`;

            throw error;
        }
    }

    async push() {
        try {
            let cmd = "git push";

            if (this._newBranch) {
                cmd += ` --set-upstream origin ${this.branchName()}`;
            }

            exec(cmd);

            this._newBranch = false;
        } catch (error) {
            // @ts-expect-error
            error.message = `Error pushing changes to "${this.branchName()} branch": ${error.message}`;

            throw error;
        }
    }

    async createPullRequest() {
        try {
            const defaultBranch = await exec(
                `git remote show origin | grep 'HEAD branch' | cut -d ' ' -f5`,
            );

            return this._config.repository.octokit.rest.pulls.create({
                owner: this._config.repository.owner,
                repo: this._config.repository.repo,
                title: this._config.repository.pullRequest.title,
                body: this._config.repository.pullRequest.body,
                head: this.branchName(),
                base: defaultBranch.trim(),
            });
        } catch (error) {
            // @ts-expect-error
            error.message = `Error when creating pull request from ${this.branchName()}: ${error.message}`;

            throw error;
        }
    }

    async assignee(issueNumber: number, assignees: string[]) {
        try {
            return this._config.repository.octokit.rest.issues.addAssignees({
                owner: this._config.repository.owner,
                repo: this._config.repository.repo,
                issue_number: issueNumber,
                assignees: assignees,
            });
        } catch (error) {
            // @ts-expect-error
            error.message = `Error when adding assignees to issue ${issueNumber}: ${error.message}`;

            throw error;
        }
    }

    async addLabels(issueNumber: number, labels: string[]) {
        try {
            return this._config.repository.octokit.rest.issues.addLabels({
                owner: this._config.repository.owner,
                repo: this._config.repository.repo,
                issue_number: issueNumber,
                labels,
            });
        } catch (error) {
            // @ts-expect-error
            error.message = `Error when adding labels to issue ${issueNumber}: ${error.message}`;

            throw error;
        }
    }

    branchName(): string {
        if (this._currentBranch === "") {
            this._currentBranch = this._config.repository.commit.branch.replace(
                "{random}",
                randomizer(),
            );
        }

        return this._currentBranch;
    }
}
