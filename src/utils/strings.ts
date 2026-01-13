export const titleCase = (title: string | undefined) => {
    if (title === "" || title === undefined) {
        return "";
    }

    return title
        .replace(/([A-Z])/g, "$1")
        .toLowerCase()
        .replace(/(^|\s|-|_)\S/g, (match: string) => match.toUpperCase())
        .replace(/[-_]/g, " ");
};

export const removeImages = (content: string): string =>
    content
        .replace(/^(#\s+.+[\n\s]+)\s*<picture>[.\w\W]+<\/picture>[\n\s]*/, "$1")
        .replace(/^(#\s+.+[\n\s]+)(!\[.+]\(.*\)\n?){1,2}[\n\s]*/, "$1")
        .replace(/^(#\s+.+[\n\s]+)(<img\s.*\/>\n?){1,2}[\n\s]*/, "$1");

export const encodeUri = (value: string | undefined): string => {
    if (value === "" || value === undefined) {
        return "";
    }

    return encodeURIComponent(value);
};

export const randomString = (length: number = 8) => {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    let result: string = "";

    for (let i: number = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};
