import { hasComposer, hasNpm, hasYarn } from "../../src/utils/packageManagers";
import { testConfig } from "../helpers/config";

test("composer", () => {
    expect(hasComposer(testConfig)).toBe(false);
});

test("npm", () => {
    expect(hasNpm(testConfig)).toBe(true);
});

test("yarn", () => {
    expect(hasYarn(testConfig)).toBe(false);
});
