export type Role = 'user' | 'admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: Role
  phoneNumber?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface UpdateUserInput {
  email?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthPayload {
  token: string
  user: User
}
