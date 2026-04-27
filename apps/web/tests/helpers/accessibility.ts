import { AxeBuilder } from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

interface AllowedViolation {
  htmlIncludes?: string
  id: string
  targetIncludes?: string
}

const matchesAllowedNode = (
  node: { html: string, target: readonly unknown[] },
  allowedViolation: AllowedViolation
) => {
  const matchesHtml = allowedViolation.htmlIncludes ?
    node.html.includes(allowedViolation.htmlIncludes) :
    true

  const { targetIncludes } = allowedViolation

  const matchesTarget = targetIncludes ?
    node.target.some(target => String(target).includes(targetIncludes)) :
    true

  return matchesHtml && matchesTarget
}

type ConfigureAxe = (builder: AxeBuilder) => AxeBuilder

/**
 * Runs axe-core after finite CSS animations settle (avoids false color-contrast
 * from mid-fade compositing), then fails if any violation remains outside the
 * optional allowlist.
 */
export const expectNoUnexpectedAccessibilityViolations = async (
  page: Page,
  allowedViolations: AllowedViolation[] = [],
  configureAxe?: ConfigureAxe
) => {
  await page.evaluate(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => {
      resolve()
    })))

    const finiteAnimations = document.getAnimations().filter(
      animation => animation.effect?.getTiming().iterations !== Infinity
    )

    await Promise.all(finiteAnimations.map(animation => animation.finished.catch(() => undefined)))

    // Force all animated elements to be visible for the accessibility scan
    document.querySelectorAll('[data-animate], [data-stagger] > *').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '1'
        el.style.transform = 'none'
        el.style.transition = 'none'
        el.classList.add('is-visible')
      }
    })
  })

  let builder = new AxeBuilder({ page })

  builder = configureAxe ? configureAxe(builder) : builder

  const accessibilityScanResults = await builder.analyze()

  const unexpectedViolations = accessibilityScanResults.violations.flatMap(violation => {
    const unexpectedNodes = violation.nodes.filter(
      node => !allowedViolations.some(
        allowedViolation => violation.id === allowedViolation.id && matchesAllowedNode(node, allowedViolation)
      )
    )

    if (unexpectedNodes.length === 0) {
      return []
    }

    return [{ ...violation, nodes: unexpectedNodes }]
  })

  expect(unexpectedViolations).toEqual([])
}
