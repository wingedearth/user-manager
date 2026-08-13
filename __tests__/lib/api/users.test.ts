import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createUser,
  deleteUser,
  demoteUser,
  getUsers,
  promoteUser,
  updateUser,
} from '@/lib/api/users'
import { User } from '@/types/user'

const sampleUser: User = {
  id: '1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  createdAt: '2024-01-15T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

function mockFetchResponse(data: unknown, errors?: unknown[]) {
  return {
    json: async () => ({ data, errors }),
  } as Response
}

describe('lib/api/users', () => {
  const token = 'test-token'

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_UNITED_API_URL', 'http://localhost:4000/graphql')
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('getUsers sends an authorized request and returns users', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({ users: [sampleUser] }))

    const users = await getUsers(token)

    expect(users).toEqual([sampleUser])
    const [url, options] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('http://localhost:4000/graphql')
    expect(options?.headers).toMatchObject({ Authorization: `Bearer ${token}` })
  })

  it('createUser posts the input and returns the created user', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({ createUser: sampleUser }))

    const result = await createUser(
      { email: sampleUser.email, password: 'secret', firstName: 'John', lastName: 'Doe' },
      token
    )

    expect(result).toEqual(sampleUser)
    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(options?.body as string)
    expect(body.variables.input.email).toBe(sampleUser.email)
  })

  it('updateUser sends id and input variables', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({ updateUser: sampleUser }))

    await updateUser('1', { firstName: 'Johnny' }, token)

    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(options?.body as string)
    expect(body.variables.id).toBe('1')
    expect(body.variables.input.firstName).toBe('Johnny')
  })

  it('deleteUser sends the id variable', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({ deleteUser: { id: '1' } }))

    await deleteUser('1', token)

    const [, options] = vi.mocked(fetch).mock.calls[0]
    const body = JSON.parse(options?.body as string)
    expect(body.variables.id).toBe('1')
  })

  it('promoteUser and demoteUser call their respective mutations', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockFetchResponse({ promoteUser: { ...sampleUser, role: 'admin' } })
    )
    const promoted = await promoteUser('1', token)
    expect(promoted.role).toBe('admin')

    vi.mocked(fetch).mockResolvedValueOnce(mockFetchResponse({ demoteUser: sampleUser }))
    const demoted = await demoteUser('1', token)
    expect(demoted.role).toBe('user')
  })

  it('throws a GraphQLRequestError when the response contains errors', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      mockFetchResponse(null, [{ message: 'Authentication required' }])
    )

    await expect(getUsers(token)).rejects.toThrow('Authentication required')
  })
})
