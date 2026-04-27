export const initScrollReveal = () => {
  const revealElement = (el: HTMLElement) => {
    if (el.hasAttribute('data-stagger')) {
      const step = Number(el.dataset.stagger) || 60

      ;(Array.from(el.children) as HTMLElement[]).forEach((child, i) => {
        child.style.transitionDelay = `${i * step}ms`

        child.classList.add('is-visible')
      })
    } else {
      el.classList.add('is-visible')
    }

    scrollObserver.unobserve(el)
  }

  const scrollObserver = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          revealElement(entry.target as HTMLElement)
        }
      }
    }, { threshold: 0, rootMargin: '0px 0px -80px 0px' }
  )

  const observeAll = () => {
    document.querySelectorAll<HTMLElement>('[data-animate], [data-stagger]').forEach(el => {
      scrollObserver.observe(el)
    })
  }

  // Double-rAF: first frame sets the CSS hiding state; second frame observes so transitions fire.
  document.documentElement.setAttribute('data-scroll-reveal', 'ready')

  requestAnimationFrame(() => {
    requestAnimationFrame(observeAll)
  })
}
