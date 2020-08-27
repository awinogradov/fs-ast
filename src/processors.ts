import fs from 'fs';
import { join } from 'path';

export type Processor = (path: string) => any;

export const readFile: Processor = (path) => fs.readFileSync(path, 'utf-8');

export const requireFile: Processor = (path) => require(join(process.cwd(), path));