/**
 * ApiBaseObject of a record
 */
export interface ApiBaseObject {
    first: string;
}
/**
 * Metadata of a record
 */
export interface ApiMetadata {
    serverOperation: "I" | "U" | "D";
    test: ApiBaseObject;
}
