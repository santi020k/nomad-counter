import { type FC, memo } from 'react'

import FormCountingSection from '@organisms/counting-section/form-counting-section'
// import ListCountingSection from '@organisms/counting-section/list-counting-section'

interface CountingSectionProps {
  t: Record<string, string>
}

const CountingSection: FC<CountingSectionProps> = ({ t }) => (
  <>
    <div id="calc" className='relative top-[-128px] sm:top-[-97px]' />
    <section className="container mx-auto flex flex-col flex-wrap items-center justify-center py-[100px]">
      <FormCountingSection t={t} />
      {/* <ListCountingSection /> */}
    </section>
  </>
)

export default memo(CountingSection)
