declare namespace schema {
    /**
     * Circular Reference Pattern
     */
    export interface Circular {
        root?: {
            name?: string;
            children?: any[];
        };
    }
}
