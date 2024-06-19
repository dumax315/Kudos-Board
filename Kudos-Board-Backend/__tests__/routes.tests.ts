import { Prisma } from "@prisma/client"

const request = require('supertest')
const app = require('../index.ts')

const date = new Date();
const testDate = date.toLocaleDateString() + date.toLocaleTimeString();

describe('GET /boards', () => {
  it('should return a list of boards', async () => {
    const res = await request(app).get('/boards')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})

describe('POST /boards', () => {
  it('should return a list of boards including the new board', async () => {
    const randomBoardData: Prisma.BoardCreateInput = {
      title: "Test Board " + testDate,
      imageUrl: "https://picsum.photos/200",
    };
    const res = await request(app).post('/boards').send(randomBoardData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})

describe('GET /board/:id/posts', () => {
  it('should return a list of posts', async () => {
    const res = await request(app).get('/board/1/posts')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})

describe('POST /board/:id/posts', () => {
  it('should return a list of boards including the new board', async () => {
    const randomBoardData: Prisma.PostCreateInput = {
      title: "Test Post " + testDate,
      imageUrl: "https://picsum.photos/200",
    };
    const res = await request(app).post('/board/1/posts').send(randomBoardData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})
