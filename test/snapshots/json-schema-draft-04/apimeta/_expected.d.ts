/**
 * ApiBaseObject of a record
 */
declare interface ApiBaseObject {
    first?: string;
}
/**
 * Metadata of a record
 */
declare interface ApiMetadata {
    serverOperation?: "I" | "U" | "D";
    test?: /* ApiBaseObject of a record */ ApiBaseObject;
}
