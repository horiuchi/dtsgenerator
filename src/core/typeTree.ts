import { Schema } from './type';

export interface TypeTree {
    children: Map<string, TypeTree>;
    schema?: Schema;
}

export function buildTypeTree(schemas: IterableIterator<Schema>): TypeTree {
    const tree: TypeTree = buildTree();
    for (const type of schemas) {
        setTypeToTree(tree, type.id.toNames(), type);
    }
    if (tree.children.size === 0) {
        throw new Error('There is no schema in the input contents.');
    }
    return tree;
}

function setTypeToTree(tree: TypeTree, paths: string[], type: Schema): void {
    if (paths.length === 0) {
        throw new Error('The paths is nothing for set the type to TypeTree.');
    }
    let t: TypeTree = tree;
    for (const key of paths) {
        let next = t.children.get(key);
        if (next === undefined) {
            next = buildTree();
            t.children.set(key, next);
        }
        t = next;
    }
    t.schema = type;
}

function buildTree(): TypeTree {
    return {
        children: new Map(),
    };
}
