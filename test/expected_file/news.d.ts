declare module schema {
  /**
   * News data API
   */
  export interface INews {
    id?: number;
    title: string;
    time: string;
    detail: string;
    imageUrl?: string; // uri
    detailUrl?: string; // uri
    createdAt?: string; // date-time
    updatedAt?: string; // date-time
  }
}
