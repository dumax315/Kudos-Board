export interface User {
    email: string,
    id: number,
    name: string,
    token: string,
}

export type BoardWithAuthor = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    imageUrl: string;
    published: boolean;
    authorId: number | null;
    category: string;
    author: User | null;
}
