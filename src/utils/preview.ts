import { Image } from '../types/image'
import { Repository } from '../types/repository'
import { getImages } from './image'

const hasHeader = (content: string) => content.match(/^#\s+/)

const cleanUp = (content: string) => content
    .replace(/^(#\s+.+\n+)(!\[.+]\(.*\)\n?){1,2}\n?/, '$1\n')
    .replace(/^(#\s+.+\n+)(<img\s.*\/>\n?){1,2}\n?/, '$1\n')

const titleCase = (title: string) => title
    .replace(/[A-Z]/g, ' $1')
    .toLowerCase()
    .replace(/(^|\s|-|_)\S/g, (match: string) => match.toUpperCase())
    .replace(/[-_]/g, ' ')

export const setPreview = (content: string, repo: Repository, image: Image) => {
    if (! hasHeader(content)) {
        const title = titleCase(repo.name)

        content = `# ${ title }\n\n${ content }`
    }

    const images = getImages(image).join('\n')

    return cleanUp(content).replace(/^(#\s+.+\n\n)/, `$1${ images }\n\n`)
}
