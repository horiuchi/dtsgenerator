declare namespace json_schema_org {
  // A geographical coordinate
  export interface Geo {
    latitude?: number;
    longitude?: number;
  }

  export interface SimpleExample extends Array<{
    // The unique identifier for a product
    id: number;
    name: string;
    price: number;
    tags?: string[];
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    // Coordinates of the warehouse with the product
    warehouseLocation?: Geo;
  }> {}

}
