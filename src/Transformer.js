import path from 'path';
import {Transformer} from '@parcel/plugin';
import {ParseConfigHost} from '@parcel/ts-utils/lib/ParseConfigHost';
import type {Asset, PluginOptions} from '@parcel/types';
import {PluginLogger} from '@parcel/logger';
import ts, {ScriptTarget} from 'typescript';

// noinspection JSUnusedGlobalSymbols
export default new Transformer({
    async loadConfig({config, options, logger: PluginLogger}) {
        const configResult = await config.getConfig(['tsconfig.json']);
        if (!configResult) {
            throw new Error('No typescript config has been found. Create "tsconfig.json" in project folder');
        }

        const configContent = {
            ...configResult.contents
        };


        let ts = await options.packageManager.require('typescript', config.searchPath);
        let host = new ParseConfigHost(options.inputFS, ts);
        const commandLine = ts.parseJsonConfigFileContent(configContent, host, path.dirname(configResult.filePath)); // Add all of the extended config files to be watched


        for (let file of host.filesRead) {
            config.addIncludedFile(path.resolve(file));
        }

        this.compilerOptions = commandLine.options;
        this.compilerHost = ts.createCompilerHost(this.compilerOptions);

        config.setResult(this.compilerOptions);
    },

    async parse({asset, config, logger, resolve, options}) {
        const sourceCode = await asset.getCode();
        return ts.createSourceFile(asset.filePath, sourceCode, this.compilerOptions.target || ScriptTarget.ES2015);
    },
    //
    // async transform({ asset, ast, config, logger, resolve, options }) {
    //     return [asset];
    // },
    //
    // async generate({ asset, ast, resolve, options }) {
    //     return { code, map };
    // },

    async transform({asset, config: {}, options: PluginOptions, logger: PluginLogger}) {
        // asset.type = 'js';

        const ast = await asset.getAST();
        if (!ast) {

        } else {
            const programOptions: ts.CreateProgramOptions = {
                host: this.compilerHost,
                options: this.config
            };

            const sourceCode = await asset.getCode();
            const sourceFile = ts.createSourceFile(asset.filePath, sourceCode, this.config.target);
        }

        // const program = ts.createProgram(programOptions);
        //
        // const preEmitDiagnostics = ts.getPreEmitDiagnostics(program);
        // const emitResult = program.emit();
        // const emitDiagnostics = emitResult.diagnostics;
        //
        //
        // opts.asset.

    }
})