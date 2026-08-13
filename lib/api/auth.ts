import { graphqlRequest } from '@/lib/graphqlClient'
import { AuthPayload, LoginInput } from '@/types/user'

const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
        phoneNumber
        createdAt
        updatedAt
      }
    }
  }
`

export async function login(input: LoginInput): Promise<AuthPayload> {
  const data = await graphqlRequest<{ login: AuthPayload }>(LOGIN_MUTATION, { input })
  return data.login
}
