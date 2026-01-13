import { rawTestConfig } from "../helpers/config";
import { type Config, defaultConfig } from "../../src/types/config";
import { readConfig } from "../../src/utils/filesystem";
import { CONFIG_PATH } from "../../src/utils/inputs";

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
