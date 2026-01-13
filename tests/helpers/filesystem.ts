import { readFile } from "../../src/utils/filesystem";
import { setPreview } from "../../src/utils/preview";
import { testConfig } from "./config";

export const getReadme = (filename: string): string => {
    const content = readFile(testConfig, "tests/fixtures/readme/" + filename);

    return setPreview(content, testConfig);
};
