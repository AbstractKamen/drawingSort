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
    const sortsContainer = document.getElementById('sorts');
    const sleepSortDescription = "A rather unconventional sorting algorithm that exploits the concept of timedelays or \"sleeping\" to sort a list of numbers.For each number in the input list, create a separate thread, task, or process.In each thread, set a timer or delay that is proportional to the value of the number beingsorted.For example, if a number is 5, the thread will sleep for 5 units of time.When all threads have finished sleeping, collect the numbers in the order in which they wokeup.This order will be a sorted sequence. Sleep Sort is a fun and intriguing concept but is not suitable for practical sorting tasksdue toits inefficiency and reliance on multithreading or asynchronous operations. It's mainly usedas an educational or recreational algorithm to demonstrate the idea of concurrency and timing. Due to the unstable nature of this algorithm and the way \"super speed\" is implemented it will almost always fail to sort large lists.";
    const countingSortDescription = "Counting sort works by creating a count array to store the frequency of each unique element in the input array. It then uses this count array to determine the position of each element in the sorted output array. The algorithm is especially useful when the range of input values (k) is not significantly larger than the number of elements to be sorted (n). It is efficient for small ranges of integers but becomes impractical for large ranges due to the space required by the count array.";
    const bucketSortDescription = "Bucket sort is a comparison-based sorting algorithm that distributes elements into a number of buckets, sorts each bucket individually, and then concatenates the sorted buckets to produce the final sorted array. Its sorting stability depends on the algorithm used to sort each bucket. Its advantages are that it is simple to implement and is efficient for uniformly distributed data. Its disadvantages are that performance degrades if elements are not uniformly distributed and it requires additional space for buckets.";
    const quickSortDescription = "A highly efficient and widely used sorting algorithm known for its average-case performance. It begins by choosing a \"pivot\" element from the array. The choice of the pivot can be random or deterministic (in the example the pivot is the length of the subarray -1). Rearrange the elements in the array such that all elements less than the pivot are on the left side, and all elements greater than the pivot are on the right side. The pivot itself is in its final sorted position. Recursively apply the Quick Sort algorithm to the subarrays formed on the left and right sides of the pivot until the entire array is sorted.No additional combining step is needed because the array is sorted in place. Quick Sort is efficient because, on average, it has a time complexity of O(n log n), where \"n\" is the number of elements to be sorted. It has good cache performance and can be implemented in a way that uses relatively little additional memory. However, its worst-case time complexity is O(n^2) if the pivot selection and partitioning are not well-balanced, making it important to choose pivots wisely or use randomized pivot selection to avoid worst-case scenarios. In the example you can see the worst case if you try to sort an already sorted array.";
    const iterativeQuickSortDescription = "An iterative implementation of the Quick Sort algorithm with the help of a stack datastructure. Since we are not using recursion the algorithm starts from the end.";
    const mergeSortDescription = "A widely used and efficient comparison-based sorting algorithm known for its stability and guaranteed time complexity. It uses the 'divide and conquer' approach and is typically recursive. Begin by taking the unsorted list and split it into two roughly equal halves. This division continues recursively until each sublist contains just one element, which is considered already sorted. The individual sublists are then merged back together, and during this merging process, the elements are sorted. This is done by comparing the elements from the two sublists and placing them in sorted order. The merging step continues until a single sorted list remains, containing all the elements from the original unsorted list. Merge Sort is highly efficient and stable, meaning that no matter what the dataset is (almost sorted, sorted, random, etc.) the time complexity will still be O(n log n) and the order of equal elements before and after sorting is guaranteed to remain the same. It's often used as the basis for other sorting algorithms and is a fundamental concept in computer science.";
    const iterativeMergeSortDescription = "Merge Sort is an alternative implementation of the traditional Merge Sort algorithm that avoids recursion and instead uses an iterative approach. It is a comparison-based sorting algorithm that divides the input array into smaller subarrays, sorts them, and then merges the sorted subarrays to produce a fully sorted array. Unlike the recursive version of Merge Sort, the unoptimised iterative version uses a second auxiliary array, to perform the merging. With an auxiliary array, the space complexity is O(n), but it can be further optimized to O(1) with in-place merging at the cost of O(n^2logn) time complexity.";
    const heapSortDescription = "An efficient comparison-based sorting algorithm that operates by transforming an input array into a binary heap data structure and then repeatedly extracting the maximum (for the current max-heap example) element from the heap, placing it at the end of the array, and adjusting the heap to maintain its properties. The algorithm starts by building a heap from the given input array. This is done by iterating through the array from the bottom up and ensuring that the heap property is maintained at each step. For a max-heap, this means that the parent node is greater than or equal to its child nodes. After the heap is built, the largest element is at the root of the heap (index 0). Swap this element with the last element in the array. This effectively moves the maximum element to its correct sorted position at the end of the array. To maintain the heap property, heapify the remaining elements in the heap. This involves moving the new root element down the tree until the heap property is restored Heap Sort has a time complexity of O(n log n) for worst-case, average-case, and best-case scenarios. It's an in-place, stable, and comparison-based sorting algorithm, making it a reliable choice for sorting large datasets. However, it's less commonly used in practice compared to algorithms like Quick Sort or Merge Sort for most scenarios due to its slightly higher overhead.";
    const bubbleSortDescription = "A simple and easy to understand sorting algorithm. It repeatedly iterates through the list to be sorted, compares adjacent elements, and swaps them if they are in the wrong order. Starting at the beginning of the list. Compare the first two elements. If the first element is larger (in the context of sorting in ascending order), swap them. Move one position to the right and repeat for the next pair of elements. Continue this process, comparing and swapping adjacent elements as needed, until you reach the end of the list. After one pass through the list, the largest unsorted element will have \"bubbled up\" to the end of the list. Continue these passes until no more swaps are needed, indicating that the entire list is sorted. Bubble Sort is straightforward to understand and implement, but it is generally inefficient for large lists, especially when compared to more advanced sorting algorithms like Merge Sort or Quick Sort. It has a time complexity of O(n^2) in the worst case, where n is the number of elements in the list, making it less suitable for large datasets.";
    const brickSortDescription = "Brick Sort, also known as Odd-Even Sort, is a sorting algorithm that builds upon the principles of the Bubble Sort but with improved performance. It is named \"Brick Sort\" because it resembles the process of arranging bricks in a wall. The algorithm divides the list into two parts: the odd elements and the even elements. It then repeatedly compares and swaps adjacent pairs of elements within each part to sort the entire list. The worst-case time complexity of Brick Sort is O(n^2), where n is the number of elements in the list. This makes it less efficient than some other sorting algorithms for large lists. However, its performance can be improved by adding early termination checks to detect sorted or nearly sorted lists.";
    const shakerSortDescription = "Shaker Sort, also known as Cocktail Sort, is a variation of the bubble sort algorithm. Itdoes it's sorting by moving the largest value to the end of the list. Then when it reachesthe end instead of starting over like bubble sort it starts going back to the beginning thistime moving the smallest value it finds. It keeps doing this until no swaps have occurredand the list is sorted. The shaker sort has the bubble sort optimisation for sorting analready sorted list. It is also slightly faster than the normal bubble sort time but it'sworst case is still O(n^2).";
    const combSortDescription = "Comb Sort is a comparison-based sorting algorithm that improves upon the Bubble Sortalgorithm by eliminating or reducing the number of small values at the end of the listquickly.Initialize a gap (initially a large value) that determines the distance between elements tobe compared and swapped. Commonly, the gap is set to a value slightly less than the lengthof the list.Iterate through the list, comparing elements that are separated by the current gap value. Iftwo elements are out of order, swap them.Reduce the gap size (commonly by a fixed reduction factor, often around 1.3) and repeat thecomparisons and swaps until the gap becomes 1.Continue the process with a gap of 1, which is essentially performing a final pass of BubbleSort to ensure the remaining small elements \"bubble\" to their correct positions.Comb Sort's name comes from the idea of \"combing\" through the list with decreasing gapsizes. While it is not the most efficient sorting algorithm, it is an improvement overBubble Sort and is simple to understand and implement. It has an average-case timecomplexity of O(n^2), but its performance can be improved with certain variations andoptimizations.";
    const insertionSortDescription = "Insertion Sort is a simple and efficient comparison-based sorting algorithm. Start with the second element (index 1) of the array. This element is assumed to be part of the sorted portion of the array. Compare the second element with the one before it (the first element) and move the second element to its correct position within the sorted portion of the array. If the second element is smaller, swap it with the first element. Move on to the third element (index 2) and repeat the process, shifting it leftwards within the sorted portion until it is in its correct position relative to the already sorted elements. Continue this process for each subsequent element in the array, one at a time, until the entire array is sorted. Insertion Sort is an in-place sorting algorithm, meaning it doesn't require additional memory for sorting, and it works well for small to moderately sized lists. However, its time complexity is O(n^2) in the worst case, making it less efficient than some other sorting algorithms for large lists.";
    const shellSortDescription = "Shell Sort is an advanced sorting algorithm designed to improve upon the basic insertion sort method. It operates by dividing the input data into smaller chunks, and applies insertion sort separately to each of them. These chunks are created by selecting elements at fixed intervals or gaps. The key innovation in Shell Sort is the gradual reduction of these intervals, leading to a more sorted state before the final pass.<br> The algorithm begins with a relatively large gap between elements, making it efficient for moving smaller values to the beginning of the array and larger values to the end. This initial step helps reduce the overall work required for subsequent sorting passes. As the algorithm progresses, the gap decreases (by factor of 2.3 in this example), eventually reaching a value of 1, at which point Shell Sort behaves similarly to the traditional insertion sort.<br> By employing this step-by-step approach, Shell Sort capitalizes on the advantages of insertion sort for partially sorted subarrays, significantly improving sorting efficiency. While it doesn't guarantee the optimal time complexity, Shell Sort provides a practical balance between simplicity and performance, making it a valuable sorting method for various applications.";
    const selectionSortDescription = "Selection Sort is a simple comparison-based sorting algorithm that works by repeatedly selecting the smallest element from an unsorted portion of the list and moving it to the beginning of the sorted portion. Initially, the sorted part is empty, and the unsorted part contains all elements. Iterate through the whole unsorted part and find the smallest. Swap this smallest element with the leftmost element in the unsorted part, effectively moving it to the sorted part. Expand the sorted part by one element, and reduce the unsorted part by one element. Selection Sort is easy to understand and implement but is not the most efficient sorting algorithm as it has a time complexity of O(n^2). It is mainly used for educational purposes or for small lists where simplicity is more important than performance.";
    const combInsertionSortDescription = "Comb-Insertion Hybrid Sort is a sorting algorithm that combines two different sorting techniques, namely Comb Sort and Insertion Sort, to achieve improved performance for certain types of input data. The Comb-Insertion Hybrid Sort algorithm combines the two approaches. It starts with Comb Sort to quickly reduce the distance between elements, and when the gap becomes small (7 in the example), it switches to Insertion Sort. This hybridization leverages the strengths of Comb Sort for initial gap reduction and Insertion Sort for final fine-grained sorting. The advantage of this hybrid approach is that it can take advantage of Comb Sort's efficiency in handling larger gaps and Insertion Sort's efficiency in handling smaller gaps, making it a potentially faster sorting algorithm compared to using either method in isolation, especially for lists that are partially sorted or have elements with varying magnitudes.";
    const patienceSortDescription = "<p>Patience Sort is a sorting algorithm inspired by the patience card game. It is used to efficiently sort a sequence of elements, typically represented as a deck of cards, by creating piles of cards following specific rules and then merging these piles to obtain the sorted sequence. Patience Sort is known for its simplicity and effectiveness, especially in scenarios where the number of elements is moderate, but the input data is not fully sorted. It's an adaptive algorithm, making it efficient for partially sorted lists. It's also a stable sorting algorithm, meaning that it preserves the relative order of equal elements.</p><p>Initialization: Start with an empty array of piles and iterate through the elements to be sorted.</p><p>Pile Creation: For each element, find the leftmost pile where it can be placed on top according to the sorting order. If no such pile exists, create a new pile with the element.</p><p>Merging Piles: Once all elements are placed into piles, merge them to obtain the sorted sequence. This typically involves using a min-heap data structure. During merging, the top card of each pile is compared, and the smallest card is added to the sorted sequence. The pile from which the card was removed is refilled with the next card, and this process continues until all cards are merged. The result of the merging process is a sorted sequence of elements.</p><p>Complexity: The algorithm has a time complexity of O(n * log n), where n is the number of elements to be sorted. The most time-consuming step is merging the piles. The space complexity is O(n) because it requires extra space to store the piles.</p><p>Patience Sort is rarely used in practical applications due to its space and time complexities. However, it serves as an interesting algorithmic concept and is used as a benchmark in sorting algorithm analysis.</p>";
    const circleSortDescription = "Circle Sort, also known as Cycle Sort, is an in-place and unstable sorting algorithm designed to minimize the number of writes to memory. It is particularly useful for situations where write operations are expensive or limited. Circle Sort works by selecting an element from the unsorted portion of the array and repeatedly cycling it to its correct position, effectively building a sorted sequence one element at a time. Circle Sort selects an element from the unsorted portion of the array and cycles it through its correct position in the sorted portion. This process continues until all elements are in their correct positions. To cycle an element to its correct position, the algorithm detects cycles within the array. A cycle is a set of elements where each element's final position is occupied by another element in the cycle. Once all cycles are identified it cycles the elements within each cycle until they reach their correct positions. This process is repeated for each unsorted element until the entire array is sorted. The algorithm keeps track of the sorted portion and the remaining unsorted portion.";
    const pinInsertionSortDescription = "Pin Insertion Sort is an extension of the standard insertion sort that optimizes the process of finding the correct position for each element. It leverages a pin element, which is typically the last element in the array, to create an additional boundary for comparisons. This helps reduce the number of comparisons and shifts required for certain elements";
    const pairInsertionSortDescription = "Pair Insertion Sort is an extension of the classic insertion sort that sorts pairs of elements simultaneously. This variation attempts to improve efficiency by reducing the number of comparisons and shifts needed to sort the array. The idea is to take two elements at a time, insert them in their correct positions within the already sorted part of the array, and repeat this process for the entire array.";
    const binaryInsertionSortDescription = "Binary Insertion Sort is a variation of the traditional insertion sort that uses binary search to reduce the number of comparisons needed to find the correct position for the element being inserted. Instead of comparing elements sequentially, binary search is used to find the position in the already sorted portion of the array, which reduces the time complexity of the search to O(logn). However, the shifting of elements to make room for the inserted element still takes O(n) in the worst case, resulting in the same overall time complexity as traditional insertion sort for the entire sorting process.";

    initAlgorithm(sortsContainer, getAlgorithmUITemplate("bubble", "Bubble Sort", "Stable, In place, O(n^2) time complexity", bubbleSortDescription), bubbleSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("selection", "Selection Sort", "Not Stable, In place, O(n^2) time complexity", selectionSortDescription), selectionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("brick", "Brick Sort", "Stable, In place, O(n^2) time complexity", brickSortDescription), brickSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("shaker", "Shaker Sort", "Stable, In place, O(n^2) time complexity", shakerSortDescription), shakerSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("comb", "Comb Sort", "Not Stable, In place, O(n^2) time complexity", combSortDescription), combSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("circle", "Circle Sort", "Not Stable, In place, O(n^2) time complexity", circleSortDescription), circleSortIterative);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("insertion", "Insertion Sort", "Stable, In place, O(n^2) time complexity", insertionSortDescription), insertionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("binary-insertion", "Binary Insertion Sort", "Stable, O(n^2) time complexity", binaryInsertionSortDescription), binaryInsertionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("pair-insertion", "Pair Insertion Sort", "Stable, In place, O(n^2) time complexity", pairInsertionSortDescription), pairInsertionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("pin-insertion", "Pin Insertion Sort", "Stable, In place, O(n^2) time complexity", pinInsertionSortDescription), pinInsertionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("comb-insertion", "Comb-Insertion Sort", "Not Stable, In place, O(n^2) time complexity", combInsertionSortDescription), combInsertionSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("shell", "Shell Sort", "Not Stable, In place, O(n^2) time complexity", shellSortDescription), shellSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("sleep", "Sleep Sort", "Not Stable, O(n) time complexity", sleepSortDescription), sleepSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("patience", "Patience Sort", "Stable, Not In place, O(n^2) time complexity", patienceSortDescription), patienceSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("counting", "Counting Sort", "Not Stable, O(n) time complexity", countingSortDescription), countingSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("bucket", "Bucket Sort", "Stable, O(n log n) time complexity", bucketSortDescription, "Individual Bucket Sort: "), bucketSort, BUCKET_COMP_SORTS, BUCKET_COMP_SORTS[0]);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("tim", "Tim Sort", "Stable, O(nlogn) time complexity"), timSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("quick", "Quick Sort", "Not Stable, In place, O(n log n) time complexity", quickSortDescription), quickSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("iterative-quick", "Iterative Quick Sort", "Not Stable, Not In place, O(n log n) time complexity", iterativeQuickSortDescription), iterativeQuickSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("median-of-three-quick", "Median of Three Quick Sort", "Not Stable, In place, O(n log n) time complexity"), medianOfThreeQuickSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("merge", "Merge Sort", "Stable, Not In place, O(n log n) time complexity", mergeSortDescription), mergeSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("iterative-merge", "Iterative Merge Sort", "Stable, Not In place, O(n log n) time complexity", iterativeMergeSortDescription), iterativeMergeSort);
    initAlgorithm(sortsContainer, getAlgorithmUITemplate("heap", "Heap Sort", "Not Stable, In place, O(n log n) time complexity", heapSortDescription), heapSort);

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

function getAlgorithmUITemplate(id = undefined, name = "TODO", characteristics = "TODO", description = "TODO", compSortLabel = "Complementary Sort: ") {
    if (id == undefined) {
        throw new Error("id must be defined!");
    }
    return {
        idPrefix: id,
        name: name,
        characteristics: characteristics,
        description: description,
        minRange: 0,
        maxRange: 100,
        valueRange: 0,
        minSpeed: -9,
        maxSpeed: 50,
        valueSpeed: 0,
        minSize: 40,
        maxSize: 1200,
        valueSize: 4,
        compSortLabel: compSortLabel
    };
}

onload = init;
const BUCKET_COMP_SORTS = [{
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
            if (toVisit[i] < this.sortStatus.length) {
                prev[i] = this.sortStatus[toVisit[i]];
                this.sortStatus[toVisit[i]] = VISITED;
            }
        }
        await this.sleep();
        for (let i = 0; i < toVisit.length; ++i) {
            if (toVisit[i] < this.sortStatus.length) {
                this.sortStatus[toVisit[i]] = prev[i];
            }
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

function getElementScale(width, elements) {
    return width > elements ? width / elements : elements / width;
}

var isCopy;
var copiedElements;
var copiedRangePercent;
var copiedMaxNumber;
var copiedMinNumber;
var copiedS;
var copiedArraySizeMin;
var copiedArraySizeMax;
var copiedArraySizeValue;
var copiedNumbersRangeMin;
var copiedNumbersRangeMax;
var copiedNumbersRangeValue;
var copiedElementsScale;

function initAlgorithm(sortsContainer, getTemplate = getAlgorithmUITemplate, sort, compSorts, currentCompSort) {
    const template = getTemplate;
    const sortLabel = template.name;
    const sortId = template.idPrefix;
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div id="${sortId}-btns" class="btns"><b>${sortLabel}</b><br>
            <button id="sort-${sortId}-btn" class="sort-btn">Sort</button>
            <button id="reset-${sortId}-btn">Clear</button>
            <button class="collapsible">Click for description
                <div class="collapsible-content">
                    <p>Characteristics:<strong> ${template.characteristics}</strong></p>
                    <p>${template.description}</p>
                </div>
            </button>
            <button id="tgl-colour-mode-${sortId}-btn">Colour Mode</button><br>
            <button id="tgl-numbers-${sortId}-btn">View Numbers</button>
            <button class="copy-numbers-btn" id="copy-numbers-${sortId}-btn">Copy Numbers</button><br>

            <input id="${sortId}-range" type="range" min="${template.minRange}" max="${template.maxRange}" value="${template.valueRange}" class="slider">Numbers Range</input>
            <input id="${sortId}-millis-range" type="range" min="${template.minSpeed}" max="${template.maxSpeed}" value="${template.valueSpeed}" class="slider">Sort Speed</input>
            <input id="${sortId}-elements-range" type="range" min="${template.minSize}" max="${template.maxSize}" value="${template.valueSize}" class="slider">Array Size</input>
        </div>
        <div id="${sortId}-sort" class="sort"></div>
    `;
    sortsContainer.appendChild(listItem);

    new p5(
        (sketch) => {
            sketch.frameRate(FRAME_RATE);
            const arraySize = document.getElementById(`${sortId}-elements-range`);
            var s = Math.min(parseInt(arraySize.value), w);
            arraySize.max = w;
            var elementsScale = getElementScale(w, s);

            var rangePercent = 0; // 1 / 100
            var maxNumber = h - h * rangePercent;
            var minNumber = h * rangePercent;
            var elements = getRandomElementsWithZero(s, -minNumber, maxNumber);
            var toSort = [...elements];

            // array size
            arraySize.oninput = async () => {
                s = Math.min(parseInt(arraySize.value), w);
                elementsScale = getElementScale(w, s);
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
            const numbersRange = document.getElementById(`${sortId}-range`);
            numbersRange.oninput = () => {
                maxNumber = updateElementsRange(parseInt(numbersRange.value) / 100, toSort, elements, sortTask);
            };
            // copy numbers
            const copyElement = document.getElementById(`copy-numbers-${sortId}-btn`);
            copyElement.addEventListener('click', () => {
                if (isCopy) {
                    sortTask.isStarted = false;
                    setTimeout(() => {
                        elements = [...copiedElements];
                        rangePercent = copiedRangePercent;
                        maxNumber = copiedMaxNumber;
                        minNumber = copiedMinNumber;
                        s = copiedS;
                        arraySize.min = copiedArraySizeMin;
                        arraySize.max = copiedArraySizeMax;
                        arraySize.value = copiedArraySizeValue;
                        numbersRange.min = copiedNumbersRangeMin;
                        numbersRange.max = copiedNumbersRangeMax;
                        numbersRange.value = copiedNumbersRangeValue;
                        elementsScale = copiedElementsScale;
                        toSort = [...elements];
                        sortTask.sortStatus = new Array(elements.length);
                        sortTask.sortStatus.fill(0);
                        sortTask.operations = 0;
                    }, 100);
                    isCopy = false;

                    for (el of document.getElementsByClassName("copy-numbers-btn")) {
                        el.innerHTML = "Copy Numbers";
                    }
                } else {
                    copiedElements = [...elements];
                    copiedRangePercent = rangePercent;
                    copiedMaxNumber = maxNumber;
                    copiedMinNumber = minNumber;
                    copiedS = s;
                    copiedArraySizeMin = parseInt(arraySize.min);
                    copiedArraySizeMax = parseInt(arraySize.max);
                    copiedArraySizeValue = parseInt(arraySize.value);
                    copiedNumbersRangeMin = parseInt(numbersRange.min);
                    copiedNumbersRangeMax = parseInt(numbersRange.max);
                    copiedNumbersRangeValue = parseInt(numbersRange.value);
                    copiedElementsScale = elementsScale;
                    isCopy = true;
                    for (el of document.getElementsByClassName("copy-numbers-btn")) {
                        el.innerHTML = "Paste Numbers";
                    }
                }
            });
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
            const btnsHolder = document.getElementById(`${sortId}-btns`);
            if (compSorts != undefined) {
                const compSortDropdown = document.createElement("div");
                compSortDropdown.textContent = template.compSortLabel;
                compSortDropdown.setAttribute("id", `${sortId}-comp-sort-dropdown`);
                compSortDropdown.setAttribute("class", "dropdown");
                btnsHolder.insertBefore(compSortDropdown, numbersRange);

                const compSortBtn = document.createElement("button");
                compSortBtn.setAttribute("id", `${sortId}-comp-sort-btn`);
                compSortBtn.setAttribute("class", "dropbtn");

                const compSortContent = document.createElement("div");
                compSortDropdown.appendChild(compSortBtn);
                compSortDropdown.appendChild(compSortContent);
                compSortContent.setAttribute("id", `${sortId}-comp-sort-content`);
                compSortContent.setAttribute("class", "dropdown-content");

                btnsHolder.insertBefore(document.createElement("br"), numbersRange);

                // <div id="bucket-comp-sort-dropdown" class="dropdown">Individual Bucket Sort:
                //     <button id="bucket-comp-sort-btn" class="dropbtn"></button>
                //     <div id="bucket-comp-sort-content" class="dropdown-content"></div>
                // </div>

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
            c = sketch.color(360 - (((1 - yPartNeg) * -y)), sb, sb);
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