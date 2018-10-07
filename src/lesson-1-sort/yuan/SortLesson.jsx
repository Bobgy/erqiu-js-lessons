import React from 'react'
import styled from 'react-emotion'
import ArrayVisualization from './ArrayVisualization'
import { SortLessonContainer } from './SortLessonContainer'

const CommonButton = styled('button')({
  display: 'inline-block',
  margin: 10,
})

const StartButton = CommonButton
const ToggleAlgorithmButton = styled(CommonButton)({
  width: 140, // NOTE, min-width doesn't work here
})

const WrappedPre = styled('pre')({
  whiteSpace: 'pre-wrap',
  textAlign: 'left',
  margin: 10,
})

const ErrorUI = ({ hasError, error }) => {
  if (!hasError) {
    return null
  }

  return (
    <div>
      <h3>Error Message: {error.message}</h3>
      <WrappedPre>{error.stack}</WrappedPre>
    </div>
  )
}

const CommonLabel = styled('label')({
  fontSize: 11,
})

const DelayOptionSelect = ({ setDelayOption, chosenDelayOption }) => {
  return (
    <CommonLabel>
      {'Speed: '}
      <select
        value={chosenDelayOption}
        onChange={event => {
          setDelayOption(event.target.value)
        }}
      >
        <option value="slow">slow</option>
        <option value="normal">normal</option>
        <option value="fast">fast</option>
        <option value="fastest">fastest</option>
      </select>
    </CommonLabel>
  )
}

const SortLesson = ({
  array,
  swap,
  lessThan,
  runAlgorithm,
  stopAlgorithm,
  pauseAlgorithm,
  resumeAlgorithm,
  nextStepAlgorithm,
  algorithmToUse,
  toggleAlgorithmToUse,
  status,
  error,
  shuffle,
  reset,
  onGoingAction,
  actionParams,
  toggleAllowDuplicateNumber,
  allowDuplicateNumber,
  setDelayOption,
  chosenDelayOption,
}) => {
  const isAlgorithmActive = status === 'running' || status === 'paused'

  return (
    <div id={'lesson-1-sort-container'}>
      <h4>Status: {status}</h4>
      <ArrayVisualization
        array={array}
        onGoingAction={onGoingAction}
        actionParams={actionParams}
        isAlgoCompleted={status === 'complete'}
      />
      <div>
        {!isAlgorithmActive ? (
          <StartButton onClick={() => runAlgorithm(array.length, lessThan, swap)}>Start</StartButton>
        ) : (
          <CommonButton onClick={stopAlgorithm}>Stop</CommonButton>
        )}
        {(() => {
          if (status === 'paused') {
            return (
              <div>
                <CommonButton onClick={resumeAlgorithm}>Resume</CommonButton>
                <CommonButton onClick={nextStepAlgorithm}>Next</CommonButton>
              </div>
            )
          } else {
            return (
              <CommonButton onClick={pauseAlgorithm} disabled={status !== 'running'}>
                Pause
              </CommonButton>
            )
          }
        })()}
        <ToggleAlgorithmButton onClick={toggleAlgorithmToUse}>
          Using {algorithmToUse === 'yuan' ? "yuan's algorithm" : "erqiu's algorithm"}
        </ToggleAlgorithmButton>
        <DelayOptionSelect chosenDelayOption={chosenDelayOption} setDelayOption={setDelayOption} />
      </div>
      <div>
        <CommonLabel>
          Allow Duplicate Number
          <input type="checkbox" checked={allowDuplicateNumber} onChange={toggleAllowDuplicateNumber} />
        </CommonLabel>
        <CommonButton onClick={shuffle} disabled={isAlgorithmActive}>
          Randomize
        </CommonButton>
        <CommonButton onClick={reset} disabled={isAlgorithmActive}>
          Reset
        </CommonButton>
      </div>
      <ErrorUI hasError={status === 'error'} error={error} />
    </div>
  )
}

export default () => {
  return (
    <div>
      <SortLessonContainer>{props => <SortLesson {...props} />}</SortLessonContainer>
    </div>
  )
}
