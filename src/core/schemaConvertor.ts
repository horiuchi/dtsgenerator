import { NormalizedSchema, Schema } from './jsonSchema';
import SchemaId from './schemaId';
import WriteProcessor from './writeProcessor';

export default class SchemaConvertor {
    constructor(private processor: WriteProcessor, private header?: string) {}

    public start(): void {
        if (this.header) {
            this.processor.outputLine(this.header);
        }
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

    public startInterfaceNest(name: string): void {
        this.processor.output('export interface ').outputType(name);
        this.startTypeNest();
    }
    public endInterfaceNest(): void {
        this.endTypeNest(false);
        this.processor.outputLine();
    }

    public outputExportType(name: string): void {
        this.processor.output('export type ').outputType(name).output(' = ');
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

    public outputPropertyName(schema: NormalizedSchema, propertyName: string): void {
        const content = schema.content;
        const optionalProperty = content.required == null || content.required.indexOf(propertyName) < 0;
        this.processor.outputKey(propertyName, optionalProperty).output(': ');
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

    public outputTypeIdName(schema: NormalizedSchema, baseSchema: Schema, terminate = true, outputOptional = true): void {
        const typeName = this.getTypename(schema.id, baseSchema);
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
        const result = id.getTypeNames();
        const baseId = baseSchema && baseSchema.id;
        if (baseId) {
            const baseTypes = baseId.getTypeNames().slice(0, -1);
            for (const type of baseTypes) {
                if (result[0] === type) {
                    result.shift();
                } else {
                    break;
                }
            }
            if (result.length === 0) {
                return [id.getInterfaceName()];
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
