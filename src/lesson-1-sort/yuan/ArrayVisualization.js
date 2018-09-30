import React from 'react';
import { ArrayItem } from "./ArrayItem";
const ArrayVisualization = ({ array, onGoingAction, actionParams }) => {
    const isComparing = onGoingAction === 'compare';
    const isSwapping = onGoingAction === 'swap';
    return <div>
        {array.map((item, index) => {
            const beingCompared = isComparing && actionParams.indexOf(item.index) >= 0;
            const beingSwapped = isSwapping && actionParams.indexOf(item.index) >= 0;
            return <ArrayItem key={item.index} isFirst={index === 0} beingCompared={beingCompared} beingSwapped={beingSwapped}>
                {item.value}
            </ArrayItem>;
        })}
    </div>;
};

export default ArrayVisualization;
