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
        namespace Responses {
            export type Default = Definitions.Error;
        }
    }
    namespace FindPetById {
        namespace Responses {
            export type $200 = Definitions.Pet;
            export type Default = Definitions.Error;
        }
    }
    namespace FindPets {
        namespace Responses {
            export type $200 = Definitions.Pet[];
            export type Default = Definitions.Error;
        }
    }
}
