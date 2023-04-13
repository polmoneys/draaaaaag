import { Dispatch, SetStateAction, useEffect } from 'react'
import { useControls, folder, button } from 'leva'
import { useReorder } from '@/lib'
import { cards, makeCards, Variants } from './utils'
import { Card } from '@/lib/types'

interface Props {
  setter: Dispatch<SetStateAction<Variants>>
}

export function List(props: Props) {
  const { setter } = props

  useControls({
    demos: folder(
      {
        Grid: button(get => setter('grid')),
        List: button(get => setter('list')),
        // Distance: button(get => setter('distance')),
        Drops: button(get => setter('drag')),
      },
      { color: '#007bff' },
    ),
  })

  const [
    data,
    onDragStart,
    onDragOver,
    onDragEnd,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getGridItemClassName,
  ] = useReorder<Card>(cards.slice(0, 9), 'hov', 'dragged')

  return (
    <ul className="demo-list">
      {data.map((item, index) => (
        <li
          key={item.id}
          className={getGridItemClassName(index)}
          draggable="true"
          onDragStart={() => onDragStart(index)}
          onDragOver={event => onDragOver(event, index)}
          onDragEnd={onDragEnd}
          onTouchStart={() => onTouchStart(index)}
          onTouchMove={event => onTouchMove(event, index)}
          onTouchEnd={onTouchEnd}
        >
          {item.content}
        </li>
      ))}
    </ul>
  )
}
