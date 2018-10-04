declare interface Error {
    code: number; // int32
    message: string;
}
declare interface NewPet {
    name: string;
    tag?: string;
}
declare namespace Parameters {
    export type Id = number; // int64
    export type Limit = number; // int32
    export type Tags = string[];
}
declare interface Pet {
    name: string;
    tag?: string;
    id: number; // int64
}
declare namespace Responses {
    export type $200 = Pet[];
}
