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
        export interface Pet {
            name: string;
            tag?: string;
            id: number; // int64
        }
    }
}
declare namespace Test {
    namespace PetStore {
        namespace AddPet {
            export type RequestBody = Test.PetStore.NewPet;
            namespace Responses {
                export type $200 = Test.PetStore.Pet;
                export type Default = Test.PetStore.Error;
            }
        }
        namespace DeletePet {
            namespace Parameters {
                export type Id = number; // int64
            }
            export interface PathParameters {
                id: Parameters.Id /* int64 */;
            }
            namespace Responses {
                export type Default = Test.PetStore.Error;
            }
        }
        namespace FindPetById {
            namespace Parameters {
                export type Id = number; // int64
            }
            export interface PathParameters {
                id: Parameters.Id /* int64 */;
            }
            namespace Responses {
                export type $200 = Test.PetStore.Pet;
                export type Default = Test.PetStore.Error;
            }
        }
        namespace FindPets {
            namespace Parameters {
                export type Limit = number; // int32
                export type Tags = string[];
            }
            export interface QueryParameters {
                tags?: Parameters.Tags;
                limit?: Parameters.Limit /* int32 */;
            }
            namespace Responses {
                export type $200 = Test.PetStore.Pet[];
                export type Default = Test.PetStore.Error;
            }
        }
    }
}
