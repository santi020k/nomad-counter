type IconName = 'chart' | 'globe' | 'mail' | 'more' | 'pulse' | 'route' | 'trash'

interface IconOptions {
  size?: number
  strokeWidth?: number
}

const strokeIcon = (body: string, { size = 20, strokeWidth = 1.75 }: IconOptions = {}) =>
  `<svg width="${String(size)}" height="${String(size)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${String(strokeWidth)}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

export const iconSvg = (name: IconName, options: IconOptions = {}): string => {
  if (name === 'chart') {
    return strokeIcon('<path d="M3 3v18h18" /><path d="M7 16l4-4 4 4 6-7" />', options)
  }

  if (name === 'globe') {
    return strokeIcon('<circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />', options)
  }

  if (name === 'mail') {
    return strokeIcon('<rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />', { size: 24, ...options })
  }

  if (name === 'more') {
    const size = options.size ?? 18

    return `<svg width="${String(size)}" height="${String(size)}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.75" /><circle cx="12" cy="12" r="1.75" /><circle cx="12" cy="19" r="1.75" /></svg>`
  }

  if (name === 'pulse') {
    return strokeIcon('<path d="M22 12h-6l-2 7-4-14-2 7H2" />', { size: 22, ...options })
  }

  if (name === 'trash') {
    return strokeIcon('<path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />', { size: 14, strokeWidth: 1.8, ...options })
  }

  return strokeIcon('<circle cx="12" cy="10" r="3" /><path d="M12 21.7V14" /><path d="M5 10a7 7 0 0 1 14 0c0 5-7 9-7 9s-7-4-7-9" />', options)
}
