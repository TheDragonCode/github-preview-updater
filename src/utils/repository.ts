import type { Config } from "../types/config";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods/dist-types/generated/parameters-and-response-types";
import { exec } from "./processes";
import { randomString } from "./strings";
import {
    defaultAuthor,
    defaultCommit,
    defaultPullRequest,
} from "../libs/defaults";
import { info } from "@actions/core";

export class Repository {
    private _config: Config;
    private _currentBranch: string = "";
    private _newBranch: boolean = false;
    private _octokit: InstanceType<typeof GitHub>;

    constructor(config: Config, octokit: InstanceType<typeof GitHub>) {
        this._config = config;
        this._octokit = octokit;
    }

    async authenticate() {
        const authorName =
            this._config.repository?.commit?.author?.name || defaultAuthor.name;
        const authorEmail =
            this._config.repository?.commit?.author?.email ||
            defaultAuthor.email;

        try {
            await exec(`git config user.name "${authorName}"`);
            await exec(`git config user.email "${authorEmail}"`);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error authenticating user "${authorName}" with e-mail "${authorEmail}": ${error.message}`;

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
            await exec(`git add ${this._config.readme}`);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error staging file "${this._config.readme}": ${error.message}`;

            throw error;
        }
    }

    async commit() {
        try {
            let message =
                this._config.repository?.commit?.title || defaultCommit.title;
            const body =
                this._config.repository?.commit?.body ||
                defaultCommit.body ||
                "";

            if (body !== "") {
                message += `\n${body}`;
            }

            await exec(`git commit -m "${message}"`);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error committing file "${this._config.readme}": ${error.message}`;

            throw error;
        }
    }

    async push() {
        try {
            let cmd = "git push";

            if (this._newBranch) {
                cmd += ` --set-upstream origin ${this.branchName()}`;
            }

            await exec(cmd);
        } catch (error) {
            // @ts-expect-error
            error.message = `Error pushing changes to "${this.branchName()} branch": ${error.message}`;

            throw error;
        }
    }

    async createPullRequest() {
        try {
            const defaultBranch: string = await this.defaultBranchName();

            return await this._octokit.rest.pulls.create(<
                RestEndpointMethodTypes["pulls"]["create"]["parameters"]
            >{
                owner: this._config.repository?.owner,
                repo: this._config.repository?.repo,
                title:
                    this._config.repository?.pullRequest?.title ||
                    defaultPullRequest.title,
                body:
                    this._config.repository?.pullRequest?.body ||
                    defaultPullRequest.body ||
                    "",
                head: this.branchName(),
                base: defaultBranch,
            });
        } catch (error) {
            // @ts-expect-error
            error.message = `Error when creating a pull request from ${this.branchName()}: ${error.message}`;

            throw error;
        }
    }

    async assignee(issueNumber: number, assignees: string[]) {
        try {
            if (assignees.length === 0) {
                return;
            }

            return await this._octokit.rest.issues.addAssignees(<
                RestEndpointMethodTypes["issues"]["addAssignees"]["parameters"]
            >{
                owner: this._config.repository?.owner,
                repo: this._config.repository?.repo,
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
            if (labels.length === 0) {
                return;
            }

            return await this._octokit.rest.issues.addLabels(<
                RestEndpointMethodTypes["issues"]["addLabels"]["parameters"]
            >{
                owner: this._config.repository?.owner,
                repo: this._config.repository?.repo,
                issue_number: issueNumber,
                labels,
            });
        } catch (error) {
            // @ts-expect-error
            error.message = `Error when adding labels to issue ${issueNumber}: ${error.message}`;

            throw error;
        }
    }

    async getRawFile(filename: string): Promise<string> {
        try {
            const response = await this._octokit.rest.repos.getContent(<
                RestEndpointMethodTypes["repos"]["getContent"]["parameters"]
            >{
                owner: this._config.repository?.owner,
                repo: ".github",
                path: filename,
                headers: {
                    Accept: "application/vnd.github.v3.raw",
                },
            });

            if (response.status !== 200) {
                return "";
            }

            // @ts-expect-error
            return response.data;
        } catch (error) {
            // @ts-expect-error
            info(error.message);

            return "";
        }
    }

    branchName(): string {
        if (this._currentBranch === "") {
            const branch: string =
                this._config.repository?.commit?.branch ||
                defaultCommit.branch ||
                "preview/{random}";

            this._currentBranch = branch.replace("{random}", randomString());
        }

        return this._currentBranch;
    }

    async defaultBranchName(): Promise<string> {
        return await exec(
            `git remote show origin | grep 'HEAD branch' | cut -d ' ' -f5`,
        );
    }
}
