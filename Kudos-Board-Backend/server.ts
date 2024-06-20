import { Prisma, PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from "express";
import cors from 'cors';

const prisma = new PrismaClient()

const app: Express = express();

// The defualt selection responces for getting a board. Used in get and post for /board/:boardId/posts
const select: Prisma.BoardSelect = {
    title: true,
    createdAt: true,
    posts: true,
    imageUrl: true,
    id: true,
    description: true,
    category: true,
}

app.use(express.json())

app.use(cors())

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

app.get("/board/:boardId/posts", async (req: Request, res: Response) => {
    const boardId = parseInt(req.params.boardId)
    const boards = await prisma.board.findUnique({
        where: <Prisma.BoardWhereUniqueInput>{
            id: boardId,
        },
        select: select,
    })
    res.json(boards)
});

app.post('/board/:boardId/posts', async (req: Request, res: Response) => {
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
        select: select,
    })
    res.json(updatedBoard)
})

// TODO: incorporate prisma.$disconnect()

module.exports = app;
