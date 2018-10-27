import React from 'react'
import styled from 'react-emotion'
import ArrayVisualization, { OnGoingAction } from './ArrayVisualization'
import { SortLessonContainer } from './SortLessonContainer'
import { SwapAction, CompareAction } from './commonTypes';

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

const ErrorUI = ({ hasError, error }: { hasError: boolean; error: { message: string; stack: string } }) => {
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

const DelayOptionSelect = ({ setDelayOption, chosenDelayOption }: {
  setDelayOption: (delayOption: string) => void,
  chosenDelayOption: string
}) => {
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

interface SortLessonProps {
  array: any[];
  swap: SwapAction;
  lessThan: CompareAction;
  runAlgorithm: (length: number, lessThan: CompareAction, swap: SwapAction) => void;
  pauseAlgorithm: () => void;
  resumeAlgorithm: () => void;
  nextStepAlgorithm: () => void;
  prevStepAlgorithm: () => void;
  hasPrevStep: boolean;
  algorithmToUse: string;
  toggleAlgorithmToUse: () => void;
  status: string;
  error: any;
  shuffle: () => void;
  reset: () => void;
  onGoingAction: OnGoingAction;
  actionParams: string[];
  toggleAllowDuplicateNumber: () => void;
  allowDuplicateNumber: boolean;
  setDelayOption: (delayOption: string) => void;
  chosenDelayOption: string;
}

const SortLesson = ({
  array,
  swap,
  lessThan,
  runAlgorithm,
  pauseAlgorithm,
  resumeAlgorithm,
  nextStepAlgorithm,
  prevStepAlgorithm,
  hasPrevStep,
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
}: SortLessonProps) => {
  const isPaused = status === 'paused' || status === 'history'
  const isAlgorithmActive = status === 'running' || status === 'paused' || status === 'history'

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
        <StartButton
          onClick={() => runAlgorithm(array.length, lessThan, swap)}
          disabled={isAlgorithmActive || status === 'complete'}
        >
          Start
        </StartButton>
        {(() => {
          if (isPaused) {
            return <CommonButton onClick={resumeAlgorithm}>Resume</CommonButton>
          } else {
            return (
              <CommonButton onClick={pauseAlgorithm} disabled={status !== 'running'}>
                Pause
              </CommonButton>
            )
          }
        })()}
        <CommonButton onClick={reset} disabled={status === 'running' || status === 'initial'}>
          Reset
        </CommonButton>
      </div>
      <div>
        <ToggleAlgorithmButton onClick={toggleAlgorithmToUse} disabled={isAlgorithmActive}>
          Using {algorithmToUse === 'yuan' ? "yuan's algorithm" : "erqiu's algorithm"}
        </ToggleAlgorithmButton>
        <DelayOptionSelect chosenDelayOption={chosenDelayOption} setDelayOption={setDelayOption} />
      </div>
      <div>
        <CommonButton
          onClick={prevStepAlgorithm}
          disabled={(status !== 'paused' && status !== 'history') || !hasPrevStep}
        >
          Prev
        </CommonButton>
        <CommonButton onClick={nextStepAlgorithm} disabled={!isPaused}>
          Next
        </CommonButton>
      </div>
      <div>
        <CommonLabel>
          Allow Duplicate Number
          <input type="checkbox" checked={allowDuplicateNumber} onChange={toggleAllowDuplicateNumber} />
        </CommonLabel>
        <CommonButton onClick={shuffle} disabled={isAlgorithmActive}>
          Randomize
        </CommonButton>
      </div>
      <ErrorUI hasError={status === 'error'} error={error} />
    </div>
  )
}

export default () => {
  return (
    <div>
      <SortLessonContainer>{(props: SortLessonProps) => <SortLesson {...props} />}</SortLessonContainer>
    </div>
  )
}
