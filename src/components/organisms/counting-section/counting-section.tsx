import { type FC, memo, type ReactNode } from 'react'

import FormCountingSection from '@organisms/counting-section/form-counting-section'
import ListCountingSection from '@organisms/counting-section/list-counting-section'

import useAuthStore from '@store/use-auth-store'

interface CountingSectionProps {
  t: Record<string, string>
  children: ReactNode
}

const CountingSection: FC<CountingSectionProps> = ({ t, children }) => {
  const { user } = useAuthStore(state => state)

  return (
    <section
      id="calc"
      className="container mx-auto flex min-h-screen flex-col flex-wrap items-center justify-center gap-[144px] py-40"
    >
      <FormCountingSection t={t} />

      {user?.isSignIn
        ? <ListCountingSection />
        : children }
      {/* <ListCountingSection /> */}
    </section>
  )
}

export default memo(CountingSection)
