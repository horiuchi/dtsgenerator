import * as ts from 'typescript';
import { DefaultTypeNameConvertor, TypeNameConvertor } from './typeNameConvertor';

export interface Config {
    outputAST: boolean;
    target: ts.ScriptTarget;
    typeNameConvertor: TypeNameConvertor;
}

const defaultConfig: Config = {
    outputAST: false,
    target: ts.ScriptTarget.Latest,
    typeNameConvertor: DefaultTypeNameConvertor,
};

const config: Config = defaultConfig;
export default config;
