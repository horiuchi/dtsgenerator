declare namespace json_schema_org {
    /**
     * A geographical coordinate
     */
    export interface Geo {
        latitude?: number;
        longitude?: number;
    }
    export interface SimpleExample extends Array<{
        id: number;
        name: string;
        price: number;
        tags?: string[];
        dimensions?: {
            length: number;
            width: number;
            height: number;
        };
        warehouseLocation?: Geo;
    }> {
    }
}
