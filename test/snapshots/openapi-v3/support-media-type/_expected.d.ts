declare namespace Components {
    namespace RequestBodies {
        export type UploadFileMultipartRequest = string; // binary
        export type UploadFileStreamRequest = string; // binary
    }
    namespace Responses {
        export type $200ReturnData = Schemas.Data[];
        export type $200ReturnString = string;
        export type $400BadRequest = Schemas.Error;
        export type $403Forbidden = Schemas.Error;
        export type $500Error = Schemas.Error;
        export type $501Error = Schemas.ErrorImage /* binary */;
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
        export type ErrorImage = string; // binary
        export type ErrorText = string;
        export interface Request {
            name?: string;
            value?: string;
        }
    }
}
declare namespace Paths {
    namespace FifthPath {
        namespace Get {
            namespace Responses {
                export type $200 = Components.Responses.$200ReturnString;
            }
        }
    }
    namespace FourthPath {
        namespace Post {
            export type RequestBody = Components.Schemas.Request;
            namespace Responses {
                export type $200 = Components.Responses.$200ReturnData;
            }
        }
    }
    namespace Path {
        namespace Post {
            namespace Parameters {
                export type Age = number;
                export type Name = string;
            }
            export interface QueryParameters {
                name?: Parameters.Name;
                age?: Parameters.Age;
            }
            namespace Responses {
                export type $200 = Components.Responses.$200ReturnData;
                export type $400 = Components.Responses.$400BadRequest;
                export type $403 = Components.Responses.$403Forbidden;
                export type $500 = Components.Responses.$500Error;
                export type $501 = Components.Responses.$501Error;
                export type $502 = Components.Responses.$502Error;
            }
        }
    }
    namespace SecondPath {
        namespace Post {
            export type RequestBody = Components.RequestBodies.UploadFileStreamRequest /* binary */;
            namespace Responses {
                export type $200 = Components.Responses.$200ReturnData;
            }
        }
    }
    namespace ThirdPath {
        namespace Post {
            export type RequestBody = Components.RequestBodies.UploadFileMultipartRequest /* binary */;
            namespace Responses {
                export type $200 = Components.Responses.$200ReturnData;
            }
        }
    }
}
