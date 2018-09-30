export default async function yuanBubbleSort(length, lessThan, swap) {
    for (let lengthToSort = length; lengthToSort > 1;) {
        let lastSwapIndex = null;
        for (let j = 0; j < lengthToSort - 1; ++j) {
            const isInWrongOrder = await lessThan(j + 1, j);
            if (isInWrongOrder) {
                lastSwapIndex = j;
                await swap(j, j + 1);
            }
        }
        lengthToSort = lastSwapIndex + 1;
    }
}
