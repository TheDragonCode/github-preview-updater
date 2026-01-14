$env:GITHUB_RUN_ID = 123
$env:GITHUB_EVENT_NAME = "push"
$env:GITHUB_EVENT_PATH = "TheDragonCode/github-preview-updater"

$envFile = ".env"

Get-Content $envFile |
        ForEach-Object {
            if ($_ -match '^(?<key>[^=]+)=(?<val>.*)$')
            {
                $key = $Matches['key'].Trim()
                $val = $Matches['val'].Trim()

                Set-Item -Path "Env:$key" -Value $val
            }
        }

npm run build

act push -W '.github/workflows/preview.yml'
