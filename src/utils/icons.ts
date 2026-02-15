import type { Icon } from "../types/icons";
import type { LockFile } from "../types/lockFile";
import type { Image } from "../types/image";

export const phpIcons: Icon[] = [
    { query: "laravel/", icon: "https://laravel.com/img/logomark.min.svg" },
    { query: "illuminate/", icon: "https://laravel.com/img/logomark.min.svg" },
    {
        query: "symfony/",
        icon: "https://symfony.com/logos/symfony_black_03.svg",
        exclude: ["polyfill", "var-dumper"]
    },
];

export const jsIcons: Icon[] = [];

export const defaultPhpIcon =
    "https://www.php.net/images/logos/new-php-logo.svg";
export const defaultJsIcon = "code";

const find = (
    dependencies: Record<string, string>[],
    icons: Icon[],
): string | undefined => {
    const names: string[] = Object.keys(dependencies);

    outer:
    for (const name of names) {
        for (const icon of icons) {
            if (! name.includes(icon.query)) {
                continue;
            }

            if (! icon.exclude) {
                return icon.icon;
            }

            for (const exclude of icon.exclude) {
                if (name.includes(exclude)) {
                    break outer;
                }
            }

            return icon.icon;
        }
    }

    return undefined;
};

export const detectIcon = (
    image: Image | undefined,
    packageData: LockFile,
): string => {
    if (image?.parameters?.icon) {
        return image.parameters.icon;
    }

    if (packageData?.require !== undefined) {
        const phpIcon: string | undefined = find(packageData.require, phpIcons);

        return phpIcon || defaultPhpIcon;
    }

    if (packageData?.dependencies !== undefined) {
        const jsIcon: string | undefined = find(
            packageData.dependencies,
            jsIcons,
        );

        return jsIcon || defaultJsIcon;
    }

    return "code";
};
