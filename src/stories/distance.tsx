import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { useControls, folder, button } from 'leva'
import { makeCards, Variants } from './utils'
import { Card } from '@/lib/types'
import { useDistance } from '@/lib'
import Shape from './shape'

interface Props {
  setter: Dispatch<SetStateAction<Variants>>
}

const assignShapeSides = (test: string) => {
  if (test.endsWith('1')) return 3
  if (test.endsWith('2')) return 4
  if (test.endsWith('3')) return 5
  if (test.endsWith('4')) return 6
}

export default function Distance(props: Props): JSX.Element {
  const { setter } = props

  const { cards } = useControls({
    items: folder(
      {
        cards: {
          label: 'Amount',
          min: 6,
          max: 25,
          step: 1,
          value: 12,
        },
      },
      { color: 'yellow' },
    ),
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

  const cardsToDisplay = useMemo(() => makeCards(cards), [cards])
  const containerRef = useRef<HTMLUListElement>(null)
  const { onSelect, getClassname } = useDistance<Card>({
    items: cardsToDisplay,
    containerRef,
  })

  return (
    <ul ref={containerRef} className="demo-distance">
      {cardsToDisplay.map((card, index) => {
        const nextClass = getClassname(index)

        return (
          <li
            key={card.id}
            className={['card', nextClass].filter(Boolean).join(' ')}
            onClick={() => onSelect(index)}
          >
            <Shape sides={assignShapeSides(nextClass)} />
          </li>
        )
      })}
    </ul>
  )
}
