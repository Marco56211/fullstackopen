import { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({ title, author, url }) // call parent
    setTitle('')
    setAuthor('')
    setUrl('')
    setVisible(false)
  }

  if (!visible) {
    return <button onClick={() => setVisible(true)}>Create blog post</button>
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          title:
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={() => setVisible(false)}>
          cancel
        </button>
      </form>
    </div>
  )
}

export default CreateBlogForm
