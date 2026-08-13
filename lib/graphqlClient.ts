export class GraphQLRequestError extends Error {
  constructor(message: string, public errors: unknown[]) {
    super(message)
    this.name = 'GraphQLRequestError'
  }
}

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_UNITED_API_URL
  if (!url) {
    throw new Error(
      'NEXT_PUBLIC_UNITED_API_URL is not set. Run via `npm run dev:local` or `npm run dev:remote`.'
    )
  }
  return url
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  const json = await response.json()

  if (json.errors && json.errors.length > 0) {
    throw new GraphQLRequestError(json.errors[0].message ?? 'GraphQL request failed', json.errors)
  }

  return json.data as T
}
