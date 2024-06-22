import { Prisma, User } from '@prisma/client'
import express, { Express, NextFunction, Request, Response } from "express";
import cors from 'cors';

import { prisma } from "./auth/globalPrismaClient"
import { Unauthorized, NotFound, NotAcceptable } from 'http-json-errors'
import auth from "./auth/auth"

import jwt from "./auth/jwt"
import { errorHandler } from './errorMiddleware';

const app: Express = express();

// The defualt selection responces for getting a board. Used in get for /board/:boardId
const select: Prisma.BoardSelect = {
    title: true,
    createdAt: true,
    posts: false,
    imageUrl: true,
    id: true,
    description: true,
    category: true,
    author: {
        select: {
            name: true,
            password: false,
            email: false,
            id: true,
        },
    },
}

// The selection for getting only posts. Used in get for /board/:boardId/posts and post for /board/:boardId
const selectOnlyPosts: Prisma.BoardSelect = {
    title: false,
    createdAt: false,
    posts: {
        select: {
            upvotedUsers: true,
            id: true,
            title: true,
            imageUrl: true,
            description: true,
            authorId: true,
            boardId: true,
            author: true,
        }
    },
    imageUrl: false,
    id: false,
    description: false,
    category: false,
    author: {
        select: {
            name: true,
            password: false,
            email: false,
            id: true,
        },
    },
}

const validateUser = async (authHeader: string | undefined): Promise<[boolean, User | null]> => {
    try {
        if (!authHeader || !authHeader.split(' ')[1]) {
            return [false, null]
        }

        const userData = await jwt.verifyAccessToken(authHeader.split(' ')[1]);
        return [true, userData]
    }
    catch (e) {
        console.error(e)
        console.error("issue with validateUser")
        return [false, null]
    }

}

app.use(express.json())

app.use(cors())


/**
 * No data, can be used to check if the server is alive
 */
app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});


app.get("/boards", async (req: Request, res: Response, next: NextFunction) => {
    try {
        let options: Prisma.BoardFindManyArgs = {
            select,
        };
        if (req.query.category) {
            if (typeof req.query.category == "string" && req.query.category.startsWith("User")) {
                options.where = {
                    ...options.where,
                    authorId: {
                        equals: parseInt(req.query.category.split("User")[1]),
                    },
                } as Prisma.BoardWhereInput
            } else {
                options.where = {
                    ...options.where,
                    category: {
                        equals: req.query.category,
                    },
                } as Prisma.BoardWhereInput
            }
        }
        if (req.query.search) {
            options.where = {
                ...options.where,
                OR: [
                    {
                        title: {
                            contains: req.query.search,
                        }
                    },
                    {
                        description: {
                            contains: req.query.search,
                        }
                    },
                    {
                        // TODO: investigate why this doesn't seem to be working
                        author: {
                            name: {
                                contains: req.query.search,
                            }
                        }
                    }
                ] as Prisma.BoardWhereInput[],
            } as Prisma.BoardWhereInput
        }
        const sort = req.query.sort;
        if (sort) {
            switch (sort) {
                case 'Newest':
                    options.orderBy = {
                        createdAt: 'desc'
                    } as Prisma.BoardOrderByWithAggregationInput
                    break;
                case 'Oldest':
                    options.orderBy = {
                        createdAt: 'asc'
                    } as Prisma.BoardOrderByWithAggregationInput
                    break;
                case 'A-Z':
                    options.orderBy = {
                        title: 'desc'
                    } as Prisma.BoardOrderByWithAggregationInput
                    break;
                case 'Z-A':
                    options.orderBy = {
                        title: 'asc'
                    } as Prisma.BoardOrderByWithAggregationInput
                    break;
            }
        }
        const boards = await prisma.board.findMany(options);
        res.json(boards)
    } catch (error) {
        next(error);
    }
});

app.post('/boards', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, imageUrl, description, category, authorId } = req.body;
        let data: Prisma.BoardCreateInput = {
            title,
            imageUrl,
            description,
            "category": "none",
        }
        if (category) {
            data.category = category;
        }

        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (isAuthed && userData) {
            // Create a board that is connected the the user's id
            data.author = {
                connect: { id: userData.id },
            }
        }
        await prisma.board.create({
            data,
        })

        const boards = await prisma.board.findMany()
        res.json(boards)
    } catch (error) {
        next(error);
    }
})

app.get("/board/:boardId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = parseInt(req.params.boardId)
        const boards = await prisma.board.findUnique({
            where: <Prisma.BoardWhereUniqueInput>{
                id: boardId,
            },
            select: select,
        })
        res.json(boards)
    } catch (error) {
        next(error);
    }
});

app.delete("/board/:boardId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (isAuthed && userData) {
            // TODO: add check for whether the user is the author of the board
            const boardId = parseInt(req.params.boardId)
            const boards = await prisma.board.delete({
                where: <Prisma.BoardWhereUniqueInput>{
                    id: boardId,
                },
                select: select,
            })
            res.send("success");
        }
        else {
            return next(new Unauthorized("sign in to use this route"))
        }
    } catch (error) {
        next(error);
    }
});

app.get("/board/:boardId/posts", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = parseInt(req.params.boardId)
        const board = await prisma.board.findUnique({
            where: <Prisma.BoardWhereUniqueInput>{
                id: boardId,
            },
            select: selectOnlyPosts,
        })
        if (board == null) {
            return next(new NotFound('Board not found'))
        }
        res.json(board.posts)
    } catch (error) {
        next(error);
    }
});

app.get("/post/:postId/comments", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = parseInt(req.params.postId)
        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                Comments: true
            }
        })
        if (post == null) {
            return next(new NotFound('Board not found'))
        }
        res.json(post.Comments)
    } catch (error) {
        next(error);
    }
});

app.post("/post/:postId/comments", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postId = parseInt(req.params.postId)
        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (!(isAuthed && userData)) {
            return next(new Unauthorized("sign in to use this route"))
        }
        const { comment, signiture } = req.body;
        await prisma.commentsOnPosts.create({
            data: {
                assignedBy: signiture,
                assignedAt: new Date(),
                content: comment,
                post: {
                    connect: {
                        id: postId,
                    },
                },
                user: {
                    connect: {
                        id: userData.id,
                    },
                },
            }
        })
        res.send("success")
    } catch (error) {
        next(error);
    }
});

app.delete("/board/:boardId/posts/:postId", async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Check to see if an auth is set and a token was sent
        const [isAuthed,] = await validateUser(req.headers.authorization);
        if (!isAuthed) {
            return next(new Unauthorized("sign in to use this route"))
        }
        const postId = parseInt(req.params.postId);
        await prisma.post.delete({
            where: {
                id: postId,
            },
        })
        const boardId = parseInt(req.params.boardId);
        const board = await prisma.board.findUnique({
            where: <Prisma.BoardWhereUniqueInput>{
                id: boardId,
            },
            select: selectOnlyPosts,
        })
        if (board == null) {
            return res.status(401).send("failed")
        }
        res.json(board.posts)

    } catch (error) {
        next(error);
    }
});

app.post("/board/:boardId/posts/:postId/upvote", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = parseInt(req.params.boardId)
        const postId = parseInt(req.params.postId)

        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (!(isAuthed && userData)) {
            return next(new Unauthorized("sign in to use this route"))
        }
        try {
            await prisma.upvotesOnPosts.create({
                data: {
                    assignedBy: userData.name as string,
                    assignedAt: new Date(),
                    post: {
                        connect: {
                            id: postId,
                        },
                    },
                    user: {
                        connect: {
                            id: userData.id,
                        },
                    },
                }
            })
        }
        catch (e) {
            if (e instanceof Error) {
                return next(new NotAcceptable("already upvoted" + e.message))
            }
        }

        const updatedBoard = await prisma.board.findUnique({
            where: { id: boardId },
            select: selectOnlyPosts,
        })
        if (!updatedBoard) {
            return next(new NotFound("board Not found"))
        }
        res.json(updatedBoard.posts)
    } catch (error) {
        next(error);
    }
});

app.delete("/board/:boardId/posts/:postId/upvote", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = parseInt(req.params.boardId)
        const postId = parseInt(req.params.postId)

        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (!(isAuthed && userData)) {
            return next(new Unauthorized("sign in to use this route"))
        }
        try {
            await prisma.upvotesOnPosts.deleteMany({
                where: {
                    AND: [
                        {
                            postId: {
                                equals: postId,
                            },
                        },
                        {
                            userId: {
                                equals: userData.id,
                            }
                        },
                    ],
                }
            })
        }
        catch (error) {
            return next(error);
        }

        const updatedBoard = await prisma.board.findUnique({
            where: { id: boardId },
            select: selectOnlyPosts,
        })
        if (!updatedBoard) {
            return next(new NotFound("board Not found"))
        }
        res.json(updatedBoard.posts)
    } catch (error) {
        next(error);
    }
});



app.post('/board/:boardId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, imageUrl, description } = req.body
        const boardId = parseInt(req.params.boardId)
        let data: Prisma.BoardUpdateInput = {
            posts: {
                create: <Prisma.PostCreateInput>{
                    title: title,
                    imageUrl: imageUrl,
                    description: description
                },
            },
        }
        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);
        if (isAuthed && userData) {
            data = {
                posts: {
                    create: <Prisma.PostCreateInput>{
                        title: title,
                        imageUrl: imageUrl,
                        description: description,
                        author: {
                            connect: { id: userData.id },
                        }
                    },
                },
            }
        }
        const updatedBoard = await prisma.board.update({
            where: { id: boardId },
            data,
            select: selectOnlyPosts,
        })
        res.json(updatedBoard.posts)
    } catch (error) {
        next(error);
    }
});

app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await auth.register(req.body);
        res.status(200).json({
            status: true,
            message: 'User created successfully',
            data: user
        })
    }
    catch (e) {
        if (e instanceof Error) {
            return next(new Unauthorized(e.message))
        }
    }

})

app.post("/login", async (req, res, next) => {
    try {
        const data = await auth.login(req.body)
        res.status(200).json({
            status: true,
            message: "Account login successful",
            data
        })
    }
    catch (e) {
        if (e instanceof Error) {
            return next(new Unauthorized(e.message))
        }
    }
})

app.get("/verifyAccessToken", async (req: Request, res: Response, next: NextFunction) => {
    try {

        // Check to see if an auth is set and a token was sent
        const [isAuthed, userData] = await validateUser(req.headers.authorization);

        if (!isAuthed) {
            return next(new Unauthorized('Access token is required'))
        }
        if (!userData) {
            return next(new Unauthorized('User not found'))
        }

        // removing tokens before sending data to the front end
        userData.tokens = [];

        res.send(userData);
    } catch (error) {
        next(error);
    }
})
app.use(errorHandler);

// TODO: incorporate prisma.$disconnect()

module.exports = app;
