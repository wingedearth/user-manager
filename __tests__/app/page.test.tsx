import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'

// Mock the default users data
vi.mock('@/data/defaultUsers', () => ({
  defaultUsers: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      createdAt: '2024-01-20'
    }
  ]
}))

describe('Home Page', () => {
  beforeEach(() => {
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('renders the user manager title', () => {
    render(<Home />)
    expect(screen.getByText('User Manager')).toBeInTheDocument()
  })

  it('displays the user table with default users', () => {
    render(<Home />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows add user form when Add New User button is clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const addButton = screen.getByRole('button', { name: 'Add New User' })
    await user.click(addButton)
    
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('can add a new user', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    // Open add form
    await user.click(screen.getByRole('button', { name: 'Add New User' }))
    
    // Fill form
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], 'Test User') // Name input
    await user.type(inputs[1], 'test@example.com') // Email input
    await user.selectOptions(screen.getByRole('combobox'), 'Manager')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: 'Add User' }))
    
    // Check if user was added
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
  })

  it('can cancel adding a user', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    // Open add form
    await user.click(screen.getByRole('button', { name: 'Add New User' }))
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    
    // Cancel form
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    
    // Form should be hidden
    expect(screen.queryAllByRole('textbox')).toHaveLength(0)
  })

  it('displays user count correctly', () => {
    render(<Home />)
    expect(screen.getByText('Users (2)')).toBeInTheDocument()
  })

  it('shows edit form when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])
    
    expect(screen.getByText('Edit User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('can delete a user with confirmation', async () => {
    const user = userEvent.setup()
    render(<Home />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])
    
    expect(vi.mocked(confirm)).toHaveBeenCalledWith('Are you sure you want to delete this user?')
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })
})
