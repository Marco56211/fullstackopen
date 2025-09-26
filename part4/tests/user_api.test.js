const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({ username: 'root', name: 'Superuser', passwordHash: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length + 1)

    const usernames = usersAtEnd.body.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    assert(result.body.error.includes('username must be unique'))

    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })

  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username and password are required'))

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password must be at least 3 characters long'))

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username must be at least 3 characters long'))

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'validuser',
      name: 'Valid User Name',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username and password are required'))

    const usersAtEnd = await api.get('/api/users')
    assert.strictEqual(usersAtEnd.body.length, usersAtStart.body.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})