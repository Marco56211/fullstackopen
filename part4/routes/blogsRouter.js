const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
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
    
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
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
