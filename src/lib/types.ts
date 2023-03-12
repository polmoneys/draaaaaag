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
