import type { Config } from "../types/config";
import type { Image } from "../types/image";
import type { Package } from "../types/package";
import type { Author, Commit, PullRequest } from "../types/repository";

export const defaultPackage: Package = {
    manager: "auto",
    global: false,
    dev: false,
};

export const defaultImage: Image = {
    url: "https://banners.beyondco.de/{title}.png",

    parameters: {
        pattern: "topography",
        style: "style_2",
        fontSize: "100px",
        md: "1",
        showWatermark: "1",
    },
};

export const defaultAuthor: Author = {
    name: "github-actions",
    email: "github-actions@github.com",
};

export const defaultCommit: Commit = {
    branch: "preview/banner-{random}",
    title: "docs(preview): Update repository banner image",

    author: defaultAuthor,
};

export const defaultPullRequest: PullRequest = {
    title: "Update repository banner image",
    labels: ["preview"],
};

export const defaultConfig: Config = {
    readme: "README.md",

    repository: {
        commit: defaultCommit,
        pullRequest: defaultPullRequest,
    },

    package: defaultPackage,
    image: defaultImage,
};
