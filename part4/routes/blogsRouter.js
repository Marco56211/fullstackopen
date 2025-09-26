const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  try {
    const { title, url } = request.body
    
    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }
    
    // Get user from request object
    const user = request.user
    
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

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    // Get user from request object
    const user = request.user
    
    const blogToDelete = await Blog.findById(request.params.id)
    
    if (!blogToDelete) {
      return response.status(404).json({ error: 'blog not found' })
    }
    
    // Check if the blog has a user assigned (handle legacy blogs)
    if (!blogToDelete.user) {
      return response.status(403).json({ error: 'this blog has no owner and cannot be deleted' })
    }
    
    // Check if the user is the creator of the blog
    if (blogToDelete.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: 'only the creator can delete this blog' })
    }
    
    // Remove the blog from the user's blogs array
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()
    
    await Blog.findByIdAndDelete(request.params.id)
    
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
