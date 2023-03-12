import { Card } from '@/lib/types'

export const cards: Card[] = [...Array(16)].map((_, pos) => ({
  id: `card-${pos}`,
  content: `Card ${pos}`,
}))

export const makeCards = (amount: number): Card[] =>
  [...Array(amount)].map((_, pos) => ({
    id: `card-${pos}`,
    content: `Card ${pos}`,
  }))

export const VariantOptions = ['grid', 'list', 'distance'] as const
export type Variants = (typeof VariantOptions)[number]
