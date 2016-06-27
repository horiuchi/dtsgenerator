declare namespace Schema {
    /**
     * Circular Reference Pattern
     */
    export interface Circular {
        root?: Circular.Definitions.Node;
    }
    namespace Circular {
        namespace Definitions {
            export interface Node {
                name?: string;
                children?: Node[];
            }
        }
    }
}
