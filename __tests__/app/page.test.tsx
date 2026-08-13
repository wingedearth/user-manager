import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import { User } from '@/types/user'

const sampleUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
]

vi.mock('@/lib/api/users', () => ({
  getUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  promoteUser: vi.fn(),
  demoteUser: vi.fn(),
}))

vi.mock('@/lib/api/auth', () => ({
  login: vi.fn(),
}))

import { getUsers, createUser, deleteUser, promoteUser, demoteUser } from '@/lib/api/users'
import { login } from '@/lib/api/auth'

describe('Home Page', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    window.localStorage.clear()
    vi.mocked(getUsers).mockResolvedValue(sampleUsers)
    vi.mocked(createUser).mockReset()
    vi.mocked(deleteUser).mockReset()
    vi.mocked(promoteUser).mockReset()
    vi.mocked(demoteUser).mockReset()
    vi.mocked(login).mockReset()
  })

  it('shows the login form when there is no stored session', () => {
    render(<Home />)
    expect(screen.getByText('Sign in to User Manager')).toBeInTheDocument()
  })

  it('logs in and displays the user table', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockResolvedValue({ token: 'test-token', user: sampleUsers[0] })

    render(<Home />)

    await user.type(screen.getByLabelText('Email'), 'john@example.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument())
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(getUsers).toHaveBeenCalledWith('test-token')
  })

  describe('when authenticated', () => {
    beforeEach(() => {
      window.localStorage.setItem('userManager.token', 'test-token')
      window.localStorage.setItem('userManager.user', JSON.stringify(sampleUsers[0]))
    })

    it('displays the user table with fetched users', async () => {
      render(<Home />)

      await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument())
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('Users (2)')).toBeInTheDocument()
    })

    it('can add a new user', async () => {
      const user = userEvent.setup()
      const newUser: User = {
        id: '3',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user',
        createdAt: '2024-02-01',
        updatedAt: '2024-02-01',
      }
      vi.mocked(createUser).mockResolvedValue(newUser)

      render(<Home />)
      await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: 'Add New User' }))
      await user.type(screen.getByLabelText('First Name'), 'Test')
      await user.type(screen.getByLabelText('Last Name'), 'User')
      await user.type(screen.getByLabelText('Email'), 'test@example.com')
      await user.type(screen.getByLabelText('Password'), 'secret123')
      await user.click(screen.getByRole('button', { name: 'Add User' }))

      await waitFor(() => expect(screen.getByText('test@example.com')).toBeInTheDocument())
      expect(createUser).toHaveBeenCalled()
    })

    it('can delete a user with confirmation', async () => {
      const user = userEvent.setup()
      vi.mocked(deleteUser).mockResolvedValue(undefined)

      render(<Home />)
      await waitFor(() => expect(screen.getByText('John')).toBeInTheDocument())

      const deleteButtons = screen.getAllByText('Delete')
      await user.click(deleteButtons[0])

      expect(vi.mocked(confirm)).toHaveBeenCalledWith('Are you sure you want to delete this user?')
      await waitFor(() => expect(screen.queryByText('John')).not.toBeInTheDocument())
      expect(deleteUser).toHaveBeenCalledWith('1', 'test-token')
    })

    it('promotes a user when the role is changed to admin in the edit form', async () => {
      const user = userEvent.setup()
      const promoted: User = { ...sampleUsers[1], role: 'admin' }
      vi.mocked(promoteUser).mockResolvedValue(promoted)

      render(<Home />)
      await waitFor(() => expect(screen.getByText('Jane')).toBeInTheDocument())

      const editButtons = screen.getAllByText('Edit')
      await user.click(editButtons[1]) // Jane's row

      await user.selectOptions(screen.getByLabelText('Role'), 'admin')
      await user.click(screen.getByRole('button', { name: 'Update User' }))

      await waitFor(() => expect(promoteUser).toHaveBeenCalledWith('2', 'test-token'))
      expect(demoteUser).not.toHaveBeenCalled()
    })
  })
})
