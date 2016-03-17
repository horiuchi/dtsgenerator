import pointer = require('json-pointer');
import utils = require('./utils');

import Processor = require('./writeProcessor');


class Generator {
    private static env: any = {};
    private static map: { [id: string]: Generator } = {};

    static generate(prefix?: string, header?: string): string {
        const process = new Processor(prefix);
        if (header) {
            process.outputLine(header);
        }
        this.walk(process, this.env);
        return process.toDefinition();
    }
    private static walk(process: Processor, env: any): void {
        const keys = Object.keys(env).sort();
        keys.forEach((key) => {
            const val = env[key];
            if (val instanceof Generator) {
                val.doProcess(process);
            } else {
                if (process.indentLevel === 0) {
                    process.output('declare ');
                }
                process.output('namespace ').output(key).outputLine(' {');
                process.increaseIndent();
                this.walk(process, val);
                process.decreaseIndent();
                process.outputLine('}');
            }
        });
    }

    static add(schema: JsonSchema): void {
        if (typeof schema === 'string') {
            schema = JSON.parse(<any>schema);
        }
        const g = new Generator(schema);
        this.map[g.id] = g;
        this.setEnv(pointer.parse(g.id), g);
    }
    private static setEnv(paths: string[], g: Generator): void {
        let obj = this.env;
        const name: string = paths.splice(paths.length - 1)[0];
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


    private innerId = '';

    constructor(private schema: JsonSchema) {
        if (!schema.id) {
            console.error(schema);
            throw new Error('id is not found.');
        }
        this.innerId = schema.id;
        if (this.innerId[0] !== '/') {
            this.innerId = '/' + this.innerId;
        }
    }

    public get id(): string {
        return this.innerId;
    }

    public doProcess(process: Processor): void {
        this.parseType(process, this.schema);
    }


    private getTypename(id: string): string {
        const name = id.split('/').slice(-1)[0];
        return utils.capitalizeName(name);
    }

    private searchRef(ref: string): JsonSchema {
        const splited = ref.split('#', 2);
        const id = splited[0];
        const path = splited[1];

        if (id && !Generator.map[id]) {
            throw new Error('$ref target is not found: ' + id);
        }
        if (path[0] && path[0] !== '/') {
            throw new Error('$ref path must be absolute path: ' + path);
        }
        const schema = id ? Generator.map[id].schema : this.schema;
        return pointer.get(schema, path);
    }


    private parseType(process: Processor, type: JsonSchema): void {
        if (type.type === undefined) {
            type.type = 'object';
        }
        if (type.type !== 'object' && type.type !== 'any' && type.type !== 'array') {
            console.error(type);
            throw new Error('unknown type: ' + type.type);
        }

        process.outputJSDoc(type.description);
        if (type.type === 'array') {
            this.parseTypeCollection(process, type);
        } else {
            this.parseTypeModel(process, type);
        }
    }

    private parseTypeModel(process: Processor, type: JsonSchema) {
        const name = this.getTypename(this.innerId);
        process.output('export interface ').outputType(name).outputLine(' {');
        process.increaseIndent();

        if (type.type === 'any') {
            // TODO this is not permitted property access by dot.
            process.outputLine('[name: string]: any; // any');
        }

        Object.keys(type.properties || {}).forEach((propertyName) => {
            const property = type.properties[propertyName];
            process.outputJSDoc(property.description);
            this.parsePropertyName(process, propertyName, type);
            this.parseTypeProperty(process, property);
        });

        process.decreaseIndent();
        process.outputLine('}');
    }

    private parseTypeCollection(process: Processor, type: JsonSchema) {
        const name = this.getTypename(this.innerId);
        process.output('export interface ').outputType(name).output(' extends Array<');
        if (type.items.$ref) {
            const itemsRef = this.searchRef(type.items.$ref);
            this.parseTypePropertyNamedType(process, this.getTypename(itemsRef.id), false, type.items, false);
        } else {
            this.parseTypeProperty(process, type.items, false);
        }
        process.outputLine('> {');
        process.outputLine('}');
    }

    private parsePropertyName(process: Processor, propertyName: string, property: JsonSchema): void {
        if (propertyName) {
            const optionalProperty = property.required && typeof property.required !== 'boolean' && property.required.indexOf(propertyName) < 0;
            process.outputKey(propertyName, optionalProperty).output(': ');
        }
    }
    private parseTypeProperty(process: Processor, property: JsonSchema, terminate = true): void {
        if (!property)
            return;
        if (property.allOf) {
            const schema: any = {};
            property.allOf.forEach((p) => {
                if (p.$ref) {
                    p = this.searchRef(p.$ref);
                }
                utils.mergeSchema(schema, p);
            });
            this.parseTypeProperty(process, schema, terminate);
            return;
        }
        ['oneOf', 'not'].forEach((keyword) => {
            const schema: any = property;
            if (schema[keyword]) {
                console.error(property);
                throw new Error('unsupported property: ' + keyword);
            }
        });
        if (property.$ref) {
            const ref = this.searchRef(property.$ref);
            if (ref) {
                if (ref.id) {
                    this.parseTypePropertyNamedType(process, this.getTypename(ref.id), false, ref, terminate);
                } else {
                    this.parseTypeProperty(process, ref, terminate);
                }
            } else {
                this.parseTypePropertyNamedType(process, property.$ref, false, property, terminate);
            }
            return;
        }
        if (property.anyOf) {
            const anyOf = property.anyOf;
            if (!terminate) {
                process.output('(');
            }
            anyOf.forEach((type: JsonSchema, index: number) => {
                const isLast = index === anyOf.length - 1;
                if (type.id) {
                    this.parseTypePropertyNamedType(process, this.getTypename(type.id), false, type, isLast && terminate);
                } else {
                    this.parseTypeProperty(process, type, isLast && terminate);
                }
                if (!isLast) {
                  process.output(' | ');
                }
            });
            if (!terminate) {
                process.output(')');
            }
            return;
        }
        if (property.enum) {
            if (!terminate) {
                process.output('(');
            }
            process.output(property.enum.map(s => '"' + s + '"').join(' | '));
            if (!terminate) {
                process.output(')');
            } else {
                process.outputLine(';');
            }
            return;
        }

        const type = property.type;
        if (typeof type === 'string') {
            this.outputTypeName(process, type, property, terminate);
        } else {
            const types = utils.reduceTypes(type);
            if (!terminate) {
                process.output('(');
            }
            types.forEach((t: string, index: number) => {
                const isLast = index === types.length - 1;
                this.outputTypeName(process, t, property, terminate);
                if (!isLast) {
                  process.output(' | ');
                }
            });
            if (!terminate) {
                process.output(')');
            }
        }
    }
    private outputTypeName(process: Processor, type: string, property: JsonSchema, terminate: boolean): void {
        const tsType = utils.toTSType(type, property);
        if (tsType) {
            this.parseTypePropertyNamedType(process, tsType, true, property, terminate);
            return;
        }
        if (type === 'object') {
            process.outputLine('{');
            process.increaseIndent();
            if (property.properties) {
                Object.keys(property.properties).forEach((propertyName) => {
                    const nextProperty = property.properties[propertyName];
                    this.parsePropertyName(process, propertyName, property);
                    this.parseTypeProperty(process, nextProperty);
                });
            } else if (property.additionalProperties) {
                process.output('[name: string]: ');
                this.parseTypeProperty(process, property.additionalProperties, true);
            }
            process.decreaseIndent();
            process.output('}');
            if (terminate) {
                process.outputLine(';');
            }

        } else if (type === 'array') {
            this.parseTypeProperty(process, property.items, false);
            process.output('[]');
            if (terminate) {
                process.outputLine(';');
            }

        } else {
            console.error(property);
            throw new Error('unknown type: ' + property.type);
        }
    }

    private parseTypePropertyNamedType(process: Processor, typeName: string, primitiveType: boolean, property: JsonSchema, terminate = true) {
        process.outputType(typeName, primitiveType);
        if (terminate) {
            process.output(';');
            if (property.format) {
                process.output(' // ').output(property.format);
            }
            process.outputLine();
        } else {
            if (property.format) {
                process.output(' /* ').output(property.format).output(' */ ');
            }
        }
    }

}

export = Generator;
