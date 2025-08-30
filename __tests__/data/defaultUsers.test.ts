import { describe, it, expect } from 'vitest'
import { defaultUsers } from '@/data/defaultUsers'
import { UserStatus } from '@/types/user'

describe('Default Users Data', () => {
  it('should have 3 default users', () => {
    expect(defaultUsers).toHaveLength(3)
  })

  it('should have valid user structure', () => {
    defaultUsers.forEach(user => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('status')
      expect(user).toHaveProperty('createdAt')
      
      expect(typeof user.id).toBe('number')
      expect(typeof user.name).toBe('string')
      expect(typeof user.email).toBe('string')
      expect(typeof user.role).toBe('string')
      expect(Object.values(UserStatus)).toContain(user.status)
      expect(typeof user.createdAt).toBe('string')
    })
  })

  it('should have unique user IDs', () => {
    const ids = defaultUsers.map(user => user.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have valid email formats', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    defaultUsers.forEach(user => {
      expect(user.email).toMatch(emailRegex)
    })
  })
})
