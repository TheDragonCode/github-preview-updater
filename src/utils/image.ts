import type { Config, ImageParameters } from "../types/config";
import { hasComposer, hasNpm, hasYarn } from "./packageManagers";
import { encodeUri } from "./strings";
import type { Package } from "../types/package";
import { detectIcon } from "./icons";

const detectPackageManager = (config: Config, visibility: string): string => {
    if (hasComposer(config)) {
        return `composer${visibility} require`;
    }

    if (hasNpm(config)) {
        return `npm${visibility} install`;
    }

    if (hasYarn(config)) {
        return `yarn${visibility} add`;
    }

    return "";
};

const packageManager = (config: Config): string => {
    const visibility = config.image.parameters.packageGlobal ? " global" : "";

    switch (config.image.parameters.packageManager) {
        case "composer":
            return `composer${visibility} require`;
        case "npm":
            return `npm${visibility} install`;
        case "yarn":
            return `yarn${visibility} add`;
        case "auto":
            return detectPackageManager(config, visibility);
        case "none":
            return "";
        default:
            return config.image.parameters.packageManager;
    }
};

const packageName = (image: ImageParameters): string => {
    if (image.packageManager === "none") {
        return "";
    }

    return image?.packageName || "";
};

const render = (
    config: Config,
    packageData: Package,
    theme: "light" | "dark",
): string => {
    const image = config.image.parameters;

    const params = new URLSearchParams({
        theme: theme,
        pattern: image.pattern,
        style: image.style,
        fontSize: image.fontSize,
        images: image.icon || detectIcon(packageData),
        packageManager: packageManager(config),
        packageName: packageName(image),
        description: image.description || "",
        md: '1',
        showWatermark: '1'
    });

    return (
        config.image.url.replace("{title}", encodeUri(image.title)) +
        "?" +
        params.toString()
    );
};

export const getImages = (config: Config, packageData: Package): string => {
    const title = config.image.parameters.title;

    const light = render(config, packageData, "light");
    const dark = render(config, packageData, "dark");

    return `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${dark}">
    <img src="${light}" alt="${title}">
</picture>`;
};
