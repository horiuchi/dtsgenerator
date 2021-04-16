import { URL } from 'url';
import glob from 'glob';
import proxy from 'https-proxy-agent';

export function readStream(
    stream: NodeJS.ReadStream,
    encoding: BufferEncoding = 'utf8'
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
            `Error on fetch from url(${url}): ${res.status}, ${data}`
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
function buildProxyOptions(url: string): RequestInit | undefined {
    const parsedUrl = new URL(url);
    let proxyUrl;
    if (!noProxy(parsedUrl)) {
        if (parsedUrl.protocol === 'http:' && process.env.HTTP_PROXY) {
            proxyUrl = new URL(process.env.HTTP_PROXY);
        } else if (parsedUrl.protocol === 'https:' && process.env.HTTPS_PROXY) {
            proxyUrl = new URL(process.env.HTTPS_PROXY);
        }
    }
    if (proxyUrl) {
        const agentOptions: proxy.HttpsProxyAgentOptions = {};
        agentOptions.protocol = proxyUrl.protocol;
        agentOptions.host = proxyUrl.hostname;
        agentOptions.port = proxyUrl.port;
        if (proxyUrl.username) {
            agentOptions.auth = proxyUrl.username + ':' + proxyUrl.password;
        }
        return { agent: proxy(agentOptions) } as RequestInit;
    }
    return undefined;
}

export function globFiles(
    pattern: string,
    options?: glob.IOptions
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(pattern, options ?? {}, (err, matches) => {
            if (err) {
                reject(err);
            } else {
                resolve(matches);
            }
        });
    });
}
