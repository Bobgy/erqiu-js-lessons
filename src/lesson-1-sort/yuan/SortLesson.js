import React from 'react';
import styled from 'react-emotion';
import { SortLessonContainer } from './SortLessonContainer';

const ArrayItem = styled('div')(({ beingSwapped, beingCompared }) => ({
    minWidth: 40,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    margin: '0px -1px 10px 0px',
    display: 'inline-block',
    padding: 10,
    backgroundColor: beingSwapped
        ? 'lightgreen'
        : (beingCompared ? 'yellow' : null),
}));

const ArrayVisualization = ({ array, onGoingAction, actionParams }) => {
    const isComparing = onGoingAction === 'compare';
    const isSwapping = onGoingAction === 'swap';

    return <div>
        {array.map((item, index) => {
            const beingCompared = isComparing && actionParams.indexOf(item.index) >= 0;
            const beingSwapped = isSwapping && actionParams.indexOf(item.index) >= 0;

            return <ArrayItem
                key={item.index}
                isFirst={index === 0}
                beingCompared={beingCompared}
                beingSwapped={beingSwapped}
            >
                {item.value}
            </ArrayItem>;
        })}
    </div>
}

const CommonButton = styled('button')({
    display: 'inline-block',
    margin: 10,
});

const StartButton = CommonButton;
const ToggleAlgorithmButton = CommonButton;

const WrappedPre = styled('pre')({
    whiteSpace: 'pre-wrap',
    textAlign: 'left',
    margin: 10,
});

const ErrorUI = ({ hasError, error }) => {
    if (!hasError) {
        return null;
    }

    return <div><h3>Error Message: {error.message}</h3><WrappedPre>{error.stack}</WrappedPre></div>;
}

const CheckBoxLabel = styled('label')({
    fontSize: 11,
});

const SortLesson = ({
     array, swap, lessThan,
     runAlgorithm, stopAlgorithm, pauseAlgorithm, resumeAlgorithm,
     algorithmToUse, toggleAlgorithmToUse,
     status, error,
     shuffle, reset,
     onGoingAction, actionParams,
     toggleAllowDuplicateNumber, allowDuplicateNumber,
}) => {
    const isAlgorithmActive = status === 'running' || status === 'paused';

    return <div>
        <h4>Status: {status}</h4>
        <ArrayVisualization
            array={array}
            onGoingAction={onGoingAction}
            actionParams={actionParams}
        />
        <div>
            { !isAlgorithmActive
                ? <StartButton onClick={() =>
                    runAlgorithm(array.length, lessThan, swap)}
                >Start</StartButton>
                : <CommonButton onClick={stopAlgorithm}>Stop</CommonButton>
            }
            {(() => {
                if (status === 'paused') {
                    return <CommonButton
                        onClick={resumeAlgorithm}
                    >Resume</CommonButton>;
                } else {
                    return <CommonButton
                        onClick={pauseAlgorithm}
                        disabled={status !== 'running'}
                    >Pause</CommonButton>;
                }
            })()}
            <ToggleAlgorithmButton onClick={toggleAlgorithmToUse}>
                Using {algorithmToUse === 'yuan' ? "yuan's algorithm" : "erqiu's algorithm"}
            </ToggleAlgorithmButton>
        </div>
        <div>
            <CheckBoxLabel>
                Allow Duplicate Number
                <input
                    type="checkbox"
                    checked={allowDuplicateNumber}
                    onChange={toggleAllowDuplicateNumber}
                />
            </CheckBoxLabel>
            <CommonButton onClick={shuffle} disabled={isAlgorithmActive}>
                Randomize
            </CommonButton>
            <CommonButton onClick={reset} disabled={isAlgorithmActive}>
                Reset
            </CommonButton>
        </div>
        <ErrorUI hasError={status==='error'} error={error}/>
    </div>;
};

export default () => {
    return <div>
        <SortLessonContainer>
            {(props) => <SortLesson {...props}/>}
        </SortLessonContainer>
    </div>;
};
