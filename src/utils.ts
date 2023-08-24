import * as fs from 'fs';
import { URL } from 'url';
import { GlobOptions, globIterate } from 'glob';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ScriptTarget } from 'typescript';
import { CommandOptions, defaultConfigFile } from './commandOptions';
import { PartialConfig } from './core/config';

export function readStream(
    stream: NodeJS.ReadableStream,
    encoding: BufferEncoding = 'utf8',
): Promise<string> {
    stream.setEncoding(encoding);
    return new Promise((resolve, reject) => {
        let data = '';
        stream.on('data', (chunk) => (data += chunk));
        stream.on('end', () => resolve(data));
        stream.on('error', (error) => reject(error));
    });
}

export async function readUrl(url: string): Promise<string> {
    const init = buildProxyOptions(url);
    const res = await fetch(url, init);
    const data = await res.text();
    if (!res.ok) {
        throw new Error(
            `Error on fetch from url(${url}): ${res.status}, ${data}`,
        );
    }
    return data;
}
function noProxy(url: URL): boolean {
    if (process.env.NO_PROXY) {
        for (const domain of process.env.NO_PROXY.split(/[, ]+/)) {
            if (url.hostname.endsWith(domain)) {
                return true;
            }
        }
    }
    return false;
}
export function buildProxyOptions<Uri extends string>(
    url: Uri,
): RequestInit | undefined {
    const parsedUrl = new URL(url);
    if (!noProxy(parsedUrl)) {
        if (parsedUrl.protocol === 'http:' && process.env.HTTP_PROXY) {
            return {
                agent: new HttpProxyAgent(process.env.HTTP_PROXY),
            } as RequestInit;
        } else if (parsedUrl.protocol === 'https:' && process.env.HTTPS_PROXY) {
            return {
                agent: new HttpsProxyAgent(process.env.HTTPS_PROXY),
            } as RequestInit;
        }
    }
    return undefined;
}

export async function globFiles(
    pattern: string,
    options?: GlobOptions,
): Promise<string[]> {
    const result: string[] = [];
    for await (const r of globIterate(pattern, options ?? {})) {
        if (typeof r === 'string') {
            result.push(r);
        } else {
            result.push(r.fullpath());
        }
    }
    return result;
}

export function readConfig(options: CommandOptions): PartialConfig {
    let pc: PartialConfig = {};
    const configFile = options.configFile ?? defaultConfigFile;
    try {
        pc = loadJSON(configFile);
        pc.configFile = configFile;
    } catch (err) {
        if (options.configFile != null) {
            console.error(
                'Error to load config file from ' + options.configFile,
            );
        }
    }

    if (pc.input == null) {
        pc.input = {
            files: [],
            urls: [],
            stdin: false,
        };
    }
    if (options.files.length > 0) {
        pc.input.files = options.files;
    } else if (pc.input.files == null) {
        pc.input.files = [];
    }
    if (options.urls.length > 0) {
        pc.input.urls = options.urls;
    } else if (pc.input.urls == null) {
        pc.input.urls = [];
    }
    if (options.stdin != null) {
        pc.input.stdin = options.stdin;
    } else {
        pc.input.stdin =
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            pc.input.stdin ||
            (pc.input.files.length === 0 && pc.input.urls.length === 0);
    }

    if (options.out != null) {
        pc.outputFile = options.out;
    }
    if (options.target != null) {
        pc.target = convertToScriptTarget(options.target);
    } else if (pc.target != null) {
        pc.target = convertToScriptTarget(pc.target as unknown as string);
    }
    pc.outputAST = !!options.outputAST;
    return pc;
}
function loadJSON(file: string): PartialConfig {
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content) as PartialConfig;
}
function convertToScriptTarget(target: string): ScriptTarget {
    switch (target.trim().toLowerCase()) {
        case 'es3':
            return ScriptTarget.ES3;
        case 'es5':
            return ScriptTarget.ES5;
        case 'es2015':
            return ScriptTarget.ES2015;
        case 'es2016':
            return ScriptTarget.ES2016;
        case 'es2017':
            return ScriptTarget.ES2017;
        case 'es2018':
            return ScriptTarget.ES2018;
        case 'es2019':
            return ScriptTarget.ES2019;
        case 'es2020':
            return ScriptTarget.ES2020;
        case 'es2021':
            return ScriptTarget.ES2021;
        case 'es2022':
            return ScriptTarget.ES2022;
        case 'esnext':
            return ScriptTarget.ESNext;
        default:
            return ScriptTarget.Latest;
    }
}
