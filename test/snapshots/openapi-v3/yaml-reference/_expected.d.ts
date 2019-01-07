declare namespace Paths {
    namespace A {
        namespace Post {
            namespace Parameters {
                export type Aa = string;
            }
            export interface QueryParameters {
                aa?: Parameters.Aa;
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
        }
    }
}
