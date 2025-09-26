require('dotenv').config()

const PORT = process.env.PORT || 3003

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI || 'mongodb+srv://fulstack:testing123@cluster0.rl8qyp8.mongodb.net/blogTest?retryWrites=true&w=majority&appName=Cluster0'
  : process.env.MONGODB_URI || 'mongodb+srv://fulstack:testing123@cluster0.rl8qyp8.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'

module.exports = {
  MONGODB_URI,
  PORT
}