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

const render = (image: Image, theme: string = '', suffix: string = ''): string => {
    const params = new URLSearchParams({
        theme: theme || image.theme,
        pattern: image.pattern,
        style: image.style,
        fontSize: image.fontSize,
        images: image.icon,
        packageManager: encodeUri(packageManager(image)),
        packageName: encodeUri(image.packageName),
        description: encodeUri(image.description)
    })

    return image.host + '/' + encodeUri(image.title) + '.png?' + params.toString() + suffix
}

export const getImages = (image: Image): string => {
    if (! image.canDark) {
        return render(image, 'light')
    }

    const light = render(image, 'light', '#gh-light-mode-only')
    const dark = render(image, 'dark', '#gh-dark-mode-only')

    return light + '\n' + dark
}
