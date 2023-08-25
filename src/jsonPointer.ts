/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export function get(
    obj: any,
    path: string[],
    isCreateOnNotExists = false,
): any {
    if (path.length === 0) {
        return obj;
    }
    let o = obj;
    const lastKey = path[path.length - 1]!;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]!;
        let next = o[key];
        if (next == null) {
            if (isCreateOnNotExists) {
                next = {};
                o[key] = next;
            } else {
                return undefined;
            }
        }
        o = next;
    }
    return o[lastKey];
}

export function set(obj: any, path: string[], value: any): void {
    if (path.length === 0) {
        return;
    }
    let o = obj;
    const lastKey = path[path.length - 1]!;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i]!;
        let next = o[key];
        if (next == null) {
            next = {};
            o[key] = next;
        }
        o = next;
    }
    o[lastKey] = value;
}

export function parse(s: string): string[] {
    if (s.startsWith('#')) {
        s = s.substring(1);
    }
    const path = s.split('/');
    if (path.shift() !== '') {
        throw new Error('Invalid JSON-Pointer format: ' + s);
    }
    return path.map((key) => untilde(key));
}
function untilde(key: string): string {
    return key.replace(/~(0|1)/g, (match) => {
        switch (match) {
            case '~0':
                return '~';
            case '~1':
                return '/';
            default:
                throw new Error('Unsupported tilded number.');
        }
    });
}

export function tilde(key: string): string {
    return key.replace(/~/, '~0').replace(/\//g, '~1');
}
