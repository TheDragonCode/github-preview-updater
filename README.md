# GitHub Preview Updater

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://banners.beyondco.de/GitHub%20Preview%20Updater.png?pattern=topography&style=style_2&fontSize=100px&md=1&showWatermark=1&icon=photograph&theme=dark&packageManager=uses%3A&packageName=TheDragonCode%2Fgithub-preview-updater%40v2&images=photograph">
    <img src="https://banners.beyondco.de/GitHub%20Preview%20Updater.png?pattern=topography&style=style_2&fontSize=100px&md=1&showWatermark=1&icon=photograph&theme=light&packageManager=uses%3A&packageName=TheDragonCode%2Fgithub-preview-updater%40v2&images=photograph" alt="GitHub Preview Updater">
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
                uses: TheDragonCode/github-preview-updater@v2
                with:
                    # Personal access token (PAT) used when interacting with Git and GitHub.
                    #
                    # We recommend using a service account with the least permissions necessary.
                    # Also, when generating a new PAT, select the least scopes necessary.
                    #
                    # [Learn more about creating and using encrypted secrets](https://help.github.com/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
                    #
                    # Required: true
                    token: ${{ secrets.GITHUB_TOKEN }}

                    # Path to the settings file 
                    #
                    # By default, .github/preview-updater.yml
                    #
                    # Required: false
                    config: ''
```

The action is setting the following outputs:

| Name                | Description                                                                           |
|---------------------|---------------------------------------------------------------------------------------|
| `branchName`        | The name of the git branch created for the purpose of updating the readme file.       |
| `pullRequestNumber` | The number of the GitHub pull request created for the purpose of updating the readme. |
| `pullRequestUrl`    | The URL of the GitHub pull request created for the purpose of updating the readme.    |

## Configuration

> [!TIP]
>
> Support for working with a global settings file at the organization level (the `.github` repository).
>
> For example,
>
> - template is `https://github.com/<repo>/.github/blob/main/<config>`.
> - result is `https://github.com/TheDragonCode/.github/blob/main/.github/preview-updater.yml`.

Create `.github/preview-updater.yml` (or provide your own path via `config`).
All fields are optional—omitted ones fall back to defaults.

```yaml
# $schema: https://raw.githubusercontent.com/TheDragonCode/github-preview-updater/refs/heads/main/resources/schema.json

path: README.md        # Target file to update

package:
    # Declares the use of the package manager.
    # It is a regular string that will be substituted into the URL address.
    #
    # Reserved words: composer | npm | yarn | auto | none
    #
    # Any package manager name can be specified.
    #
    # By default, auto
    manager: auto

    # Add a prefix for global installation (`composer global require`, `npm install -g`)
    # The parameter will be ignored when a non-standard package manager name is specified in
    # the `packageManager` parameter.
    global: false

    # Add a prefix for dev installation (`composer require --dev`, `npm install --save-dev`)
    # The parameter will be ignored when a non-standard package manager name is specified in
    # the `packageManager` parameter
    dev: false

    # By default, the package name is taken from the composer.json or package.json file.
    name: ''

data:
    # By default, the repository name will be used.
    # For example, for https://github.com/TheDragonCode/github-preview-updater, it will take `preview-updater`
    # and convert it to `Preview Updater`.
    title: ''          # Fallbacks to repo name (Title Case)

    # By default, the package description will be used (the ` description ` key in composer.json or package.json).
    description: ''    # Fallbacks to owner name or package description

image:
    url: https://banners.beyondco.de/{title}.png

    # May contain any keys and values
    parameters:
        pattern: topography
        style: style_2
        fontSize: 100px
        icon: code

repository:
    commit:
        branch: preview/banner-{random}
        title: "docs(preview): Update preview"
        body: ''
        author:
            name: github-actions
            email: github-actions@github.com

    pullRequest:
        title: Update preview
        body: ''
        assignees: [ ]
        labels: [ 'preview' ]
```

Currently, the project generates previews through [banners.beyondco.de](https://banners.beyondco.de) and the parameters
are specified for it.
But you can use any other service by replacing the URL.

### Information on how link formation works

An object is created, containing combined data from the [`data`](src/types/data.ts) and [
`image.parameters`](src/types/image.ts) objects.

A link is taken from the `image.url` parameter and using the `replace` method, everything is replaced in it according to
the `{key}` pattern, where `key` is the object key from the merged object.

For example, if the `image.url` parameter is `https://banners.beyondco.de/{title}/{foo}-{bar}.png`, and the `data`
object is `{ title: 'Qwe rty', foo: 'asd', bar: 'zxc' }`, then the resulting link will be
`https://banners.beyondco.de/Qwe%20rty/asd-zxc.png`.

After this, the original `image.parameters` object is taken and query parameters are formed from it.

For example, if the `image.parameters` object is `{ foo: 'asd', bar: 'zxc' }`, then the resulting query parameters
will be `?foo=asd&bar=zxc`.

Ultimately, the image link will look like this:
`https://banners.beyondco.de/Qwe%20rty/asd-zxc.png?foo=asd&bar=zxc`.

## License

This project is licensed under the [MIT License](LICENSE.md).
