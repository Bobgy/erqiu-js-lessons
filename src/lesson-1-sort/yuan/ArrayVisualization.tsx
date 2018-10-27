import React from 'react'
import { ArrayItem } from './ArrayItem'
import { Flipped, Flipper } from 'react-flip-toolkit'

export interface ArrayItem {
  index: number,   // original index of this item
  value: number,   // value of this item
  arrayID: number, // ID of the whole array
}

export type OnGoingAction = 'compare' | 'swap' | null

interface ArrayVisualizationProps {
  array: ArrayItem[],
  onGoingAction: OnGoingAction,
  actionParams: any[],
  isAlgoCompleted: boolean,
}

const ArrayVisualization = ({ array, onGoingAction, actionParams, isAlgoCompleted }: ArrayVisualizationProps) => {
  const isComparing = onGoingAction === 'compare'
  const isSwapping = onGoingAction === 'swap'

  return (
    <Flipper flipKey={array}>
      <div>
        {array.map((item: ArrayItem) => {
          const beingCompared = isComparing && actionParams.indexOf(item.index) >= 0
          const beingSwapped = isSwapping && actionParams.indexOf(item.index) >= 0

          return (
            <Flipped key={item.index} flipId={`array-${item.arrayID}-item-${item.index}`}>
              <ArrayItem
                className="array-item-number"
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