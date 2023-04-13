import { Dispatch, SetStateAction } from 'react'
import { useControls, folder, button } from 'leva'
import { cards, makeCards, Variants } from './utils'
import Distance from './distance'
import { List } from './list'
import { Card } from '@/lib/types'
import { useReorder } from '@/lib'
import Drag from './drag'

interface Props {
  setter: Dispatch<SetStateAction<Variants>>
}

function Stories(props: Props) {
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
  ] = useReorder<Card>(cards, 'hov', 'dragged')

  return (
    <ul className="demo-grid">
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

Stories.List = List
Stories.Distance = Distance
Stories.Drag = Drag

export default Stories
