import { graphqlRequest } from '@/lib/graphqlClient'
import { CreateUserInput, UpdateUserInput, User } from '@/types/user'

const USER_FIELDS = `
  id
  email
  firstName
  lastName
  role
  phoneNumber
  createdAt
  updatedAt
`

const GET_USERS_QUERY = `
  query Users {
    users {
      ${USER_FIELDS}
    }
  }
`

const CREATE_USER_MUTATION = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ${USER_FIELDS}
    }
  }
`

const UPDATE_USER_MUTATION = `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      ${USER_FIELDS}
    }
  }
`

const DELETE_USER_MUTATION = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`

const PROMOTE_USER_MUTATION = `
  mutation PromoteUser($id: ID!) {
    promoteUser(id: $id) {
      ${USER_FIELDS}
    }
  }
`

const DEMOTE_USER_MUTATION = `
  mutation DemoteUser($id: ID!) {
    demoteUser(id: $id) {
      ${USER_FIELDS}
    }
  }
`

export async function getUsers(token: string): Promise<User[]> {
  const data = await graphqlRequest<{ users: User[] }>(GET_USERS_QUERY, undefined, token)
  return data.users
}

export async function createUser(input: CreateUserInput, token: string): Promise<User> {
  const data = await graphqlRequest<{ createUser: User }>(CREATE_USER_MUTATION, { input }, token)
  return data.createUser
}

export async function updateUser(
  id: string,
  input: UpdateUserInput,
  token: string
): Promise<User> {
  const data = await graphqlRequest<{ updateUser: User }>(
    UPDATE_USER_MUTATION,
    { id, input },
    token
  )
  return data.updateUser
}

export async function deleteUser(id: string, token: string): Promise<void> {
  await graphqlRequest<{ deleteUser: { id: string } }>(DELETE_USER_MUTATION, { id }, token)
}

export async function promoteUser(id: string, token: string): Promise<User> {
  const data = await graphqlRequest<{ promoteUser: User }>(PROMOTE_USER_MUTATION, { id }, token)
  return data.promoteUser
}

export async function demoteUser(id: string, token: string): Promise<User> {
  const data = await graphqlRequest<{ demoteUser: User }>(DEMOTE_USER_MUTATION, { id }, token)
  return data.demoteUser
}
