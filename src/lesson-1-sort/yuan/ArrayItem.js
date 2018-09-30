import styled from 'react-emotion';
export const ArrayItem = styled('div')(({ beingSwapped, beingCompared }) => ({
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
