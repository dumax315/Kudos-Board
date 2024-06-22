import { prisma } from "./globalPrismaClient"
import bcrypt from 'bcryptjs'
import { Prisma, User } from "@prisma/client";
import createError from 'http-errors'

import jwt from "./jwt"
import { SignInData } from "../types";


class AuthService {

    static async register(data: Prisma.UserCreateInput) {
        // const { email } = data;
        if(data.password == null) throw createError.Unauthorized('Password not valid')
        data.password = bcrypt.hashSync(data.password!, 8);
        let user = await prisma.user.create({
            data
        })

        const accessToken = await jwt.signAccessToken(user);

        return {...data, accessToken};
    }
    static async login(data: SignInData) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw createError.NotFound('User not registered')
        }
        const checkPassword = bcrypt.compareSync(password, user.password!)
        if (!checkPassword) throw createError.Unauthorized('Email address or password not valid')
        user.password = null
        const accessToken = await jwt.signAccessToken(user)
        return { ...user, accessToken }
    }
    static async all() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }
}

export default AuthService;
