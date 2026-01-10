import { Image } from './image'

export interface RepositoryConfig
{
    name: string
    owner?: string
    branch?: string
    path?: string
    image?: Partial<Image>
}

export interface Repository
{
    name: string
    owner: string
    branch?: string
    path: string
    image: Image
}
