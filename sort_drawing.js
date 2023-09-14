const CANVAS_SCALE = 0.8;
const w = ((window.innerWidth > 0) ? window.innerWidth : screen.width) * CANVAS_SCALE;
const h = ((window.innerHeight > 0) ? window.innerHeight : screen.height) * CANVAS_SCALE;
const MAX_ELEMENTS = 50;
const COLOURS = ["red", "yellow", "blue", "teal", "green"];
const NOT_SORTED = 0;
const SORTED = 1;
const GREATER = 2;
const LESSER = 3;
const VERIFIED_SORTED = 4;

onload = () => {
    initP5SortDrawer("heap", "Heap Sort", heapSort);
    initP5SortDrawer("bubble", "Bubble Sort", bubbleSort);
    initP5SortDrawer("merge", "Merge Sort", mergeSort);
    initP5SortDrawer("sleep", "Sleep Sort", sleepSort);
    initP5SortDrawer("quick", "Quick Sort", quickSort);
}

class SortTask {
    constructor(sortLabel, sortFunc) {
        this.sortLabel = sortLabel;
        this.isOff = true;
        this.isStarted = false;
        this.sortFunc = sortFunc;
        this.operations = 0;
    }

    async doSort() {
        if (this.isStarted) return;
        this.operations = 0;
        this.isOff = false;
        this.isStarted = true;
        await this.sortFunc.apply(this, arguments);
        const sortStatus = arguments[1];
        for (let i = 0; i < sortStatus.length; i++) {
            if (this.isOff) return;
            sortStatus[i] = VERIFIED_SORTED;
            await sleep(1);
        }
        this.isStarted = false;
        this.isOff = true;
    }
    increment() {
        if (this.isStarted) {
            this.operations++;
        }
    }
}

function initP5SortDrawer(sortId, sortLabel, sort) {
    const s = Math.min(MAX_ELEMENTS, w);
    const elementsScale = w > MAX_ELEMENTS ? w / MAX_ELEMENTS : 1;
    new p5(
        (sketch) => {
            var rangePercent = 0; // 1 / 100
            var maxNumber = h - h * rangePercent;
            var minNumber = h * rangePercent;
            var elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);
            var toSort = [...elements];
            var sortStatus = new Array(s).fill(0);
            var sortTask = new SortTask(sortLabel, sort);

            // millis to sleep for 'animation' effect
            const millis = document.getElementById(`${sortId}-millis-range`);
            const msMax = parseInt(millis.max);
            var ms = msMax - parseInt(millis.value);
            millis.oninput = () => {
                ms = msMax - parseInt(millis.value);
            };

            // reset
            document.getElementById(`reset-${sortId}-btn`).addEventListener('click', () => {
                sortTask.isOff = true;
                sortTask.isStarted = false;
                setTimeout(() => {
                    toSort = [...elements];
                    sortStatus.fill(0);
                    sortTask.operations = 0;
                }, 100);
            });
            // sort
            document.getElementById(`sort-${sortId}-btn`).addEventListener('click', async () => {
                await sortTask.doSort(toSort, sortStatus, sortTask, ms);
            });
            const range = document.getElementById(`${sortId}-range`);
            range.oninput = () => {
                maxNumber = updateElementsRange(parseInt(range.value) / 100, toSort, elements, sortTask, sortStatus);
            };
            sketch.setup = () => {
                sketch.createCanvas(w, h);
            };
            sketch.draw = () => {
                drawElements(sketch, toSort, elementsScale, maxNumber, sortStatus, sortTask);
            };
        },
        `${sortId}-sort`);
}

function updateElementsRange(m, toSort, elements, offSwitch, sortStatus) {
    offSwitch.isOff = true;
    const high = h - h * m;
    const low = h * m;
    const size = elements.length;
    elements.length = 0;
    elements.push(...getRandomElementsWithZero(size, -low, high * 0.90));
    setTimeout(() => {
        toSort.length = 0;
        toSort.push(...elements)
        sortStatus.fill(0);
    }, 25);
    return high;
}

function drawElements(sketch, elements, elementsScale, maxNumber, sortStatus, sortTask) {
    sketch.background(0);
    sketch.push();
    sketch.translate(0, maxNumber);
    sketch.scale(1, -1);
    sketch.strokeWeight(1 * elementsScale);
    for (let x = 0; x < elements.length; x++) {
        let y = elements[x];
        sketch.stroke(COLOURS[sortStatus[x]]);
        let xS = x * elementsScale + elementsScale / 2
        sketch.line(xS, 0, xS, y);
    }

    sketch.scale(1, -1);
    sketch.rotate(sketch.radians(270));
    // adjusting nonsense so we can see the numbers better
    const adjust = maxNumber / h;
    const offset = 10 - Math.floor(10 * adjust);
    for (let x = 0; x < elements.length; x++) {
        let xS = x * elementsScale
        let y = elements[x];
        sketch.stroke(50);
        sketch.strokeWeight(1);
        sketch.textSize(15);
        sketch.fill(255);
        sketch.text(y, -offset + Math.max(y, y - y * adjust), xS + elementsScale);
    }
    sketch.pop();
    sketch.stroke(50);
    sketch.strokeWeight(1);
    sketch.textSize(15);
    sketch.fill(255);
    sketch.text(`${sortTask.sortLabel}: ${sortTask.operations} operations to sort ${elements.length} elements.`, h * 0.03, w * 0.03);
}

/*
    SORT ALORITHMS START
 */
// QUICK SORT
async function quickSort(toSort, sortStatus, sortTask, ms) {
    await quickSortRec(toSort, 0, toSort.length - 1, sortStatus, sortTask, ms);
}
async function quickSortRec(toSort, low, high, sortStatus, sortTask, ms) {
    if (sortTask.isOff) return;
    if (low < high) {
        sortTask.increment();
        let pi = await partition(toSort, low, high, sortStatus, sortTask, ms);
        await quickSortRec(toSort, low, pi - 1, sortStatus, sortTask, ms);
        await quickSortRec(toSort, pi + 1, high, sortStatus, sortTask, ms);
        sortStatus[pi] = SORTED;
        sortStatus[low] = SORTED;
        sortStatus[high] = SORTED;
    }
}

async function partition(toSort, low, high, sortStatus, sortTask, ms) {
    if (sortTask.isOff) return;
    await sleep(ms);
    let pivot = toSort[high];
    sortStatus[high] = GREATER;
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        if (sortTask.isOff) return;
        sortTask.increment();
        await sleep(ms);
        if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);
            if (sortStatus[j] != GREATER) {
                sortStatus[j] = LESSER;
            }
        }
    }
    swap(toSort, i + 1, high);
    return i + 1;
}


// SLEEP SORT
async function sleepSort(toSort, sortStatus, sortTask, ms) {
    const result = new Array();
    let i = 0;
    await Promise.all(
        toSort.map(async (n) => {
            if (sortTask.isOff) return;
            sortTask.increment();
            await new Promise((res) => setTimeout(res, n));
            sortStatus[i++] = GREATER;
            result.push(n);
        }));
    for (let j = 0; j < result.length; j++) {
        if (sortTask.isOff) return;
        sortTask.increment();
        toSort[j] = result[j];
        await sleep(ms);
        sortStatus[j] = SORTED
    }
}
// HEAP SORT
async function heapSort(toSort, sortStatus, sortTask, ms) {
    const n = toSort.length;

    // Build a max heap starting from the last non-leaf node
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (sortTask.isOff) return;
        await heapify(toSort, n, i, sortStatus, sortTask, ms);
    }

    for (let i = n - 1; i > 0; i--) {
        if (sortTask.isOff) return;
        // Swap the maximum element (at index 0) with the last element
        sortStatus[i] = SORTED;
        swap(toSort, 0, i);
        // Restore the max heap property for the remaining elements
        await heapify(toSort, i, 0, sortStatus, sortTask, ms);
    }
    sortStatus[0] = SORTED;

    // Heapify function to maintain the max heap property
    async function heapify(arr, n, i, sortStatus, sortTask, ms) {
        await sleep(ms);
        let smallest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && arr[left] > arr[smallest]) {
            sortTask.increment();
            smallest = left;
        }

        if (right < n && arr[right] > arr[smallest]) {
            sortTask.increment();
            smallest = right;
        }

        if (smallest !== i) {
            sortTask.increment();
            swap(arr, i, smallest);
            sortStatus[smallest] = GREATER;
            sortStatus[i] = LESSER;

            // Recursively heapify the affected sub-tree
            await heapify(arr, n, smallest, sortStatus, sortTask, ms);
        }
    }
}
// BUBBLE SORT
async function bubbleSort(toSort, sortStatus, sortTask, ms) {
    var i, j, m, p;
    var swapped;
    for (i = 0; i < toSort.length - 1; i++) {
        if (sortTask.isOff) return;
        swapped = false;
        for (j = 0; j < toSort.length - i - 1; j++) {
            if (sortTask.isOff) return;
            sortStatus[j] = GREATER;
            sortTask.increment();
            await sleep(ms);
            if (toSort[j] > toSort[j + 1]) {
                m = j + 1;
                p = m;
                swap(toSort, j, j + 1);
                swapped = true;

                if (sortStatus[m] != SORTED) {
                    sortStatus[m] = GREATER;
                }
                sortStatus[m - 1] = NOT_SORTED;
            } else if (sortStatus[p] != SORTED) {
                sortStatus[p] = NOT_SORTED;
            }
        }

        if (swapped == false) {
            for (k = 0; k < toSort.length - 1; k++) {
                sortStatus[k] = SORTED;
            }
            break;
        } else {
            sortStatus[j] = SORTED;
        }
    }
    sortStatus[0] = SORTED;
}
// MERGE SORT
async function mergeSort(toSort, sortStatus, sortTask, ms) {
    await mergeSortRec(toSort, 0, toSort.length - 1, sortStatus, sortTask, ms);
}
async function mergeSortRec(toSort, leftI, rightI, sortStatus, sortTask, ms) {
    if (sortTask.isOff) {
        return;
    }
    if (leftI >= rightI) {
        return;
    }
    var m = leftI + parseInt((rightI - leftI) / 2);
    await mergeSortRec(toSort, leftI, m, sortStatus, sortTask, ms);
    await mergeSortRec(toSort, m + 1, rightI, sortStatus, sortTask, ms);
    await merge(toSort, leftI, m, rightI, sortStatus, sortTask, ms);
}

async function merge(toSort, leftI, middle, rightI, sortStatus, sortTask, ms) {
    if (sortTask.isOff) return;
    var leftSize = middle - leftI + 1;
    var rightSize = rightI - middle;
    var left = new Array(leftSize);
    var right = new Array(rightSize);
    for (let i = 0; i < leftSize && !sortTask.isOff; i++) {
        left[i] = toSort[leftI + i];
        sortStatus[leftI + i] = GREATER;
    }
    for (let j = 0; j < rightSize && !sortTask.isOff; j++) {
        right[j] = toSort[middle + 1 + j];
        sortStatus[middle + 1 + j] = GREATER;
    }
    var i = 0;
    var j = 0;
    var k = leftI;

    while (i < leftSize && j < rightSize && !sortTask.isOff) {
        if (left[i] <= right[j]) {
            toSort[k] = left[i];
            i++;
            sortStatus[k] = SORTED;
        } else {
            toSort[k] = right[j];
            j++;
            sortStatus[k] = SORTED;
        }
        await sleep(ms);
        k++;
        sortTask.increment();
    }

    while (i < leftSize && !sortTask.isOff) {
        toSort[k] = left[i];
        sortStatus[k] = SORTED;
        i++;
        k++;
        await sleep(ms);
        sortTask.increment();
    }

    while (j < rightSize && !sortTask.isOff) {
        toSort[k] = right[j];
        sortStatus[k] = SORTED;
        j++;
        k++;
        await sleep(ms);
        sortTask.increment();
    }
}
/*
    SORT ALORITHMS END
 */

// HELPERS
function getRandomElementsWithZero(size, lowerBound, upperBound) {
    const elements = [];
    for (let i = 0; i < size; i++) {
        elements.push(Math.floor(getRandom(lowerBound, upperBound)));
    }
    elements[size / 2] = 0;
    return elements;
}

function getRandom(lower, upper) {
    return Math.random() * (upper - lower) + lower;
}
async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}