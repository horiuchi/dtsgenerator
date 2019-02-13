declare namespace Components {
    namespace Schemas {
        export interface DataGroup {
            items?: Group[];
        }
        export interface DataGroupSpec {
            items?: GroupSpec[];
        }
        /**
         * A specification for creating a new group
         */
        export interface Group {
            name?: string;
            /**
             * The source of this group
             */
            source?: string;
            /**
             * ID of the group in the source. Only applicable if source is specified. The combination of source and sourceId must be unique.
             */
            sourceId?: string;
            permissions?: PermissionsDTO;
            capabilities?: Group.Properties.Capabilities;
            id?: number; // int64
            isDeleted?: boolean;
            deletedTime?: number; // int64
        }
        namespace Group {
            namespace Properties {
                /**
                 * Capability
                 */
                export type Capabilities = ({
                    /**
                     * Acl:Group
                     */
                    groupsAcl?: {
                        actions?: ("LIST" | "READ" | "CREATE" | "UPDATE" | "DELETE")[];
                        /**
                         * Group:Scope
                         */
                        scope?: {
                            /**
                             * all groups
                             */
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        } | {
                            /**
                             * groups the current user is in
                             */
                            currentuserscope?: Capabilities.Items.OneOf.$4.Properties.UsersAcl.Properties.Scope.OneOf.$1.Properties.Currentuserscope;
                        };
                    };
                } | {
                    /**
                     * Acl:Asset
                     */
                    assetsAcl?: {
                        actions?: ("READ" | "WRITE")[];
                        /**
                         * Asset:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:Event
                     */
                    eventsAcl?: {
                        actions?: ("READ" | "WRITE")[];
                        /**
                         * Event:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:File
                     */
                    filesAcl?: {
                        actions?: ("READ" | "WRITE")[];
                        /**
                         * File:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:User
                     */
                    usersAcl?: {
                        actions?: ("LIST" | "CREATE" | "DELETE")[];
                        /**
                         * User:Scope
                         */
                        scope?: {
                            /**
                             * all users
                             */
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        } | {
                            /**
                             * the current user making the request
                             */
                            currentuserscope?: {
                            };
                        };
                    };
                } | {
                    /**
                     * Acl:Project
                     */
                    projectsAcl?: {
                        actions?: ("LIST" | "READ" | "CREATE" | "UPDATE")[];
                        /**
                         * Project:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:SecurityCategory
                     */
                    securityCategoriesAcl?: {
                        actions?: ("MEMBEROF" | "LIST" | "CREATE" | "DELETE")[];
                        /**
                         * SecurityCategory:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:Raw
                     */
                    rawAcl?: {
                        actions?: ("READ" | "WRITE" | "LIST")[];
                        /**
                         * Raw:Scope
                         */
                        scope?: {
                            /**
                             * Scope:All
                             */
                            all?: {
                            };
                        };
                    };
                } | {
                    /**
                     * Acl:Timeseries
                     */
                    timeSeriesAcl?: {
                        actions?: ("READ" | "WRITE")[];
                        /**
                         * Timeseries:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        } | {
                            /**
                             * Scope:AssetIdScope
                             */
                            assetIdScope?: {
                                /**
                                 * root asset id (subtrees)
                                 */
                                subtreeIds?: string /* uint64 */ [];
                            };
                        };
                    };
                } | {
                    /**
                     * Acl:Apikey
                     */
                    apikeysAcl?: {
                        actions?: ("LIST" | "CREATE" | "DELETE")[];
                        /**
                         * Apikey:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        } | {
                            /**
                             * apikeys the user making the request has
                             */
                            currentuserscope?: Capabilities.Items.OneOf.$4.Properties.UsersAcl.Properties.Scope.OneOf.$1.Properties.Currentuserscope;
                        };
                    };
                } | {
                    /**
                     * Acl:Threed
                     */
                    threedAcl?: {
                        actions?: ("READ" | "CREATE" | "UPDATE" | "DELETE")[];
                        /**
                         * Threed:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:Sequences
                     */
                    sequencesAcl?: {
                        actions?: ("READ" | "WRITE")[];
                        /**
                         * Sequences:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                } | {
                    /**
                     * Acl:Analytics
                     */
                    analyticsAcl?: {
                        actions?: ("READ" | "EXECUTE" | "LIST")[];
                        /**
                         * Analytics:Scope
                         */
                        scope?: {
                            all?: Capabilities.Items.OneOf.$7.Properties.RawAcl.Properties.Scope.Properties.All;
                        };
                    };
                })[];
                namespace Capabilities {
                    namespace Items {
                        namespace OneOf {
                            namespace $4 {
                                namespace Properties {
                                    namespace UsersAcl {
                                        namespace Properties {
                                            namespace Scope {
                                                namespace OneOf {
                                                    namespace $1 {
                                                        namespace Properties {
                                                            /**
                                                             * the current user making the request
                                                             */
                                                            export interface Currentuserscope {
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            namespace $7 {
                                namespace Properties {
                                    namespace RawAcl {
                                        namespace Properties {
                                            namespace Scope {
                                                namespace Properties {
                                                    /**
                                                     * Scope:All
                                                     */
                                                    export interface All {
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        export interface GroupResponse {
            data?: DataGroup;
        }
        /**
         * A specification for creating a new group
         */
        export interface GroupSpec {
            name?: string;
            /**
             * The source of this group
             */
            source?: string;
            /**
             * ID of the group in the source. Only applicable if source is specified. The combination of source and sourceId must be unique.
             */
            sourceId?: string;
            permissions?: PermissionsDTO;
            capabilities?: Group.Properties.Capabilities;
        }
        /**
         * Permissions determine the access types of a group, and alternatively also the assets a group has access to.
         */
        export interface PermissionsDTO {
            /**
             * READ, WRITE, RAW_READ or ADMIN.
             */
            accessTypes?: ("READ" | "WRITE" | "ADMIN" | "RAW_READ")[];
            /**
             * List of IDs of assets the group should have access to.
             */
            assetIds?: number /* int64 */ [];
            securityCategoryIds?: number /* int64 */ [];
        }
    }
}
declare namespace Paths {
    namespace GetGroupsV06 {
        namespace Parameters {
            export type All = boolean;
            export type Project = string;
        }
        export interface PathParameters {
            project: Parameters.Project;
        }
        export interface QueryParameters {
            all?: Parameters.All;
        }
        namespace Responses {
            export type $200 = Components.Schemas.GroupResponse;
        }
    }
}
