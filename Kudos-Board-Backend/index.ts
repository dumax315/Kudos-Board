import { PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const prisma = new PrismaClient()

const app: Express = express();
const port = process.env.PORT || 3000;

// ts setup from https://blog.logrocket.com/how-to-set-up-node-typescript-express/
async function main() {
    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript Server");
    });

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
