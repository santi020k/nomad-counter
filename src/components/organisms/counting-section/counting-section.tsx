import { type FC, memo } from 'react'

import FormCountingSection from '@organisms/counting-section/form-counting-section'
// import ListCountingSection from '@organisms/counting-section/list-counting-section'

interface CountingSectionProps {
  t: Record<string, string>
}

const CountingSection: FC<CountingSectionProps> = ({ t }) => (
  <section id="calc" className="container mx-auto flex flex-col flex-wrap items-center justify-center py-40">
    <FormCountingSection t={t} />
    {/* <ListCountingSection /> */}
  </section>
)

export default memo(CountingSection)
