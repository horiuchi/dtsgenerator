declare namespace JsonSchemaOrg {
    namespace Complex {
        /**
         * complex patterns
         */
        export interface Patterns {
            p: Patterns.Definitions.Primitives;
            pr: Patterns.Definitions.PrimitivesRequired;
            ut?: Patterns.Definitions.UnionTuple;
            at?: Patterns.Definitions.ArrayTypes;
            nt?: Patterns.Definitions.NestedTypes;
            ct?: /**
             * comment test type.
             * description comment.
             * example:
             *   obj = {
             *     p1: 'example',
             *     p2: true,
             *     p3: [ false, 1.23, 'tuple' ],
             *   }
             */
            Patterns.Definitions.CommentTest;
            ta?: Patterns.Definitions.TypeAlias;
            array?: Patterns.Definitions.TypeArray;
            const?: Patterns.Definitions.MathPi | Patterns.Definitions.IsDebug | Patterns.Definitions.IsTest | Patterns.Definitions.ProjectName;
        }
        namespace Patterns {
            namespace Definitions {
                export interface ArrayTypes {
                    strings?: string[];
                    numbers?: number[];
                    arrays?: string[][][];
                    array_of_array?: (string | string[])[];
                }
                /**
                 * comment test type.
                 * description comment.
                 * example:
                 *   obj = {
                 *     p1: 'example',
                 *     p2: true,
                 *     p3: [ false, 1.23, 'tuple' ],
                 *   }
                 */
                export interface CommentTest {
                    /**
                     * p1 is string type.
                     */
                    p1: string;
                    /**
                     * p2 is union types.
                     * example:
                     * true or 1 or 'string'
                     */
                    p2: boolean | string | number;
                    /**
                     * p3 is tuple types
                     * example:
                     * true
                     * 2.5
                     * p3
                     */
                    p3: [
                        boolean,
                        number,
                        string?,
                        ...any[]
                    ];
                }
                export type IsDebug = false;
                export type IsTest = true;
                export type MathPi = 3.1415926536;
                export interface NestedTypes {
                    first: {
                        second: {
                            third: {
                                [key: string]: any;
                            };
                        };
                    };
                }
                export interface Primitives {
                    any?: any;
                    array?: any[];
                    boolean?: boolean;
                    double?: number; // double
                    int?: number; // int
                    integer?: number;
                    null?: null;
                    number?: number;
                    object?: {
                        [key: string]: any;
                    };
                    string?: string;
                    undefined?: undefined;
                }
                export interface PrimitivesRequired {
                    any: any;
                    array: any[];
                    boolean: boolean;
                    double: number; // double
                    int: number; // int
                    integer: number;
                    null: null;
                    number: number;
                    object: {
                        [key: string]: any;
                    };
                    string: string;
                    undefined: undefined;
                }
                export type ProjectName = "dtsgenerator";
                export type TypeAlias = Primitives | PrimitivesRequired;
                export type TypeArray = {
                    a: string;
                    b?: string;
                    n?: {
                        c: number;
                    }[];
                }[];
                export interface UnionTuple {
                    s_tuple?: "A" | "B" | "C";
                    n_tuple?: 1 | 2 | 3 | 4 | 5;
                    some_types?: boolean | number | string;
                    ref_types?: Primitives | PrimitivesRequired;
                }
            }
        }
    }
}
