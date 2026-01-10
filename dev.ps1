$env:GITHUB_TOKEN = "dev";
$env:GITHUB_RUN_ID = 123
$env:GITHUB_EVENT_NAME = "push"
$env:GITHUB_EVENT_PATH = "TheDragonCode/preview-updater"

npm run dev
