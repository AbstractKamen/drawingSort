const CANVAS_SCALE = 0.8;
var w = ((window.innerWidth > 0) ? window.innerWidth : screen.width) * CANVAS_SCALE;
var h = ((window.innerHeight > 0) ? window.innerHeight : screen.height) * CANVAS_SCALE;
const MIN_ELEMENTS = 50;
const COLOURS = ["red", "yellow", "blue", "teal", "green", "white"];
const NOT_SORTED = 0;
const SORTED = 1;
const GREATER = 2;
const LESSER = 3;
const VERIFIED_SORTED = 4;
const VISITED = 5;
const BAR_RATIO = 0.9;
const FRAME_RATE = 30;

function init() {
    initP5SortDrawer("heap", "Heap Sort", heapSort);
    initP5SortDrawer("bubble", "Bubble Sort", bubbleSort);
    initP5SortDrawer("brick", "Brick Sort", brickSort);
    initP5SortDrawer("shaker", "Shaker Sort", shakerSort);
    initP5SortDrawer("merge", "Merge Sort", mergeSort);
    initP5SortDrawer("iterative-merge", "Iterative Merge Sort", iterativeMergeSort);
    initP5SortDrawer("sleep", "Sleep Sort", sleepSort);
    initP5SortDrawer("quick", "Quick Sort", quickSort);
    initP5SortDrawer("iterative-quick", "Iterative Quick Sort", iterativeQuickSort);
    initP5SortDrawer("comb", "Comb Sort", combSort);
    initP5SortDrawer("selection", "Selection Sort", selectionSort);
    initP5SortDrawer("insertion", "Insertion Sort", insertionSort);
    initP5SortDrawer("comb-insertion", "Comb-Insertion Sort", combInsertionSort);
    initP5SortDrawer("shell", "Shell Sort", shellSort);
    initP5SortDrawer("patience", "Patience Sort", patienceSort);
    initP5SortDrawer("circle", "Circle Sort", circleSortIterative);
    initP5SortDrawer("counting", "Counting Sort", countingSort);
    initP5SortDrawer("bucket", "Bucket Sort", bucketSort, BUCKET_COMP_SORTS, BUCKET_COMP_SORTS[0]);
    //initP5SortDrawer("circle", "Circle Sort", circleSort);
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
onload = init;
const BUCKET_COMP_SORTS = [
    {
        'label': function () {
            return "Insertion Sort";
        },
        sort: bucketInsertionSort
    },
    {
        'label': function () {
            return "Quick Sort";
        },
        sort: bucketQuickSort
    },
    {
        'label': function () {
            return "Merge Sort";
        },
        sort: bucketMergeSort
    }
];
class SortTask {
    constructor(sketch, sortLabel, sortFunc, ms, s, ...additionalArgs) {
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
        this.additionalArgs = additionalArgs;
    }

    async doSort() {
        if (this.isStarted) return;
        this.sortStatus.fill(0);
        this.operations = 0;
        this.isStarted = true;
        const args = [...arguments, ...this.additionalArgs]
        await this.sortFunc.apply(this, args);
        // verify
        const toSort = arguments[0];
        let lastVerified;
        for (let i = 1; i < toSort.length; i++) {
            if (!this.isStarted) return;
            if (toSort[i - 1] <= toSort[i]) {
                this.sortStatus[i - 1] = VERIFIED_SORTED;
                this.sortStatus[i] = VERIFIED_SORTED;
            } else {
                lastVerified = i;
                console.log(i - 1, i);
                console.log(toSort[i - 1], toSort[i]);
                for (let item of toSort) {
                    console.log(typeof item, item);
                }
                break;
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
    increment(i = 1) {
        if (this.isStarted) {
            this.operations += i;
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

function elementScale(width, elements) {
    return width > elements ? width / elements : elements / width;
}

function initP5SortDrawer(sortId, sortLabel, sort, compSorts, currentCompSort) {
    new p5(
        (sketch) => {
            sketch.frameRate(FRAME_RATE);
            const arraySize = document.getElementById(`${sortId}-elements-range`);
            var s = Math.min(parseInt(arraySize.value), w);
            arraySize.max = w;
            var elementsScale = elementScale(w, s);

            var rangePercent = 0; // 1 / 100
            var maxNumber = h - h * rangePercent;
            var minNumber = h * rangePercent;
            var elements = getRandomElementsWithZero(s, -minNumber, maxNumber);
            var toSort = [...elements];

            // array size
            arraySize.oninput = async () => {
                s = Math.min(parseInt(arraySize.value), w);
                elementsScale = elementScale(w, s);
                sortTask.isStarted = false;
                elements = getRandomElementsWithZero(s, -minNumber, maxNumber);
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
            var sortTask = new SortTask(sketch, sortLabel, sort, ms, s, currentCompSort);
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
            const DISTINCT = 2;
            var currentMode = HSB;
            var nextMode = DISTINCT;
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
            // comp sorts
            const compSortBtn = document.getElementById(`${sortId}-comp-sort-btn`);
            if (compSortBtn != undefined && compSorts != undefined) {
                const compSortContent = document.getElementById(`${sortId}-comp-sort-content`);
                compSortBtn.textContent = currentCompSort.label();
                loadDropDownContent(compSortContent, compSortBtn, compSorts, (selection) => {
                    currentCompSort = compSorts[selection];
                    // todo
                    sortTask.additionalArgs = [currentCompSort];
                    compSortBtn.textContent = currentCompSort.label();
                    compSortContent.classList.toggle("show");
                    return false;
                });
            }
        },
        `${sortId}-sort`);
}

function loadDropDownContent(contentHtmlElement, contentBtn, labeledContent, onClickFunc) {
    for (var i = 0; i < labeledContent.length; i++) {
        let a = document.createElement("a");
        const curI = i;
        a.onclick = () => onClickFunc(curI);
        a.href = '#';
        a.textContent = labeledContent[i].label();
        a.classList = ["dropdown-content-a"];
        contentHtmlElement.appendChild(a);
    }
    contentBtn.addEventListener("click", () => contentHtmlElement.classList.toggle("show"));
}

function updateElementsRange(m, toSort, elements, sortTask) {
    sortTask.isStarted = false;
    const high = h - h * m;
    const low = h * m;
    const size = elements.length;
    elements.length = 0;
    elements.push(...getRandomElementsWithZero(size, -low, high));
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
    //sketch.strokeCap(sketch.SQUARE);
    sketch.colorMode(sketch.HSB, 360, 100, 100);
    const yPart = 1 / Math.max(100, absDifference(0, maxNumber));
    const yPartNeg = 1 / Math.max(100, absDifference(0, minNumber));
    for (let x = 0; x < elements.length; x++) {
        const y = elements[x];
        const xSortStatus = sortTask.sortStatus[x];
        var sb = 70;
        if (xSortStatus == VISITED) {
            sb = 100;
        }
        var c = sketch.color(yPart * y * 360, sb, sb);
        if (y < 0) {
            c = sketch.color(360 - (((1 - yPartNeg) * -y )), sb, sb);
        }
        drawBar(sketch, x, y, elementsScale, c);
    }
    drawElementNumbers(sketch, elements, elementsScale, sortTask);
    stats(sketch, elements, sortTask);
}

function drawElementsColourCoded(sketch, elements, elementsScale, maxNumber, sortTask) {
    sketch.background(0);
    sketch.push();
    sketch.translate(0, maxNumber);
    sketch.scale(1, -1);
    sketch.strokeWeight(1 * elementsScale);
    // sketch.strokeCap(sketch.SQUARE);
    for (let x = 0; x < elements.length; x++) {
        const y = elements[x];
        drawBar(sketch, x, y, elementsScale, sketch.color(COLOURS[sortTask.sortStatus[x]]))
    }
    drawElementNumbers(sketch, elements, elementsScale, sortTask);
    stats(sketch, elements, sortTask);
}

function drawBar(sketch, x, y, elementsScale, colour) {
    sketch.stroke(colour);
    let xS = x * elementsScale + elementsScale / 2
    sketch.line(xS, 0, xS, y * BAR_RATIO);
}

function stats(sketch, elements, sortTask) {
    sketch.pop();
    sketch.stroke(50);
    sketch.strokeWeight(1);
    sketch.textSize(12);
    sketch.fill(255);
    sketch.text(`${sortTask.sortLabel} ≈ ${sortTask.operations} operations to sort ${elements.length} elements.`, w * 0.005, h * 0.05);
}

function drawElementNumbers(sketch, elements, elementsScale, sortTask) {
    sketch.scale(1, -1);
    sketch.rotate(sketch.radians(270));
    for (let x = 0; x < elements.length; x++) {
        let xS = x * elementsScale
        let y = elements[x];
        sketch.stroke(50);
        if (sortTask.seeNumbers) {
            sketch.strokeWeight(1);
            sketch.textSize(1.3 * elementsScale);
            sketch.fill(255);
            sketch.text(y, y * BAR_RATIO, xS + elementsScale);
        }
    }
}

function getRandomElementsWithZero(size, lowerBound, upperBound) {
    const elements = [];
    for (let i = 0; i < size; i++) {
        elements.push(Math.floor(getRandom(lowerBound, upperBound)));
    }
    return elements;
}

function getRandom(lower, upper) {
    return Math.random() * (upper - lower) + lower;
}
async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
}

function absDifference(a, b) {
    return a ^ b;
}