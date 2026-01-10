import { Image } from './image'
import { RepositoryConfig } from './repository'

export interface PreviewConfig
{
    owner?: string
    branch?: string
    path?: string
    defaults?: Partial<Image>
    repositories: RepositoryConfig[]
}
