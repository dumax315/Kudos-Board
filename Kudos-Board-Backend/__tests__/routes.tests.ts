import { Prisma } from "@prisma/client"

const request = require('supertest')
const app = require('../server.ts')

const date = new Date();
const testDate = date.toLocaleDateString() +" "+ date.toLocaleTimeString();

// gets all of the current boards and varifies that the responce is an array
describe('GET /boards', () => {
  it('should return a list of boards', async () => {
    const res = await request(app).get('/boards')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})

// adds a board and makes sure the responce includes the new board
describe('POST /boards', () => {
  it('should return a list of boards including the new board', async () => {
    const randomBoardData: Prisma.BoardCreateInput = {
      title: `Test Board ${testDate}`,
      imageUrl: "https://picsum.photos/200",
      description: "a board created by the automated tests",
      category: "test",
    };
    const res = await request(app).post('/boards').send(randomBoardData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.findIndex((value: any) => value.title ===  `Test Board ${testDate}` )).toBeGreaterThanOrEqual(0);
  })
})

// Gets all of the posts on the board with id 1
describe('GET /board/:id/posts', () => {
  it('should return a list of posts', async () => {
    const res = await request(app).get('/board/1/posts')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})

// adds a post to board with id 1 and ensure that the response includes the new board
describe('POST /board/:id/posts', () => {
  it('should return a list of boards including the new board', async () => {
    const randomPostData: Prisma.PostCreateInput = {
      title: "Test Post " + testDate,
      imageUrl: "https://picsum.photos/200",
      description: "a post created by the automated tests",
    };
    const res = await request(app).post('/board/1/posts').send(randomPostData)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
    const bodyObj = res.body as {posts:Array<Object>};
    expect(bodyObj.posts.findIndex((value: any) => value.title ===  `Test Post ${testDate}` )).toBeGreaterThanOrEqual(0);
  })
})
