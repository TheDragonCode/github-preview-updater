# GitHub Preview Updater

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://banners.beyondco.de/GitHub%20Preview%20Updater.png?pattern=topography&style=style_2&fontSize=100px&md=1&showWatermark=1&icon=photograph&theme=dark&packageManager=uses%3A&packageName=TheDragonCode%2Fgithub-preview-updater%40v2&description=Lightweight+preview+update+in+your+repository&images=photograph">
    <img src="https://banners.beyondco.de/GitHub%20Preview%20Updater.png?pattern=topography&style=style_2&fontSize=100px&md=1&showWatermark=1&icon=photograph&theme=light&packageManager=uses%3A&packageName=TheDragonCode%2Fgithub-preview-updater%40v2&description=Lightweight+preview+update+in+your+repository&images=photograph" alt="GitHub Preview Updater">
</picture>

Both light and dark banner variants are generated automatically.

## How it works

1. The action reads `composer.json` / `package.json` to detect the package manager, package name, and description.
2. It builds the banner URL for [banners.beyondco.de](https://banners.beyondco.de) from the collected data.
3. It replaces the `<picture>` block in `README.md` with refreshed URLs.
4. If the file changed, it commits the update to a new branch and opens a pull request.

## Quick start (reusable workflow)

Create `.github/workflows/preview.yml`:

```yaml
name: Preview Updater

on:
    schedule:
        -   cron: '20 2 * * *'
    workflow_dispatch:

permissions:
    contents: write
    pull-requests: write

jobs:
    preview:
        uses: TheDragonCode/.github/.github/workflows/preview.yml@main
```

Example reusable workflow: https://github.com/TheDragonCode/.github/blob/main/.github/workflows/preview.yml

## Standalone usage (direct action call)

If you prefer not to use the reusable workflow, create `.github/workflows/preview.yml` like this:

```yaml
name: Preview Updater

on:
    schedule:
        -   cron: '20 2 * * *' # 02:20 AM every day
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
                id: preview
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

                    # Specifies the path to the README file.
                    #
                    # By default, README.md
                    #
                    # Required: false
                    readme: ''

            -   name: Merge PR
                if: steps.preview.outputs.pullRequestNumber != ''
                env:
                    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                run: gh pr merge --merge --delete-branch ${{ steps.preview.outputs.pullRequestNumber }}
```

The action exposes these outputs:

| Name                | Description                                          |
|---------------------|------------------------------------------------------|
| `branchName`        | Name of the branch created for README update.        |
| `pullRequestNumber` | Number of the created pull request.                  |
| `pullRequestUrl`    | URL of the created pull request.                     |

## Configuration

> [!TIP]
>
> You can keep a shared config in the organization-level `.github` repository.
>
> Example:
>
> - Template: `https://github.com/<repo>/.github/blob/main/<config>`
> - Result: `https://github.com/TheDragonCode/.github/blob/main/.github/preview-updater.yml`

Create `.github/preview-updater.yml` (or set your own path via `config`).
All fields are optional; omitted values fallback to defaults.

```yaml
# $schema: https://raw.githubusercontent.com/TheDragonCode/github-preview-updater/refs/heads/main/resources/schema.json

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

By default, previews are generated with [banners.beyondco.de](https://banners.beyondco.de).
You can use any service by replacing `image.url`.

### How URL generation works

A merged object is built from [`data`](src/types/data.ts) and [`image.parameters`](src/types/image.ts).

Then values are substituted into `image.url` by `{key}` placeholders.

For example, if `image.url` is `https://banners.beyondco.de/{title}/{foo}-{bar}.png`, and `data` is
`{ title: 'Qwe rty', foo: 'asd', bar: 'zxc' }`, the resulting link is:
`https://banners.beyondco.de/Qwe%20rty/asd-zxc.png`.

After that, query params are built from `image.parameters`.

For example, for `{ foo: 'asd', bar: 'zxc' }`, the query string is:
`?foo=asd&bar=zxc`.

Final image URL example:
`https://banners.beyondco.de/Qwe%20rty/asd-zxc.png?foo=asd&bar=zxc`.

## Recipes

### Update many files

```yaml
# .github/workflows/preview.yml
name: Preview Updater

on:
    workflow_dispatch:

permissions:
    contents: write
    pull-requests: write

jobs:
    main:
        uses: TheDragonCode/.github/.github/workflows/preview.yml@main

    foo:
        runs-on: ubuntu-latest

        steps:
            -   uses: actions/checkout@v6
                with:
                    fetch-depth: 0

            -   name: Update banner
                uses: TheDragonCode/github-preview-updater@v2
                id: preview1
                with:
                    token: ${{ secrets.GITHUB_TOKEN }}
                    readme: 'README_foo.md'

            -   name: Merge PR
                if: steps.preview1.outputs.pullRequestNumber != ''
                env:
                    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                run: gh pr merge --merge --delete-branch ${{ steps.preview1.outputs.pullRequestNumber }}

    bar:
        runs-on: ubuntu-latest

        steps:
            -   uses: actions/checkout@v6
                with:
                    fetch-depth: 0

            -   name: Update banner
                uses: TheDragonCode/github-preview-updater@v2
                id: preview2
                with:
                    token: ${{ secrets.GITHUB_TOKEN }}
                    readme: 'README.bar.md'
                    config: '.github/preview-updater-bar.yml'

            -   name: Merge PR
                if: steps.preview2.outputs.pullRequestNumber != ''
                env:
                    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
                run: gh pr merge --merge --delete-branch ${{ steps.preview2.outputs.pullRequestNumber }}
```

## FAQ

> 💥 Preview Updater failed with error: Error when creating a pull request from preview/banner-***: GitHub Actions is not
> permitted to create or approve pull requests

Enable the "Allow GitHub Actions to create and approve pull requests" option in project settings.

<img width="814" height="403" alt="Image" src="https://github.com/user-attachments/assets/3687000d-68ee-4574-b601-dc2a64ac4d90" />

## License

This project is licensed under the [MIT License](LICENSE.md).
