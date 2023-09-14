"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var CANVAS_SCALE = 0.8;
var w = (window.innerWidth > 0 ? window.innerWidth : screen.width) * CANVAS_SCALE;
var h = (window.innerHeight > 0 ? window.innerHeight : screen.height) * CANVAS_SCALE;
var MAX_ELEMENTS = 50;
var COLOURS = ["red", "yellow", "blue", "teal", "green"];
var NOT_SORTED = 0;
var SORTED = 1;
var GREATER = 2;
var LESSER = 3;
var VERIFIED_SORTED = 4;

onload = function onload() {
  initP5SortDrawer("heap", "Heap Sort", heapSort);
  initP5SortDrawer("bubble", "Bubble Sort", bubbleSort);
  initP5SortDrawer("merge", "Merge Sort", mergeSort);
  initP5SortDrawer("sleep", "Sleep Sort", sleepSort);
  initP5SortDrawer("quick", "Quick Sort", quickSort);
};

var SortTask =
/*#__PURE__*/
function () {
  function SortTask(sortLabel, sortFunc) {
    _classCallCheck(this, SortTask);

    this.sortLabel = sortLabel;
    this.isOff = true;
    this.isStarted = false;
    this.sortFunc = sortFunc;
    this.operations = 0;
  }

  _createClass(SortTask, [{
    key: "doSort",
    value: function doSort() {
      var sortStatus,
          i,
          _args = arguments;
      return regeneratorRuntime.async(function doSort$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.isStarted) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              this.operations = 0;
              this.isOff = false;
              this.isStarted = true;
              _context.next = 7;
              return regeneratorRuntime.awrap(this.sortFunc.apply(this, _args));

            case 7:
              sortStatus = _args[1];
              i = 0;

            case 9:
              if (!(i < sortStatus.length)) {
                _context.next = 18;
                break;
              }

              if (!this.isOff) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return");

            case 12:
              sortStatus[i] = VERIFIED_SORTED;
              _context.next = 15;
              return regeneratorRuntime.awrap(sleep(1));

            case 15:
              i++;
              _context.next = 9;
              break;

            case 18:
              this.isStarted = false;
              this.isOff = true;

            case 20:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "increment",
    value: function increment() {
      if (this.isStarted) {
        this.operations++;
      }
    }
  }]);

  return SortTask;
}();

function initP5SortDrawer(sortId, sortLabel, sort) {
  var s = Math.min(MAX_ELEMENTS, w);
  var elementsScale = w > MAX_ELEMENTS ? w / MAX_ELEMENTS : 1;
  new p5(function (sketch) {
    var rangePercent = 0; // 1 / 100

    var maxNumber = h - h * rangePercent;
    var minNumber = h * rangePercent;
    var elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);

    var toSort = _toConsumableArray(elements);

    var sortStatus = new Array(s).fill(0);
    var sortTask = new SortTask(sortLabel, sort); // millis to sleep for 'animation' effect

    var millis = document.getElementById("".concat(sortId, "-millis-range"));
    var msMax = parseInt(millis.max);
    var ms = msMax - parseInt(millis.value);

    millis.oninput = function () {
      ms = msMax - parseInt(millis.value);
    }; // reset


    document.getElementById("reset-".concat(sortId, "-btn")).addEventListener('click', function () {
      sortTask.isOff = true;
      sortTask.isStarted = false;
      setTimeout(function () {
        toSort = _toConsumableArray(elements);
        sortStatus.fill(0);
        sortTask.operations = 0;
      }, 100);
    }); // sort

    document.getElementById("sort-".concat(sortId, "-btn")).addEventListener('click', function _callee() {
      return regeneratorRuntime.async(function _callee$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(sortTask.doSort(toSort, sortStatus, sortTask, ms));

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    var range = document.getElementById("".concat(sortId, "-range"));

    range.oninput = function () {
      maxNumber = updateElementsRange(parseInt(range.value) / 100, toSort, elements, sortTask, sortStatus);
    };

    sketch.setup = function () {
      sketch.createCanvas(w, h);
    };

    sketch.draw = function () {
      drawElements(sketch, toSort, elementsScale, maxNumber, sortStatus, sortTask);
    };
  }, "".concat(sortId, "-sort"));
}

function updateElementsRange(m, toSort, elements, offSwitch, sortStatus) {
  offSwitch.isOff = true;
  var high = h - h * m;
  var low = h * m;
  var size = elements.length;
  elements.length = 0;
  elements.push.apply(elements, _toConsumableArray(getRandomElementsWithZero(size, -low, high * 0.90)));
  setTimeout(function () {
    toSort.length = 0;
    toSort.push.apply(toSort, _toConsumableArray(elements));
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

  for (var x = 0; x < elements.length; x++) {
    var y = elements[x];
    sketch.stroke(COLOURS[sortStatus[x]]);
    var xS = x * elementsScale + elementsScale / 2;
    sketch.line(xS, 0, xS, y);
  }

  sketch.scale(1, -1);
  sketch.rotate(sketch.radians(270)); // adjusting nonsense so we can see the numbers better

  var adjust = maxNumber / h;
  var offset = 10 - Math.floor(10 * adjust);

  for (var _x = 0; _x < elements.length; _x++) {
    var _xS = _x * elementsScale;

    var _y = elements[_x];
    sketch.stroke(50);
    sketch.strokeWeight(1);
    sketch.textSize(15);
    sketch.fill(255);
    sketch.text(_y, -offset + Math.max(_y, _y - _y * adjust), _xS + elementsScale);
  }

  sketch.pop();
  sketch.stroke(50);
  sketch.strokeWeight(1);
  sketch.textSize(15);
  sketch.fill(255);
  sketch.text("".concat(sortTask.sortLabel, ": ").concat(sortTask.operations, " operations to sort ").concat(elements.length, " elements."), h * 0.03, w * 0.03);
}
/*
    SORT ALORITHMS START
 */
// QUICK SORT


function quickSort(toSort, sortStatus, sortTask, ms) {
  return regeneratorRuntime.async(function quickSort$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(quickSortRec(toSort, 0, toSort.length - 1, sortStatus, sortTask, ms));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function quickSortRec(toSort, low, high, sortStatus, sortTask, ms) {
  var pi;
  return regeneratorRuntime.async(function quickSortRec$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!sortTask.isOff) {
            _context4.next = 2;
            break;
          }

          return _context4.abrupt("return");

        case 2:
          if (!(low < high)) {
            _context4.next = 14;
            break;
          }

          sortTask.increment();
          _context4.next = 6;
          return regeneratorRuntime.awrap(partition(toSort, low, high, sortStatus, sortTask, ms));

        case 6:
          pi = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(quickSortRec(toSort, low, pi - 1, sortStatus, sortTask, ms));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(quickSortRec(toSort, pi + 1, high, sortStatus, sortTask, ms));

        case 11:
          sortStatus[pi] = SORTED;
          sortStatus[low] = SORTED;
          sortStatus[high] = SORTED;

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function partition(toSort, low, high, sortStatus, sortTask, ms) {
  var pivot, i, j;
  return regeneratorRuntime.async(function partition$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!sortTask.isOff) {
            _context5.next = 2;
            break;
          }

          return _context5.abrupt("return");

        case 2:
          _context5.next = 4;
          return regeneratorRuntime.awrap(sleep(ms));

        case 4:
          pivot = toSort[high];
          sortStatus[high] = GREATER;
          i = low - 1;
          j = low;

        case 8:
          if (!(j <= high - 1)) {
            _context5.next = 18;
            break;
          }

          if (!sortTask.isOff) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return");

        case 11:
          sortTask.increment();
          _context5.next = 14;
          return regeneratorRuntime.awrap(sleep(ms));

        case 14:
          if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);

            if (sortStatus[j] != GREATER) {
              sortStatus[j] = LESSER;
            }
          }

        case 15:
          j++;
          _context5.next = 8;
          break;

        case 18:
          swap(toSort, i + 1, high);
          return _context5.abrupt("return", i + 1);

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  });
} // SLEEP SORT


function sleepSort(toSort, sortStatus, sortTask, ms) {
  var result, i, j;
  return regeneratorRuntime.async(function sleepSort$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          result = new Array();
          i = 0;
          _context7.next = 4;
          return regeneratorRuntime.awrap(Promise.all(toSort.map(function _callee2(n) {
            return regeneratorRuntime.async(function _callee2$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    if (!sortTask.isOff) {
                      _context6.next = 2;
                      break;
                    }

                    return _context6.abrupt("return");

                  case 2:
                    sortTask.increment();
                    _context6.next = 5;
                    return regeneratorRuntime.awrap(new Promise(function (res) {
                      return setTimeout(res, n);
                    }));

                  case 5:
                    sortStatus[i++] = GREATER;
                    result.push(n);

                  case 7:
                  case "end":
                    return _context6.stop();
                }
              }
            });
          })));

        case 4:
          j = 0;

        case 5:
          if (!(j < result.length)) {
            _context7.next = 16;
            break;
          }

          if (!sortTask.isOff) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return");

        case 8:
          sortTask.increment();
          toSort[j] = result[j];
          _context7.next = 12;
          return regeneratorRuntime.awrap(sleep(ms));

        case 12:
          sortStatus[j] = SORTED;

        case 13:
          j++;
          _context7.next = 5;
          break;

        case 16:
        case "end":
          return _context7.stop();
      }
    }
  });
} // HEAP SORT


function heapSort(toSort, sortStatus, sortTask, ms) {
  var n, i, _i, heapify;

  return regeneratorRuntime.async(function heapSort$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          heapify = function _ref(arr, n, i, sortStatus, sortTask, ms) {
            var smallest, left, right;
            return regeneratorRuntime.async(function heapify$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return regeneratorRuntime.awrap(sleep(ms));

                  case 2:
                    smallest = i;
                    left = 2 * i + 1;
                    right = 2 * i + 2;

                    if (left < n && arr[left] > arr[smallest]) {
                      sortTask.increment();
                      smallest = left;
                    }

                    if (right < n && arr[right] > arr[smallest]) {
                      sortTask.increment();
                      smallest = right;
                    }

                    if (!(smallest !== i)) {
                      _context8.next = 14;
                      break;
                    }

                    sortTask.increment();
                    swap(arr, i, smallest);
                    sortStatus[smallest] = GREATER;
                    sortStatus[i] = LESSER; // Recursively heapify the affected sub-tree

                    _context8.next = 14;
                    return regeneratorRuntime.awrap(heapify(arr, n, smallest, sortStatus, sortTask, ms));

                  case 14:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          };

          n = toSort.length; // Build a max heap starting from the last non-leaf node

          i = Math.floor(n / 2) - 1;

        case 3:
          if (!(i >= 0)) {
            _context9.next = 11;
            break;
          }

          if (!sortTask.isOff) {
            _context9.next = 6;
            break;
          }

          return _context9.abrupt("return");

        case 6:
          _context9.next = 8;
          return regeneratorRuntime.awrap(heapify(toSort, n, i, sortStatus, sortTask, ms));

        case 8:
          i--;
          _context9.next = 3;
          break;

        case 11:
          _i = n - 1;

        case 12:
          if (!(_i > 0)) {
            _context9.next = 22;
            break;
          }

          if (!sortTask.isOff) {
            _context9.next = 15;
            break;
          }

          return _context9.abrupt("return");

        case 15:
          // Swap the maximum element (at index 0) with the last element
          sortStatus[_i] = SORTED;
          swap(toSort, 0, _i); // Restore the max heap property for the remaining elements

          _context9.next = 19;
          return regeneratorRuntime.awrap(heapify(toSort, _i, 0, sortStatus, sortTask, ms));

        case 19:
          _i--;
          _context9.next = 12;
          break;

        case 22:
          sortStatus[0] = SORTED; // Heapify function to maintain the max heap property

        case 23:
        case "end":
          return _context9.stop();
      }
    }
  });
} // BUBBLE SORT


function bubbleSort(toSort, sortStatus, sortTask, ms) {
  var i, j, m, p, swapped;
  return regeneratorRuntime.async(function bubbleSort$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < toSort.length - 1)) {
            _context10.next = 26;
            break;
          }

          if (!sortTask.isOff) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("return");

        case 4:
          swapped = false;
          j = 0;

        case 6:
          if (!(j < toSort.length - i - 1)) {
            _context10.next = 17;
            break;
          }

          if (!sortTask.isOff) {
            _context10.next = 9;
            break;
          }

          return _context10.abrupt("return");

        case 9:
          sortStatus[j] = GREATER;
          sortTask.increment();
          _context10.next = 13;
          return regeneratorRuntime.awrap(sleep(ms));

        case 13:
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

        case 14:
          j++;
          _context10.next = 6;
          break;

        case 17:
          if (!(swapped == false)) {
            _context10.next = 22;
            break;
          }

          for (k = 0; k < toSort.length - 1; k++) {
            sortStatus[k] = SORTED;
          }

          return _context10.abrupt("break", 26);

        case 22:
          sortStatus[j] = SORTED;

        case 23:
          i++;
          _context10.next = 1;
          break;

        case 26:
          sortStatus[0] = SORTED;

        case 27:
        case "end":
          return _context10.stop();
      }
    }
  });
} // MERGE SORT


function mergeSort(toSort, sortStatus, sortTask, ms) {
  return regeneratorRuntime.async(function mergeSort$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, 0, toSort.length - 1, sortStatus, sortTask, ms));

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
}

function mergeSortRec(toSort, leftI, rightI, sortStatus, sortTask, ms) {
  var m;
  return regeneratorRuntime.async(function mergeSortRec$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          if (!sortTask.isOff) {
            _context12.next = 2;
            break;
          }

          return _context12.abrupt("return");

        case 2:
          if (!(leftI >= rightI)) {
            _context12.next = 4;
            break;
          }

          return _context12.abrupt("return");

        case 4:
          m = leftI + parseInt((rightI - leftI) / 2);
          _context12.next = 7;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, leftI, m, sortStatus, sortTask, ms));

        case 7:
          _context12.next = 9;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, m + 1, rightI, sortStatus, sortTask, ms));

        case 9:
          _context12.next = 11;
          return regeneratorRuntime.awrap(merge(toSort, leftI, m, rightI, sortStatus, sortTask, ms));

        case 11:
        case "end":
          return _context12.stop();
      }
    }
  });
}

function merge(toSort, leftI, middle, rightI, sortStatus, sortTask, ms) {
  var leftSize, rightSize, left, right, _i2, _j, i, j, k;

  return regeneratorRuntime.async(function merge$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          if (!sortTask.isOff) {
            _context13.next = 2;
            break;
          }

          return _context13.abrupt("return");

        case 2:
          leftSize = middle - leftI + 1;
          rightSize = rightI - middle;
          left = new Array(leftSize);
          right = new Array(rightSize);

          for (_i2 = 0; _i2 < leftSize && !sortTask.isOff; _i2++) {
            left[_i2] = toSort[leftI + _i2];
            sortStatus[leftI + _i2] = GREATER;
          }

          for (_j = 0; _j < rightSize && !sortTask.isOff; _j++) {
            right[_j] = toSort[middle + 1 + _j];
            sortStatus[middle + 1 + _j] = GREATER;
          }

          i = 0;
          j = 0;
          k = leftI;

        case 11:
          if (!(i < leftSize && j < rightSize && !sortTask.isOff)) {
            _context13.next = 19;
            break;
          }

          if (left[i] <= right[j]) {
            toSort[k] = left[i];
            i++;
            sortStatus[k] = SORTED;
          } else {
            toSort[k] = right[j];
            j++;
            sortStatus[k] = SORTED;
          }

          _context13.next = 15;
          return regeneratorRuntime.awrap(sleep(ms));

        case 15:
          k++;
          sortTask.increment();
          _context13.next = 11;
          break;

        case 19:
          if (!(i < leftSize && !sortTask.isOff)) {
            _context13.next = 29;
            break;
          }

          toSort[k] = left[i];
          sortStatus[k] = SORTED;
          i++;
          k++;
          _context13.next = 26;
          return regeneratorRuntime.awrap(sleep(ms));

        case 26:
          sortTask.increment();
          _context13.next = 19;
          break;

        case 29:
          if (!(j < rightSize && !sortTask.isOff)) {
            _context13.next = 39;
            break;
          }

          toSort[k] = right[j];
          sortStatus[k] = SORTED;
          j++;
          k++;
          _context13.next = 36;
          return regeneratorRuntime.awrap(sleep(ms));

        case 36:
          sortTask.increment();
          _context13.next = 29;
          break;

        case 39:
        case "end":
          return _context13.stop();
      }
    }
  });
}
/*
    SORT ALORITHMS END
 */
// HELPERS


function getRandomElementsWithZero(size, lowerBound, upperBound) {
  var elements = [];

  for (var i = 0; i < size; i++) {
    elements.push(Math.floor(getRandom(lowerBound, upperBound)));
  }

  elements[size / 2] = 0;
  return elements;
}

function getRandom(lower, upper) {
  return Math.random() * (upper - lower) + lower;
}

function sleep(ms) {
  return regeneratorRuntime.async(function sleep$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, ms);
          }));

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
}

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}