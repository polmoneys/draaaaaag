import { Card } from '@/lib/types'

interface InertElement extends HTMLElement {
  inert: boolean
}

export const inertMain = (status = true): void => {
  const main = document?.querySelector('main')
  if (main != null) (main as InertElement).inert = status
}

export const cards: Card[] = [...Array(16)].map((_, pos) => ({
  id: `card-${pos}`,
  content: `Card ${pos}`,
}))

export const makeCards = (amount: number): Card[] =>
  [...Array(amount)].map((_, pos) => ({
    id: `card-${pos}`,
    content: `Card ${pos}`,
  }))

export const VariantOptions = [
  'grid',
  'list',
  // 'distance',
  'drag',
] as const
export type Variants = (typeof VariantOptions)[number]
