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
        export interface PathParameters {
            id: Parameters.Id /* int64 */;
        }
        export interface Pet {
            name: string;
            tag?: string;
            id: number; // int64
        }
        export interface QueryParameters {
            tags?: Test.PetStore.Parameters.Tags;
            limit?: Test.PetStore.Parameters.Limit /* int32 */;
        }
        export type RequestBody = Test.PetStore.NewPet;
        namespace Responses {
            export type $200 = Test.PetStore.Pet;
            export type Default = Test.PetStore.Error;
        }
    }
}
