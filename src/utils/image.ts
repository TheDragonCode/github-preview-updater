import type { Config } from "../types/config";
import { hasComposer, hasNpm, hasYarn } from "./packageManagers";
import type { LockFile } from "../types/lockFile";
import { detectIcon } from "./icons";
import type { Package } from "../types/package";
import { encodeUri } from "./strings";

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
    const global: boolean = config.package?.global || false;
    const dev: boolean = config.package?.dev || false;
    let name: string = config.package?.manager || "auto";

    if (name === "none") {
        return "";
    }

    if (name === "auto") {
        name = detectPackageManager(config);
    }

    if (["composer", "npm", "yarn"].includes(name)) {
        return command(name, dev, global);
    }

    return name.trim();
};

const packageName = (data?: Package): string => {
    if (data?.manager === "none") {
        return "";
    }

    return data?.name || "";
};

const render = (
    config: Config,
    packageData: LockFile,
    theme: "light" | "dark",
): string => {
    let url: string = config.image?.url || "";
    const parameters: Record<string, string> = config.image?.parameters || {};

    parameters.theme = theme;

    parameters.packageManager = packageManager(config);
    parameters.packageName = packageName(config.package);

    parameters.images = detectIcon(config.image, packageData);

    url = url
        .replace("{title}", encodeUri(config.data?.title || ""))
        .replace("{description}", encodeUri(config.data?.description || ""));

    for (const [key, value] of Object.entries(parameters)) {
        url = url.replace(`{${key}}`, encodeUri(value));
    }

    const query: string = new URLSearchParams(parameters).toString();

    return `${url}?${query}`;
};

export const getImages = (config: Config, packageData: LockFile): string => {
    const title: string | undefined = config.data?.title;

    const light: string = render(config, packageData, "light");
    const dark: string = render(config, packageData, "dark");

    return `<picture>
    <source media="(prefers-color-scheme: dark)" srcset="${dark}">
    <img src="${light}" alt="${title}">
</picture>`;
};
