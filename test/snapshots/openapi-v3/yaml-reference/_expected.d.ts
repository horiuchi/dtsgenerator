declare namespace Paths {
    namespace A {
        namespace Post {
            namespace Parameters {
                export type Aa = string;
            }
            export interface QueryParameters {
                aa?: Parameters.Aa;
            }
            export interface RequestBody {
            }
            namespace Responses {
                export interface $200 {
                }
            }
        }
    }
    namespace B {
        namespace Post {
            namespace Parameters {
                export type Aa = string;
            }
            export interface QueryParameters {
                aa?: Parameters.Aa;
            }
            export interface RequestBody {
            }
            namespace Responses {
                export interface $200 {
                }
            }
        }
    }
}
