import * as JsonPointer from '../jsonPointer';
import { NormalizedSchema, Schema } from './jsonSchema';
import SchemaId from './schemaId';
import { DefaultTypeNameConvertor, TypeNameConvertor } from './typeNameConvertor';
import WriteProcessor from './writeProcessor';

export default class SchemaConvertor {
    private ns: string[] | undefined;
    private replaceLevel = 0;

    constructor(private processor: WriteProcessor, private convertor: TypeNameConvertor = DefaultTypeNameConvertor, namespaceName?: string) {
        this.ns = namespaceName == null ? undefined : namespaceName.split('/').filter((s) => s.length > 0);
    }

    public getLastTypeName(id: SchemaId): string {
        const names = this.convertor(id);
        if (names.length > 0) {
            return names[names.length - 1];
        } else {
            return '';
        }
    }

    public buildSchemaMergedMap(schemas: IterableIterator<Schema>, typeMarker: symbol): any {
        const map: any = {};
        const paths: Array<{ path: string[]; type: Schema; }> = [];
        let minLevel = Number.MAX_SAFE_INTEGER;
        for (const type of schemas) {
            const path = this.convertor(type.id);
            minLevel = Math.min(minLevel, path.length);
            paths.push({ path, type });
        }
        this.replaceLevel = minLevel;

        for (const item of paths) {
            const path = item.path;
            this.replaceNamespace(path);
            const parent = JsonPointer.get(map, path, true);
            if (parent == null) {
                JsonPointer.set(map, path, { [typeMarker]: item.type });
            } else {
                parent[typeMarker] = item.type;
            }
        }
        if (Object.keys(map).length === 0) {
            throw new Error('There is no schema in the input contents.');
        }
        return map;
    }

    private replaceNamespace(paths: string[]): void {
        if (this.ns == null) {
            return;
        }
        paths.splice(0, this.replaceLevel - 1);
        if (this.ns.length > 0) {
            paths.unshift(...this.ns);
        }
    }

    public start(): void {
        this.processor.clear();
    }
    public end(): string {
        return this.processor.toDefinition();
    }

    public startNest(name: string): void {
        const processor = this.processor;
        if (processor.indentLevel === 0) {
            processor.output('declare ');
        }
        processor.output('namespace ').outputType(name, true).outputLine(' {');
        processor.increaseIndent();
    }

    public endNest(): void {
        const processor = this.processor;
        processor.decreaseIndent();
        processor.outputLine('}');
    }

    /// acutal type convert methods

    public startInterfaceNest(id: SchemaId): void {
        const processor = this.processor;
        if (processor.indentLevel === 0) {
            processor.output('declare ');
        } else {
            processor.output('export ');
        }
        const name = this.getLastTypeName(id);
        processor.output('interface ').outputType(name).output(' ');
        this.startTypeNest();
    }
    public endInterfaceNest(): void {
        this.endTypeNest(false);
        this.processor.outputLine();
    }

    public outputExportType(id: SchemaId): void {
        const processor = this.processor;
        if (processor.indentLevel === 0) {
            processor.output('declare ');
        } else {
            processor.output('export ');
        }
        const name = this.getLastTypeName(id);
        processor.output('type ').outputType(name).output(' = ');
    }

    public startTypeNest(): void {
        this.processor.outputLine('{');
        this.processor.increaseIndent();
    }
    public endTypeNest(terminate: boolean): void {
        this.processor.decreaseIndent();
        this.processor.output('}');
        if (terminate) {
            this.processor.outputLine(';');
        }
    }

    public outputRawValue(value: string, isEndOfLine = false): void {
        this.processor.output(value);
        if (isEndOfLine) {
            this.processor.outputLine();
        }
    }

    public outputComments(schema: NormalizedSchema): void {
        const content = schema.content;
        const comments = [];
        if ('$comment' in content) {
            comments.push(content.$comment);
        }
        comments.push(content.title);
        comments.push(content.description);
        if ('example' in content || 'examples' in content) {
            comments.push('example:');
            if ('example' in content) {
                comments.push(content.example);
            }
            if ('examples' in content) {
                comments.push(...content.examples);
            }
        }
        this.processor.outputJSDoc(...comments);
    }

    public outputPropertyName(_schema: NormalizedSchema, propertyName: string, required: string[] | undefined): void {
        const optionalProperty = required == null || required.indexOf(propertyName) < 0;
        this.processor.outputKey(propertyName, optionalProperty).output(': ');
    }

    public outputPropertyAttribute(schema: NormalizedSchema): void {
        const content = schema.content;
        if ('readOnly' in content && content.readOnly) {
            this.processor.output('readonly ');
        }
    }

    public outputArrayedType<T>(schema: NormalizedSchema, types: T[], output: (t: T, index: number) => void, terminate: boolean, outputOptional = true): void {
        if (!terminate) {
            this.processor.output('(');
        }
        types.forEach((t, index) => {
            output(t, index);
            if (index < types.length - 1) {
                this.processor.output(' | ');
            }
        });
        if (!terminate) {
            this.processor.output(')');
        }
        this.outputTypeNameTrailer(schema, terminate, outputOptional);
    }

    public outputTypeIdName(schema: NormalizedSchema, currentSchema: Schema, terminate = true, outputOptional = true): void {
        const typeName = this.getTypename(schema.id, currentSchema);
        typeName.forEach((type, index) => {
            const isLast = index === typeName.length - 1;
            this.processor.outputType(type, isLast ? false : true);
            if (!isLast) {
                this.processor.output('.');
            }
        });
        this.outputTypeNameTrailer(schema, terminate, outputOptional);
    }
    private getTypename(id: SchemaId, baseSchema: Schema): string[] {
        const result = this.convertor(id);
        this.replaceNamespace(result);
        const baseId = baseSchema.id;
        if (baseId) {
            const baseTypes = this.convertor(baseId).slice(0, -1);
            for (const type of baseTypes) {
                if (result[0] === type) {
                    result.shift();
                } else {
                    break;
                }
            }
            if (result.length === 0) {
                return [this.getLastTypeName(id)];
            }
        }
        return result;
    }
    public outputPrimitiveTypeName(schema: NormalizedSchema, typeName: string, terminate = true, outputOptional = true): void {
        this.processor.outputType(typeName, true);
        this.outputTypeNameTrailer(schema, terminate, outputOptional);
    }
    public outputStringTypeName(schema: NormalizedSchema, typeName: string, terminate: boolean, outputOptional = true): void {
        if (typeName) {
            this.processor.output(typeName);
        }
        this.outputTypeNameTrailer(schema, terminate, outputOptional);
    }
    private outputTypeNameTrailer(schema: NormalizedSchema, terminate: boolean, outputOptional: boolean): void {
        if (terminate) {
            this.processor.output(';');
        }
        if (outputOptional) {
            this.outputOptionalInformation(schema, terminate);
        }
        if (terminate) {
            this.processor.outputLine();
        }
    }
    private outputOptionalInformation(schema: NormalizedSchema, terminate: boolean): void {
        const format = schema.content.format;
        const pattern = schema.content.pattern;
        if (!format && !pattern) {
            return;
        }
        if (terminate) {
            this.processor.output(' //');
        } else {
            this.processor.output(' /*');
        }
        if (format) {
            this.processor.output(' ').output(format);
        }
        if (pattern) {
            this.processor.output(' ').output(pattern);
        }
        if (!terminate) {
            this.processor.output(' */ ');
        }
    }
}
