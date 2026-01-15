import { reservedWords } from "../libs/words";

const prepareWords = (value: string): string => {
    value = value.replace(/([^\w\d]|[-/_])+/g, " ");

    for (const word of reservedWords) {
        value = value.replace(
            new RegExp(`\\b${word}\\b`, "i"),
            word.toLowerCase(),
        );
    }

    return value;
};

const normalizeWords = (value: string): string => {
    for (const word of reservedWords) {
        value = value.replace(new RegExp(`\\b${word}\\b`, "i"), word);
    }

    return value;
};

export const titleCase = (title?: string) => {
    if (title === "" || title === undefined) {
        return "";
    }

    const upper: string = title.toUpperCase();

    if (upper === title) {
        title = title.toLowerCase();
    }

    title = prepareWords(title)
        .replace(/([A-Z])/g, " $1")
        .toLowerCase()
        .replace(/(^|\s|-|_)\S/g, (match: string) => match.toUpperCase())
        .replace(/(\s|\u3164|\u1160)+/gu, " ")
        .trim();

    const normalized = normalizeWords(title);

    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
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
