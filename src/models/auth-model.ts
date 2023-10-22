import * as z from 'zod'

export const DataSchema = z.object({
  avatar_url: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  full_name: z.string(),
  iss: z.string(),
  name: z.string(),
  picture: z.string(),
  provider_id: z.string(),
  sub: z.string()
})
export type Data = z.infer<typeof DataSchema>

export const IdentitySchema = z.object({
  id: z.string(),
  user_id: z.string(),
  identity_data: DataSchema,
  provider: z.string(),
  last_sign_in_at: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
})
export type Identity = z.infer<typeof IdentitySchema>

export const AppMetadataSchema = z.object({
  provider: z.string(),
  providers: z.array(z.string())
})
export type AppMetadata = z.infer<typeof AppMetadataSchema>

export const UserSchema = z.object({
  id: z.string(),
  aud: z.string(),
  role: z.string(),
  email: z.string(),
  email_confirmed_at: z.coerce.date(),
  phone: z.string(),
  confirmed_at: z.coerce.date(),
  last_sign_in_at: z.coerce.date(),
  app_metadata: AppMetadataSchema,
  user_metadata: DataSchema,
  identities: z.array(IdentitySchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
})
export type User = z.infer<typeof UserSchema>

export const UserAuthSchema = z.object({
  provider_token: z.string(),
  provider_refresh_token: z.string(),
  access_token: z.string(),
  expires_in: z.number(),
  expires_at: z.number(),
  refresh_token: z.string(),
  token_type: z.string(),
  user: UserSchema
})
export type UserAuth = z.infer<typeof UserAuthSchema>
