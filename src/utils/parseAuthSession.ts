import { UserAuthSchema, UserDataSchema, type UserData } from '@models/auth-model'

export const parseAuthSession = (session: unknown): UserData | undefined => {
  const result = UserAuthSchema.safeParse(session)

  if (session === null) return undefined

  if (result?.success) {
    const { user: { user_metadata: userMetadata } } = result.data
    const splitNames = userMetadata?.name?.split(' ')
    const splitFirstName = splitNames?.[0]?.split('') ?? ''
    const splitLastName = splitNames?.[1]?.split('') ?? ''
    const shortName = `${splitFirstName?.[0] ?? ''}${splitLastName?.[0] ?? ''}`

    const userDataSchema = UserDataSchema.safeParse({
      isSignIn: true,
      name: userMetadata?.name,
      email: userMetadata?.email,
      avatar: userMetadata?.avatar_url,
      shortName,
      initialLetter: splitFirstName?.[0] ?? ''
    })

    if (userDataSchema.success) {
      return userDataSchema.data
    }
  }

  return undefined
}
