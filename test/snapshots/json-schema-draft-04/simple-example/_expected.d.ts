declare namespace JsonSchemaOrg {
    /**
     * A geographical coordinate
     */
    export interface Geo {
        latitude?: number;
        longitude?: number;
    }
    /**
     * Product set
     */
    export type SimpleExample = {
        /**
         * The unique identifier for a product
         */
        id: number;
        name: string;
        price: number;
        tags?: string[];
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        /**
         * Coordinates of the warehouse with the product
         */
        warehouseLocation?: Geo;
    }[];
}
