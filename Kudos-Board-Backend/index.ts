import { Prisma, PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const prisma = new PrismaClient()

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/boards", async (req: Request, res: Response) => {
  const boards = await prisma.board.findMany()
  res.json(boards)
});

app.post('/boards', async (req: Request, res: Response) => {
  console.log(req.body)
  const { title, imageUrl } = req.body
  await prisma.board.create({
    data: <Prisma.BoardCreateInput> {
      title,
      imageUrl
    },
  })
  const boards = await prisma.board.findMany()
  res.json(boards)
})

app.get("/board/:boardId/posts", async (req: Request, res: Response) => {
  const boardId = parseInt(req.params.boardId)
  const boards = await prisma.board.findUnique({
    where: <Prisma.BoardWhereUniqueInput> {
      id: boardId,
    },
    select: <Prisma.BoardSelect> {
      title: true,
      createdAt: true,
      posts: true,
      imageUrl: true,
      id: true,
    },
  })
  res.json(boards)
});

app.post('/board/:boardId/posts', async (req: Request, res: Response) => {
  const { title, imageUrl } = req.body
  const boardId = parseInt(req.params.boardId)
  const updatedBoard = await prisma.board.update({
    where: { id: boardId },
    data: <Prisma.BoardUpdateInput>  {
      posts: {
        create: <Prisma.PostCreateInput> {
          title: title,
          imageUrl: imageUrl,
        },
      },
    },
  })
  res.json(updatedBoard)
})

// express ts setup from https://blog.logrocket.com/how-to-set-up-node-typescript-express/
async function main() {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

module.exports = app;
