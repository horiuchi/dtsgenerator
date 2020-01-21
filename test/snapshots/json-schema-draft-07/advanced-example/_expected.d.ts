declare namespace SomeSiteSomewhere {
    /**
     * schema for an fstab entry
     */
    export interface EntrySchema {
        storage: EntrySchema.Definitions.DiskDevice | EntrySchema.Definitions.DiskUUID | EntrySchema.Definitions.Nfs | EntrySchema.Definitions.Tmpfs;
        fstype?: "ext3" | "ext4" | "btrfs";
        options?: string[];
        readonly?: boolean;
    }
    namespace EntrySchema {
        namespace Definitions {
            export interface DiskDevice {
                type: "disk";
                device: string; // ^/dev/[^/]+(/[^/]+)*$
            }
            export interface DiskUUID {
                type: "disk";
                label: string; // ^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$
            }
            export interface Nfs {
                type: "nfs";
                remotePath: string; // ^(/[^/]+)+$
                server: any /* hostname */ | any /* ipv4 */ | any /* ipv6 */;
            }
            export interface Tmpfs {
                type: "tmpfs";
                sizeInMB: number;
            }
        }
    }
}
