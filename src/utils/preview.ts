import { getImages } from "./image";
import type { Config } from "../types/config";
import { titleCase } from "./strings";

const hasHeader = (content: string) => content.match(/^#\s+/);

const cleanUp = (content: string): string =>
    content
        .replace(/^(#\s+.+[\n\s]+)\s*<picture>[.\w\W]+<\/picture>[\n\s]*/, "$1")
        .replace(/^(#\s+.+[\n\s]+)(!\[.+]\(.*\)\n?){1,2}[\n\s]*/, "$1")
        .replace(/^(#\s+.+[\n\s]+)(<img\s.*\/>\n?){1,2}[\n\s]*/, "$1");

export const setPreview = (content: string, config: Config) => {
    if (!hasHeader(content)) {
        const title = titleCase(config.image.parameters.title);

        content = `# ${title}\n\n${content}`;
    }

    const images: string = getImages(config);

    return cleanUp(content).replace(/^(#\s+.+[\n\s]+)/, "$1" + images + "\n\n");
};
