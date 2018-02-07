import YAML from 'js-yaml';
import path from 'path';

export function parseFileContent(content: string, filename?: string): JsonSchemaOrg.Schema {
    const ext = filename ? path.extname(filename).toLowerCase() : '';
    const maybeYaml = ext === '.yaml' || ext === '.yml';
    try {
        if (maybeYaml) {
            return YAML.safeLoad(content);
        } else {
            return JSON.parse(content);
        }
    } catch (e) {
        if (maybeYaml) {
            return JSON.parse(content);
        } else {
            return YAML.safeLoad(content);
        }
    }
}

