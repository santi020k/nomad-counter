import { faker } from '@faker-js/faker'

const provider = faker.lorem.word()

const mockUser = {
  access_token: faker.string.uuid(),
  refresh_token: faker.string.uuid(),
  expires_in: faker.number.int(),
  expires_at: faker.number.int(),
  token_type: faker.lorem.word(),
  user: {
    name: faker.person.fullName(),
    avatar: faker.image.avatar(),
    id: faker.string.uuid(),
    app_metadata: {
      provider,
      providers: [provider]
    },
    user_metadata: {
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      email: faker.internet.email()
    },
    aud: faker.lorem.word(),
    email: faker.internet.email(),
    created_at: faker.date.past().toString()
  }
}

export default mockUser
