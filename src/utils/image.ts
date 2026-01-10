import { Image } from '../types/image'

const encodeUri = (value: string) => encodeURIComponent(value)

const packageManager = (image: Image): string => {
    const visibility = image.packageGlobal ? ' global' : ''

    switch (image.packageManager) {
        case 'composer':
            return `composer${ visibility } require`
        case 'npm':
            return `npm${ visibility } install`
        case 'yarn':
            return `yarn${ visibility } add`
        case 'pip':
            return `pip${ visibility } install`
        default:
            return ''
    }
}

const packageName = (image: Image) => image.packageManager !== 'none' ? image.packageName : ''

const render = (image: Image, theme: string = '', suffix: string = ''): string => {
    const params = new URLSearchParams({
        theme: theme || image.theme,
        pattern: image.pattern,
        style: image.style,
        fontSize: image.fontSize,
        images: image.icon,
        packageManager: encodeUri(packageManager(image)),
        packageName: encodeUri(packageName(image)),
        description: encodeUri(image.description)
    })

    return image.host + '/' + encodeUri(image.title) + '.png?' + params.toString() + suffix
}

const format = (title: string, url: string) => `![${ title }](${ url })`

export const getImages = (image: Image): string[] => {
    const title = `${ image.title } banner`

    const light = format(title, render(image, 'light', '#gh-light-mode-only'))
    const dark = format(title, render(image, 'dark', '#gh-dark-mode-only'))

    return [light, dark]
}
