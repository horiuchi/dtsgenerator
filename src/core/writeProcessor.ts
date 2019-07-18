import { normalizeTypeName } from './typeNameConvertor';

export interface WriteProcessorOptions {
    indentChar: string;
    indentSize: number;
    normalizeTypeName: (type: string, primitive: boolean) => string;
}

const defaultOptions: WriteProcessorOptions = {
    indentChar: ' ',
    indentSize: 4,
    normalizeTypeName,
};

export default class WriteProcessor {
    private options: WriteProcessorOptions;

    private indent = 0;
    private results = '';
    private alreadyIndentThisLine = false;

    constructor(options?: Partial<WriteProcessorOptions>) {
        this.options = { ...defaultOptions, ...options };
    }

    public clear(): void {
        this.indent = 0;
        this.results = '';
        this.alreadyIndentThisLine = false;
    }

    public output(str: string): this {
        this.doIndent();
        this.results += str;
        return this;
    }

    public outputType(type: string, primitive: boolean = false): this {
        type = this.options.normalizeTypeName(type, primitive);
        this.output(type);
        return this;
    }

    public outputKey(name: string, optional: boolean = false): this {
        if (/[^0-9A-Za-z_$]/.test(name) || /^\d/.test(name)) {
            this.output(`"${name}"`);
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

    public outputJSDoc(...comments: any[]): this {
        let lines: string[] = [];
        comments
            .filter((comment) => comment != null)
            .map((comment) => {
                if (typeof comment === 'string') {
                    return comment;
                } else {
                    return JSON.stringify(comment, null, 2);
                }
            })
            .map((comment) => comment.split('\n').map((line: string) => this.protectComment(line)))
            .forEach((ls: string[]) => {
                lines = lines.concat(ls);
            });
        if (lines.length > 0) {
            this.outputLine('/**');
            for (const line of lines) {
                this.output(' * ').outputLine(line);
            }
            this.outputLine(' */');
        }
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
        return this.repeatString(this.indent * this.options.indentSize, this.options.indentChar);
    }

    private repeatString(n: number, s: string): string {
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

