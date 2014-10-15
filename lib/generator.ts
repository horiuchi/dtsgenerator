import model = require("./model");
import utils = require("./utils");

import Process = require("./process");


class Generator {
  private static env: Generator[] = [];
  private static map: { [id: string]: Generator } = {};

  static get results() {
    return Generator.env;
  }
  static add(...schemas: model.IJsonSchema[]): void {
    schemas.forEach((schema) => {
      if (typeof schema === "string") {
        schema = JSON.parse(<any>schema);
      }
      var result = new Generator(schema);
      Generator.env.push(result);
      Generator.map[result.id] = result;
    });
  }


  private _id = "";
  private dts = "";

  constructor(private schema: model.IJsonSchema) {
    if (!schema.id) {
      throw new Error("id is not found.");
    }
    this._id = schema.id;
  }

  get id(): string {
    return this._id;
  }
  get result(): string {
    if (!this.dts) {
      var process = new Process();
      this.parseType(process, this.schema);
      this.dts = process.toDefinition();
    }
    return this.dts;
  }


  private get typenames(): string[] {
    return this._id.split("/");
  }
  private get typename(): string {
    var names = this.typenames;
    var name = names[names.length - 1];
    return this.capitalize(name);
  }
  private capitalize(s: string): string {
    s = s.trim();
    return s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
      return m.toUpperCase();
    });
  }

  private searchRef(ref: string): model.IJsonSchema {
    var splited = ref.split('#', 2);
    var id = splited[0];
    var path = splited[1];
    var schema = id ? Generator.map[id].schema : this.schema;
    return this.search(schema, path);
  }
  private search(schema: model.IJsonSchema, path: string): model.IJsonSchema {
    if (path[0] !== '/') {
      throw new Error("$ref path must be absolute path: " + path);
    }
    var result: any = schema;
    var paths = path.split('/');
    for (var i = 1, len = paths.length; i < len; ++i) {
      var p = paths[i];
      if (!result[p]) {
        return null;
      }
      result = result[p];
    }
    return result;
  }


  private parseType(process: Process, type: model.IJsonSchema): void {
    if (type.type !== "object" && type.type !== "any" && type.type !== "array") {
      console.error(type);
      throw new Error("unknown type: " + type.type);
    }

    process.outputJSDoc(type.description);
    var names = this.typenames;
    for (var i = 0, len = names.length; i < len - 1; i++) {
      if (i === 0) {
        process.output("declare ");
      }
      var name = names[i];
      process.output("module ").output(name).outputLine(" {");
      process.increaseIndent();
    }

    if (type.type === "array") {
      this.parseTypeCollection(process, type);
    } else {
      this.parseTypeModel(process, type);
    }

    for (var i = 0, len = names.length; i < len - 1; i++) {
      process.decreaseIndent();
      process.outputLine("}");
    }
  }

  private parseTypeModel(process: Process, type: model.IJsonSchema) {
    var name = this.typename;
    process.output("export interface I").output(name).outputLine(" {");
    process.increaseIndent();

    if (type.type === "any") {
      // TODO this is not permitted property access by dot.
      process.outputLine("[name: string]: any; // any");
    }

    Object.keys(type.properties || {}).forEach(propertyName=> {
      process.outputJSDoc(type.properties[propertyName].description);
      this.parseTypeProperty(process, propertyName, type.properties[propertyName]);
    });

    process.decreaseIndent();
    process.outputLine("}");
  }

  private parseTypeCollection(process: Process, type: model.IJsonSchema) {
    var name = this.typename;
    process.output("export interface I").output(name).output(" extends Array<");
    if (type.items.$ref) {
      this.parseTypePropertyNamedType(process, "I" + type.items.$ref, type.items, false);
    } else {
      this.parseTypeProperty(process, null, type.items, false);
    }
    process.outputLine("> {");
    process.outputLine("}");
  }

  private parseTypeProperty(process: Process, name: string, property: model.IJsonSchema, terminate = true): void {
    if (name) {
      process.outputKey(name).output(": ");
    }
    if (property.$ref) {
      var ref = this.searchRef(property.$ref);
      if (ref) {
        this.parseTypeProperty(process, null, ref, terminate);
      } else {
        this.parseTypePropertyNamedType(process, "I" + property.$ref, property, terminate);
      }
      return;
    }
    var tsType = utils.toTSType(property.type, property);
    if (tsType) {
      this.parseTypePropertyNamedType(process, tsType, property, terminate);
      return;
    }
    if (property.type === "object") {
      if (property.properties) {
        process.increaseIndent();
        process.outputLine("{");
        Object.keys(property.properties).forEach(propertyName => {
          this.parseTypeProperty(process, propertyName, property.properties[propertyName]);
        });
        process.decreaseIndent();
        process.output("}");
        if (terminate) {
          process.outputLine(";");
        }
      } else if (property.additionalProperties) {
        process.outputLine("{");
        process.increaseIndent();
        process.output("[name:string]: ");
        this.parseTypeProperty(process, null, property.additionalProperties, false);
        process.outputLine(";");
        process.decreaseIndent();
        process.output("}");
        if (terminate) {
          process.outputLine(";");
        }
      }

    } else if (property.type === "array") {
      this.parseTypeProperty(process, null, property.items, false);
      process.output("[]");
      if (terminate) {
        process.outputLine(";");
      }

    } else {
      console.error(property);
      throw new Error("unknown type: " + property.type);
    }
  }

  private parseTypePropertyNamedType(process: Process, typeName: string, property: model.IJsonSchema, terminate = true) {
    process.output(typeName);
    if (terminate) {
      process.output(";");
      if (property.format) {
        process.output(" // ").output(property.format);
      }
      process.outputLine();
    } else {
      if (property.format) {
        process.output(" /* ").output(property.format).output(" */ ");
      }
    }
  }

}

export = Generator;

