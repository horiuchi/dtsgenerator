/**
 * ApiBaseObject of a record
 */
export interface IApiBaseObject {
  first: string;
}
/**
 * Metadata of a record
 */
export interface IApiMetadata {
  serverOperation: any; // I,U,D
  test: IApiBaseObject;
}
