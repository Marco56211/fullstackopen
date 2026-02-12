import { useState } from 'react'

const Blog = ({ blog, onLike, onDelete, user }) => {
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => setVisible((prev) => !prev)

  const [currentLikes, setCurrentLikes] = useState(blog.likes ?? 0)

  const handleClick = () => {
    setCurrentLikes((cur) => cur + 1)
    onLike()
  }

  const handleDelete = () => {
    console.log('delete button clicked')
    onDelete(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  console.log('blog.id', blog.id)

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div className="blog-details">
          <div className="blog-url">URL: {blog.url}</div>
          <div className="blog-likes">
            Likes: {currentLikes} <button onClick={handleClick}>like</button>
          </div>
          {user && blog.user && user.username === (blog.user.username || blog.user) && (
            <div>
              <button onClick={handleDelete}>DELETE BLOG</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
