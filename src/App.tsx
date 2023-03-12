import { useState } from 'react'
import { Leva } from 'leva'
import './app.css'
import './stories/demo.css'
import { cards, Variants } from './stories/utils'
import Stories from './stories'

export default function App(): JSX.Element {
  const [demo, setDemo] = useState<Variants>('grid')

  return (
    <main>
      <Leva
        // oneLineLabels={demo !== 'diy'}
        hideCopyButton
        titleBar={{ title: '<Draaaaaag/>', filter: false }}
        // hidden={demo === "wild"}
      />
      {
        {
          grid: <Stories setter={setDemo} />,
          list: <Stories.List setter={setDemo} />,
          distance: <Stories.Distance setter={setDemo} />,
        }[demo]
      }
    </main>
  )
}
