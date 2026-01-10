const hasHeader = (content: string) => content.match(/^#\s+/)

const removeOldPreview = (content: string) => content.replace(/^(#\s+.+\n\n)!\[.+\]\(.+\)/, '$1')

export const setPreview = (content: string) => {
    if (! hasHeader(content)) {
        content = `# Hello World!\n\n${ content }`
    }
}
