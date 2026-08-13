import { describe, it, expect } from 'vitest'
import { User, Role } from '@/types/user'

describe('User Types', () => {
  it('should create a valid User object', () => {
    const user: User = {
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      createdAt: '2024-01-15T00:00:00.000Z',
      updatedAt: '2024-01-15T00:00:00.000Z'
    }

    expect(user.id).toBe('1')
    expect(user.email).toBe('john@example.com')
    expect(user.firstName).toBe('John')
    expect(user.lastName).toBe('Doe')
    expect(user.role).toBe('admin')
  })

  it('only allows user or admin as a role', () => {
    const roles: Role[] = ['user', 'admin']
    roles.forEach((role) => {
      expect(['user', 'admin']).toContain(role)
    })
  })
})
