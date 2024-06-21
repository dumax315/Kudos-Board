import { Prisma, User } from '@prisma/client'
import express, { ErrorRequestHandler, Express, Request, Response } from "express";
import cors from 'cors';

import { prisma } from "./auth/globalPrismaClient"

import createError from 'http-errors'
import auth from "./auth/auth"

import jwt from "./auth/jwt"

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
    posts: true,
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

app.use(express.json())

app.use(cors())

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(401).json(
        {
            "status": 401,
            "error": "ERR-AUTH-001",
            "message": err.message,
            "detail": "Ensure that the username entered is correct"
        }
    )
};

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.get("/boards", async (req: Request, res: Response) => {
    let options: Prisma.BoardFindManyArgs = {
        select,
    };
    if (req.query.category) {
        options.where = {
            ...options.where,
            category: {
                equals: req.query.category,
            },
        } as Prisma.BoardWhereInput
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
});

app.post('/boards', async (req: Request, res: Response) => {
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
    if (req.headers.authorization && req.headers.authorization.split(' ')[1]) {
        // The the user data associated with the user token
        const responce = await jwt.verifyAccessToken(req.headers.authorization.split(' ')[1]);
        const userData = (responce as { payload: { id: number, email: string } }).payload;

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
})

app.get("/board/:boardId", async (req: Request, res: Response) => {
    const boardId = parseInt(req.params.boardId)
    const boards = await prisma.board.findUnique({
        where: <Prisma.BoardWhereUniqueInput>{
            id: boardId,
        },
        select: select,
    })
    res.json(boards)
});

app.delete("/board/:boardId", async (req: Request, res: Response) => {
    const boardId = parseInt(req.params.boardId)
    const boards = await prisma.board.delete({
        where: <Prisma.BoardWhereUniqueInput>{
            id: boardId,
        },
        select: select,
    })
    res.send("success")
});

app.get("/board/:boardId/posts", async (req: Request, res: Response, next) => {
    const boardId = parseInt(req.params.boardId)
    const board = await prisma.board.findUnique({
        where: <Prisma.BoardWhereUniqueInput>{
            id: boardId,
        },
        select: selectOnlyPosts,
    })
    if (board == null) {
        return next(new Error('Board not found'))
    }
    res.json(board.posts)
});



app.post('/board/:boardId', async (req: Request, res: Response) => {
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
    if (req.headers.authorization) {
        console.log(req.headers.authorization)
        // Check to see if an auth is set and a token was sent
        if (req.headers.authorization.split(' ')[1]) {
            // The the user data associated with the user token
            const responce = await jwt.verifyAccessToken(req.headers.authorization.split(' ')[1]);
            const userData = (responce as { payload: { id: number, email: string } }).payload;
            console.log(userData)
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
    }

    const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data,
        select: selectOnlyPosts,
    })
    res.json(updatedBoard.posts)
})

app.post('/register', async (req, res, next) => {
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
            res.status(401).json(
                {
                    "status": 401,
                    "error": "ERR-AUTH-001",
                    "message": e.message,
                }
            )
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
            res.status(401).json(
                {
                    "status": 401,
                    "error": "ERR-AUTH-001",
                    "message": e.message,
                }
            )
        }
    }
})

app.get("/verifyAccessToken", async (req, res, next) => {
    if (!req.headers.authorization) {
        return next(createError.Unauthorized('Access token is required'))
    }
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
        return next(createError.Unauthorized())
    }
    const user = await jwt.verifyAccessToken(token);

    res.send(user);
})

// TODO: incorporate prisma.$disconnect()

module.exports = app;
