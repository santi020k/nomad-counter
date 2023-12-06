import * as z from 'zod'

export const DataSchema = z.object({
  avatar_url: z.string().optional(),
  email: z.string().optional(),
  email_verified: z.boolean().optional(),
  full_name: z.string().optional(),
  iss: z.string().optional(),
  name: z.string().optional(),
  picture: z.string().optional(),
  provider_id: z.string().optional(),
  sub: z.string().optional()
}).optional()
export type Data = z.infer<typeof DataSchema>

export const IdentitySchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  identity_data: DataSchema,
  provider: z.string().optional(),
  last_sign_in_at: z.coerce.date().optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).optional()
export type Identity = z.infer<typeof IdentitySchema>

export const AppMetadataSchema = z.object({
  provider: z.string(),
  providers: z.array(z.string())
}).optional()
export type AppMetadata = z.infer<typeof AppMetadataSchema>

export const UserSchema = z.object({
  id: z.string().optional(),
  aud: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  email_confirmed_at: z.coerce.date().optional(),
  phone: z.string().optional(),
  confirmed_at: z.coerce.date().optional(),
  last_sign_in_at: z.coerce.date().optional(),
  app_metadata: AppMetadataSchema,
  user_metadata: DataSchema,
  identities: z.array(IdentitySchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional()
}).optional()
export type User = z.infer<typeof UserSchema>

export const UserAuthSchema = z.object({
  provider_token: z.string().optional(),
  provider_refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_in: z.number().optional(),
  expires_at: z.number().optional(),
  refresh_token: z.string().optional(),
  token_type: z.string().optional(),
  user: UserSchema
})
export type UserAuth = z.infer<typeof UserAuthSchema>

export const UserDataSchema = z.object({
  isSignIn: z.boolean().optional(),
  name: z.string(),
  email: z.string(),
  avatar: z.string()?.optional(),
  shortName: z.string()?.optional(),
  initialLetter: z.string()?.optional()
})
export type UserData = z.infer<typeof UserDataSchema>
