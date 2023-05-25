import { Compiler } from 'webpack';

interface Options {
    entry?: string;
    output?: string;
    ignorePath?: string;
    resolvers?: "element-ui";
    logLevel?: "error" | "wran" | "info" | "none";
    check?: boolean;
}

declare class AutoImportPlugin {
    #private;
    constructor(options?: Options);
    apply(compiler: Compiler): Promise<void>;
}

export { AutoImportPlugin as default };
