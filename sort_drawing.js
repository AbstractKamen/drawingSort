const CANVAS_SCALE = 0.8;
const w = ((window.innerWidth > 0) ? window.innerWidth : screen.width) * CANVAS_SCALE;
const h = ((window.innerHeight > 0) ? window.innerHeight : screen.height) * CANVAS_SCALE;
const MAX_ELEMENTS = 50;
const COLOURS = ["red", "green", "teal", "blue"];
const NOT_SORTED = 0;
const SORTED = 1;
const LESSER = 2;
const GREATER = 3;
var i = 0;
onload = () => {
    initSorts();
}

function initSorts() {
    const s = Math.min(MAX_ELEMENTS, w);
    const elementsScale = w > MAX_ELEMENTS ? w / MAX_ELEMENTS : 1;
    // bubble
    new p5(
        (sketch) => {
            var m = 0;
            var hh = h - h * m;
            var ll = h * m;
            var elements = getRandomElementsWithZero(s, -ll, hh * 0.90);
            var toSort = [...elements];
            var sortStatus = new Array(s).fill(0);
            var offSwitch = {
                isOff: true,
                isStarted: false
            };
            const millis = document.getElementById("bubble-millis-range");
            var ms = parseInt(millis.value);
            millis.oninput = () => {
                ms = parseInt(millis.value);
                console.log(ms);
            };


            document.getElementById('reset-bubble-btn').addEventListener('click', () => {
                offSwitch.isOff = true;
                setTimeout(() => {
                    toSort = [...elements];
                    sortStatus.fill(0);
                }, 25);
            });

            document.getElementById('sort-bubble-btn').addEventListener('click', async () => {
                if (offSwitch.isStarted) return;
                offSwitch.isStarted = true;
                offSwitch.isOff = false;
                await doBubbleSort(toSort, sortStatus, offSwitch, ms);
                offSwitch.isOff = true;
                offSwitch.isStarted = false;
            });
            const range = document.getElementById("bubble-range");
            range.oninput = () => {
                hh = updateElementsRange(parseInt(range.value) / 100, toSort, elements, offSwitch, sortStatus);
            };
            sketch.setup = () => {
                sketch.createCanvas(w, h);
            };
            sketch.draw = () => {
                drawElements(sketch, toSort, elementsScale, hh, sortStatus);
            };

            async function doBubbleSort(toSort, sortStatus, offSwitch) {
                var i, j, temp;
                var swap;
                console.log(ms);
                for (i = 0; i < toSort.length - 1; i++) {
                    if (offSwitch.isOff) return true;
                    swap = false;

                    for (j = 0; j < toSort.length - i - 1; j++) {
                        if (offSwitch.isOff) return true;
                        await sleep(ms);
                        if (toSort[j] > toSort[j + 1]) {
                            temp = toSort[j];
                            toSort[j] = toSort[j + 1];
                            toSort[j + 1] = temp;
                            swap = true;
                            if (sortStatus[i] != SORTED) {
                                sortStatus[i] = GREATER;
                            }
                        }
                    }

                    sortStatus[j] = SORTED;
                }
                sortStatus[0] = SORTED;
            }
        },
        'bubble-sort');

    // merge
    new p5(
        (sketch) => {
            var m = 0;
            var hh = h - h * m;
            var ll = h * m;
            var elements = getRandomElementsWithZero(s, -ll, hh * 0.90);
            var toSort = [...elements];
            var sortStatus = new Array(s).fill(0);
            var offSwitch = {
                isOff: true,
                isStarted: false
            };
            const millis = document.getElementById("merge-millis-range");
            var ms = parseInt(millis.value);
            millis.oninput = () => {
                ms = parseInt(millis.value);
            };

            document.getElementById('reset-merge-btn').addEventListener('click', () => {
                offSwitch.isOff = true;
                setTimeout(() => {
                    toSort = [...elements];
                    sortStatus.fill(0);
                }, 25);
            });

            document.getElementById('sort-merge-btn').addEventListener('click', async () => {
                if (offSwitch.isStarted) return;
                offSwitch.isStarted = true;
                offSwitch.isOff = false;
                await doMergeSort(toSort, 0, toSort.length - 1, sortStatus, offSwitch, ms);
                offSwitch.isOff = true;
                offSwitch.isStarted = false;
            });
            const range = document.getElementById("merge-range");
            range.oninput = () => {
                hh = updateElementsRange(parseInt(range.value) / 100, toSort, elements, offSwitch, sortStatus);
            };
            sketch.setup = () => {
                sketch.createCanvas(w, h);
            };
            sketch.draw = () => {
                drawElements(sketch, toSort, elementsScale, hh, sortStatus);
            };
            async function doMergeSort(toSort, leftI, rightI, sortStatus, offSwitch, ms) {
                if (offSwitch.isOff) {
                    return;
                }
                if (leftI >= rightI) {
                    return;
                }
                var m = leftI + parseInt((rightI - leftI) / 2);
                await doMergeSort(toSort, leftI, m, sortStatus, offSwitch, ms);
                await doMergeSort(toSort, m + 1, rightI, sortStatus, offSwitch, ms);
                await merge(toSort, leftI, m, rightI, sortStatus, offSwitch, ms);
            }

            async function merge(toSort, leftI, middle, rightI, sortStatus, offSwitch, ms) {
                if (offSwitch.isOff) {
                    return;
                }
                var leftSize = middle - leftI + 1;
                var rightSize = rightI - middle;
                var left = new Array(leftSize);
                var right = new Array(rightSize);
                for (let i = 0; i < leftSize; i++) {
                    left[i] = toSort[leftI + i];
                    sortStatus[leftI + i] = GREATER;
                }
                for (let j = 0; j < rightSize; j++) {
                    right[j] = toSort[middle + 1 + j];
                    sortStatus[middle + 1 + j] = GREATER;
                }
                var i = 0;
                var j = 0;
                var k = leftI;

                while (i < leftSize && j < rightSize) {
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
                }

                while (i < leftSize) {
                    toSort[k] = left[i];
                    sortStatus[k] = SORTED;
                    i++;
                    k++;
                    await sleep(ms);
                }

                while (j < rightSize) {
                    toSort[k] = right[j];
                    sortStatus[k] = SORTED;
                    j++;
                    k++;
                    await sleep(ms);
                }
            }
        },
        'merge-sort');
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

function drawElements(sketch, elements, elementsScale, hh, sortStatus) {
    sketch.background(0);
    sketch.translate(0, hh);
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
    // adjusting nonsense
    const adjust = hh / h;
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
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

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