/// <reference types="node" />
import { Readable, ReadableOptions } from "stream";
export declare class MultiStream extends Readable {
    _object: any;
    constructor(object: any, options?: ReadableOptions);
    _read: () => void;
}
