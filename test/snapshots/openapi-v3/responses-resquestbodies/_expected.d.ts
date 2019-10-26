declare namespace Components {
    namespace RequestBodies {
        export type ResourceCreationRequest = Schemas.Resource;
    }
    namespace Responses {
        export type $201Created = Schemas.Resource;
        export type $400Invalid = Schemas.Error;
    }
    namespace Schemas {
        export interface Error {
            error?: string;
        }
        export interface Resource {
            status?: string;
        }
    }
}
declare namespace Paths {
    namespace CreateResource {
        export type RequestBody = Components.RequestBodies.ResourceCreationRequest;
        namespace Responses {
            export type $200 = Components.Responses.$201Created;
            export type $400 = Components.Responses.$400Invalid;
        }
    }
}
