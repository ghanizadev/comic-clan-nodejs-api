export interface IPostPaginatedDTO {
    docs : {
        user : any;
        description: string;
        body: string;
        comments : string[];
        media?: string[];
        updatedAt?: string;
        createdAt?: string;
        _id: string;
        _v: number;
    },
    [key : string] : any
}
