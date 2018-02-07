import { SchemaId } from './schemaId';

export default function parse(content: any, url?: string): Schema {
    const { type, isOpenApi } = selectSchemaType(content);
    const getId = () => {
        switch (type) {
            case 'Draft04':
                return new SchemaId(content.id || url);
            case 'Draft07':
                return new SchemaId(content.$id || url);
        }
    };
    return {
        type,
        isOpenApi,
        id: getId(),
        content,
    };
}

export type SchemaType = 'Draft04' | 'Draft07';

export interface Schema {
    type: SchemaType;
    isOpenApi: boolean;
    id: SchemaId;
    content: JsonSchemaOrg.Draft04.Schema | JsonSchemaOrg.Draft07.Schema;
}

function selectSchemaType(content: any): { type: SchemaType; isOpenApi: boolean; } {
    if (content.$schema) {
        const schema = content.$schema;
        const match = schema.match(/http\:\/\/json-schema\.org\/draft-(\d+)\/schema#?/);
        if (match) {
            const version = Number(match[1]);
            if (version <= 4) {
                return {
                    type: 'Draft04',
                    isOpenApi: false,
                };
            } else {
                return {
                    type: 'Draft07',
                    isOpenApi: false,
                };
            }
        }
    }
    if (content.swagger === '2.0') {
        // Add `id` property in #/definitions/*
        if (content.definitions) {
            setSubIds(content.definitions, 'definitions');
        }
        return {
            type: 'Draft04',
            isOpenApi: true,
        };
    }
    if (content.openapi) {
        const openapi = content.openapi;
        if (/^3\.\d+\.\d+$/.test(openapi)) {
            // Add `id` property in #/components/schemas/*
            if (content.components && content.components.schema) {
                setSubIds(content.components.schema, 'components/schema');
            }
            return {
                type: 'Draft07',
                isOpenApi: true,
            };
        }
    }
    throw new Error(`Unknown content format: ${content}`);
}
function setSubIds(obj: any, prefix: string): void {
    Object.keys(obj).forEach((key) => {
        const sub = obj[key];
        if (sub != null) {
            if (sub.id == null) {
                sub.id = `#/${prefix}/${key}`;
            }
        }
    });
}
