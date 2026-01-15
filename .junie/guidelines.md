## Triggers

### JSON schema

Aliases:
- `update schema`
- `upgrade schema`
- `schema`
- `json schema`

Ignore the following properties:

- `directory`
- `repository.owner`
- `repository.repo`

Steps:

1. Carefully study the `Config` interface in the `src/types/defaults.ts` file.
2. Study its dependencies.
3. Memorize the overall relationship scheme of these interfaces.
4. Update the JSON schema in the `resources/schema.json` file in accordance with the new requirements.
