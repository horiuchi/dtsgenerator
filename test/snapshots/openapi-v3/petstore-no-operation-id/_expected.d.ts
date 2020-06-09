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
    namespace Pets {
        namespace Get {
            namespace Parameters {
                export type Limit = number; // int32
                export type Tags = string[];
            }
            export interface QueryParameters {
                tags?: Parameters.Tags;
                limit?: Parameters.Limit /* int32 */;
            }
            namespace Responses {
                export type $200 = Components.Schemas.Pet[];
                export type Default = Components.Schemas.Error;
            }
        }
        namespace Post {
            export type RequestBody = Components.Schemas.NewPet;
            namespace Responses {
                export type $200 = Components.Schemas.Pet;
                export type Default = Components.Schemas.Error;
            }
        }
    }
    namespace Pets$Id {
        namespace Delete {
            namespace Parameters {
                export type Id = number; // int64
            }
            export interface PathParameters {
                id: Parameters.Id /* int64 */;
            }
            namespace Responses {
                export interface $204 {
                }
                export type Default = Components.Schemas.Error;
            }
        }
        namespace Get {
            namespace Parameters {
                export type Id = number; // int64
            }
            export interface PathParameters {
                id: Parameters.Id /* int64 */;
            }
            namespace Responses {
                export type $200 = Components.Schemas.Pet;
                export type Default = Components.Schemas.Error;
            }
        }
    }
}
