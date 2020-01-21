export interface Error {
    code: number; // int32
    message: string;
}
export interface NewPet {
    name: string;
    tag?: string;
}
declare namespace Parameters {
    export type Id = number; // int64
    export type Limit = number; // int32
    export type Tags = string[];
}
export interface PathParameters {
    id: Parameters.Id /* int64 */;
}
export interface Pet {
    name: string;
    tag?: string;
    id: number; // int64
}
export interface QueryParameters {
    tags?: Parameters.Tags;
    limit?: Parameters.Limit /* int32 */;
}
export type RequestBody = NewPet;
declare namespace Responses {
    export type $200 = Pet;
    export type Default = Error;
}
