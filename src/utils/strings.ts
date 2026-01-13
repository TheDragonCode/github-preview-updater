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
