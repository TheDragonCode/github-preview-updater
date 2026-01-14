import type { Config, ImageParameters } from "../types/config";
import { hasComposer, hasNpm, hasYarn } from "./packageManagers";
import { encodeUri } from "./strings";
import type { Package } from "../types/package";
import { detectIcon } from "./icons";

const command = (manager: string, dev: boolean, global: boolean): string => {
    switch (manager) {
        case "composer":
            return `composer${global ? " global" : ""} require${dev ? " --dev" : ""}`;
        case "npm":
            return `npm install${global ? " -g" : ""}${dev ? " -D" : ""}`;
        case "yarn":
            return `yarn${global ? " global" : ""} add${dev ? " -D" : ""}`;
        default:
            return manager;
    }
};

const detectPackageManager = (config: Config): string => {
    if (hasComposer(config)) {
        return "composer";
    }

    if (hasNpm(config)) {
        return "npm";
    }

    if (hasYarn(config)) {
        return "yarn";
    }

    return "none";
};

const packageManager = (config: Config): string => {
    const global: boolean = config.image.parameters.packageGlobal;
    const dev: boolean = config.image.parameters.packageDev;
    let name: string = config.image.parameters.packageManager;

    if (name === "none") {
        return "";
    }

    if (name === "auto") {
        name = detectPackageManager(config);
    }

    if (["composer", "npm", "yarn"].includes(name)) {
        return command(name, dev, global);
    }

    return config.image.parameters.packageManager.trim();
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
        md: "1",
        showWatermark: "1",
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
