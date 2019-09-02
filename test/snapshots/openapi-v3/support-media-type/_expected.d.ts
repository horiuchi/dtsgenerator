declare namespace Components {
    namespace Responses {
        export type BadRequest = Schemas.Error;
        export type Error = Schemas.Error;
        export type Forbidden = Schemas.Error;
        export type ReturnData = Schemas.Data[];
    }
    namespace Schemas {
        export interface Data {
            name: string;
            description: string;
        }
        export interface Error {
            code: number;
            description: string;
        }
        export interface Request {
            name?: string;
            value?: string;
        }
    }
}
declare namespace Paths {
    namespace Path {
        namespace Post {
            namespace Responses {
                export type $200 = Components.Responses.ReturnData;
                export type $400 = Components.Responses.BadRequest;
                export type $403 = Components.Responses.Forbidden;
                export type $500 = Components.Responses.Error;
            }
        }
    }
}
