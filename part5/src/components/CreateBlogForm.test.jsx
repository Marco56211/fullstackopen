import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'
import { describe, test, expect, vi } from 'vitest'

describe('<CreateBlogForm />', () => {
  test('form calls event handler with the right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateBlogForm createBlog={createBlog} />)

    // Click the button to show the form
    const showFormButton = screen.getByText('Create blog post')
    await user.click(showFormButton)

    // Fill in the form inputs
    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]

    await user.type(titleInput, 'Testing forms with react-testing-library')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://testurl.com')

    // Submit the form
    const createButton = screen.getByText('create')
    await user.click(createButton)

    // Check that the event handler was called with the right details
    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Testing forms with react-testing-library',
      author: 'Test Author',
      url: 'http://testurl.com'
    })
  })
})
