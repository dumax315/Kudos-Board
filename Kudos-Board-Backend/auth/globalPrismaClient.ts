import { PrismaClient } from '@prisma/client'

const globalClient = new PrismaClient()

export const prisma = globalClient;
