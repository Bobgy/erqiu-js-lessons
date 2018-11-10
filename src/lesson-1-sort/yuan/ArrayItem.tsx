import styled from '@emotion/styled'

interface ArrayItemProps {
  beingSwapped: boolean,
  beingCompared: boolean,
  isAlgoCompleted: boolean,
}

export const ArrayItem = styled('div')(({ beingSwapped, beingCompared, isAlgoCompleted }: ArrayItemProps) => ({
  minHeight: 40,
  minWidth: 40,
  boxSizing: 'border-box',
  borderRadius: 20,
  margin: '10px 2px',
  display: 'inline-block',
  padding: 10,
  color: 'white',
  lineHeight: '20px', // HACK: checked internal container is 20px height, so set line height to 20px to center vertically
  backgroundColor: (() => {
    if (isAlgoCompleted) return 'lightgreen'
    else if (beingCompared) return 'pink'
    else if (beingSwapped) return 'orangered'
    else return '#CCC'
  })(),
}))
