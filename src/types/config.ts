export interface Config
{
    url: string;
    parameters: object;
}

export const defaultConfig: Config = {
    url: 'https://banners.beyondco.de/{title}.png',

    parameters: {
        theme: 'light',
        pattern: 'topography',
        style: 'style_2',
        fontSize: '100px',
        icon: 'https://laravel.com/img/logomark.min.svg',

        packageManager: 'none',
        packageName: '',
        packageGlobal: false,

        description: ''
    }
}
