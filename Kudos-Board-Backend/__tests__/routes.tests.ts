import { Prisma } from "@prisma/client"
import {SignInData} from "../types"


const request = require('supertest')
const app = require('../server')

const date = new Date();
const testDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();

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
  it('should return success', async () => {
    const randomBoardData: Prisma.BoardCreateInput = {
      title: `Test Board ${testDate}`,
      imageUrl: "https://picsum.photos/200",
      description: "a board created by the automated tests",
      category: "test",
    };
    const res = await request(app).post('/boards').send(randomBoardData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', '')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.findIndex((value: any) => value.title === `Test Board ${testDate}`)).toBeGreaterThanOrEqual(0);
  })
})

// varifies that the new board was added
describe('GET /boards', () => {
  it('should return a list of boards including the new board', async () => {
    const res = await request(app).get('/boards')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.findIndex((value: any) => value.title === `Test Board ${testDate}`)).toBeGreaterThanOrEqual(0);
  })
})

// Gets all of the posts on the board with id 1
describe('GET /board/:id', () => {
  it('should return a list of posts', async () => {
    const res = await request(app).get('/board/1')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})

// Gets all of the posts on the board with id 1
describe('GET /board/:id/posts', () => {
  it('should return a list of posts', async () => {
    const res = await request(app).get('/board/1/posts')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
  })
})

// adds a post to board with id 1 and ensure that the response includes the new board
describe('POST /board/:id', () => {
  it('should return a list of boards including the new board', async () => {
    const randomPostData: Prisma.PostCreateInput = {
      title: "Test Post " + testDate,
      imageUrl: "https://picsum.photos/200",
      description: "a post created by the automated tests",
    };
    const res = await request(app).post('/board/1').send(randomPostData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', '')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Array)
    expect(res.body.findIndex((value: any) => value.title === `Test Post ${testDate}`)).toBeGreaterThanOrEqual(0);
  })
})

const testUserName = "testUser" + date.getMilliseconds()%100;

// adds new user
describe('POST /register', () => {
  it('should register a new user', async () => {
    const randomUserData: Prisma.UserCreateInput = {
      email: `${testUserName}@fake.com`,
      password: `${testUserName}password`,
      name: testUserName
    };
    const res = await request(app).post('/register').send(randomUserData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})

// Logs in the new user
describe('POST /login', () => {
  it('should register a new user', async () => {
    const randomUserData: SignInData = {
      email: `${testUserName}@fake.com`,
      password: `${testUserName}password`,
    };
    const res = await request(app).post('/login').send(randomUserData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(Object)
  })
})
