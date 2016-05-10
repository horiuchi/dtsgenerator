import * as JsonPointer from './jsonPointer';
import * as utils from './utils';
import { SchemaId } from './schemaid';
import { WriteProcessor } from './writeProcessor';
import * as Debug from 'debug';
const debug = Debug('dtsgen');
import { nameFromPath, titleCase } from './utils';
let _ = require('lodash-fp');

export class TypeDefinition {
    private id: SchemaId;
    private target: json_schema_org.Schema;
    private isInnerType = false;

    constructor(private schema: json_schema_org.Schema, private path: string[]) {
        this.target = JsonPointer.get(schema, path);
        if (!this.target || !this.target.id) {
            this.id = null;
        } else {
            const baseId = this.target.id;
            const parentsId: string[] = [];
            for (let i = path.length - 1; i >= 0; i--) {
                const parent = JsonPointer.get(schema, path.slice(0, i));
                if (parent && parent.id) {
                    parentsId.push(parent.id);
                }
            }
            this.id = new SchemaId(baseId, parentsId);
        }
    }

    get schemaId(): SchemaId {
        return this.id;
    }
    get rootSchema(): json_schema_org.Schema {
        return this.schema;
    }
    get targetSchema(): json_schema_org.Schema {
        return this.target;
    }

    public doProcess(process: WriteProcessor): void {
        const name = nameFromPath(this.schema.id);
        this.generateType(process, this.schema, name);
    }

    // get the TypeDefinition for a $ref
    private searchRef(process: WriteProcessor, ref: string): TypeDefinition {
        const type = process.referenceResolve(this.schema, ref);
        if (type == null) {
            throw new Error('Target reference is not found: ' + ref);
        }
        return type;
    }

    // get the type names (as a string[]) for a schema id
    private getTypename(id: SchemaId | string): string[] {
        let sid = (id instanceof SchemaId) ? id : new SchemaId(id);
        const result = sid.getTypeNames();
        const myId = this.schemaId;
        if (myId) {
            const baseType = myId.getTypeNames();
            const isSameLength = result.length === baseType.length;
            for (let name of baseType) {
                if (result[0] === name) {
                    result.shift();
                } else {
                    break;
                }
            }
            if (result.length === 0) {
                return !this.isInnerType && isSameLength ? ['this'] : [sid.getInterfaceName()];
            }
        }
        return result;
    }

    // output the type for a schema value
    private generateType(process: WriteProcessor, type: json_schema_org.Schema, name: string): void {
        let types = type.type;
        let ofX = type.anyOf || type.oneOf || type.allOf;
        let ref = type.$ref || _.get(['$ref'])(_.find(x => x.$ref)(ofX));
        if (!types && ref) {
            types = this.searchRef(process, ref).targetSchema.type;
        }
        if (!types) {
            type.type = 'object';
        } else if (Array.isArray(types)) {
            const reduced = utils.reduceTypes(types);
            if (reduced.length > 1) {
                throw new Error('unsupported root type: ' + JSON.stringify(reduced));
            } else {
                type.type = reduced[0];
            }
        }

        process.outputJSDoc(type);
        const SCALARS = ['integer', 'number', 'null', 'string', 'boolean'];
        if (SCALARS.includes(types) || (types == 'any' && !type.properties && !type.patternProperties && !type.additionalProperties)) {
            // throw new Error('unsupported root type: ' + JSON.stringify(types));
            this.generateTypeScalar(process, type, name);
        } else if (ref) {
            this.generateTypeExtender(process, type, name, ref);
        } else if (types == 'array') {
            this.generateTypeCollection(process, type, name);
        } else {
            // object
            this.generateTypeModel(process, type, name);
        }
    }

    // output the type for a schema scalar
    private generateTypeScalar(process: WriteProcessor, type: json_schema_org.Schema, name: string) {
        // debug('generateTypeExtender', name);
        process.output('export type ').outputType(name).output(' = ');
        this.generateTypeProperty(process, type, false);
        process.outputLine(';');
    }

    // output the type for a schema array/object that just extends an existing reference
    private generateTypeExtender(process: WriteProcessor, type: json_schema_org.Schema, name: string, ref: string) {
        // debug('generateTypeExtender', name, ref);
        process.output('export interface ').outputType(name).output(' extends ');
        let refName = this.refPrintNameSpaceGetName(process, type, ref);
        process.outputLine(`${refName}{}`);
    }

    // output the type for a schema object
    private generateTypeModel(process: WriteProcessor, type: json_schema_org.Schema, name: string) {
        if(type.properties || type.additionalProperties) {
          process.output('export interface ').outputType(name).outputLine(' {');
          process.increaseIndent();
          if (type.type === 'any') {
              // TODO this is not permitted property access by dot.
              process.outputLine('[name: string]: any; // any');
          }
          this.generateProperties(process, type);
          process.decreaseIndent();
          process.outputLine('}');
        } else {
          process.output('export interface ').outputType(name).outputLine(' {}');
        }
    }

    // output the type for a schema array
    private generateTypeCollection(process: WriteProcessor, type: json_schema_org.Schema, name: string) {
        process.output('export interface ').outputType(name).output(' extends Array<');
        this.generateTypeProperty(process, type.items, false);
        process.outputLine('> {}');
    }

    // output name + type for all k/v pairs in a schema object
    private generateProperties(process: WriteProcessor, type: json_schema_org.Schema): void {
        if (type.additionalProperties) {
            process.output('[name: string]: ');
            this.generateTypeProperty(process, type.additionalProperties, true);
        }
        if (type.properties) {
            Object.keys(type.properties).forEach((propertyName) => {
                const property = type.properties[propertyName];
                process.outputJSDoc(property);
                this.generatePropertyName(process, propertyName, type);
                this.generateTypeProperty(process, property);
            });
        }
    }

    // output name for a k/v pair in a schema object
    private generatePropertyName(process: WriteProcessor, propertyName: string, property: json_schema_org.Schema): void {
        if (propertyName) {
            const optionalProperty = !property.required || property.required.indexOf(propertyName) < 0;
            process.outputKey(propertyName, optionalProperty).output(': ');
        }
    }

    // name is returned for printing as desired (terminate, etc.); name-space is printed right away for external references.
    private refPrintNameSpaceGetName(process: WriteProcessor, property: Schema, ref: string): string {
      let refName = nameFromPath(ref);
      // if this references a different namespace, print this namespace as well.
      let { host, path, hash } = new SchemaId(ref).baseId;
      let refPath = (host ? [host] : []).concat(_.filter(x => x)(path.split('/')));
      let isExternal = !_.eq(process.path.slice(0,-1), refPath.slice(0,-1));
      if(isExternal) {
        let hashPath = hash.split('/').slice(1);
        let isDef = hashPath[0] == 'definitions';
        // also, definitions can keep their TitleCase, but properties can't.
        if(!isDef) refName = nameFromPath(property.$ref, false);
        let nameSpacePath = refPath.slice(0,-1).concat(isDef ? [] : refPath.slice(-1).map(titleCase));
        let nameSpace = nameSpacePath.map(s => process.convertToType(s, true)).join('.') + '.';
        process.output(nameSpace);
      }
      return refName;
    }

    // output type for a k/v pair in a schema object
    private generateTypeProperty(process: WriteProcessor, property: json_schema_org.Schema, terminate = true): void {
        if (!property)
            return;
        ['not'].forEach((keyword) => {
            const schema: any = property;
            if (schema[keyword]) {
                console.error(property);
                throw new Error('unsupported property: ' + keyword);
            }
        });
        if (property.allOf) {
            const schema: any = {};
            property.allOf.forEach((p) => {
                if (p.$ref) {
                    p = this.searchRef(process, p.$ref).targetSchema;
                }
                utils.mergeSchema(schema, p);
            });
            this.generateTypeProperty(process, schema, terminate);
            return;
        }
        if (property.$ref) {
            let refName = this.refPrintNameSpaceGetName(process, property, property.$ref);
            if(terminate) {
              this.generateTypePropertyNamedType(process, refName, property, true);
            } else {
              process.outputType(refName, false);
            }
            return;
        }
        const anyOf = property.anyOf || property.oneOf;
        if (anyOf) {
            this.generateArrayedType(process, anyOf, ' | ', terminate);
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
        if (type == null) {
            this.generateTypePropertyNamedType(process, 'any', true, property, terminate);
        } else if (typeof type === 'string') {
            this.generateTypeName(process, type, property, terminate);
        } else {
            const types = utils.reduceTypes(type);
            if (!terminate && types.length > 1) {
                process.output('(');
            }
            types.forEach((t: string, index: number) => {
                const isLast = index === types.length - 1;
                this.generateTypeName(process, t, property, terminate);
                if (!isLast) {
                  process.output(' | ');
                }
            });
            if (!terminate && types.length > 1) {
                process.output(')');
            }
        }
    }

    // output an array type as demanded by anyOf/oneOf
    private generateArrayedType(process: WriteProcessor, types: json_schema_org.Schema[], separator: string, terminate: boolean): void {
        if (!terminate) {
            process.output('(');
        }
        types.forEach((type: json_schema_org.Schema, index: number) => {
            const isLast = index === types.length - 1;
            if (type.id) {
                this.generateTypePropertyNamedType(process, this.getTypename(type.id), false, type, isLast && terminate);
            } else {
                this.generateTypeProperty(process, type, isLast && terminate);
            }
            if (!isLast) {
              process.output(separator);
            }
        });
        if (!terminate) {
            process.output(')');
        }
    }

    // output a named type
    private generateTypeName(process: WriteProcessor, type: string, property: json_schema_org.Schema, terminate: boolean): void {
        const tsType = utils.toTSType(type, property);
        if (tsType) {
            this.generateTypePropertyNamedType(process, tsType, true, property, terminate);
            return;
        }
        if (type === 'object') {
            if(property.properties || property.additionalProperties) {
              process.outputLine('{');
              process.increaseIndent();
              this.isInnerType = true;
              this.generateProperties(process, property);
              this.isInnerType = false;
              process.decreaseIndent();
              process.output('}');
            } else {
              process.output('{}');
            }
        } else if (type === 'array') {
            this.generateTypeProperty(process, property.items == null ? {} : property.items, false);
            process.output('[]');
        } else {
            console.error(property);
            throw new Error('unknown type: ' + property.type);
        }
        if (terminate) {
            process.outputLine(';');
        }
    }

    // output a TypeScript type name
    private generateTypePropertyNamedType(process: WriteProcessor, typeName: string | string[], primitiveType: boolean, property: json_schema_org.Schema, terminate = true): void {
        if (Array.isArray(typeName)) {
            typeName.forEach((type: string, index: number) => {
                const isLast = index === typeName.length - 1;
                process.outputType(type, primitiveType);
                if (!isLast) {
                    process.output('.');
                }
            });
        } else {
            process.outputType(typeName, primitiveType);
        }
        if (terminate) {
            process.output(';');
            this.generateOptionalInformation(process, property, terminate);
            process.outputLine();
        } else {
            this.generateOptionalInformation(process, property, terminate);
        }
    }

    // output metadata (format/pattern) comments for a schema value
    private generateOptionalInformation(process: WriteProcessor, property: json_schema_org.Schema, terminate = true): void {
        if (!property.format && !property.pattern) {
            return;
        }
        if (terminate) {
            process.output(' //');
        } else {
            process.output(' /*');
        }
        if (property.format) {
            process.output(' ').output(property.format);
        }
        if (property.pattern) {
            process.output(' ').output(property.pattern);
        }
        if (!terminate) {
            process.output(' */ ');
        }
    }
}

