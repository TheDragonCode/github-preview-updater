export interface ImageParameters
{
    pattern: string;
    style: string;
    fontSize: string;
    icon: string;

    packageManager: 'composer' | 'npm' | 'yarn' | 'auto' | 'none';
    packageName: string;
    packageGlobal: boolean;

    title: string;
    description: string;
}

export interface Image
{
    url: string;
    parameters: ImageParameters;
}

export interface Config
{
    image: Image;
}

export const defaultConfig: Config = {
    image: {
        url: 'https://banners.beyondco.de/{title}.png',

        parameters: {
            pattern: 'topography',
            style: 'style_2',
            fontSize: '100px',
            icon: 'https://laravel.com/img/logomark.min.svg',

            packageManager: 'auto',
            packageName: '',
            packageGlobal: false,

            title: '',
            description: ''
        }
    }
}
