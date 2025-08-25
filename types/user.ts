export enum UserStatus {
    Active = 'active',
    Inactive = 'inactive'
}

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: UserStatus
  createdAt: string
}
