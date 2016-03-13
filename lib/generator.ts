/// <referece path="../typings/tsd.d.ts" />

import pointer = require('json-pointer');
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
    this.setEnv(pointer.parse(g.id), g);
  }
  private static setEnv(paths: string[], g: Generator): void {
    var obj = this.env;
    var name: string = paths.splice(paths.length - 1)[0];
    paths.forEach((path, i) => {
      if (!obj[path]) {
        obj[path] = {};
      }
      obj = obj[path];
    });
    obj[name] = g;
  }

  static clear(): void {
    this.env = {};
    this.map = {};
  }


  private _id = "";

  constructor(private schema: model.IJsonSchema) {
    if (!schema.id) {
      console.error(schema);
      throw new Error("id is not found.");
    }
    this._id = schema.id;
    if (this._id[0] !== "/") {
      this._id = "/" + this._id;
    }
  }

  public get id(): string {
    return this._id;
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

    if (id && !Generator.map[id]) {
      throw new Error("$ref target is not found: " + id);
    }
    if (path[0] && path[0] !== '/') {
      throw new Error("$ref path must be absolute path: " + path);
    }
    var schema = id ? Generator.map[id].schema : this.schema;
    return pointer.get(schema, path);
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

    Object.keys(type.properties || {}).forEach((propertyName) => {
      var property = type.properties[propertyName];
      process.outputJSDoc(property.description);
      if (type.required && typeof(property.required)!=="boolean" && type.required.indexOf(propertyName) < 0) {
        propertyName = propertyName + "?";
      }
      this.parseTypeProperty(process, propertyName, property);
    });

    process.decreaseIndent();
    process.outputLine("}");
  }

  private parseTypeCollection(process: Process, type: model.IJsonSchema) {
    var name = this.getTypename(this._id);
    process.output("export interface I").output(name).output(" extends Array<");
    if (type.items.$ref) {
      var itemsRef = this.searchRef(type.items.$ref);
      this.parseTypePropertyNamedType(process, "I" + this.getTypename(itemsRef.id), type.items, false);
    } else {
      this.parseTypeProperty(process, null, type.items, false);
    }
    process.outputLine("> {");
    process.outputLine("}");
  }

  private parseTypeProperty(process: Process, name: string, property: model.IJsonSchema, terminate = true): void {
    if (!property)
      return;
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
      process.outputKey(name).output(": ");
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
      process.outputLine("{");
      process.increaseIndent();
      if (property.properties) {
        Object.keys(property.properties).forEach((propertyName) => {
          var nextProperty = property.properties[propertyName];
          if (property.required && typeof(property.required)!=="boolean" && property.required.indexOf(propertyName) < 0) {
            propertyName = propertyName + "?";
          }
          this.parseTypeProperty(process, propertyName, nextProperty);
        });
      } else if (property.additionalProperties) {
        process.output("[name:string]: ");
        this.parseTypeProperty(process, null, property.additionalProperties, false);
        process.outputLine(";");
      }
      process.decreaseIndent();
      process.output("}");
      if (terminate) {
        process.outputLine(";");
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
