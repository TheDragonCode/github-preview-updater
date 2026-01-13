import { getImages } from "./image";
import type { Config } from "../types/config";
import { removeImages, titleCase } from "./strings";

const hasHeader = (content: string) => content.match(/^#\s+/);

export const setPreview = (content: string, config: Config) => {
    if (!hasHeader(content)) {
        const title = titleCase(config.image.parameters.title);

        content = `# ${title}\n\n${content}`;
    }

    const images: string = getImages(config);

    const replace = "$1";

    return removeImages(content).replace(
        /^(#\s+.+[\n\s]+)/,
        `${replace}${images}\n\n`,
    );
};
