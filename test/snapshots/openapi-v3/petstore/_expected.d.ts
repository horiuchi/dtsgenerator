declare namespace Components {
    namespace Schemas {
        export interface Error {
            code: number; // int32
            message: string;
        }
        export interface NewPet {
            name: string;
            tag?: string;
        }
        export interface Pet {
            name: string;
            tag?: string;
            id: number; // int64
        }
    }
}
declare namespace Paths {
    namespace DeletePet {
        namespace Parameters {
            export type Id = number; // int64
        }
    }
    namespace FindPetById {
        namespace Parameters {
            export type Id = number; // int64
        }
    }
    namespace FindPets {
        namespace Parameters {
            export type Limit = number; // int32
            export type Tags = string[];
        }
        namespace Responses {
            export type $200 = Components.Schemas.Pet[];
        }
    }
}
