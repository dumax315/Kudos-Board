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

export type PostWithAuthor = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    published: boolean;
    imageUrl: string;
    description: string;
    upvotes: number;
    authorId: number | null;
    boardId: number | null;
    author: User | null;
}
