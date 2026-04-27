export interface Bindings {
  DB: D1Database
  ALLOWED_ORIGIN?: string
  ALLOWED_ORIGINS?: string
  NOMAD_LOGIN_SECRET?: string
  SESSION_COOKIE_NAME?: string
}

export interface Variables {
  userId: string
  userEmail: string
}
