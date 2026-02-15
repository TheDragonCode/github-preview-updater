import { getPackage } from "../helpers/filesystem";
import {
    defaultJsIcon,
    defaultPhpIcon,
    detectIcon,
    phpIcons,
} from "../../src/utils/icons";

test("composer laravel", () => {
    const data = getPackage("tests/fixtures/packages/composer-laravel.json");

    expect(detectIcon(undefined, data)).toBe(phpIcons[0].icon);
});

test("composer illuminate", () => {
    const data = getPackage("tests/fixtures/packages/composer-illuminate.json");

    expect(detectIcon(undefined, data)).toBe(phpIcons[1].icon);
});

test("composer symfony framework", () => {
    const data = getPackage(
        "tests/fixtures/packages/composer-symfony-framework.json",
    );

    expect(detectIcon(undefined, data)).toBe(phpIcons[2].icon);
});

test("composer symfony polyfill", () => {
    const data = getPackage(
        "tests/fixtures/packages/composer-symfony-polyfill.json",
    );

    expect(detectIcon(undefined, data)).toBe(defaultPhpIcon);
});

test("composer default", () => {
    const data = getPackage("tests/fixtures/packages/composer-default.json");

    expect(detectIcon(undefined, data)).toBe(defaultPhpIcon);
});

test("npm default", () => {
    const data = getPackage("tests/fixtures/packages/npm-default.json");

    expect(detectIcon(undefined, data)).toBe(defaultJsIcon);
});
