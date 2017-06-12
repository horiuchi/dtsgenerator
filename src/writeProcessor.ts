import opts from './commandOptions';
import { TypeDefinition } from './typeDefinition';

export type ReferenceResolver = (baseSchema: JsonSchemaOrg.Schema, ref: string) => TypeDefinition;

export class WriteProcessor {

    public indentChar = ' ';
    public indentStep = 4;

    private indent = 0;
    private results = '';
    private alreadlyIndentThisLine = false;
    private referenceStack: string[] = [];

    constructor(private refResolver: ReferenceResolver) {}

    get referenceResolve(): ReferenceResolver {
        return this.refResolver;
    }

    public pushReference(referenceName: string): number {
        return this.referenceStack.push(referenceName);
    }
    public popReference(): string {
        return this.referenceStack.pop();
    }
    public checkCircularReference(referenceName: string): boolean {
        return this.referenceStack.indexOf(referenceName) < 0;
    }


    public output(str: string): this {
        this.doIndent();
        this.results += str;
        return this;
    }

    public outputType(type: string, primitive: boolean = false): this {
        const prefix = opts.prefix;
        if (prefix && !primitive) {
            this.output(prefix);
        }
        type = type.replace(/[^0-9A-Za-z_$]/g, '_');
        if (/^\d/.test(type)) {
          type = '$' + type;
        }
        this.output(type);
        return this;
    }

    public outputKey(name: string, optional: boolean = false): this {
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

    public outputLine(str?: string): this {
        this.doIndent();
        if (str) {
            this.output(str);
        }
        this.output('\n');
        this.alreadlyIndentThisLine = false;
        return this;
    }

    public outputJSDoc(spec: any): this {
        const { description, example } = spec;
        if (!description && !example) {
            return this;
        }

        this.outputLine('/**');
        if (description) {
            description.toString().split('\n').forEach((line: string) => {
                this.output(' * ').outputLine(line);
            });
        }
        if (example) {
            const split = example.toString().split('\n');
            if (split.length === 1) {
                this.outputLine(` * example: ${example}`);
            } else {
                this.outputLine(' * example:');
                split.forEach((line: string) => {
                    this.output(' *   ').outputLine(line);
                });
            }
        }
        this.outputLine(' */');
        return this;
    }

    public doIndent(): this {
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

    public increaseIndent(): this {
        this.indent++;
        return this;
    }

    public decreaseIndent(): this {
        this.indent--;
        return this;
    }

    public getIndent(): string {
        return this.repeatString(this.indent * this.indentStep, this.indentChar);
    }

    public repeatString(n: number, s: string): string {
        let result = '';
        for (let i = 0; i < n; i++) {
            result += s;
        }
        return result;
    }

    public toDefinition(): string {
        return this.results;
    }
}

