import { faker } from '@faker-js/faker'

import { type UserData } from '@models/auth-model'

import { parseAuthSession } from '@utils/auth-session-utils'

export const provider = faker.lorem.word()

export const mockUser = Object.freeze({
  access_token: faker.string.uuid(),
  refresh_token: faker.string.uuid(),
  expires_in: faker.number.int(),
  expires_at: faker.number.int(),
  token_type: faker.lorem.word(),
  user: {
    name: faker.person.fullName(),
    avatar_url: faker.image.avatar(),
    id: faker.string.uuid(),
    app_metadata: {
      provider,
      providers: [provider]
    },
    user_metadata: {
      name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
      email: faker.internet.email()
    },
    aud: faker.lorem.word(),
    email: faker.internet.email(),
    created_at: faker.date.past().toString()
  }
})

export const parsedMockUser = Object.freeze(parseAuthSession(mockUser) as UserData)
