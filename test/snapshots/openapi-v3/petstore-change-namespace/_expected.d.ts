declare namespace Test {
    namespace PetStore {
        export interface Error {
            code: number; // int32
            message: string;
        }
        export interface NewPet {
            name: string;
            tag?: string;
        }
        namespace Parameters {
            export type Id = number; // int64
            export type Limit = number; // int32
            export type Tags = string[];
        }
        export interface Pet {
            name: string;
            tag?: string;
            id: number; // int64
        }
        namespace Responses {
            export type $200 = Test.PetStore.Pet[];
        }
    }
}
