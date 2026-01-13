# Preview Updater

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://banners.beyondco.de/Preview%20Updater.png?theme=dark&pattern=topography&style=style_2&fontSize=100px&images=code&packageManager=npm+install&packageName=preview-updater&description=Lightweight+preview+update+in+your+repository">
    <img src="https://banners.beyondco.de/Preview%20Updater.png?theme=light&pattern=topography&style=style_2&fontSize=100px&images=code&packageManager=npm+install&packageName=preview-updater&description=Lightweight+preview+update+in+your+repository" alt="Preview Updater">
</picture>

Легко обновляйте превью своих репозиториев, сохраняя время и усилия на процесс разработки.

## Как это работает

- читает YAML-конфиг с параметрами баннера и списком репозиториев;
- получает `README` указанных репозиториев через GitHub API;
- вставляет (или обновляет) ссылки на превью-баннеры под заголовком, поддерживая светлую/тёмную темы;
- коммитит изменение в целевой ветке только при фактической разнице.

## Пример workflow

```yaml
name: Preview Updater

on:
    schedule:
        -   cron: 20 2 1 * *
    workflow_dispatch:

jobs:
    preview_updater:
        runs-on: ubuntu-latest
        permissions:
            contents: write
        steps:
            -   uses: actions/checkout@v4

            -   name: Update previews
                uses: TheDragonCode/preview-updater@v1
                with:
                    token: ${{ secrets.GITHUB_TOKEN }}
                    config-path: .github/preview.yml
                    commit-message: 'docs: refresh preview banners'
```

## Конфигурация `.github/preview.yml`

```yaml
owner: TheDragonCode               # организация/владелец по умолчанию
path: README.md                    # путь к файлу по умолчанию
branch: main                       # ветка по умолчанию

defaults:                          # дефолтные параметры баннера (переопределяются в repositories[].image)
    canDark: true
    host: https://banners.beyondco.de
    theme: light
    pattern: topography
    style: style_2
    fontSize: 100px
    icon: https://example.com/icon.svg
    packageManager: npm
    packageName: preview-updater
    packageGlobal: false
    title: Preview Updater
    description: Update preview banners automatically

repositories:
    -   name: preview-updater      # репозиторий в owner
        image:
            packageManager: npm
            packageName: preview-updater

    -   name: another-repo
        owner: AnotherOrg          # можно переопределить владельца
        path: docs/README.md       # и путь/ветку для конкретного репо
        branch: develop
        image:
            theme: dark
            canDark: false         # использовать только один баннер
            title: Another Repo
            description: Custom preview banner
```

### Поля конфига

- `owner`, `branch`, `path` — значения по умолчанию для всех репозиториев.
- `defaults` — общие параметры баннера (см. ниже); в `repositories[].image` можно переопределить любые из них.
- `repositories` — список целевых репозиториев с необязательными `owner`, `branch`, `path`, `image`.

### Параметры баннера

- `canDark` — генерировать второй баннер для тёмной темы.
- `host` — базовый URL генератора (по умолчанию https://banners.beyondco.de).
- `theme`, `pattern`, `style`, `fontSize`, `icon` — оформление баннера.
- `packageManager` (`composer` | `npm` | `yarn` | `pip` | `none`), `packageName`, `packageGlobal` — подсказки по установке.
- `title`, `description` — текст на баннере; при отсутствии `title` подставляется имя репозитория.

## Inputs

- `token` (обязательный) — токен с правами `contents: write` для целевых репозиториев.
- `config-path` — путь до файла конфигурации (по умолчанию `.github/preview.yml`).
- `commit-message` — сообщение коммита при обновлении (по умолчанию `docs: update preview banner`).

## Требуемые permissions

Экшену нужны права `contents: write` в репозиториях, где обновляется `README`.
