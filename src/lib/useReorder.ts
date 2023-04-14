import { useMemo, useReducer, DragEvent, TouchEvent } from 'react'
import { Action, State } from './types'

function useReorder<T>(
  initialData: T[],
  hoverClassName?: string,
  draggedClassName?: string,
): [
  T[],
  (index: number) => void,
  (event: DragEvent<HTMLLIElement>, index: number) => void,
  () => void,
  (index: number) => void,
  (event: TouchEvent<HTMLLIElement>, index: number) => void,
  () => void,
  (index: number) => string,
  (newInitialData: T[]) => void,
] {
  function reducer(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case 'SET_DRAGGED_INDEX':
        return { ...state, draggedIndex: action.index }
      case 'SET_DRAGGED_OVER_INDEX':
        return { ...state, draggedOverIndex: action.index }
      case 'REORDER_DATA':
        const newData = [...state.data]
        const [removed] = newData.splice(state.draggedIndex!, 1)
        newData.splice(state.draggedOverIndex!, 0, removed)
        return {
          data: newData,
          draggedIndex: state.draggedOverIndex!,
          draggedOverIndex: null,
        }
      case 'REORDER_DATA_2':
        const newData2 = [...state.data]
        const draggedItem = newData2[state.draggedIndex!]
        newData2.splice(state.draggedIndex!, 1)
        newData2.splice(state.draggedOverIndex!, 0, draggedItem)
        for (let i = 0; i < newData2.length; i++) {
          if (i === state.draggedOverIndex!) {
            continue
          }
          if (
            (i > state.draggedIndex! && i <= state.draggedOverIndex!) ||
            (i < state.draggedIndex! && i >= state.draggedOverIndex!)
          ) {
            const shift = i > state.draggedIndex! ? -1 : 1
            const shiftedIndex = i + shift
            const [removed] = newData2.splice(i, 1)
            newData2.splice(shiftedIndex, 0, removed)
          }
        }
        return {
          data: newData2,
          draggedIndex: state.draggedOverIndex!,
          draggedOverIndex: null,
        }
      case 'UPDATE_INITIAL_DATA':
        return {
          data: action.initialData,
          draggedIndex: null,
          draggedOverIndex: null,
        }

      default:
        throw new Error()
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    data: initialData,
    draggedIndex: null,
    draggedOverIndex: null,
  })

  const onDragStart = useMemo(
    () => (index: number) => {
      dispatch({ type: 'SET_DRAGGED_INDEX', index })
    },
    [],
  )
  const onDragOver = useMemo(
    () => (event: DragEvent<HTMLLIElement>, index: number) => {
      event.preventDefault()
      if (state.draggedIndex !== index) {
        dispatch({ type: 'SET_DRAGGED_OVER_INDEX', index })
      }
    },
    [state.draggedIndex],
  )

  const onDragEnd = useMemo(
    () => () => {
      if (state.draggedOverIndex === null) {
        dispatch({ type: 'SET_DRAGGED_INDEX', index: null })
      } else {
        dispatch({ type: 'REORDER_DATA' })
        // dispatch({ type: 'REORDER_DATA_2' })
      }
    },
    [state.draggedOverIndex],
  )

  const onTouchStart = useMemo(
    () => (index: number) => {
      dispatch({ type: 'SET_DRAGGED_INDEX', index })
    },
    [],
  )

  const onTouchMove = useMemo(
    () => (event: TouchEvent<HTMLLIElement>, index: number) => {
      const itemHeight = (event.target as any).offsetHeight
      const touchY = event.touches[0].clientY
      const newIndex = Math.floor((touchY - itemHeight / 2) / itemHeight)
      if (
        state.draggedIndex !== newIndex &&
        newIndex >= 0 &&
        newIndex < state.data.length
      ) {
        dispatch({ type: 'SET_DRAGGED_OVER_INDEX', index: newIndex })
      }
    },
    [state.draggedIndex, state.data.length],
  )

  const onTouchEnd = () => {
    if (state.draggedOverIndex !== null) {
      dispatch({ type: 'REORDER_DATA' })
    }
  }

  const getGridItemClassName = (index: number): string =>
    [
      index === state.draggedIndex && `${draggedClassName}`,
      index === state.draggedOverIndex && `${hoverClassName}`,
    ]
      .filter(Boolean)
      .join(' ')

  const onReset = (newInitialData: T[]) => {
    dispatch({ type: 'UPDATE_INITIAL_DATA', initialData: newInitialData })
  }

  return [
    state.data,
    onDragStart,
    onDragOver,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getGridItemClassName,
    onReset,
  ]
}

export default useReorder
