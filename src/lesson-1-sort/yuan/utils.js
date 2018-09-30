// random integer in [l, r)
export function randomInt(l, r) {
    const res = Math.floor(Math.random() * (r - l) + l);
    if (res >= r) {
        // fix possible float error
        return r - 1;
    } else {
        return res;
    }
}

export const randomArrayStrategies = {
    allRandom: (length) => {
        const newArray = [];
        for (let i = 0; i < length; ++i) {
            newArray.push(Math.ceil(Math.random() * 10));
        }

        return newArray;
    },
    permutation: (length) => {
        const a = [];
        for (let i = 0; i < length; ++i) {
            a.push(i + 1);
        }
        for (let i = 0; i < length - 1; ++i) {
            const j = randomInt(i, length);
            const t = a[i];
            a[i] = a[j];
            a[j] = t;
        }

        return a;
    },
}

export function randomArray(allowDuplicateNumber = true) {
    const length = Math.ceil(Math.random() * 4) + 6;
    if (allowDuplicateNumber) {
        return randomArrayStrategies.allRandom(length);
    } else {
        return randomArrayStrategies.permutation(length);
    }
}

export function expandArray(array, arrayID = 0) {
    const newArray = [];
    for (let i = 0; i < array.length; ++i) {
        newArray.push({
            value: array[i],
            index: i,
            arrayID,
        });
    }

    return newArray;
}

export function resetArray(array) {
    const newArray = [];
    console.log(array);
    for (let i = 0; i < array.length; ++i) {
        newArray[array[i].index - 1] = array[i];
    }
    console.log(newArray);

    return newArray;
}
