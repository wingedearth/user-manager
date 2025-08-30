import { describe, it, expect } from 'vitest'
import { User, UserStatus } from '@/types/user'

describe('User Types', () => {
  it('should have correct UserStatus enum values', () => {
    expect(UserStatus.Active).toBe('active')
    expect(UserStatus.Inactive).toBe('inactive')
  })

  it('should create a valid User object', () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: UserStatus.Active,
      createdAt: '2024-01-15'
    }

    expect(user.id).toBe(1)
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john@example.com')
    expect(user.role).toBe('Admin')
    expect(user.status).toBe(UserStatus.Active)
    expect(user.createdAt).toBe('2024-01-15')
  })
})
