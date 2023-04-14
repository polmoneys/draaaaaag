import useDraggable from './useDraggable'
import { DraggableProps } from './types'
import Handler, { HANDLER_SIZE } from './Handler'

const HANDLER_STYLES = {
  aspectRatio: 1,
  borderRadius: '50%',
  top: '2em',
  left: '2em',
}

const Draggable = (props: DraggableProps) => {
  const {
    children,
    onCollideIn,
    onCollideOut,
    collisionRefs,
    anticipate = false,
  } = props
  const { draggableRef, onMouseDown, onTouchStart, isDragging } = useDraggable({
    onCollision: collidingElement => {
      if (collidingElement) {
        // vs. const el = collidingElement.dataset.drop
        onCollideIn?.(collidingElement)
      } else {
        onCollideOut?.()
      }
    },
    collisionRefs,
    anticipate,
  })

  return (
    <div
      ref={draggableRef}
      style={{
        position: 'fixed',
        touchAction: 'none',
        backgroundColor: isDragging ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.05)',
        ...HANDLER_STYLES,
      }}
    >
      <div
        draggable="true"
        onMouseDown={onMouseDown as any}
        onTouchStart={onTouchStart as any}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          height: `${HANDLER_SIZE}px`,
        }}
      >
        <Handler />
      </div>
      {children}
    </div>
  )
}

export default Draggable
