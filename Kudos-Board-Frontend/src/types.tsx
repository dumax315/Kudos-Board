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

export type Comment = {
    postId:number,
    userId:number,
    assignedBy:string,
    content?:string,
}

export type PostWithAuthor = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    published: boolean;
    imageUrl: string;
    description: string;
    authorId: number | null;
    boardId: number | null;
    author: User | null;
    upvotedUsers: {
        postId:number,
        userId:number
    }[],
    comments?: Comment[],
}
