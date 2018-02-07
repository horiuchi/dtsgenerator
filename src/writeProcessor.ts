import opts from './commandOptions';
import { TypeDefinition } from './typeDefinition';

export type ReferenceResolver = (baseSchema: JsonSchemaOrg.Schema, ref: string) => TypeDefinition | undefined;

export class WriteProcessor {

    public indentChar = ' ';
    public indentStep = 4;

    private indent = 0;
    private results = '';
    private alreadyIndentThisLine = false;
    private referenceStack: string[] = [];

    constructor(private refResolver: ReferenceResolver) {}

    get referenceResolve(): ReferenceResolver {
        return this.refResolver;
    }

    public pushReference(referenceName: string): number {
        return this.referenceStack.push(referenceName);
    }
    public popReference(): string | undefined {
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
        this.alreadyIndentThisLine = false;
        return this;
    }

    private protectComment(str: string): string {
        return str.replace(/\*\//g, '*\u200B/'); // Unicode [ZERO WIDTH SPACE]
    }

    public outputJSDoc(spec: JsonSchemaOrg.Schema): this {
        const { description, example } = spec;
        if (!description && !example) {
            return this;
        }

        this.outputLine('/**');
        if (description) {
            description.toString().split('\n').forEach((line: string) => {
                this.output(' * ').outputLine(this.protectComment(line));
            });
        }
        if (example) {
            const text = example.toString();
            const split = text.split('\n');
            if (split.length === 1) {
                this.outputLine(` * example: ${this.protectComment(text)}`);
            } else {
                this.outputLine(' * example:');
                split.forEach((line: string) => {
                    this.output(' *   ').outputLine(this.protectComment(line));
                });
            }
        }
        this.outputLine(' */');
        return this;
    }

    public doIndent(): this {
        if (!this.alreadyIndentThisLine) {
            const indent = this.getIndent();
            this.results += indent;
            this.alreadyIndentThisLine = true;
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

