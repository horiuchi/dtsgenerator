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
