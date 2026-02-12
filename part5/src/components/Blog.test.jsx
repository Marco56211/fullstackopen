import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { describe, test, expect, vi } from 'vitest'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const currentUser = {
    username: 'testuser',
    name: 'Test User'
  }

  test('renders title and author, but not URL or likes by default', () => {
    const mockHandler = vi.fn()

    const { container } = render(
      <Blog blog={blog} onLike={mockHandler} onDelete={mockHandler} user={currentUser} />
    )

    // Check that title and author are rendered
    const titleAuthor = container.querySelector('.blog-title-author')
    expect(titleAuthor).toHaveTextContent('Component testing is done with react-testing-library')
    expect(titleAuthor).toHaveTextContent('Test Author')

    // Check that URL and likes are not rendered by default
    const details = container.querySelector('.blog-details')
    expect(details).toBeNull()
  })

  test('URL and likes are shown when the view button is clicked', async () => {
    const mockHandler = vi.fn()

    const { container } = render(
      <Blog blog={blog} onLike={mockHandler} onDelete={mockHandler} user={currentUser} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    // Check that URL and likes are now visible
    const details = container.querySelector('.blog-details')
    expect(details).not.toBeNull()
    
    const url = container.querySelector('.blog-url')
    expect(url).toHaveTextContent('http://testurl.com')
    
    const likes = container.querySelector('.blog-likes')
    expect(likes).toHaveTextContent('5')
  })

  test('like button calls event handler twice when clicked twice', async () => {
    const mockHandler = vi.fn()

    render(
      <Blog blog={blog} onLike={mockHandler} onDelete={mockHandler} user={currentUser} />
    )

    const user = userEvent.setup()
    
    // First click the view button to show details
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Then click the like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Check that the event handler was called twice
    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})
