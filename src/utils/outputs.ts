import { setOutput } from "@actions/core";

export const setOutputs = (
    branchName: string,
    pullRequestNumber: number,
    pullRequestUrl: string,
): void => {
    setOutput("branchName", branchName);
    setOutput("pullRequestNumber", pullRequestNumber);
    setOutput("pullRequestUrl", pullRequestUrl);
};
