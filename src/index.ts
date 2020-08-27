import fs, { Stats } from 'fs';
import { join, basename } from 'path';

import { readFile } from './processors';

export interface NodeMeta<C = unknown> {
    stats: Stats;
    name: string;
    relativePath: string;
    absolutePath: string;
    children?: NodeMeta[] | C;
}


interface WalkOptions {
    process?: (path: string) => unknown;
    onNode?: (meta: NodeMeta) => NodeMeta;
}

const defaultWalkOptions: Required<WalkOptions> = {
    process: readFile,
    onNode: (meta) => meta,
};

export function ast(cwd: string, userOptions: WalkOptions = {}) {
    const root: NodeMeta[] = [];
    const options = {
        ...defaultWalkOptions,
        ...userOptions,
    };

    fs.readdirSync(cwd).forEach(f => {
        const relativePath = join(cwd, f);
        const stats = fs.statSync(relativePath);
        let result: NodeMeta = {
            stats,
            name: basename(relativePath),
            relativePath,
            absolutePath: join(process.cwd(), relativePath)
        };

        if (stats.isDirectory()) {
            result.children = ast(relativePath, options);
        } else {
            result = options.onNode({
                ...result,
                children: options.process(relativePath),
            });
        }

        root.push(result);
    });

    return root;
};

export * from './processors';

