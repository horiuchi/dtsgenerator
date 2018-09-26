declare namespace Test {
    namespace PetStore {
        namespace Delete {
            namespace Parameters {
                export type Id = number; // int64
            }
        }
        export interface Error {
            code: number; // int32
            message: string;
        }
        namespace Get {
            namespace Parameters {
                export type Id = number; // int64
                export type Limit = number; // int32
                export type Tags = string[];
            }
            namespace Responses {
                export type $200 = Components.Schemas.Pet[];
            }
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
