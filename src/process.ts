import model = require('./model');

class Process {

  indentChar = ' ';
  indentStep = 2;

  indent = 0;

  results = '';
  alreadlyIndentThisLine = false;

  output(str: string): Process {
    this.doIndent();
    this.results += str;
    return this;
  }

  outputKey(name: string): Process {
    if (name.indexOf('-') !== -1 || name.indexOf('.') !== -1) {
      this.output('\"').output(name).output('\"');
    } else {
      this.output(name);
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
        default :
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

  increaseIndent(): Process {
    this.indent++;
    return this;
  }

  decreaseIndent(): Process {
    this.indent--;
    return this;
  }

  getIndent(): string {
    let indent = '';
    for (let i = 0; i < this.indent; i++) {
      indent += this.repeatString(this.indentStep, this.indentChar);
    }
    return indent;
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

