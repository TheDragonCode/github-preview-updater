import type { Repository } from "./repository";
import type { Data } from "./data";
import type { Package } from "./package";
import type { Image } from "./image";

export interface Config {
    directory?: string;
    readme?: string;

    package?: Package;
    data?: Data;
    image?: Image;
    repository?: Repository;
}
