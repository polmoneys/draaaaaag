import { useState, useEffect } from 'react'
import { UseDistanceProps } from './types'

const useDistance = <T extends {}>({
  items,
  containerRef,
  selector = '.card',
  distanceRange = 200,
}: UseDistanceProps<T>) => {
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1)
  const [cardPositions, setCardPositions] = useState<Array<[number, number]>>(
    [],
  )

  useEffect(() => {
    if (containerRef.current === null) return

    const updateCardPositions = () => {
      const cardElements = containerRef.current?.querySelectorAll(selector)

      if (cardElements === undefined) return

      const positions = Array.from(cardElements).map(cardElement => {
        const { left, top } = cardElement.getBoundingClientRect()
        return [left, top] as [number, number]
      })

      setCardPositions(positions)
    }

    updateCardPositions()

    window.addEventListener('resize', updateCardPositions)

    return () => {
      window.removeEventListener('resize', updateCardPositions)
    }
  }, [containerRef, selector, items.length])

  const onSelect = (index: number) => {
    console.log({ index })
    setSelectedCardIndex(index)
  }

  const getClassname = (index: number) => {
    if (selectedCardIndex === index) {
      return 'selected'
    }

    if (cardPositions.length === 0) {
      return ''
    }

    const selectedCardPosition = cardPositions[selectedCardIndex]

    if (!selectedCardPosition) {
      return ''
    }

    const [selectedCardX, selectedCardY] = selectedCardPosition
    const [cardX, cardY] = cardPositions[index]
    const distance = Math.round(
      Math.sqrt(
        Math.pow(selectedCardX - cardX, 2) + Math.pow(selectedCardY - cardY, 2),
      ),
    )

    /*
      Notes:
      if 50 is used as the range then
      .distance-1 would represent distances between 1 and 50 pixels, 
      .distance-2 would represent distances between 51 and 100 pixels... 
    */
    const distanceLevel = Math.ceil(distance / distanceRange)
    return `distance-${distanceLevel}`
  }

  return {
    items,
    onSelect,
    getClassname,
  }
}
export default useDistance
