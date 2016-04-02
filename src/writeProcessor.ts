import { SchemaId } from './schemaid';
import { TypeDefenition } from './typeDefenition';

export interface ReferenceResolver {
    (baseSchema: JsonSchema, refId: SchemaId): TypeDefenition;
}

export class WriteProcessor {

    public indentChar = ' ';
    public indentStep = 4;

    private indent = 0;
    private results = '';
    private alreadlyIndentThisLine = false;

    constructor(private refResolver: ReferenceResolver, private typePrefix: string = '') { }

    get referenceResolve(): ReferenceResolver {
        return this.refResolver;
    }

    output(str: string): WriteProcessor {
        this.doIndent();
        this.results += str;
        return this;
    }

    outputType(type: string, primitive: boolean = false): WriteProcessor {
        if (this.typePrefix && !primitive) {
            this.output(this.typePrefix);
        }
        type = type.replace(/[^0-9A-Za-z_$.]/g, '_');
        if (/^\d/.test(type)) {
          type = '$' + type;
        }
        this.output(type);
        return this;
    }

    outputKey(name: string, optional: boolean = false): WriteProcessor {
        if (/[^0-9A-Za-z_$]/.test(name) || /^\d/.test(name)) {
            this.output('\"').output(name).output('\"');
        } else {
            this.output(name);
        }
        if (optional) {
            this.output('?');
        }
        return this;
    }

    outputLine(str?: string): WriteProcessor {
        this.doIndent();
        if (str) {
            this.output(str);
        }
        this.output('\n');
        this.alreadlyIndentThisLine = false;
        return this;
    }

    outputJSDoc(description: string, parameters: { [name: string]: JsonSchema; } = {}): WriteProcessor {
        if (!description && Object.keys(parameters).length === 0) {
            return;
        }
        description = description || '';

        this.outputLine('/**');
        description.split('\n').forEach(line => {
            this.output(' * ').outputLine(line);
        });
        Object.keys(parameters).forEach(parameterKey => {
            const parameter = parameters[parameterKey];
            // TODO type doc
            this.output(' * @params {');
            switch (parameter.type) {
                case 'string':
                    this.output('string');
                    break;
                case 'integer':
                case 'number':
                    this.output('number');
                    break;
                case 'boolean':
                    this.output('boolean');
                    break;
                default:
                    console.error(parameter);
                    throw new Error('unknown type');
            }

            this.output('} ').output(parameterKey).output(' ').outputLine(parameter.description);
        });
        this.outputLine(' */');
        return this;
    }

    doIndent(): WriteProcessor {
        if (!this.alreadlyIndentThisLine) {
            const indent = this.getIndent();
            this.results += indent;
            this.alreadlyIndentThisLine = true;
        }
        return this;
    }

    get indentLevel(): number {
        return this.indent;
    }

    increaseIndent(): WriteProcessor {
        this.indent++;
        return this;
    }

    decreaseIndent(): WriteProcessor {
        this.indent--;
        return this;
    }

    getIndent(): string {
        return this.repeatString(this.indent * this.indentStep, this.indentChar);
    }

    repeatString(n: number, s: string): string {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += s;
        }
        return result;
    }

    toDefinition(): string {
        return this.results;
    }
}

