# Preview Updater

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://banners.beyondco.de/Preview%20Updater.png?theme=dark&pattern=topography&style=style_2&fontSize=100px&images=photograph&packageManager=&packageName=&description=Lightweight+preview+update+in+your+repository">
    <img src="https://banners.beyondco.de/Preview%20Updater.png?theme=light&pattern=topography&style=style_2&fontSize=100px&images=photograph&packageManager=&packageName=&description=Lightweight+preview+update+in+your+repository" alt="Preview Updater">
</picture>

## Overview

GitHub Action that generates an always-fresh preview banner for your project and keeps it at the top of your
`README.md`. The action detects your package manager, builds a light/dark banner, replaces any previous preview block,
commits the change in a dedicated branch, and opens a pull request with optional assignees and labels.

## Usage

Create the file `.github/workflows/preview.yml` with the following content:

```yaml
name: Preview Updater

on:
    schedule:
        -   cron: '20 2 * * *' # 02:20 AM on everyday
    workflow_dispatch:

permissions:
    contents: write
    pull-requests: write

jobs:
    preview:
        runs-on: ubuntu-latest

        steps:
            -   uses: actions/checkout@v6
                with:
                    fetch-depth: 0

            -   name: Update banner
                uses: TheDragonCode/preview-updater@v1
                with:
                    # Personal access token (PAT) used when interacting with Git and GitHub.
                    #
                    # We recommend using a service account with the least permissions necessary. Also
                    # when generating a new PAT, select the least scopes necessary.
                    #
                    # [Learn more about creating and using encrypted secrets](https://help.github.com/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
                    #
                    # Required: true
                    token: ${{ secrets.GITHUB_TOKEN }}

                    # Path to settings file
                    #
                    # By default, .github/preview-updater.yml
                    #
                    # Required: false
                    configPath: ''
```

The action is setting the following outputs:

| Name                | Description                                                                           |
|---------------------|---------------------------------------------------------------------------------------|
| `branchName`        | The name of the git branch created for the purpose of updating the readme file.       |
| `pullRequestNumber` | The number of the GitHub pull request created for the purpose of updating the readme. |
| `pullRequestUrl`    | The URL of the GitHub pull request created for the purpose of updating the readme.    |

## Configuration

Create `.github/preview-updater.yml` (or provide your own path via `configPath`).
All fields are optional—omitted ones fall back to defaults.

```yaml
path:
    readme: README.md        # Target file to update

image:
    url: https://banners.beyondco.de/{title}.png
    parameters:
        pattern: topography
        style: style_2
        fontSize: 100px
        icon: code

        # Declares the use of the package manager.
        # It is a regular string that will be substituted into the URL address.
        #
        # Reserved words: composer | npm | yarn | auto | none
        #
        # Any package manager name can be specified.
        #
        # By default, auto
        packageManager: auto

        # By default, the package name is taken from the composer.json or package.json file.
        packageName: ''

        # Add a prefix for global installation (`composer global require`, `npm install -g`)
        # The parameter will be ignored when a non-standard package manager name is specified in
        # the `packageManager` parameter.
        packageGlobal: false

        # By default, the repository name will be used.
        # For example, for https://github.com/TheDragonCode/preview-updater, it will take `preview-updater`
        # and convert it to `Preview Updater`.
        title: ''          # Fallbacks to repo name (Title Case)

        # By default, the package description will be used (the ` description ` key in composer.json or package.json).
        description: ''    # Fallbacks to owner name or package description

repository:
    commit:
        branch: preview-{random}
        title: "docs(preview): Update preview"
        body: ''
        author:
            name: github-actions
            email: github-actions@github.com

    pullRequest:
        title: Update preview
        body: ''
        assignees: [ ]
        labels: [ ]
```

Currently, the project generates previews through [banners.beyondco.de](https://banners.beyondco.de) and the parameters
are specified for it.
But you can use any other service by replacing the URL.

## License

This project is licensed under the [MIT License](LICENSE.md).
