import { Prisma } from "@prisma/client"
import { SignInData } from "../types"


const request = require('supertest')
const app = require('../server')

const date = new Date();
const testDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();

describe('unAuthenticated /board/:id', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).delete('/board/2').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})

describe('unAuthenticated Post /post/:id/comments', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).post('/post/3/comments').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})

describe('unAuthenticated Delete /board/:boardId/posts/:postId', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).delete('/board/5/posts/2').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})

describe('unAuthenticated Post /board/:boardId/posts/:postId/upvote', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).post('/board/4/posts/3/upvote').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})

describe('unAuthenticated Delete /board/:boardId/posts/:postId/upvote', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).delete('/board/4/posts/3/upvote').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})

describe('unAuthenticated Get /verifyAccessToken', () => {
    it('should return an error due to not being authecentated', async () => {
        const res = await request(app).get('/verifyAccessToken').send()
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(res.statusCode).toEqual(401)
    })
})
