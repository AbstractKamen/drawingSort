// QUICK SORT
async function quickSort(toSort, sortTask) {
    await quickSortRec(toSort, 0, toSort.length - 1, sortTask);
}
async function quickSortRec(toSort, low, high, sortTask) {
    if (sortTask.isFinished()) return;
    while (low < high) {
        sortTask.increment();
        let pi = await partition(toSort, low, high, sortTask);
        sortTask.sortStatus[pi] = SORTED;
        sortTask.sortStatus[pi - 1] = SORTED;
        if (pi - low < high - pi) {
            await quickSortRec(toSort, low, pi - 1, sortTask);
            sortTask.sortStatus[low] = SORTED;
            low = pi + 1;
        } else {
            await quickSortRec(toSort, pi + 1, high, sortTask);
            sortTask.sortStatus[high] = SORTED;
            high = pi - 1;
        }
    }
}
// ITERATIVE QUICK SORT
async function iterativeQuickSort(toSort, sortTask) {
    const loHiStack = [{
        low: 0,
        high: toSort.length - 1
    }];
    while (loHiStack.length > 0) {
        if (sortTask.isFinished()) return;
        const {
            low,
            high
        } = loHiStack.pop();
        if (low < high) {
            sortTask.increment();
            let pi = await partition(toSort, low, high, sortTask);
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

function medianOfThree(toSort, low, high) {
    const a = toSort[low];
    const mid = Math.floor((low + high) / 2);
    const b = toSort[mid];
    const c = toSort[high];
    // [a, b, c] a >= b >= c --> mid
    // [c, b, a] c >= b >= a --> mid
    // [b, a, c] b >= a >= c --> low
    // [c, a, b] c >= a >= b --> low
    // [b, c, a] b >= c >= a --> high
    // [a, c, b] a >= c >= b --> high
    if (a >= b && b >= c || c >= b && b >= a) {
        return mid;
    } else if (b >= a && a >= c || c >= a && a >= b) {
        return low;
    } else {
        return high;
    }
}

async function partition(toSort, low, high, sortTask) {
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
// SLEEP SORT
async function sleepSort(toSort, sortTask) {
    const result = new Array();
    let i = 0;
    await Promise.all(
        toSort.map(async (n) => {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            await new Promise((res) => setTimeout(res, n));
            await sortTask.visit(i++);
            result.push(n);
        }));
    for (let j = 0; j < result.length; j++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        toSort[j] = result[j];
        await sortTask.visit(j);
        sortTask.sortStatus[j] = SORTED
    }
}
// HEAP SORT
async function heapSort(toSort, sortTask) {
    const n = toSort.length;

    // make a max heap starting from the last non-leaf node
    for (let i = (n >>> 1) - 1; i >= 0; --i) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await maxHeapify(toSort, n, i, sortTask);
    }

    for (let i = n - 1; i > 0; --i) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        sortTask.sortStatus[i] = SORTED;
        swap(toSort, 0, i);
        // restore the max heap property for the remaining elements
        await maxHeapify(toSort, i, 0, sortTask);
    }
    sortTask.sortStatus[0] = SORTED;
}
async function maxHeapify(arr, n, i, sortTask) {
    const half = n >>> 1;
    while (i < half) {
        if (sortTask.isFinished()) return;

        const visit = [i]
        let largest = i;
        const left = (i << 1) + 1;
        const right = left + 1;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
            sortTask.increment();
            visit.push(left);
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
            sortTask.increment();
            visit.push(right);
        }

        if (largest == i) {
            return; // no further swaps needed
        }
        await sortTask.visit(...visit);
        swap(arr, i, largest);
        sortTask.sortStatus[largest] = LESSER;
        sortTask.sortStatus[i] = GREATER;
        i = largest; // move to the next level of the heap
    }
}
// BUBBLE SORT
async function bubbleSort(toSort, sortTask) {
    var i, j, m;
    var swapped;
    for (i = 0; i < toSort.length - 1; i++) {
        if (sortTask.isFinished()) return;
        swapped = false;
        sortTask.increment();
        for (j = 0; j < toSort.length - i - 1; j++) {
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

        if (swapped == false) {
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

        if (swapped == false) {
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

        if (swapped == false) {
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
            await sortTask.visit(i);
            await insertionBackstepLoop(toSort, sortTask, i, g, async j => {
                await sortTask.visit(i, j);
            });
        }
    }
    return toSort;
}
// COMB-INSERTION SORT
async function combInsertionSort(toSort, sortTask) {
    let n = toSort.length;
    let comb = n;
    let swapped = true;
    while (comb != 1 || swapped == true) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        comb = getNextComb(comb);
        swapped = false;
        if (comb <= 7) {
            await insertionSort(toSort, sortTask);
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
async function insertionSort(toSort, sortTask) {
    let i, n = toSort.length;
    for (i = 1; i < n; i++) {
        if (sortTask.isFinished()) return;
        await sortTask.visit(i);
        await insertionBackstepLoop(toSort, sortTask, i, 1);
    }
}
async function insertionBackstepLoop(toSort, sortTask, cur, backStep,
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
    while (j >= 0 && toSort[j] > key) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        // insertion
        toSort[j + backStep] = toSort[j];
        await markInserted(j);
        j -= backStep;

    }
    toSort[j + backStep] = key;
}
// COMB SORT
async function combSort(toSort, sortTask) {
    let n = toSort.length;
    let comb = n;
    let swapped = true;
    while (comb != 1 || swapped == true) {
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
            await sortTask.visit(j);

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
async function mergeSort(toSort, sortTask) {
    await mergeSortRec(toSort, 0, toSort.length - 1, sortTask);
}
async function mergeSortRec(toSort, leftI, rightI, sortTask) {
    if (sortTask.isFinished()) {
        return;
    }
    if (leftI >= rightI) {
        return;
    }
    var m = leftI + parseInt((rightI - leftI) / 2);
    await mergeSortRec(toSort, leftI, m, sortTask);
    await mergeSortRec(toSort, m + 1, rightI, sortTask);
    await merge(toSort, leftI, m, rightI, sortTask);
}

async function merge(toSort, leftI, middle, rightI, sortTask) {
    if (sortTask.isFinished()) return;
    var leftSize = middle - leftI + 1;
    var rightSize = rightI - middle;
    var left = new Array(leftSize);
    var right = new Array(rightSize);
    for (let i = 0; i < leftSize && sortTask.isStarted; i++) {
        await sortTask.visit(i, leftI + i);
        left[i] = toSort[leftI + i];
        sortTask.increment();
    }
    for (let j = 0; j < rightSize && sortTask.isStarted; j++) {
        await sortTask.visit(j, middle + 1 + j);
        right[j] = toSort[middle + 1 + j];
        sortTask.increment();
    }
    var i = 0;
    var j = 0;
    var k = leftI;

    while (i < leftSize && j < rightSize && sortTask.isStarted) {
        if (left[i] <= right[j]) {
            toSort[k] = left[i];
            i++;
            sortTask.sortStatus[k] = SORTED;
        } else {
            toSort[k] = right[j];
            j++;
            sortTask.sortStatus[k] = SORTED;
        }
        await sortTask.visit(k);
        sortTask.increment();
        k++;
    }

    while (i < leftSize && sortTask.isStarted) {
        toSort[k] = left[i];
        sortTask.sortStatus[k] = SORTED;
        await sortTask.visit(k);
        i++;
        k++;
        sortTask.increment();
    }

    while (j < rightSize && sortTask.isStarted) {
        toSort[k] = right[j];
        sortTask.sortStatus[k] = SORTED;
        await sortTask.visit(k);
        j++;
        k++;
        sortTask.increment();
    }
}
// PATIENCE SORT
async function patienceSort(toSort, sortTask) {
    const piles = [];
    const toSortCopy = [...toSort];
    const getFromToSort = (p, pilesIndex) => toSortCopy[getLastPileItemPS(p, pilesIndex)];
    const desc = (a, b) => a > b ? 1 : a == b ? 0 : -1;
    for (let i = 0; i < toSort.length; ++i) {
        sortTask.increment();
        if (sortTask.isFinished()) return;
        await sortTask.visit(i);
        var b = false;
        var j = 0;
        // linear card pile search
        // for (; j < piles.length; ++j) {
        //     sortTask.increment();
        //     // if we start from the leftmost pile and find a card greater than the current we push
        //     if (toSortCopy[getLastPileItemPS(piles, j)] > toSortCopy[i]) {
        //         piles[j].push(i);
        //         b = true;
        //         break;
        //     }
        // }
        // // if no pile was found make a new one and push current
        // if (!b) {
        //     piles.push([i]);
        //     j = piles.length - 1;
        // }

        // binary card pile search + heapify
        const pileIndex = binarySearch(sortTask, piles, toSort[i], getFromToSort, desc);
        if (pileIndex <= 0) {
            j = Math.max(0, -pileIndex - 1);
            // if there is a next pile it's last card is always greater, so push
            if (j + 1 < piles.length) {
                piles[j + 1].push(i);
            } else {
                piles.push([i]);
            }
        } else {
            j = pileIndex;
            piles[pileIndex].push(i);
        }
        // preserve piles order
        minHeapifyPiles(toSortCopy, piles, sortTask, j);
        swapElementsWithCards(toSort, toSortCopy, piles, sortTask, i);
    }

    let i = 0;
    while (piles.length > 0) {
        if (sortTask.isFinished()) return;
        const pile = piles[0];
        sortTask.increment();
        await sortTask.visit(i);

        toSort[i] = toSortCopy[pile.pop()];
        if (pile.length <= 0) {
            piles.shift();
        }
        sortTask.sortStatus[i] = SORTED;
        i++;
        for (let j = (piles.length >>> 1) - 1; j >= 0; --j) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            minHeapifyPiles(toSortCopy, piles, sortTask, j, piles.length);
        }
    }
}

function swapElementsWithCards(toSort, toSortCopy, piles, sortTask, start) {
    for (let i = 0, k = 0; i < piles.length; ++i) {
        const p = piles[i];
        for (let j = p.length - 1; j >= 0; --j) {
            if (sortTask.isFinished()) return;
            toSort[k++] = toSortCopy[p[j]];
        }
    }
}

function minHeapifyPiles(toSort, piles, sortTask, i, n = piles.length) {
    const half = piles.length >>> 1;
    let smallest = i;
    while (i < half) {
        if (sortTask.isFinished()) return;
        const left = (i << 1) + 1;
        const right = left + 1;
        if (left < n && toSort[getLastPileItemPS(piles, left)] < toSort[getLastPileItemPS(piles, smallest)]) {
            smallest = left;
            sortTask.increment();
        }
        if (right < n && toSort[getLastPileItemPS(piles, right)] < toSort[getLastPileItemPS(piles, smallest)]) {
            smallest = right;
            sortTask.increment();
        }
        if (smallest == i) {
            return;
        }
        swap(piles, i, smallest);
        i = smallest;
    }
}

function binarySearch(sortTask, elements, value,
    // default array access and comparison functions
    getFromElements = (e, i) => e[i],
    compareTo = (a, b) => a > b ? 1 : a == b ? 0 : -1) {
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

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}