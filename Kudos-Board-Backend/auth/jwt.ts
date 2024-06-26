import jwt from 'jsonwebtoken'
import { InternalServerError, Unauthorized } from 'http-json-errors'
import 'dotenv/config'
import { User } from '@prisma/client';
import { prisma } from "./globalPrismaClient"

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET ? process.env.ACCESS_TOKEN_SECRET : "ACCESS_TOKEN_SECRET";
export default {
    signAccessToken(payload: User) {
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, accessTokenSecret, {
            }, async (err, token) => {
                if (err) {
                    reject(new InternalServerError())
                }
                await prisma.user.update({
                    where: {
                        id: payload.id,
                    },
                    data: {
                        tokens: {
                            push: token,
                        },
                    },
                })
                resolve(token)
            })
        })
    },
    verifyAccessToken(token: string): Promise<User> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, async (err, payload) => {
                if (err) {
                    const message = err.name == 'JsonWebTokenError' ? 'Unauthorized' : err.message
                    return reject(new Unauthorized(message))
                }if(!payload){
                    return reject(new Unauthorized("unknown issue with payload data form jwt"))
                }
                const userData = (payload as { payload: User }).payload;
                const tokens = await prisma.user.findUnique({
                    where: {
                        id: userData.id,
                    },
                    select: {
                        tokens: true
                    }
                })
                if(!tokens){
                    return reject(new Unauthorized("JWT not valid"))
                }
                if(!tokens.tokens.includes(token)){
                    return reject(new Unauthorized("JWT not valid"))
                }
                resolve(userData)
            })
        })
    }
}
