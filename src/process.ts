import model = require('./model');

class Process {

    public indentChar = ' ';
    public indentStep = 4;

    private indent = 0;
    private results = '';
    private alreadlyIndentThisLine = false;

    constructor(private typePrefix: string = '') { }

    output(str: string): Process {
        this.doIndent();
        this.results += str;
        return this;
    }

    outputType(type: string, primitive: boolean = false): Process {
        if (this.typePrefix && !primitive) {
            this.output(this.typePrefix);
        }
        this.output(type);
        return this;
    }

    outputKey(name: string, optional: boolean = false): Process {
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

    outputLine(str?: string): Process {
        this.doIndent();
        if (str) {
            this.output(str);
        }
        this.output('\n');
        this.alreadlyIndentThisLine = false;
        return this;
    }

    outputJSDoc(description: string, parameters: { [name: string]: model.IJsonSchema; } = {}): Process {
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

    doIndent(): Process {
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

    increaseIndent(): Process {
        this.indent++;
        return this;
    }

    decreaseIndent(): Process {
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

export = Process;

