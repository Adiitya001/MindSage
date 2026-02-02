// API client utilities for making authenticated requests
import { auth } from "@/lib/firebase/client"

export interface ApiError {
  error: string
  details?: any
}

/**
 * Get the current Firebase ID token for authenticated requests
 * This function waits for auth to be ready if needed
 */
async function getIdToken(): Promise<string | null> {
  try {
    // Only run on client side
    if (typeof window === "undefined") {
      return null
    }

    // Check if auth is available
    if (!auth) {
      console.warn("Firebase auth not initialized")
      return null
    }

    // Wait for auth to be ready (auth.currentUser might be null initially)
    // Firebase Auth maintains auth.currentUser, so we can check it directly
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      // Try waiting a bit for auth state to initialize (max 1 second)
      // This handles the case where auth.currentUser is null but user is actually authenticated
      await new Promise((resolve) => setTimeout(resolve, 100))
      if (!auth.currentUser) {
        return null
      }
    }

    // Get a fresh token (force refresh to ensure it's valid)
    const token = await auth.currentUser.getIdToken()
    return token
  } catch (error) {
    console.error("Error getting ID token:", error)
    return null
  }
}

/**
 * Make an authenticated API request
 * @param endpoint - The API endpoint
 * @param options - Request options
 * @param providedToken - Optional token to use instead of getting from auth.currentUser
 * @param requireAuth - Whether this endpoint requires authentication (default: auto-detect)
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  providedToken?: string | null,
  requireAuth?: boolean
): Promise<T> {
  // Determine if auth is required
  let needsAuth = requireAuth
  
  if (needsAuth === undefined) {
    // Auto-detect based on endpoint and method
    const method = (options.method || "GET").toUpperCase()
    
    // All /api/me endpoints require auth
    if (endpoint.startsWith("/api/me")) {
      needsAuth = true
    }
    // POST/PATCH/DELETE to /api/community require auth (GET is public)
    else if (endpoint.startsWith("/api/community") && method !== "GET") {
      needsAuth = true
    }
    // All /api/community/[id]/* paths require auth
    else if (endpoint.match(/\/api\/community\/[^/]+/)) {
      needsAuth = true
    }
    // POST/PATCH/DELETE to /api/therapists require auth (GET is public)
    else if (endpoint.startsWith("/api/therapists") && method !== "GET") {
      needsAuth = true
    }
    // GET /api/community and GET /api/therapists are public
    else {
      needsAuth = false
    }
  }
  
  // Get token for the request
  // Priority: providedToken (if valid) > getIdToken() (if needed) > null
  let token: string | null = null
  
  if (providedToken && typeof providedToken === "string" && providedToken.length > 0) {
    // Use provided token if it's a valid non-empty string
    token = providedToken
  } else if (needsAuth) {
    // For protected endpoints, always try to get token from auth if not provided or invalid
    token = await getIdToken()
  } else if (providedToken !== undefined) {
    // For public endpoints, use provided token as-is (even if null)
    token = providedToken
  } else {
    // For public endpoints without provided token, try to get one (optional)
    token = await getIdToken()
  }
  
  // For protected endpoints, ensure we have a valid token
  if (needsAuth && (!token || typeof token !== "string" || token.length === 0)) {
    const error = new Error("Authentication required")
    ;(error as any).status = 401
    throw error
  }
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add auth token to headers if available
  // For protected endpoints, this is required (enforced above)
  // For public endpoints, this is optional
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

  // Handle empty responses
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

/**
 * GET request
 * @param endpoint - The API endpoint
 * @param token - Optional token to use instead of getting from auth.currentUser
 * @param requireAuth - Whether this endpoint requires authentication (default: auto-detect)
 */
export async function apiGet<T>(
  endpoint: string,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" }, token, requireAuth)
}

/**
 * POST request
 * @param endpoint - The API endpoint
 * @param data - The request body data
 * @param token - Optional token to use instead of getting from auth.currentUser
 * @param requireAuth - Whether this endpoint requires authentication (default: auto-detect)
 */
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

/**
 * PATCH request
 * @param endpoint - The API endpoint
 * @param data - The request body data
 * @param token - Optional token to use instead of getting from auth.currentUser
 * @param requireAuth - Whether this endpoint requires authentication (default: auto-detect)
 */
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

/**
 * DELETE request
 * @param endpoint - The API endpoint
 * @param token - Optional token to use instead of getting from auth.currentUser
 * @param requireAuth - Whether this endpoint requires authentication (default: auto-detect)
 */
export async function apiDelete<T>(
  endpoint: string,
  token?: string | null,
  requireAuth?: boolean
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "DELETE" }, token, requireAuth)
}
