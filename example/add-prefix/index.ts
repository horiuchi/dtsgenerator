import dtsGenerator, { DefaultTypeNameConvertor, SchemaId } from 'dtsgenerator';
import * as fs from 'fs';

const filePath = '../../test/snapshots/json-schema-draft-04/schema/schema.json';

function typeNameConvertor(id: SchemaId): string[] {
    const names = DefaultTypeNameConvertor(id);
    if (names.length > 0) {
        const lastIndex = names.length - 1;
        names[lastIndex] = 'I' + names[lastIndex];
    }
    return names;
}

async function main(): Promise<void> {
    const content = JSON.parse( fs.readFileSync(filePath, 'utf-8') );
    const result = await dtsGenerator({
        contents: [content],
        typeNameConvertor,
    });
    console.log(result);
}
main();
