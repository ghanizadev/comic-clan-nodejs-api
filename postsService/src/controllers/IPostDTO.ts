export interface IPostDTO {
    userId: string;
    description: string;
    body: string;
    comments?: string[];
    media?: string[];
    updatedAt?: string;
    createdAt?: string;
    _id: string;
    _v: number;
}
