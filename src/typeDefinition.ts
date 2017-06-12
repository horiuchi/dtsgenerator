import * as JsonPointer from './jsonPointer';
import { SchemaId } from './schemaid';
import * as utils from './utils';
import { WriteProcessor } from './writeProcessor';

export class TypeDefinition {
    private id: SchemaId;
    private target: JsonSchemaOrg.Schema;

    constructor(private schema: JsonSchemaOrg.Schema, path: string[], refId?: SchemaId) {
        this.target = JsonPointer.get(schema, path);
        if (!this.target || !this.target.id) {
            this.id = refId || null;
        } else {
            const baseId = this.target.id;
            const parentsId: string[] = [];
            for (let i = path.length - 1; i >= 0; i--) {
                const parent = JsonPointer.get(schema, path.slice(0, i));
                if (parent && parent.id && typeof parent.id === 'string') {
                    parentsId.push(parent.id);
                }
            }
            this.id = new SchemaId(baseId, parentsId);
        }
    }

    get schemaId(): SchemaId {
        return this.id;
    }
    get rootSchema(): JsonSchemaOrg.Schema {
        return this.schema;
    }
    get targetSchema(): JsonSchemaOrg.Schema {
        return this.target;
    }

    public doProcess(process: WriteProcessor): void {
        this.generateType(process, this.target);
    }


    private searchRef(process: WriteProcessor, ref: string): TypeDefinition {
        const type = process.referenceResolve(this.schema, ref);
        if (type == null) {
            throw new Error('Target reference is not found: ' + ref);
        }
        return type;
    }
    private getTypename(id: SchemaId | string): string[] {
        const sid = (id instanceof SchemaId) ? id : new SchemaId(id);
        const result = sid.getTypeNames();
        const myId = this.schemaId;
        if (myId) {
            const baseType = myId.getTypeNames().slice(0, -1);
            for (const name of baseType) {
                if (result[0] === name) {
                    result.shift();
                } else {
                    break;
                }
            }
            if (result.length === 0) {
                return [sid.getInterfaceName()];
            }
        }
        return result;
    }
    private checkSchema(process: WriteProcessor, base: JsonSchemaOrg.Schema): JsonSchemaOrg.Schema {
        if (base.allOf) {
            const schema = base;
            base.allOf.forEach((p) => {
                if (p.$ref) {
                    p = this.searchRef(process, p.$ref).targetSchema;
                }
                utils.mergeSchema(schema, p);
            });
            return schema;
        }
        return base;
    }

    private generateType(process: WriteProcessor, type: JsonSchemaOrg.Schema): void {
        type = this.checkSchema(process, type);
        const types = type.type;
        if (types === undefined && (type.properties || type.additionalProperties)) {
            type.type = 'object';
        } else if (Array.isArray(types)) {
            const reduced = utils.reduceTypes(types);
            type.type = reduced.length === 1 ? reduced[0] : reduced;
        }

        process.outputJSDoc(type);
        if (type.type === 'array') {
            this.generateTypeCollection(process, type);
        } else if (type.type === 'object' || type.type === 'any') {
            this.generateTypeModel(process, type);
        } else {
            this.generateDeclareType(process, type);
        }
    }

    private generateDeclareType(process: WriteProcessor, type: JsonSchemaOrg.Schema): void {
        const name = this.id.getInterfaceName();
        process.output('export type ').outputType(name).output(' = ');
        this.generateTypeProperty(process, type, true);
    }

    private generateTypeModel(process: WriteProcessor, type: JsonSchemaOrg.Schema): void {
        const name = this.id.getInterfaceName();
        process.output('export interface ').outputType(name).outputLine(' {');
        process.increaseIndent();

        if (type.type === 'any') {
            // TODO this is not permitted property access by dot.
            process.outputLine('[name: string]: any; // any');
        }
        this.generateProperties(process, type);
        process.decreaseIndent();
        process.outputLine('}');
    }

    private generateTypeCollection(process: WriteProcessor, type: JsonSchemaOrg.Schema): void {
        const name = this.id.getInterfaceName();
        process.output('export type ').outputType(name).output(' = ');
        this.generateTypeProperty(process, type.items == null ? {} : type.items, false);
        process.outputLine('[];');
    }

    private generateProperties(process: WriteProcessor, type: JsonSchemaOrg.Schema): void {
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
    private generatePropertyName(process: WriteProcessor, propertyName: string, property: JsonSchemaOrg.Schema): void {
        if (propertyName) {
            const optionalProperty = !property.required || property.required.indexOf(propertyName) < 0;
            process.outputKey(propertyName, optionalProperty).output(': ');
        }
    }
    private generateTypeProperty(process: WriteProcessor, property: JsonSchemaOrg.Schema, terminate = true): void {
        if (!property) {
            return;
        }
        property = this.checkSchema(process, property);

        if (property.$ref) {
            const ref = this.searchRef(process, property.$ref);
            if (ref.id == null) {
                throw new Error('target referenced id is nothing: ' + property.$ref);
            }
            this.generateTypePropertyNamedType(process, this.getTypename(ref.id), false, ref.targetSchema, terminate);
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
            process.output(property.enum.map((s) => '"' + s + '"').join(' | '));
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
                this.generateTypeName(process, t, property, terminate && isLast, isLast);
                if (!isLast) {
                  process.output(' | ');
                }
            });
            if (!terminate && types.length > 1) {
                process.output(')');
            }
        }
    }

    private generateArrayedType(process: WriteProcessor, types: JsonSchemaOrg.Schema[], separator: string, terminate: boolean): void {
        if (!terminate) {
            process.output('(');
        }
        types.forEach((type: JsonSchemaOrg.Schema, index: number) => {
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

    private generateTypeName(process: WriteProcessor, type: string, property: JsonSchemaOrg.Schema, terminate: boolean, outputOptional = true): void {
        const tsType = utils.toTSType(type, property);
        if (tsType) {
            this.generateTypePropertyNamedType(process, tsType, true, property, terminate, outputOptional);
            return;
        }
        if (type === 'object') {
            process.outputLine('{');
            process.increaseIndent();
            this.generateProperties(process, property);
            process.decreaseIndent();
            process.output('}');
            if (terminate) {
                process.outputLine(';');
            }
        } else if (type === 'array') {
            this.generateTypeProperty(process, property.items == null ? {} : property.items, false);
            process.output('[]');
            if (terminate) {
                process.outputLine(';');
            }
        } else {
            throw new Error('unknown type: ' + property.type);
        }
    }

    private generateTypePropertyNamedType(process: WriteProcessor, typeName: string | string[], primitiveType: boolean, property: JsonSchemaOrg.Schema, terminate = true, outputOptional = true): void {
        if (Array.isArray(typeName)) {
            typeName.forEach((type: string, index: number) => {
                const isLast = index === typeName.length - 1;
                process.outputType(type, isLast ? primitiveType : true);
                if (!isLast) {
                    process.output('.');
                }
            });
        } else {
            process.outputType(typeName, primitiveType);
        }
        if (terminate) {
            process.output(';');
        }
        if (outputOptional) {
            this.generateOptionalInformation(process, property, terminate);
        }
        if (terminate) {
            process.outputLine();
        }
    }
    private generateOptionalInformation(process: WriteProcessor, property: JsonSchemaOrg.Schema, terminate = true): void {
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

