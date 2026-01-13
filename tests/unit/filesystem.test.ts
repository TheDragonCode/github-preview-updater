import { rawTestConfig } from "../helpers/config";
import { type Config, defaultConfig } from "../../src/types/config";
import { CONFIG_PATH } from "../../src/utils/inputs";
import { readConfig } from "../../src/utils/config";

test("read config", () => {
    const data: Config = readConfig(rawTestConfig, CONFIG_PATH.defaultValue);

    expect(data.directory).toBe(process.cwd());

    expect(data.image.parameters.packageName).toBe(
        "TheDragonCode/preview-updater",
    );
    expect(data.image.parameters.title).toBe("Preview Updater");
    expect(data.image.parameters.description).toBe(
        "Lightweight preview update in your repository",
    );

    expect(data.path.readme).toBe(defaultConfig.path.readme);
    expect(data.image.url).toBe(defaultConfig.image.url);
    expect(data.image.parameters.pattern).toBe(
        defaultConfig.image.parameters.pattern,
    );

    expect(data.image.parameters.packageManager).toBe("none");
    expect(data.image.parameters.icon).toBe("photograph");
});

test("custom config", () => {
    const data: Config = readConfig(
        <Config>{
            directory: process.cwd(),
        },
        "tests/fixtures/configs/preview.yml",
    );

    expect(data.path.readme).toBe("README-foo.md");

    expect(data.image.url).toBe("https://example.com/image.png");
    expect(data.image.parameters.pattern).toBe("cage");
    expect(data.image.parameters.style).toBe("style_1");

    expect(data.image.parameters.fontSize).toBe("123px");
    expect(data.image.parameters.icon).toBe("cog");

    expect(data.image.parameters.packageManager).toBe("yarn");
    expect(data.image.parameters.packageGlobal).toBe(true);
    expect(data.image.parameters.packageName).toBe("foo/bar");

    expect(data.image.parameters.title).toBe("Foo Bar");
    expect(data.image.parameters.description).toBe(
        "Lorem ipsum dolor sit amet.",
    );

    expect(data.repository.commit.branch).toBe("qwerty");
    expect(data.repository.commit.title).toBe("Foo Bar Commit");
    expect(data.repository.commit.body).toBe(
        "Eu assum suscipit, vel veniam eu sadipscing kasd invidunt elit wisi.",
    );

    expect(data.repository.commit.author.name).toBe("some_username");
    expect(data.repository.commit.author.email).toBe(
        "some_username@example.com",
    );

    expect(data.repository.pullRequest.title).toBe("Foo Bar Baz Pull Request");
    expect(data.repository.pullRequest.body).toBe(
        "Eu assum suscipit, vel veniam eu sadipscing kasd invidunt elit wisi.",
    );

    expect(data.repository.pullRequest.assignees.length).toBe(2);
    expect(data.repository.pullRequest.assignees.join("-")).toBe("foo1-foo2");

    expect(data.repository.pullRequest.labels.length).toBe(2);
    expect(data.repository.pullRequest.labels.join("-")).toBe("foo3-foo4");
});
