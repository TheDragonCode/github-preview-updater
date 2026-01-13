export interface ImageParameters {
    pattern: string;
    style: string;
    fontSize: string;
    icon: string;

    packageManager: "composer" | "npm" | "yarn" | "auto" | "none";
    packageName?: string;
    packageGlobal: boolean;

    title?: string;
    description?: string;
}

export interface Image {
    url: string;
    parameters: ImageParameters;
}

export interface Author {
    name: string;
    email: string;
}

export interface Commit {
    branch: string;
    title: string;
    body?: string;
    author: Author;
}

export interface PullRequest {
    title: string;
    body?: string;
    assignees: string[];
    labels: string[];
}

export interface Repository {
    owner?: string;
    repo?: string;

    commit: Commit;
    pullRequest: PullRequest;
}

export interface Path {
    readme: string;
}

export interface Config {
    directory?: string;
    path: Path;

    image: Image;
    repository: Repository;
}

export const defaultConfig: Config = {
    directory: undefined,
    path: {
        readme: "README.md",
    },

    image: {
        url: "https://banners.beyondco.de/{title}.png",

        parameters: {
            pattern: "topography",
            style: "style_2",
            fontSize: "100px",
            icon: "code",

            packageManager: "auto",
            packageGlobal: false,
            packageName: undefined,

            title: undefined,
            description: undefined,
        },
    },

    repository: {
        owner: undefined,
        repo: undefined,

        commit: {
            branch: "preview-{random}",
            title: "docs(preview): Update preview",
            body: undefined,

            author: {
                name: "github-actions",
                email: "github-actions@github.com",
            },
        },

        pullRequest: {
            title: "Update preview",
            body: undefined,
            assignees: [],
            labels: [],
        },
    },
};
