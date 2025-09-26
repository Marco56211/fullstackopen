const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let authToken = ''

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  
  // Create a test user for authentication
  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  await user.save()
  
  // Login to get token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'password123' })
  
  authToken = loginResponse.body.token
  
  await Blog.insertMany(initialBlogs)
})

describe('blog api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct amount of blog posts are returned', async () => {
    const response = await api.get('/api/blogs')
    
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('unique identifier property of blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    
    const blog = response.body[0]
    assert(blog.id !== undefined, 'id property should be defined')
    assert(blog._id === undefined, '_id property should not be defined')
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Testing with SuperTest',
      author: 'Test Author',
      url: 'http://testurl.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length + 1)

    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert(titles.includes('Testing with SuperTest'))
  })

  test('blog post content is saved correctly', async () => {
    const newBlog = {
      title: 'Content Verification Test',
      author: 'Content Author',
      url: 'http://contenttest.com',
      likes: 3
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    assert.strictEqual(savedBlog.title, newBlog.title)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.url, newBlog.url)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
    assert(savedBlog.id !== undefined)
  })

  test('likes property defaults to 0 if missing from request', async () => {
    const newBlog = {
      title: 'Test Blog Without Likes',
      author: 'Test Author',
      url: 'http://testblog.com'
      // likes property is intentionally missing
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = response.body
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5
      // title property is missing
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      likes: 5
      // url property is missing
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'No Auth',
      url: 'http://unauthorized.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect(response => {
        assert(response.body.error.includes('token invalid'))
      })
  })

  test('adding a blog fails with 401 Unauthorized if token is invalid', async () => {
    const newBlog = {
      title: 'Invalid Token Blog',
      author: 'Invalid Token',
      url: 'http://invalid.com',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalidtoken123')
      .send(newBlog)
      .expect(401)
      .expect(response => {
        assert(response.body.error.includes('token invalid'))
      })
  })

  test('a blog can be deleted by its creator', async () => {
    // First create a blog with authentication
    const newBlog = {
      title: 'Blog to be deleted',
      author: 'Test Author', 
      url: 'http://tobedeleted.com',
      likes: 1
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = blogResponse.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('deleting a blog with invalid id returns 404', async () => {
    const invalidId = '507f1f77bcf86cd799439011'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404)
  })

  test('deleting a blog fails with 401 if no token provided', async () => {
    // First create a blog
    const newBlog = {
      title: 'Blog to test unauthorized delete',
      author: 'Test Author',
      url: 'http://testunauth.com',
      likes: 1
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = blogResponse.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
      .expect(response => {
        assert(response.body.error.includes('token invalid'))
      })
  })

  test('deleting a blog fails with 401 if token is invalid', async () => {
    // First create a blog
    const newBlog = {
      title: 'Blog to test invalid token delete',
      author: 'Test Author',
      url: 'http://testinvalidtoken.com',
      likes: 1
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = blogResponse.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'Bearer invalidtoken123')
      .expect(401)
      .expect(response => {
        assert(response.body.error.includes('token invalid'))
      })
  })

  test('deleting a blog fails with 403 if user is not the creator', async () => {
    // Create a second user
    const passwordHash = await bcrypt.hash('password456', 10)
    const secondUser = new User({
      username: 'seconduser',
      name: 'Second User',
      passwordHash
    })
    await secondUser.save()

    // Login as second user
    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'seconduser', password: 'password456' })

    const secondUserToken = loginResponse.body.token

    // First user creates a blog
    const newBlog = {
      title: 'Blog by first user',
      author: 'First User',
      url: 'http://firstuser.com',
      likes: 1
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = blogResponse.body

    // Second user tries to delete first user's blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${secondUserToken}`)
      .expect(403)
      .expect(response => {
        assert(response.body.error.includes('only the creator can delete this blog'))
      })
  })

  test('updating the likes of a blog post', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
    assert.strictEqual(response.body.id, blogToUpdate.id)
  })

  test('updating a blog with invalid id returns 404', async () => {
    const invalidId = '507f1f77bcf86cd799439011'
    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://updated.com',
      likes: 10
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})