declare namespace Components {
    namespace Responses {
        export type $200ReturnData = Schemas.Data[];
        export type $400BadRequest = Schemas.Error;
        export type $403Forbidden = Schemas.Error;
        export type $500Error = Schemas.Error;
        export type $502Error = Schemas.ErrorText;
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
        export type ErrorText = string;
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
                export type $200 = Components.Responses.$200ReturnData;
                export type $400 = Components.Responses.$400BadRequest;
                export type $403 = Components.Responses.$403Forbidden;
                export type $500 = Components.Responses.$500Error;
                export type $502 = Components.Responses.$502Error;
            }
        }
    }
}
