import glob from 'glob';
import YAML from 'js-yaml';
import path from 'path';

export function readStream(stream: NodeJS.ReadStream, encoding = 'utf8'): Promise<string> {
    stream.setEncoding(encoding);
    return new Promise((resolve, reject) => {
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => resolve(data));
        stream.on('error', error => reject(error));
    });
}

export async function readUrl(url: string): Promise<string> {
    const res = await fetch(url);
    const data = await res.text();
    if (!res.ok) {
        throw new Error(`Error on fetch from url(${url}): ${res.status}, ${data}`);
    }
    return data;
}

export function parseFileContent(content: string, filename?: string): any {
    const ext = filename ? path.extname(filename).toLowerCase() : '';
    const maybeYaml = ext === '.yaml' || ext === '.yml';
    try {
        if (maybeYaml) {
            return deepCopy(YAML.safeLoad(content));
        } else {
            return JSON.parse(content);
        }
    } catch (e) {
        if (maybeYaml) {
            return JSON.parse(content);
        } else {
            return deepCopy(YAML.safeLoad(content));
        }
    }
}
function deepCopy(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
}

export function globFiles(pattern: string, options?: glob.IOptions): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(pattern, options || {}, (err, matches) => {
            if (err) {
                reject(err);
            } else {
                resolve(matches);
            }
        });
    });
}
