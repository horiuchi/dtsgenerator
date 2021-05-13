declare namespace Definitions {
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
declare namespace Paths {
    namespace AddPet {
        export interface BodyParameters {
            pet: Parameters.Pet;
        }
        namespace Parameters {
            export type Pet = Definitions.NewPet;
        }
        namespace Responses {
            export type $200 = Definitions.Pet;
            export type Default = Definitions.Error;
        }
    }
    namespace DeletePet {
        namespace Parameters {
            /**
             * ID of pet to delete
             */
            export type Id = number; // int64
        }
        export interface PathParameters {
            id: /* ID of pet to delete */ Parameters.Id /* int64 */;
        }
        namespace Responses {
            export type Default = Definitions.Error;
        }
    }
    namespace FindPetById {
        namespace Parameters {
            /**
             * ID of pet to fetch
             */
            export type Id = number; // int64
        }
        export interface PathParameters {
            id: /* ID of pet to fetch */ Parameters.Id /* int64 */;
        }
        namespace Responses {
            export type $200 = Definitions.Pet;
            export type Default = Definitions.Error;
        }
    }
    namespace FindPets {
        namespace Parameters {
            /**
             * maximum number of results to return
             */
            export type Limit = number; // int32
            /**
             * tags to filter by
             */
            export type Tags = string[];
        }
        export interface QueryParameters {
            tags?: /* tags to filter by */ Parameters.Tags;
            limit?: /* maximum number of results to return */ Parameters.Limit /* int32 */;
        }
        namespace Responses {
            export type $200 = Definitions.Pet[];
            export type Default = Definitions.Error;
        }
    }
}
