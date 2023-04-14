import { ReactNode, RefObject } from 'react'

export interface Card {
  id: string
  content: string
}

export interface State<T> {
  data: T[]
  draggedIndex: number | null
  draggedOverIndex: number | null
}

export type Action<T> =
  | { type: 'SET_DRAGGED_INDEX'; index: number | null }
  | { type: 'SET_DRAGGED_OVER_INDEX'; index: number }
  | { type: 'REORDER_DATA' }
  | { type: 'REORDER_DATA_2' }
  | { type: 'UPDATE_INITIAL_DATA'; initialData: T[] }

export interface useDraggableProps {
  buffer?: number
  onCollision?: (collidingElement: HTMLElement | null) => void
  collisionRefs?: React.RefObject<HTMLElement>[]
  anticipate?: boolean
}

export interface DraggableBounds {
  top: number
  right: number
  bottom: number
  left: number
}

export interface DraggableProps {
  children?: ReactNode
  collisionRefs?: RefObject<HTMLElement>[]
  anticipate?: boolean
  onCollideIn?: (item: HTMLElement) => void
  onCollideOut?: () => void
}

export interface UseDistanceProps<T> {
  items: T[]
  containerRef: RefObject<HTMLElement>
  selector?: string
  distanceRange?: number
}
