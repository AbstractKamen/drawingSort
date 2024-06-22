// QUICK SORT
async function quickSort(toSort, sortTask, sortArgs, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    if (sortArgs == undefined || sortArgs.partitioner == undefined || sortArgs.partitioner.partition == undefined) {
        await quickSortRec(toSort, sortTask, lo, hi);

    } else {
        await quickSortRec(toSort, sortTask, lo, hi, sortArgs.partitioner.partition);
    }
}
async function quickSortRec(toSort, sortTask, low, high, partitionFunc = alwaysLastPartition) {
    if (sortTask.isFinished()) return;
    while (low < high) {
        sortTask.increment();
        let pi = await partitionFunc(toSort, sortTask, low, high);
        sortTask.sortStatus[pi] = SORTED;
        sortTask.sortStatus[pi - 1] = SORTED;
        if (pi - low < high - pi) {
            await quickSortRec(toSort, sortTask, low, pi - 1);
            sortTask.sortStatus[low] = SORTED;
            low = pi + 1;
        } else {
            await quickSortRec(toSort, sortTask, pi + 1, high);
            sortTask.sortStatus[high] = SORTED;
            high = pi - 1;
        }
    }
}
// HYBRID QUICK SORT
async function cutoffQuickSort(toSort, sortTask, sortArgs) {
    var cutoff = sortArgs.cutoff;
    if (cutoff < 0) {
        cutoff = (Math.log(toSort.length) << 1) + Math.log(Math.log(toSort.length) << 11);
    }
    await cutOffquickSortRec(toSort, sortTask, 0, toSort.length - 1, cutoff, sortArgs.partitionFunc);
    if (sortArgs.compSort.sortArgs()) {
        await sortArgs.compSort.sort(toSort, sortTask, sortArgs.compSort.sortArgs(), 0, toSort.length - 1);
    } else {
        await sortArgs.compSort.sort(toSort, sortTask, 0, toSort.length - 1);
    }
}
async function cutOffquickSortRec(toSort, sortTask, low, high, cutoff, partitionFunc = alwaysLastPartition) {
    if (sortTask.isFinished()) return;
    if (low + cutoff < high) {
        sortTask.increment();
        let pi = await partitionFunc(toSort, sortTask, low, high);
        sortTask.sortStatus[pi] = SORTED;
        sortTask.sortStatus[pi - 1] = SORTED;
        await cutOffquickSortRec(toSort, sortTask, low, pi - 1, cutoff);
        sortTask.sortStatus[low] = SORTED;
        await cutOffquickSortRec(toSort, sortTask, pi + 1, high, cutoff);
        sortTask.sortStatus[high] = SORTED;
    }
}
// ITERATIVE QUICK SORT
async function iterativeQuickSort(toSort, sortTask, sortArgs, low = 0, high = toSort.length - 1, end = toSort.length) {
    const loHiStack = [{
        low: low,
        high: high
    }];
    while (loHiStack.length > 0) {
        if (sortTask.isFinished()) return;
        const {
            low,
            high
        } = loHiStack.pop();
        if (low < high) {
            sortTask.increment();
            let pi = await sortArgs.partitioner.partition(toSort, sortTask, low, high);
            sortTask.sortStatus[pi] = SORTED;
            sortTask.sortStatus[pi - 1] = SORTED;
            sortTask.sortStatus[pi + 1] = SORTED;
            loHiStack.push({
                low,
                high: pi - 1
            });
            loHiStack.push({
                low: pi + 1,
                high
            });
        }
    }

}
// QUICK SORT PARTITION FUNCTIONS
async function alwaysLastPartition(toSort, sortTask, low, high) {
    if (sortTask.isFinished()) return;
    await sortTask.sleep();
    let pivot = toSort[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await sortTask.visit(i, j);
        if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);
        }
    }
    swap(toSort, i + 1, high);
    return i + 1;
}

async function alwaysFirstPartition(toSort, sortTask, low, high) {
    if (sortTask.isFinished()) return;
    await sortTask.sleep();
    let pivot = toSort[low];
    let i = low;
    for (let j = low + 1; j <= high; j++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await sortTask.visit(i, j);
        if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);
        }
    }
    swap(toSort, low, i);
    return i;
}

async function medianOfThreePartition(toSort, sortTask, low, high) {

    async function medianOfThree(toSort, sortTask, low, high) {
        const mid = low + ((high - low) >> 1);
        if (toSort[low] > toSort[mid]) {
            swap(toSort, low, mid);
        }
        if (toSort[low] > toSort[high]) {
            swap(toSort, low, high);
        }
        if (toSort[mid] > toSort[high]) {
            swap(toSort, mid, high);
        }
        await sortTask.visit(low, mid, high);
        sortTask.increment();
        return mid;
    }

    if (sortTask.isFinished()) return;
    let pIndex = await medianOfThree(toSort, sortTask, low, high);
    let pivot = toSort[pIndex];
    swap(toSort, pIndex, high);
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await sortTask.visit(i, j);
        if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);
        }
    }
    swap(toSort, i + 1, high);
    return i + 1;
}
// SLEEP SORT
async function sleepSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    const result = new Array();
    let i = lo;
    await Promise.all(
        toSort.map(async (n) => {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await new Promise((res) => setTimeout(res, n));
            await sortTask.visit(i++);
            result.push(n);
        }));
    for (let j = lo; j < end; j++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        toSort[j] = result[j];
        await sortTask.visit(j);
        sortTask.sortStatus[j] = SORTED
    }
}
// HEAP SORT
async function heapSort(toSort, sortTask, lo = 0, hi = toSort.length - 1) {
    for (let k = ((lo + hi) >>> 1); k >= lo; k--) {
        await pushDown(toSort, sortTask, k, lo, hi);
    }
    for (let i = hi; i > lo; i--) {
        [toSort[lo], toSort[i]] = [toSort[i], toSort[lo]];
        sortTask.increment();
        await sortTask.visit(lo, i);
        await pushDown(toSort, sortTask, lo, lo, i - 1);
        sortTask.sortStatus[i] = SORTED;
    }
}

async function pushDown(toSort, sortTask, root, lo, hi) {
    let largest = root;
    let left = 2 * root + 1 - lo;
    let right = 2 * root + 2 - lo;

    if (left <= hi && toSort[left] > toSort[largest]) {
        largest = left;
    }

    if (right <= hi && toSort[right] > toSort[largest]) {
        largest = right;
    }

    if (largest !== root) {
        [toSort[root], toSort[largest]] = [toSort[largest], toSort[root]];
        sortTask.increment();
        await sortTask.visit(root, largest);
        await pushDown(toSort, sortTask, largest, lo, hi);
    }
    sortTask.sortStatus[root] = SORTED;
}
// BUBBLE SORT
async function bubbleSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    var i, j;
    var swapped;
    for (i = lo; i < hi; i++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        swapped = await bubbleSortInner(toSort, sortTask, j => j < toSort.length - i - 1, lo);

        if (swapped === false) {
            for (k = 0; k < hi; k++) {
                sortTask.sortStatus[k] = SORTED;
            }
            break;
        } else {
            sortTask.sortStatus[j] = SORTED;
        }
    }
    sortTask.sortStatus[lo] = SORTED;
}
async function bubbleSortInner(toSort, sortTask, loopPred, init = 0, step = 1) {
    var swapped = false;
    for (j = init; loopPred(j); j += step) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await sortTask.visit(j);
        if (toSort[j] > toSort[j + 1]) {
            swap(toSort, j, j + 1);
            swapped = true;
        }
    }
    return swapped;
}
// BUBBLE SORT
async function brickSort(toSort, sortTask) {
    var swapped = true;
    while (swapped) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        swapped = await bubbleSortInner(toSort, sortTask, i => i < toSort.length - 1, 1, 2);
        swapped = await bubbleSortInner(toSort, sortTask, i => i < toSort.length - 1, 0, 2);

        if (swapped === false) {
            for (k = 0; k < toSort.length; k++) {
                sortTask.sortStatus[k] = SORTED;
            }
        }
    }
}
// SHAKER SORT
async function shakerSort(toSort, sortTask) {
    var i, j = 0,
        m;
    var swapped;
    for (i = 0; i < toSort.length - 1; ++i) {
        if (sortTask.isFinished()) return;
        swapped = false;
        sortTask.increment();
        for (; j < toSort.length - i - 1; ++j) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await sortTask.visit(j);
            if (toSort[j] > toSort[j + 1]) {
                m = j + 1;
                p = m;
                swap(toSort, j, j + 1);
                swapped = true;
            }
        }

        if (swapped === false) {
            for (k = 0; k < toSort.length - 1; ++k) {
                sortTask.sortStatus[k] = SORTED;
            }
            break;
        } else {
            sortTask.sortStatus[j] = SORTED;
        }

        for (; j > i; --j) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await sortTask.visit(j);
            if (toSort[j] < toSort[j - 1]) {
                m = j - 1;
                p = m;
                swap(toSort, j, j - 1);
                swapped = true;
            }
        }

        if (swapped === false) {
            for (k = 0; k < toSort.length - 1; k++) {
                sortTask.sortStatus[k] = SORTED;
            }
            break;
        } else {
            sortTask.sortStatus[j] = SORTED;
        }
    }
    sortTask.sortStatus[0] = SORTED;
}
// SHELL SORT
async function shellSort(toSort, sortTask) {
    var n = toSort.length;
    const factor = 2.3;
    // start with half gap then decrease by half again
    for (let g = Math.round(n / factor); g > 0; g = Math.round(g / factor)) {
        if (sortTask.isFinished()) return;
        // gapped insertion sort for this gap size
        for (let i = g; i < n; ++i) {
            if (sortTask.isFinished()) return;
            await insertionBackstepLoop(toSort, sortTask, 0, i, g, async j => {
                await sortTask.visit(i, j);
            });
        }
    }
    return toSort;
}
// COMB-HYBRID SORT
async function combHybridSort(toSort, sortTask, sortArgs) {
    let n = toSort.length;
    let comb = n;
    let swapped = true;
    while (comb != 1 || swapped === true) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        comb = getNextComb(comb);
        swapped = false;
        if (comb <= 7) {
            await sortArgs.compSort.sort(toSort, sortTask);
            if (sortArgs.compSort.sortArgs()) {
                await sortArgs.compSort.sort(toSort, sortTask, sortArgs.compSort.sortArgs());
            } else {
                await sortArgs.compSort.sort(toSort, sortTask);
            }
            return;
        }
        for (let i = 0; i < n - comb; i++) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await sortTask.visit(i, i + comb);
            if (toSort[i] > toSort[i + comb]) {
                swap(toSort, i, i + comb);
                swapped = true;
            }
        }
    }

    function getNextComb(comb) {
        // shrink comb
        comb = parseInt(comb / 1.3, 10);
        if (comb < 1)
            return 1;
        return comb;
    }
}
// INSERTION SORT
async function insertionSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    let i = lo + 1,
        n = end;
    for (; i < n; i++) {
        if (sortTask.isFinished()) return;
        await insertionBackstepLoop(toSort, sortTask, lo, i, 1);
    }
}
async function insertionBackstepLoop(toSort, sortTask, low, cur, backStep,
    /* 
     * since we use this for other sorts leave a way for them to mark the insertions
     * the default for insertion sort is to visit mark as SORTED
     */
    markInserted = async j => {
        await sortTask.visit(j);
        sortTask.sortStatus[j - backStep] = SORTED;
        sortTask.sortStatus[j] = SORTED;
        sortTask.sortStatus[j + backStep] = SORTED;
    }
) {
    if (sortTask.isFinished()) return;
    sortTask.increment();
    const key = toSort[cur];
    let j = cur - backStep;
    while (j >= low && toSort[j] > key) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        // insertion
        toSort[j + backStep] = toSort[j];
        await markInserted(j);
        j -= backStep;

    }
    toSort[j + backStep] = key;
}
// BINARY INSERTION SORT
async function binaryInsertionSort(toSort, sortTask, low = 0, high = toSort.length - 1, end = toSort.length) {
    let i = low + 1;
    for (; i < end && sortTask.isStarted; i++) {
        let p = toSort[i];
        let left = low;
        let right = i;
        while (left < right && sortTask.isStarted) {
            let mid = (left + right) >>> 1;
            await sortTask.visit(left, right);
            sortTask.increment();
            if (p < toSort[mid]) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        for (let j = i; j > left - 1; j--) {
            sortTask.increment();
            await sortTask.visit(j);
            toSort[j] = toSort[j - 1];
            sortTask.sortStatus[j] = SORTED;
        }
        toSort[left] = p;
    }
}
// PAIR INSERTION
async function pairInsertionSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    let i = lo,
        low = lo;
    for (; low <= hi && i <= hi && sortTask.isStarted; ++low) {
        let left = toSort[i = low],
            right = toSort[++low];
        if (left > right) {
            while (lo <= i && left < toSort[--i] && sortTask.isStarted) {
                sortTask.increment();
                await sortTask.visit(i);
                toSort[i + 2] = toSort[i];
                sortTask.sortStatus[i + 2] = SORTED;
            }
            toSort[++i + 1] = left;
            sortTask.sortStatus[i + 2] = SORTED;
            await sortTask.visit(i + 2);
            while (lo <= i && right < toSort[--i] && sortTask.isStarted) {
                sortTask.increment();
                await sortTask.visit(i, i + 1);
                toSort[i + 1] = toSort[i];
                sortTask.sortStatus[i + 1] = SORTED;
            }
            toSort[i + 1] = right;
            sortTask.sortStatus[i] = SORTED;
            sortTask.sortStatus[i + 1] = SORTED;
            await sortTask.visit(i, i + 1);
            sortTask.increment();
        } else if (left < toSort[i - 1]) {
            while (lo <= i && right < toSort[--i] && sortTask.isStarted) {
                sortTask.increment();
                await sortTask.visit(i, i + 1);
                toSort[i + 2] = toSort[i];
                sortTask.sortStatus[i + 2] = SORTED;
            }
            await sortTask.visit(i + 2, i - 1);
            sortTask.sortStatus[i + 2] = SORTED;
            toSort[++i + 1] = right;
            while (lo <= i && left < toSort[--i] && sortTask.isStarted) {
                sortTask.increment();
                await sortTask.visit(i, i + 1);
                toSort[i + 1] = toSort[i];
                sortTask.sortStatus[i + 1] = SORTED;
            }
            toSort[i + 1] = left;
            sortTask.sortStatus[i] = SORTED;
            sortTask.sortStatus[i + 1] = SORTED;
            await sortTask.visit(i, i + 1);
            sortTask.increment();
        }
    }
    if ((end) % 2 === 1) {
        await insertionBackstepLoop(toSort, sortTask, lo, hi, 1);
    }
}
// PIN INSERTION SORT
async function pinInsertionSort(toSort, sortTask, lo = 0, high = toSort.length - 1, end = toSort.length) {
    let i = lo,
        p = high,
        pin = toSort[high];
    for (let low = lo; ++low < end && i <= high && sortTask.isStarted;) {
        let a = toSort[i = low];
        if (a < toSort[i - 1]) {
            sortTask.sortStatus[i] = SORTED;
            toSort[i] = toSort[--i];
            await sortTask.visit(i);
            sortTask.increment();
            while (lo <= i && a < toSort[--i] && sortTask.isStarted) {
                await sortTask.visit(i);
                sortTask.increment();
                toSort[i + 1] = toSort[i];
                sortTask.sortStatus[i + 1] = SORTED;
            }
            toSort[i + 1] = a;
            sortTask.sortStatus[i + 1] = SORTED;
            await sortTask.visit(i + 1);
            sortTask.increment();
        } else if (p > i && a > pin) {
            while (toSort[--p] > pin && sortTask.isStarted) {
                await sortTask.visit(p);
                sortTask.increment();
            }

            if (p > i) {
                sortTask.increment();
                a = toSort[p];
                await sortTask.visit(p, i);
                toSort[p] = toSort[i];
                sortTask.sortStatus[p] = GREATER;
            }
            while (lo <= i && a < toSort[--i] && sortTask.isStarted) {
                await sortTask.visit(i);
                toSort[i + 1] = toSort[i];
                sortTask.sortStatus[i + 1] = SORTED;
            }
            await sortTask.visit(i + 1);
            toSort[i + 1] = a;
            sortTask.sortStatus[i + 1] = SORTED;
        }
    }
}

// COMB SORT
async function combSort(toSort, sortTask) {
    let n = toSort.length;
    let comb = n;
    let swapped = true;
    while (comb != 1 || swapped === true) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        comb = getNextComb(comb);
        swapped = false;

        for (let i = 0; i < n - comb; i++) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await sortTask.visit(i, i + comb);
            if (toSort[i] > toSort[i + comb]) {
                swap(toSort, i, i + comb);
                swapped = true;
            }
        }
    }

    function getNextComb(comb) {
        // shrink comb
        comb = parseInt(comb / 1.3, 10);
        if (comb < 1)
            return 1;
        return comb;
    }
}
// SELECTION SORT
async function selectionSort(toSort, sortTask) {
    var min_idx, j, n = toSort.length;
    for (let i = 0; i < n - 1; i++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();

        min_idx = i;
        for (j = i + 1; j < n; j++) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await sortTask.visit(min_idx, j);
            if (toSort[j] < toSort[min_idx]) {
                sortTask.sortStatus[j] = LESSER;
                if (sortTask.sortStatus[min_idx] != SORTED) {
                    sortTask.sortStatus[min_idx] = NOT_SORTED;
                }
                min_idx = j;
            }
            if (j - 1 != min_idx && sortTask.sortStatus[j - 1] != SORTED) {
                sortTask.sortStatus[j - 1] = NOT_SORTED;
            }
        }
        sortTask.sortStatus[i] = SORTED;
        sortTask.sortStatus[i + 1] = SORTED;
        if (sortTask.sortStatus[min_idx] != SORTED) {
            sortTask.sortStatus[min_idx] = NOT_SORTED;
        }
        swap(toSort, min_idx, i);
    }
}
// MERGE SORT
async function mergeSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    await mergeSortRec(toSort, sortTask, lo, hi, end);
}
async function mergeSortRec(toSort, sortTask, leftI, rightI, end) {
    if (sortTask.isFinished()) {
        return;
    }
    if (leftI >= rightI) {
        return;
    }
    sortTask.increment();
    var m = leftI + ((rightI - leftI) >>> 1);
    await sortTask.visit(m);
    await mergeSortRec(toSort, sortTask, leftI, m);
    await mergeSortRec(toSort, sortTask, m + 1, rightI);
    if (toSort[m] > toSort[m + 1]) { // best case condition
        sortTask.increment();
        await merge(toSort, sortTask, leftI, m, rightI, end);
    } else {
        sortTask.sortStatus[m] = SORTED;
        sortTask.sortStatus[m + 1] = SORTED;
    }
}
async function merge(toSort, sortTask, l, m, r, end) {
    let leftSize = m - l + 1,
        rightSize = r - m;
    let left = new Array(leftSize);
    let right = new Array(rightSize);
    for (let i = 0; i < leftSize && sortTask.isStarted; i++) {
        left[i] = toSort[l + i];
        sortTask.increment();
    }
    for (let i = 0; i < rightSize && sortTask.isStarted; i++) {
        right[i] = toSort[m + 1 + i];
        sortTask.increment();
    }
    let i = 0,
        j = 0,
        k = l;

    while (i < leftSize && j < rightSize && sortTask.isStarted) {
        // no galloping here brother man
        if (left[i] <= right[j]) {
            toSort[k] = left[i++];
        } else {
            toSort[k] = right[j++];
        }
        sortTask.increment();
        await sortTask.visit(k++);
    }

    while (i < leftSize && sortTask.isStarted) {
        toSort[k] = left[i++];
        await sortTask.visit(k++);
        sortTask.increment();
    }
    while (j < rightSize && sortTask.isStarted) {
        toSort[k] = right[j++];
        await sortTask.visit(k++);
        sortTask.increment();
    }
}
// BUCKET SORT
async function bucketSort(toSort, sortTask, sortArgs) {
    let n = toSort.length;
    var max = -(1 << 32),
        min = 1 << 32;
    for (i = 0; i < toSort.length; i++) {
        sortTask.increment();
        min = Math.min(min, toSort[i]);
        max = Math.max(max, toSort[i]);
    }
    const bucketSize = Math.floor((max - min) / Math.sqrt(n)) + 1;
    // Initialize buckets
    const buckets = new Array(Math.floor((max - min) / bucketSize) + 1);
    for (let i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }
    for (let i = 0; i < n; i++) {
        if (sortTask.isFinished()) return;
        let bi = Math.floor((toSort[i] - min) / bucketSize);
        let biStart = 0;
        for (let j = 0; j <= bi; j++) {
            biStart += buckets[j].length;
        }
        const bucket = buckets[bi];
        bucket.push(toSort[i]);
        await sortTask.visit(biStart, biStart + bucket.length);
        sortTask.increment();
        let index = 0;
        for (let k = 0; k < buckets.length; k++) {
            const bucket = buckets[k];
            for (let j = 0; j < bucket.length; j++) {
                toSort[index++] = bucket[j];
            }
        }
    }
    let index = 0;
    for (let k = 0; k < buckets.length; k++) {
        sortTask.increment();
        const bucket = buckets[k];
        if (sortArgs.compSort.sortArgs()) {
            await sortArgs.compSort.sort(toSort, sortTask, sortArgs.compSort.sortArgs(), index, index + bucket.length - 1, index + bucket.length);
        } else {
            await sortArgs.compSort.sort(toSort, sortTask, index, index + bucket.length - 1, index + bucket.length);
        }
        index += bucket.length;
    }
}

// TIM SORT
async function timSort(toSort, sortTask, sortArgs) {
    const n = toSort.length;
    const minRun = minRunLength(n, sortArgs.runLimit);
    for (let i = 0; i < n; i += minRun) {
        const end = Math.min(i + minRun, n);
        if (sortArgs.compSort.sortArgs()) {
            await sortArgs.compSort.sort(toSort, sortTask, sortArgs.compSort.sortArgs(), i, end - 1, end);
        } else {
            await sortArgs.compSort.sort(toSort, sortTask, i, end - 1, end);
        }
    }

    for (let size = minRun; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            let mid = Math.min(n - 1, left + size - 1);
            let right = Math.min((left + 2 * size - 1), (n - 1));
            if (mid < right) {
                await merge(toSort, sortTask, left, mid, right);
            }
        }
    }
}

function minRunLength(n, runLimit) {
    let r = 0;
    while (n >= runLimit) {
        r |= (n & 1);
        n >>>= 1;
    }
    return n + r;
}
// ITERATIVE MERGE SORT
async function iterativeMergeSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    const n = end;
    var minLen = 1;
    while (minLen < n) {
        var i = lo;
        while (i < n) {
            var leftStart = i;
            var leftEnd = i + minLen - 1;
            var rightStart = i + minLen;
            var rightEnd = i + 2 * minLen - 1;
            if (rightStart >= n) {
                break;
            }
            if (rightEnd >= n) {
                rightEnd = n - 1;
            }
            sortTask.increment();
            if (toSort[leftEnd] > toSort[rightStart]) { // best case condition
                const temp = await itMerge(lo, n, toSort, sortTask, leftStart, leftEnd, rightStart, rightEnd);
                const limit = rightEnd - leftStart + 1;
                for (let j = 0; j < limit && sortTask.isStarted; j++) {
                    await sortTask.visit(i + j);
                    toSort[i + j] = temp[j];
                    sortTask.sortStatus[j] = SORTED;
                    sortTask.increment();
                }
            }
            i = i + 2 * minLen;
        }
        minLen = 2 * minLen;
    }
}

async function itMerge(lo, hi, toSort, sortTask, leftStart, leftEnd, rightStart, rightEnd) {
    const temp = new Array(hi - lo);
    var i = 0;
    while (leftStart <= leftEnd && rightStart <= rightEnd && sortTask.isStarted) {
        if (toSort[leftStart] <= toSort[rightStart]) {
            temp[i] = toSort[leftStart];
            await sortTask.visit(leftStart);
            leftStart++;
        } else {
            temp[i] = toSort[rightStart];
            await sortTask.visit(rightStart);
            rightStart++;
        }
        sortTask.increment();
        i++;
    }

    while (leftStart <= leftEnd && sortTask.isStarted) {
        temp[i] = toSort[leftStart];
        await sortTask.visit(leftStart);
        leftStart++;
        i++;
        sortTask.increment();
    }

    while (rightStart <= rightEnd && sortTask.isStarted) {
        temp[i] = toSort[rightStart];
        await sortTask.visit(rightStart);
        rightStart++;
        i++;
        sortTask.increment();
    }
    return temp;
}
// PATIENCE SORT
async function patienceSort(toSort, sortTask) {
    const piles = [];
    const toSortCopy = [...toSort];
    const getFromToSort = (p, pilesIndex) => getLastPileItemPS(p, pilesIndex);
    for (let i = 0; i < toSort.length; ++i) {
        sortTask.increment();
        if (sortTask.isFinished()) return;
        await sortTask.visit(i);
        var b = false;
        var j = 0;
        const newCard = toSortCopy[i];

        // linear card pile search
        for (; j < piles.length; ++j) {
            sortTask.increment();
            // if we start from the leftmost pile and find a card greater than the current we push
            if (getLastPileItemPS(piles, j) > newCard) {
                piles[j].push(newCard);
                b = true;
                break;
            }
        }
        // if no pile was found make a new one and push current
        if (!b) {
            piles.push([newCard]);
        }

        // binary card pile search + heapify
        // const pileIndex = binarySearch(sortTask, piles, newCard, getFromToSort);
        // if (pileIndex <= 0) {
        //     j = Math.max(0, -pileIndex - 1);
        //     // if there is a next pile it's last card is always greater, so push
        //     if (pileIndex ===-0 || j === piles.length) {
        //         piles.push([newCard]);
        //     } else if (j + 1 < piles.length) {
        //         piles[j + 1].push(newCard);
        //     } else if (j - 1 > 0) {
        //         piles.splice(j - 1, 0, [newCard]);
        //     }
        // } else {
        //     j = pileIndex;
        //     piles[pileIndex].push(newCard);
        // }
        swapElementsWithCards(toSort, piles, sortTask);
    }

    let i = 0;
    while (piles.length > 0) {
        if (sortTask.isFinished()) return;
        const pile = piles[0];
        sortTask.increment();
        await sortTask.visit(i);
        toSort[i] = pile.pop();
        sortTask.sortStatus[i] = SORTED;
        i++;

        if (pile.length <= 0) {
            piles.shift();
        }
        if (piles.length > 0) {
            //swap(piles, 0, piles.length - 1);
            // minHeapifyPiles(piles, sortTask, 0);
            for (let j = (piles.length >>> 1) - 1; j >= 0; --j) {
                if (sortTask.isFinished()) return;
                minHeapifyPiles(piles, sortTask, j);
            }
        }
    }
}

function swapElementsWithCards(toSort, piles, sortTask) {
    for (let i = 0, k = 0; i < piles.length; ++i) {
        const p = piles[i];
        for (let j = p.length - 1; j >= 0; --j) {
            if (sortTask.isFinished()) return;
            toSort[k++] = p[j];
        }
    }
}

function minHeapifyPiles(piles, sortTask, i, n = piles.length) {
    const half = piles.length >>> 1;
    let smallest = i;
    while (i < half) {
        if (sortTask.isFinished()) return;
        const left = (i << 1) + 1;
        const right = left + 1;
        sortTask.increment();
        if (left < n && getLastPileItemPS(piles, left) < getLastPileItemPS(piles, smallest)) {
            smallest = left;
            sortTask.increment();
        }
        if (right < n && getLastPileItemPS(piles, right) < getLastPileItemPS(piles, smallest)) {
            smallest = right;
            sortTask.increment();
        }
        if (smallest === i) {
            return;
        }
        swap(piles, i, smallest);
        i = smallest;
    }
}
// CIRCLE SORT
async function circleSort(toSort, sortTask, lo = 0, hi = toSort.length - 1, end = toSort.length) {
    while (await circleSortRec(toSort, sortTask, lo, hi, end));
    for (k = 0; k < toSort.length - 1; ++k) {
        sortTask.sortStatus[k] = SORTED;
    }
    await sortTask.sleep();
}

async function circleSortRec(toSort, sortTask, low, high, end) {
    if (sortTask.isFinished()) return false;
    let swapped = false;
    sortTask.increment();
    if (low === high) {
        return false;
    }

    let lo = low;
    let hi = high;

    while (lo < hi) {
        if (sortTask.isFinished()) return false;
        if (toSort[lo] > toSort[hi]) {
            sortTask.increment();
            await sortTask.visit(lo, hi);
            sortTask.sortStatus[lo] = NOT_SORTED;
            sortTask.sortStatus[hi] = NOT_SORTED;
            swap(toSort, lo, hi);
            swapped = true;
        }
        lo++;
        hi--;
    }
    // central element if it exists
    if (lo === hi) {
        sortTask.increment();
        hi++;
        if (toSort[lo] > toSort[hi]) {
            await sortTask.visit(lo, hi);
            sortTask.sortStatus[lo] = NOT_SORTED;
            sortTask.sortStatus[hi] = NOT_SORTED;
            swap(toSort, lo, hi);
            swapped = true;
        }
    }

    let mid = (high - low) >>> 1;
    let firstHalf = await circleSortRec(toSort, sortTask, low, low + mid);
    let secondHalf = await circleSortRec(toSort, sortTask, low + mid + 1, high);
    sortTask.sortStatus[low + mid + 1] = SORTED;
    return swapped || firstHalf || secondHalf;
}
// ITERATIVE CIRCLE SORT
async function circleSortIterative(toSort, sortTask) {
    const startCycle = {
        low: 0,
        high: toSort.length - 1
    };
    const loHiStack = [startCycle];
    while (loHiStack.length > 0) {
        let swapped = false;
        const {
            low,
            high
        } = loHiStack.pop()
        sortTask.increment();
        if (low === high) continue;
        let lo = low;
        let hi = high;
        if (lo === hi) return;
        while (lo < hi) {
            if (sortTask.isFinished()) return;
            if (toSort[lo] > toSort[hi]) {
                sortTask.increment();
                await sortTask.visit(lo, hi);
                sortTask.sortStatus[lo] = NOT_SORTED;
                sortTask.sortStatus[hi] = NOT_SORTED;
                swap(toSort, lo, hi);
                swapped = true;
            }
            lo++;
            hi--;
        }

        // central element if it exists
        if (lo === hi) {
            await sortTask.visit(hi);
            sortTask.increment();
            hi++;
            if (toSort[lo] > toSort[hi]) {
                await sortTask.visit(lo, hi);
                sortTask.sortStatus[lo] = NOT_SORTED;
                sortTask.sortStatus[hi] = NOT_SORTED;
                swap(toSort, lo, hi);
                swapped = true;
            }
        }
        let mid = (high - low) >>> 1;
        loHiStack.push({
            low: low,
            high: low + mid
        });
        loHiStack.push({
            low: low + mid + 1,
            high: high
        });
        // if swap occured we have to keep cycling but we only want one (0, n - 1) cycle present on the stack
        if (swapped && (loHiStack.length <= 0 || loHiStack[0] != startCycle)) {
            loHiStack.unshift(startCycle);
        }
    }
}
// COUNTING SORT
async function countingSort(toSort, sortTask) {
    var n, i, j = 0,
        max = -((1 << 32) - 1),
        min = 1 << 32;
    for (i = 0; i < toSort.length; i++) {
        if (sortTask.isFinished()) return;
        await sortTask.visit(i);
        sortTask.increment();
        min = Math.min(min, toSort[i]);
        max = Math.max(max, toSort[i]);
    }
    var count;
    if (min < 0) {
        const min_abs = abs(min);
        n = max + min_abs + 1;
        count = new Array(n);
        for (i = 0; i < toSort.length; i++) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            if (count[min_abs + toSort[i]]) {
                count[min_abs + toSort[i]]++;
            } else {
                count[min_abs + toSort[i]] = 1;
            }
        }
        for (i = 0; i < n; i++) {
            if (sortTask.isFinished()) return;
            if (count[i] > 0) {
                while (count[i] > 0) {
                    if (sortTask.isFinished()) return;
                    sortTask.increment();
                    await sortTask.visit(j);
                    toSort[j] = i - min_abs;
                    sortTask.sortStatus[j] = SORTED;
                    j++;
                    count[i]--;
                }
            }
            sortTask.increment();
        }
    } else {
        n = max + 1;
        count = new Array(n);
        for (i = 0; i < toSort.length; i++) {
            if (sortTask.isFinished()) return;
            if (count[toSort[i]]) {
                count[toSort[i]]++;
            } else {
                count[toSort[i]] = 1;
            }
        }
        for (i = 0, j = 0; i < n; i++) {
            if (sortTask.isFinished()) return;
            if (count[i] > 0) {
                while (count[i] > 0) {
                    sortTask.increment();
                    await sortTask.visit(j);
                    toSort[j] = i;
                    sortTask.sortStatus[j] = SORTED;
                    j++;
                    count[i]--;
                }
            }
            sortTask.increment();
        }
    }
}
/*
 * HELPERS
 */
function binarySearch(sortTask, elements, value,
    // default array access and comparison functions
    getFromElements = (e, i) => e[i],
    compareTo = (a, b) => a > b ? 1 : a === b ? 0 : -1) {
    let low = 0;
    let high = elements.length - 1;
    while (low <= high) {
        if (sortTask.isFinished()) return;
        let mid = (low + high) >>> 1;
        const cur = getFromElements(elements, mid);
        const compareToRes = compareTo(cur, value);
        sortTask.increment();
        if (compareToRes < 0) {
            // increase the minimum boundary and skip mid which has been visited
            low = mid + 1;
        } else if (compareToRes > 0) {
            // lower the maximum boundary
            high = mid - 1;
        } else {
            return mid;
        }
    }
    // return the expected index where value should be -> (-low - 1)
    return -low;
}

function getLastPileItemPS(piles, i) {
    const pile = piles[i];
    return pile[pile.length - 1];
}

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function abs(n) {
    mask = n >> 31;
    return ((n + mask) ^ mask);
}