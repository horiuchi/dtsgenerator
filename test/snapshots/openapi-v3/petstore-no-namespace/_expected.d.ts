declare interface Error {
    code: number; // int32
    message: string;
}
declare interface NewPet {
    name: string;
    tag?: string;
}
declare interface Pet {
    name: string;
    tag?: string;
    id: number; // int64
}
declare namespace AddPet {
    export type RequestBody = NewPet;
    namespace Responses {
        export type $200 = Pet;
        export type Default = Error;
    }
}
declare namespace DeletePet {
    namespace Parameters {
        export type Id = number; // int64
    }
    export interface PathParameters {
        id: Parameters.Id /* int64 */;
    }
    namespace Responses {
        export interface $204 {
        }
        export type Default = Error;
    }
}
declare namespace FindPetById {
    namespace Parameters {
        export type Id = number; // int64
    }
    export interface PathParameters {
        id: Parameters.Id /* int64 */;
    }
    namespace Responses {
        export type $200 = Pet;
        export type Default = Error;
    }
}
declare namespace FindPets {
    namespace Parameters {
        export type Limit = number; // int32
        export type Tags = string[];
    }
    export interface QueryParameters {
        tags?: Parameters.Tags;
        limit?: Parameters.Limit /* int32 */;
    }
    namespace Responses {
        export type $200 = Pet[];
        export type Default = Error;
    }
}
