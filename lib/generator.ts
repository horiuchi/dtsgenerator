import model = require("./model");
import utils = require("./utils");

import Process = require("./process");


class Generator {
  private static env: any = {};
  private static map: { [id: string]: Generator } = {};

  static generate(header?: string): string {
    var process = new Process();
    if (header) {
      process.outputLine(header);
    }
    this.walk(process, this.env);
    return process.toDefinition();
  }
  private static walk(process: Process, env: any): void {
    var keys = Object.keys(env).sort();
    keys.forEach((key) => {
      var val = env[key];
      if (val instanceof Generator) {
        var g: Generator = val;
        g.doProcess(process);
      } else {
        if (process.indent === 0) {
          process.output("declare ");
        }
        process.output("module ").output(key).outputLine(" {");
        process.increaseIndent();
        this.walk(process, val);
        process.decreaseIndent();
        process.outputLine("}");
      }
    });
  }

  static add(schema: model.IJsonSchema): void {
    if (typeof schema === "string") {
      schema = JSON.parse(<any>schema);
    }
    var g = new Generator(schema);
    this.map[g.id] = g;
    this.setEnv(g.typenames, g);
  }
  private static setEnv(paths: string[], g: Generator): void {
    var obj = this.env;
    var name = paths.splice(paths.length - 1);
    paths.forEach((path, i) => {
      if (!obj[path]) {
        obj[path] = {};
      }
      obj = obj[path];
    });
    obj[name] = g;
  }


  private _id = "";

  constructor(private schema: model.IJsonSchema) {
    if (!schema.id) {
      console.error(schema);
      throw new Error("id is not found.");
    }
    this._id = schema.id;
  }

  public get id(): string {
    return this._id;
  }
  public get typenames(): string[] {
    return this._id.split("/");
  }

  public doProcess(process: Process): void {
    this.parseType(process, this.schema);
  }


  private getTypename(id: string): string {
    var name = id.split("/").slice(-1)[0];
    return utils.capitalizeName(name);
  }

  private searchRef(ref: string): model.IJsonSchema {
    var splited = ref.split('#', 2);
    var id = splited[0];
    var path = splited[1];

    if (path[0] && path[0] !== '/') {
      throw new Error("$ref path must be absolute path: " + path);
    }
    var schema = id ? Generator.map[id].schema : this.schema;
    var paths = path.split('/').slice(1);
    return utils.searchPath(schema, paths);
  }


  private parseType(process: Process, type: model.IJsonSchema): void {
    if (type.type !== "object" && type.type !== "any" && type.type !== "array") {
      console.error(type);
      throw new Error("unknown type: " + type.type);
    }

    process.outputJSDoc(type.description);
    if (type.type === "array") {
      this.parseTypeCollection(process, type);
    } else {
      this.parseTypeModel(process, type);
    }
  }

  private parseTypeModel(process: Process, type: model.IJsonSchema) {
    var name = this.getTypename(this._id);
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
    var name = this.getTypename(this._id);
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
    if (property.allOf) {
      var schema: any = {};
      property.allOf.forEach((p) => {
        if (p.$ref) {
          p = this.searchRef(p.$ref);
        }
        utils.mergeSchema(schema, p);
      });
      this.parseTypeProperty(process, name, schema, terminate);
      return;
    }
    // TODO I hope to use union type for 'anyOf' support.
    if (property.anyOf) {
      delete property.anyOf;
      property.type = 'any';
    }
    if (property.enum) {
      property.format = property.enum.toString();
      property.type = "any";
    }
    ['oneOf', 'not'].forEach((keyword) => {
      var schema: any = property;
      if (schema[keyword]) {
        console.error(property);
        throw new Error("unsupported property: " + keyword);
      }
    });

    if (name) {
      process.outputKey(name);
      // if (property.required && property.required.indexOf(name) < 0) {
      //   process.output("?");
      // }
      process.output(": ");
    }
    if (property.$ref) {
      var ref = this.searchRef(property.$ref);
      if (ref) {
        if (ref.id) {
          this.parseTypePropertyNamedType(process, "I" + this.getTypename(ref.id), ref, terminate);
        } else {
          this.parseTypeProperty(process, null, ref, terminate);
        }
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

