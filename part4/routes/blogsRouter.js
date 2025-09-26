const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const { title, url } = request.body
    
    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }
    
    // Find any user from the database to assign as creator
    const user = await User.findOne({})
    if (!user) {
      return response.status(400).json({ error: 'no users in database' })
    }
    
    const blog = new Blog({
      ...request.body,
      user: user._id
    })
    
    const savedBlog = await blog.save()
    
    // Add the blog to the user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    // Populate the user information in the response
    await savedBlog.populate('user', { username: 1, name: 1 })
    
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    
    if (!deletedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    
    response.status(204).end()
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, 
      request.body, 
      { new: true, runValidators: true }
    )
    
    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogsRouter
