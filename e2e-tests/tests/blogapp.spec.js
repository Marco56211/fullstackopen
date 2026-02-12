const { test, expect, describe, beforeEach } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create blog post' }).click()
  const textboxes = page.getByRole('textbox')
  await textboxes.nth(0).fill(title)
  await textboxes.nth(1).fill(author)
  await textboxes.nth(2).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.locator('.blog-title-author').getByText(title)).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrongpassword')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'testpassword')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A blog created by Playwright', 'Playwright Author', 'http://playwright.dev')
      await expect(page.locator('.blog-title-author').getByText('A blog created by Playwright')).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test Blog Title', 'Test Blog Author', 'http://testblog.com')
      })

      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()

        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('the user who added the blog can delete it', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()

        page.on('dialog', dialog => dialog.accept())
        await page.getByRole('button', { name: 'DELETE BLOG' }).click()

        await expect(page.locator('.blog-title-author').getByText('Test Blog Title')).not.toBeVisible()
      })

      test('only the creator can see the delete button', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Other User',
            username: 'otheruser',
            password: 'otherpassword'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()

        await loginWith(page, 'otheruser', 'otherpassword')
        await expect(page.getByText('Other User logged in')).toBeVisible()

        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByText('Likes:')).toBeVisible()
        await expect(page.getByRole('button', { name: 'DELETE BLOG' })).not.toBeVisible()
      })
    })
  })
})
