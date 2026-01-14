import { getReadme } from "../helpers/filesystem";
import type { Config } from "../../src/types/config";
import { readConfig } from "../../src/utils/config";

test("empty", () => expect(getReadme("empty.md")).toMatchSnapshot());

test("just-text", () => expect(getReadme("just-text.md")).toMatchSnapshot());

test("with-one-image", () =>
    expect(getReadme("with-one-image.md")).toMatchSnapshot());

test("with-one-image-without-header", () =>
    expect(getReadme("with-one-image-without-header.md")).toMatchSnapshot());

test("with-two-images", () =>
    expect(getReadme("with-two-images.md")).toMatchSnapshot());

test("with-two-images-without-header", () =>
    expect(getReadme("with-two-images-without-header.md")).toMatchSnapshot());

test("without-all", () =>
    expect(getReadme("without-all.md")).toMatchSnapshot());

test("without-images", () =>
    expect(getReadme("without-images.md")).toMatchSnapshot());

test("html-tag", () => expect(getReadme("html-tag.md")).toMatchSnapshot());

test("composer dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/composer-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("composer global dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/composer-global-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("npm dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/npm-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("npm global dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/npm-global-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("yarn dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/yarn-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("yarn global dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/yarn-global-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("custom dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/custom-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});

test("custom global dev", async () => {
    const config: Config = await readConfig(
        <Config>{ directory: process.cwd() },
        "tests/fixtures/configs/custom-global-dev.yml",
    );

    expect(getReadme("just-text.md", config)).toMatchSnapshot();
});
