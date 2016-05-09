import { TypeDefinition } from './typeDefinition';
import { toTSType } from './utils';

export interface ReferenceResolver {
    (baseSchema: Schema, ref: string): TypeDefinition;
}

export class WriteProcessor {

    public indentChar = ' ';
    public indentStep = 4;

    private indent = 0;
    private results = '';
    private alreadlyIndentThisLine = false;
    private referenceStack: string[] = [];

    constructor(private refResolver: ReferenceResolver, private typePrefix: string = '') {}

    get referenceResolve(): ReferenceResolver {
        return this.refResolver;
    }

    pushReference(referenceName: string): number {
        return this.referenceStack.push(referenceName);
    }
    popReference(): string {
        return this.referenceStack.pop();
    }
    checkCircularReference(referenceName: string): boolean {
        return this.referenceStack.indexOf(referenceName) < 0;
    }


    output(str: string): this {
        this.doIndent();
        this.results += str;
        return this;
    }

    outputType(type: string, primitive: boolean = false): this {
        if (type === 'this') {
            this.output(type);
            return this;
        }
        if (this.typePrefix && !primitive) {
            this.output(this.typePrefix);
        }
        type = type.replace(/[^0-9A-Za-z_$]/g, '_');
        if (/^\d/.test(type)) {
          type = '$' + type;
        }
        this.output(type);
        return this;
    }

    outputKey(name: string, optional: boolean = false): this {
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

    outputLine(str?: string): this {
        this.doIndent();
        if (str) {
            this.output(str);
        }
        this.output('\n');
        this.alreadlyIndentThisLine = false;
        return this;
    }

    outputJSDoc(spec: Object, parameters: { [name: string]: Schema; } = {}, mline = false): this {
        let { description, example } = spec;
        if (!description && !example && Object.keys(parameters).length === 0) {
            return this;
        }
        // this.outputLine('');
        let start = mline ? ' * ' : '// ';
        if(mline) {
            this.outputLine('/**');
        }
        if(description) {
          description.split('\n').forEach(line => {
              this.output(start).outputLine(line);
          });
        }
        if(example) {
            let split = example.split('\n');
            if(split.length == 1) {
                this.outputLine(start + ` * example: ${example}`);
            } else {
                this.outputLine(start + 'example:');
                split.forEach(line => {
                    this.output(start + '  ').outputLine(line);
                });
            }
        }
        Object.keys(parameters).forEach(parameterKey => {
            const parameter = parameters[parameterKey];
            this.outputLine(start + `@params {${toTSType(parameter.type)}} ${parameterKey} ${parameter.description}`);
        });
        if(mline) {
            this.outputLine(' */');
        }
        return this;
    }

    doIndent(): this {
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

    increaseIndent(): this {
        this.indent++;
        return this;
    }

    decreaseIndent(): this {
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
