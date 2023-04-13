import { Dispatch, Fragment, SetStateAction, useMemo, useRef } from 'react'
import { useControls, folder, button } from 'leva'
import { Variants } from './utils'
import Draggable from '@/lib/Draggable'

interface Props {
  setter: Dispatch<SetStateAction<Variants>>
}

export default function Drag(props: Props): JSX.Element {
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
  const diva = useRef(null)
  const divb = useRef(null)
  const divc = useRef(null)

  return (
    <Fragment>
      <div className="diva" data-drop="ALPHA" ref={diva} />
      <div className="divb" data-drop="BETA" ref={divb} />
      <div className="divc" data-drop="DELTA" ref={divc} />

      <Draggable
        onCollideOut={() => {
          for (const it of document.querySelectorAll('[data-drop]')) {
            it.classList.remove('yay')
          }
        }}
        onCollideIn={drop => drop.classList.add('yay')}
        collisionRefs={[diva, divb, divc]}
      >
        <Fragment />
        {/* <div
          style={{
            backgroundColor: 'orange',
            padding: '1em',
            maxWidth: '200px',
          }}
        >
          <h3>Content inside the Draggable component</h3>
          <p>
            This is an example of a Draggable component with dynamic content.
          </p>
        </div> */}
      </Draggable>
    </Fragment>
  )
}
