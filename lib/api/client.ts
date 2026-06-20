import { auth } from "@/lib/firebase/client"

export interface ApiError {
  error: string
  details?: any
}

async function getIdToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null
    if (!auth) {
      console.warn("Firebase auth not initialized")
      return null
    }
    const currentUser = auth.currentUser
    if (!currentUser) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!auth.currentUser) return null
    }
    return await auth.currentUser.getIdToken()
  } catch (error) {
    console.error("Error getting ID token:", error)
    return null
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  providedToken?: string | null,
  requireAuth?: boolean
): Promise<T> {
  let needsAuth = requireAuth
  if (needsAuth === undefined) {
    const method = (options.method || "GET").toUpperCase()
    if (endpoint.startsWith("/api/me")) needsAuth = true
    else if (endpoint.startsWith("/api/community") && method !== "GET") needsAuth = true
    else if (endpoint.match(/\/api\/community\/[^/]+/)) needsAuth = true
    else if (endpoint.startsWith("/api/therapists") && method !== "GET") needsAuth = true
    else needsAuth = false
  }
  let token: string | null = null
  if (providedToken && typeof providedToken === "string" && providedToken.length > 0) {
    token = providedToken
  } else if (needsAuth) {
    token = await getIdToken()
  } else if (providedToken !== undefined) {
    token = providedToken
  } else {
    token = await getIdToken()
  }
  if (needsAuth && (!token || typeof token !== "string" || token.length === 0)) {
    const error = new Error("Authentication required")
    ;(error as any).status = 401
    throw error
  }
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }
  if (token && typeof token === "string" && token.length > 0) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: ApiError
    try {
      errorData = await response.json()
    } catch {
      errorData = { error: `Request failed with status ${response.status}` }
    }
    const error = new Error(errorData.error || "API request failed")
    ;(error as any).status = response.status
    throw error
  }

  const text = await response.text()
  if (!text) {
    return null as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    return null as T
  }
}

export async function apiGet<T>(
  endpoint: string,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" }, token, requireAuth)
}

export async function apiPost<T>(
  endpoint: string,
  data?: any,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    },
    token,
    requireAuth
  )
}

export async function apiPatch<T>(
  endpoint: string,
  data: any,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token,
    requireAuth
  )
}

export async function apiDelete<T>(
  endpoint: string,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "DELETE" }, token, requireAuth)
}
