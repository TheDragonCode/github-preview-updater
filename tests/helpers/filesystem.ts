import { readFile } from "../../src/utils/filesystem";
import { setPreview } from "../../src/utils/preview";
import { testConfig } from "./config";
import type { Package } from "../../src/types/package";
import { getNpm } from "../../src/utils/packageManagers";
import type { Config } from "../../src/types/config";
import { merge } from "../../src/utils/merge";

export const getReadme = (filename: string, config?: Config): string => {
    config ||= <Config>{};

    config = merge(testConfig, config);

    const content = readFile(config, `tests/fixtures/readme/${filename}`);

    return setPreview(content, config, getNpm(config));
};

export const getPackage = (filename: string): Package => {
    return <Package>JSON.parse(readFile(testConfig, filename));
};
