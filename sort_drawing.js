const CANVAS_SCALE = 0.8;
const w = ((window.innerWidth > 0) ? window.innerWidth : screen.width) * CANVAS_SCALE;
const h = ((window.innerHeight > 0) ? window.innerHeight : screen.height) * CANVAS_SCALE;
const MAX_ELEMENTS = 50;
const MIN_ELEMENTS = 50;
const COLOURS = ["red", "yellow", "blue", "teal", "green", "white"];
const NOT_SORTED = 0;
const SORTED = 1;
const GREATER = 2;
const LESSER = 3;
const VERIFIED_SORTED = 4;
const VISITED = 5;

onload = () => {
    initP5SortDrawer("heap", "Heap Sort", heapSort);
    initP5SortDrawer("bubble", "Bubble Sort", bubbleSort);
    initP5SortDrawer("merge", "Merge Sort", mergeSort);
    initP5SortDrawer("sleep", "Sleep Sort", sleepSort);
    initP5SortDrawer("quick", "Quick Sort", quickSort);
    initP5SortDrawer("selection", "Selection Sort", selectionSort);
    initP5SortDrawer("insertion", "Insertion Sort", insertionSort);
    initP5SortDrawer("comb", "Comb Sort", combSort);
    initP5SortDrawer("comb-insertion", "Comb-Insertion Sort", combInsertionSort);
    // collapsible descriptions
    var elements = document.getElementsByClassName("collapsible");
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", function () {
            this.classList.toggle("active");
            const subElements = elements[i].getElementsByClassName("collapsible-content");
            for (let j = 0; j < subElements.length; j++) {
                var content = subElements[j];
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            }

        });
    }
}

class SortTask {
    constructor(sketch, sortLabel, sortFunc, ms, s) {
        this.sketch = sketch;
        this.sortLabel = sortLabel;
        this.isStarted = false;
        this.sortFunc = sortFunc;
        this.operations = 0;
        this.seeNumbers = false;
        this.ms = ms;
        this.sortStatus = new Array(s).fill(0);
        this.mms = ms;
        this.msC = 5;
    }

    async doSort() {
        if (this.isStarted) return;
        this.sortStatus.fill(0);
        this.operations = 0;
        this.isStarted = true;
        await this.sortFunc.apply(this, arguments);
        // verify
        const toSort = arguments[0];
        let lastVerified;
        for (let i = 1; i < this.sortStatus.length; i++) {
            if (!this.isStarted) return;
            if (toSort[i - 1] <= toSort[i]) {
                this.sortStatus[i - 1] = VERIFIED_SORTED;
                this.sortStatus[i] = VERIFIED_SORTED;
            } else {
                lastVerified = i;
            }
            await this.sleep();
        }
        for (let i = lastVerified; i >= 0; i--) {
            if (!this.isStarted) return;
            this.sortStatus[i] = NOT_SORTED;
            await this.sleep();
        }
        // finish
        this.isStarted = false;
    }
    async visit(...toVisit) {
        const prev = new Array(toVisit.length);
        for (let i = 0; i < toVisit.length; ++i) {
            prev[i] = this.sortStatus[toVisit[i]];
            this.sortStatus[toVisit[i]] = VISITED;
        }
        await this.sleep();
        for (let i = 0; i < toVisit.length; ++i) {
            this.sortStatus[toVisit[i]] = prev[i];
        }
    }
    setMs(ms) {
        this.ms = ms;
        this.mms = ms;
    }
    increment() {
        if (this.isStarted) {
            this.operations++;
        }
    }
    isFinished() {
        return !this.isStarted;
    }
    async sleep() {
        if (this.mms <= 0) {
            if (this.msC <= 0) {
                await sleep(1);
                this.msC = 1000;
            } else {
                this.msC -= (1000 + this.ms * 100);
            }
        } else {
            await sleep(this.ms);
        }
    }
}

function initP5SortDrawer(sortId, sortLabel, sort) {
    new p5(
        (sketch) => {

            const arraySize = document.getElementById(`${sortId}-elements-range`);
            var s = Math.min(parseInt(arraySize.value), w);
            var elementsScale = w > s ? w / s : s / w;

            var rangePercent = 0; // 1 / 100
            var maxNumber = h - h * rangePercent;
            var minNumber = h * rangePercent;
            var elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);
            var toSort = [...elements];

            // array size
            arraySize.oninput = async () => {
                s = Math.min(parseInt(arraySize.value), w);
                elementsScale = w > s ? w / s : s / w;
                sortTask.isStarted = false;
                elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);
                setTimeout(() => {
                    toSort.length = 0;
                    toSort.push(...elements)
                    sortTask.sortStatus.length = elements.length;
                    sortTask.sortStatus.fill(0);
                    sortTask.operations = 0;
                }, 100);
            };

            // millis to sleep for 'animation' effect
            const millis = document.getElementById(`${sortId}-millis-range`);
            const msMax = parseInt(millis.max);
            const msMin = parseInt(millis.min);
            var ms = msMax - parseInt(millis.value);
            // sort task init
            var sortTask = new SortTask(sketch, sortLabel, sort, ms, s);
            millis.oninput = () => {
                sortTask.setMs(msMax - parseInt(millis.value) + msMin);
            };

            // reset
            document.getElementById(`reset-${sortId}-btn`).addEventListener('click', () => {
                sortTask.isStarted = false;
                setTimeout(() => {
                    toSort = [...elements];
                    sortTask.sortStatus.fill(0);
                    sortTask.operations = 0;
                }, 100);
            });
            // sort
            document.getElementById(`sort-${sortId}-btn`).addEventListener('click', async () => {
                await sortTask.doSort(toSort, sortTask);
            });
            // see numbers
            document.getElementById(`tgl-numbers-${sortId}-btn`).addEventListener('click', async () => {
                sortTask.seeNumbers = !sortTask.seeNumbers;
            });
            // colour mode
            const HSB = 1;
            const CODED = 2;
            var currentMode = HSB;
            var nextMode = CODED;
            document.getElementById(`tgl-colour-mode-${sortId}-btn`).addEventListener('click', async () => {
                [currentMode, nextMode] = [nextMode, currentMode];
            });
            // numbers range
            const range = document.getElementById(`${sortId}-range`);
            range.oninput = () => {
                maxNumber = updateElementsRange(parseInt(range.value) / 100, toSort, elements, sortTask);
            };
            sketch.setup = () => {
                sketch.createCanvas(w, h);
            };
            sketch.draw = () => {
                switch (currentMode) {
                    case HSB:
                        drawElementsHSBMode(sketch, toSort, elementsScale, minNumber, maxNumber, sortTask);
                        break;
                    default:
                        drawElementsColourCoded(sketch, toSort, elementsScale, maxNumber, sortTask);
                }
            };
        },
        `${sortId}-sort`);
}

function updateElementsRange(m, toSort, elements, sortTask) {
    sortTask.isStarted = false;
    const high = h - h * m;
    const low = h * m;
    const size = elements.length;
    elements.length = 0;
    elements.push(...getRandomElementsWithZero(size, -low, high * 0.90));
    setTimeout(() => {
        toSort.length = 0;
        toSort.push(...elements)
        sortTask.sortStatus.fill(0);
    }, 25);
    return high;
}

function drawElementsHSBMode(sketch, elements, elementsScale, minNumber, maxNumber, sortTask) {
    sketch.background(0);
    sketch.push();
    sketch.translate(0, maxNumber);
    sketch.scale(1, -1);
    sketch.strokeWeight(1 * elementsScale);
    sketch.colorMode(sketch.HSB, 360, 100, 100);
    // maybe some there is some way we don't do this every time
    const yPart = 1 / absDifference(maxNumber, minNumber);
    for (let x = 0; x < elements.length; x++) {
        const y = elements[x];
        const xSortStatus = sortTask.sortStatus[x];
        if (xSortStatus == VISITED) {
            drawBar(sketch, x, y, elementsScale, sketch.color(100));
        } else {
            drawBar(sketch, x, y, elementsScale, sketch.color(Math.abs(1 - (yPart * y)) * 360, 80, 80))
        }
    }
    drawElementNumbers(sketch, elements, elementsScale, maxNumber, sortTask);
    drawOperations(sketch, elements, sortTask);
}

function drawElementsColourCoded(sketch, elements, elementsScale, maxNumber, sortTask) {
    sketch.background(0);
    sketch.push();
    sketch.translate(0, maxNumber);
    sketch.scale(1, -1);
    sketch.strokeWeight(1 * elementsScale);
    for (let x = 0; x < elements.length; x++) {
        const y = elements[x];
        drawBar(sketch, x, y, elementsScale, sketch.color(COLOURS[sortTask.sortStatus[x]]))
    }
    drawElementNumbers(sketch, elements, elementsScale, maxNumber, sortTask);
    drawOperations(sketch, elements, sortTask);
}

function drawBar(sketch, x, y, elementsScale, colour) {
    sketch.stroke(colour);
    let xS = x * elementsScale + elementsScale / 2
    sketch.line(xS, 0, xS, y);
}

function drawOperations(sketch, elements, sortTask) {
    sketch.pop();
    sketch.stroke(50);
    sketch.strokeWeight(1);
    sketch.textSize(12);
    sketch.fill(255);
    sketch.text(`${sortTask.sortLabel}: ${sortTask.operations} operations to sort ${elements.length} elements.`, w * 0.005, h * 0.03);
}

function drawElementNumbers(sketch, elements, elementsScale, maxNumber, sortTask) {
    sketch.scale(1, -1);
    sketch.rotate(sketch.radians(270));
    // adjusting nonsense so we can see the numbers better
    const adjust = maxNumber / h;
    const offset = 10 - Math.floor(10 * adjust);
    for (let x = 0; x < elements.length; x++) {
        let xS = x * elementsScale
        let y = elements[x];
        sketch.stroke(50);
        if (sortTask.seeNumbers) {
            sketch.strokeWeight(1);
            sketch.textSize(1.3 * elementsScale);
            sketch.fill(255);
            sketch.text(y, -offset + Math.max(y, y - y * adjust), xS + elementsScale);
        }
    }
}
/*
    SORT ALORITHMS START
 */
// QUICK SORT
async function quickSort(toSort, sortTask) {
    await quickSortRec(toSort, 0, toSort.length - 1, sortTask);
}
async function quickSortRec(toSort, low, high, sortTask) {
    if (sortTask.isFinished()) return;
    if (low < high) {
        await sortTask.visit(low, high);
        sortTask.increment();
        let pi = await partition(toSort, low, high, sortTask);
        sortTask.sortStatus[pi] = SORTED;
        await quickSortRec(toSort, low, pi - 1, sortTask);
        await sortTask.sleep();
        sortTask.sortStatus[pi - 1] = SORTED;
        await quickSortRec(toSort, pi + 1, high, sortTask);
        await sortTask.sleep();
        sortTask.sortStatus[high] = SORTED;
        sortTask.sortStatus[low] = SORTED;
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
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        await heapify(toSort, n, i, sortTask);
    }

    for (let i = n - 1; i > 0; i--) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        sortTask.sortStatus[i] = SORTED;
        swap(toSort, 0, i);
        // restore the max heap property for the remaining elements
        await heapify(toSort, i, 0, sortTask);
    }
    sortTask.sortStatus[0] = SORTED;

    async function heapify(arr, n, i, sortTask) {
        if (sortTask.isFinished()) return;
        await sortTask.visit(i);
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            swap(arr, i, largest);
            sortTask.sortStatus[largest] = LESSER;
            sortTask.sortStatus[i] = GREATER;
            sortTask.increment();
            await heapify(arr, n, largest, sortTask);
        }
    }
}
// BUBBLE SORT
async function bubbleSort(toSort, sortTask) {
    var i, j, m, p;
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
// INSERTION SORT
async function insertionSort(toSort, sortTask) {
    let i, key, j, n = toSort.length;
    for (i = 1; i < n; i++) {
        if (sortTask.isFinished()) return;
        sortTask.increment();
        key = toSort[i];
        j = i - 1;
        while (j >= 0 && toSort[j] > key) {
            if (sortTask.isFinished()) return;
            sortTask.increment();
            toSort[j + 1] = toSort[j];
            await sortTask.visit(j);
            sortTask.sortStatus[j - 1] = SORTED;
            sortTask.sortStatus[j] = SORTED;
            sortTask.sortStatus[j + 1] = SORTED;
            j = j - 1;

        }
        toSort[j + 1] = key;
    }
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
        left[i] = toSort[leftI + i];
        await sortTask.visit(i);
    }
    for (let j = 0; j < rightSize && sortTask.isStarted; j++) {
        right[j] = toSort[middle + 1 + j];
        await sortTask.visit(j);
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

function absDifference(a, b) {
    return Math.max(a, b) - Math.min(a, b);
}