import React from 'react'
import { ArrayItem } from './ArrayItem'
import { Flipped, Flipper } from 'react-flip-toolkit'

const ArrayVisualization = ({ array, onGoingAction, actionParams, isAlgoCompleted }) => {
  const isComparing = onGoingAction === 'compare'
  const isSwapping = onGoingAction === 'swap'

  return (
    <Flipper flipKey={array}>
      <div>
        {array.map((item, index) => {
          const beingCompared = isComparing && actionParams.indexOf(item.index) >= 0
          const beingSwapped = isSwapping && actionParams.indexOf(item.index) >= 0

          return (
            <Flipped key={item.index} flipId={`array-${item.arrayID}-item-${item.index}`}>
              <ArrayItem
                className="array-item-number"
                isFirst={index === 0}
                beingCompared={beingCompared}
                beingSwapped={beingSwapped}
                isAlgoCompleted={isAlgoCompleted}
              >
                {item.value}
              </ArrayItem>
            </Flipped>
          )
        })}
      </div>
    </Flipper>
  )
}

export default ArrayVisualization
