import { useRef, useState, useEffect } from 'react'

interface DraggableBounds {
  top: number
  right: number
  bottom: number
  left: number
}

interface Props {
  buffer?: number
  onCollision?: (collidingElement: HTMLElement | null) => void
  collisionRefs?: React.RefObject<HTMLElement>[]
  anticipate?: boolean
}

const useDraggable = (props?: Props) => {
  const draggableRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [collisionRects, setCollisionRects] = useState<
    Array<{ ref: React.RefObject<HTMLElement>; rect: DOMRect }>
  >([])
  const computeCollisionRects = (
    collisionRefs?: React.RefObject<HTMLElement>[],
  ) => {
    if (!collisionRefs) return

    const rects = collisionRefs
      .map(ref => ({ ref, rect: ref.current?.getBoundingClientRect() }))
      .filter(
        (item): item is { ref: React.RefObject<HTMLElement>; rect: DOMRect } =>
          item.rect !== undefined,
      )

    setCollisionRects(rects)
  }

  const checkForCollision = (x: number, y: number) => {
    if (!draggableRef.current || !collisionRects) return

    const draggableRect = draggableRef.current.getBoundingClientRect()

    const updatedDraggableRect = {
      left: x,
      right: x + draggableRect.width,
      top: y,
      bottom: y + draggableRect.height,
    }

    const anticipation = props?.anticipate ? 16 : 0

    for (const { ref, rect } of collisionRects) {
      /*
  const isColliding =
      updatedDraggableRect.left < rect.right + anticipation &&
      updatedDraggableRect.right > rect.left - anticipation &&
      updatedDraggableRect.top < rect.bottom + anticipation &&
      updatedDraggableRect.bottom > rect.top - anticipation;

*/
      const isColliding =
        updatedDraggableRect.left < rect.right &&
        updatedDraggableRect.right > rect.left &&
        updatedDraggableRect.top < rect.bottom &&
        updatedDraggableRect.bottom > rect.top

      if (isColliding) {
        props?.onCollision?.(ref.current ?? null)
        return
      }
    }
    props?.onCollision?.(null)
  }

  const onMove = (x: number, y: number) => {
    if (!draggableRef.current) return
    requestAnimationFrame(() => {
      if (!draggableRef.current) return

      const bounds: DraggableBounds = {
        top: -1 * draggableRef.current.offsetHeight + 16 * 3,
        right: window.innerWidth - draggableRef.current.offsetWidth - 16 * 3,
        bottom: window.innerHeight - draggableRef.current.offsetHeight - 16,
        left: 16,
      }
      const clampedX = Math.min(Math.max(x, bounds.left), bounds.right)
      const clampedY = Math.min(Math.max(y, bounds.top), bounds.bottom)

      draggableRef.current.style.transform = `translate(${clampedX}px, ${clampedY}px)`
      checkForCollision(clampedX, clampedY)
    })
  }

  const onMouseDown = (event: MouseEvent) => {
    setIsDragging(true)
    setStartPosition({ x: event.clientX, y: event.clientY })
  }

  const onTouchStart = (event: TouchEvent) => {
    setIsDragging(true)
    setStartPosition({
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    })
  }

  const onMouseMove = (event: MouseEvent) => {
    if (!isDragging) return
    event.preventDefault()

    const x = event.clientX - startPosition.x + offset.x
    const y = event.clientY - startPosition.y + offset.y
    onMove(x, y)
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!isDragging) return
    event.preventDefault()

    const x = event.touches[0].clientX - startPosition.x + offset.x
    const y = event.touches[0].clientY - startPosition.y + offset.y
    onMove(x, y)
  }

  useEffect(() => {
    const onMouseUp = () => {
      setIsDragging(false)
      if (!draggableRef.current) return
      const transform = draggableRef.current.style.transform
      const translateValues = transform.match(/-?\d+(\.\d+)?/g) || []
      setOffset({
        x: parseFloat(translateValues[0] ?? '0'),
        y: parseFloat(translateValues[1]),
      })
    }

    const onTouchEnd = () => {
      onMouseUp()
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [isDragging])

  useEffect(() => {
    computeCollisionRects(props?.collisionRefs)
  }, [props?.collisionRefs])

  return {
    draggableRef,
    onMouseDown,
    onTouchStart,
    isDragging,
  }
}

export default useDraggable
