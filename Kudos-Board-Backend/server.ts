import { Prisma } from '@prisma/client'
import express, { ErrorRequestHandler, Express, Request, Response } from "express";
import cors from 'cors';

import { prisma } from "./auth/globalPrismaClient"

import createError from 'http-errors'
import auth from "./auth/auth"

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
    const boards = await prisma.board.findMany()
    res.json(boards)
});

app.post('/boards', async (req: Request, res: Response) => {
    const { title, imageUrl, description, category } = req.body;
    let data: Prisma.BoardCreateInput = {
        title,
        imageUrl,
        description,
        "category": "none",
    }
    if (category) {
        data.category = category;
    }
    await prisma.board.create({
        data: data,
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
    res.json(board!.posts)
});



app.post('/board/:boardId', async (req: Request, res: Response) => {
    const { title, imageUrl, description } = req.body
    const boardId = parseInt(req.params.boardId)
    const updatedBoard = await prisma.board.update({
        where: { id: boardId },
        data: <Prisma.BoardUpdateInput>{
            posts: {
                create: <Prisma.PostCreateInput>{
                    title: title,
                    imageUrl: imageUrl,
                    description: description
                },
            },
        },
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

// TODO: incorporate prisma.$disconnect()

module.exports = app;
