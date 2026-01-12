import { Config, ImageParameters } from '../types/config'
import { hasComposer, hasNpm, hasYarn } from './packageManagers'

const encodeUri = (value: string): string => {
    if (value === '') {
        return ''
    }

    return encodeURIComponent(value)
}

const detectPackageManager = (config: Config, visibility: string): string => {
    if (hasComposer(config)) {
        return `composer${ visibility } require`
    }

    if (hasNpm(config)) {
        return `npm${ visibility } install`
    }

    if (hasYarn(config)) {
        return `yarn${ visibility } add`
    }

    return ''
}

const packageManager = (config: Config): string => {

    const visibility = config.image.parameters.packageGlobal ? ' global' : ''

    switch (config.image.parameters.packageManager) {
        case 'composer':
            return `composer${ visibility } require`
        case 'npm':
            return `npm${ visibility } install`
        case 'yarn':
            return `yarn${ visibility } add`
        case 'auto':
            return detectPackageManager(config, visibility)
        default:
            return ''
    }
}

const packageName = (image: ImageParameters): string => image.packageManager !== 'none' ? image.packageName : ''

const render = (config: Config, theme: 'light' | 'dark', suffix: string = ''): string => {
    const image = config.image.parameters

    const params = new URLSearchParams({
        theme: theme,
        pattern: image.pattern,
        style: image.style,
        fontSize: image.fontSize,
        images: image.icon,
        packageManager: packageManager(config),
        packageName: packageName(image),
        description: image.description
    })

    return config.image.url.replace('{title}', encodeUri(image.title)) + '?' + params.toString() + suffix
}

const format = (title: string, url: string): string => `![${ title }](${ url })`

export const getImages = (config: Config): string[] => {
    const light = format(config.image.parameters.title, render(config, 'light', '#gh-light-mode-only'))
    const dark = format(config.image.parameters.title, render(config, 'dark', '#gh-dark-mode-only'))

    return [light, dark]
}
