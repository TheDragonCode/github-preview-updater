import { getImages } from './image'
import { Config } from '../types/config'

const hasHeader = (content: string) => content.match(/^#\s+/)

const cleanUp = (content: string): string => content
    .replace(/^(#\s+.+\n+)(!\[.+]\(.*\)\n?){1,2}\n?/, '$1\n')
    .replace(/^(#\s+.+\n+)(<img\s.*\/>\n?){1,2}\n?/, '$1\n')

const titleCase = (title: string) => title
    .replace(/([A-Z])/g, '$1')
    .toLowerCase()
    .replace(/(^|\s|-|_)\S/g, (match: string) => match.toUpperCase())
    .replace(/[-_]/g, ' ')

export const setPreview = (content: string, config: Config) => {
    if (! hasHeader(content)) {
        const title = titleCase(config.image.parameters.title)

        content = `# ${ title }\n\n${ content }`
    }

    const images = getImages(config).join('\n')

    return cleanUp(content).replace(/^(#\s+.+\n\n)/, '$1' + images + '\n\n')
}
