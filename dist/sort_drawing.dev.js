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
var MIN_ELEMENTS = 50;
var COLOURS = ["red", "yellow", "blue", "teal", "green", "white"];
var NOT_SORTED = 0;
var SORTED = 1;
var GREATER = 2;
var LESSER = 3;
var VERIFIED_SORTED = 4;
var VISITED = 5;

onload = function onload() {
  initP5SortDrawer("heap", "Heap Sort", heapSort);
  initP5SortDrawer("bubble", "Bubble Sort", bubbleSort);
  initP5SortDrawer("merge", "Merge Sort", mergeSort);
  initP5SortDrawer("sleep", "Sleep Sort", sleepSort);
  initP5SortDrawer("quick", "Quick Sort", quickSort);
  initP5SortDrawer("selection", "Selection Sort", selectionSort);
  initP5SortDrawer("insertion", "Insertion Sort", insertionSort);
  initP5SortDrawer("comb", "Comb Sort", combSort); // collapsible descriptions

  var elements = document.getElementsByClassName("collapsible");

  var _loop = function _loop(i) {
    elements[i].addEventListener("click", function () {
      this.classList.toggle("active");
      var subElements = elements[i].getElementsByClassName("collapsible-content");

      for (var j = 0; j < subElements.length; j++) {
        var content = subElements[j];

        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      }
    });
  };

  for (var i = 0; i < elements.length; i++) {
    _loop(i);
  }
};

var SortTask =
/*#__PURE__*/
function () {
  function SortTask(sortLabel, sortFunc, ms, s) {
    _classCallCheck(this, SortTask);

    this.sortLabel = sortLabel;
    this.isStarted = false;
    this.sortFunc = sortFunc;
    this.operations = 0;
    this.seeNumbers = false;
    this.ms = ms;
    this.sortStatus = new Array(s).fill(0);
  }

  _createClass(SortTask, [{
    key: "doSort",
    value: function doSort() {
      var toSort,
          lastVerified,
          i,
          _i,
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
              this.sortStatus.fill(0);
              this.operations = 0;
              this.isStarted = true;
              _context.next = 7;
              return regeneratorRuntime.awrap(this.sortFunc.apply(this, _args));

            case 7:
              // verify
              toSort = _args[0];
              i = 1;

            case 9:
              if (!(i < this.sortStatus.length)) {
                _context.next = 18;
                break;
              }

              if (this.isStarted) {
                _context.next = 12;
                break;
              }

              return _context.abrupt("return");

            case 12:
              if (toSort[i - 1] <= toSort[i]) {
                this.sortStatus[i - 1] = VERIFIED_SORTED;
                this.sortStatus[i] = VERIFIED_SORTED;
              } else {
                lastVerified = i;
              }

              _context.next = 15;
              return regeneratorRuntime.awrap(_sleep(1));

            case 15:
              i++;
              _context.next = 9;
              break;

            case 18:
              _i = lastVerified;

            case 19:
              if (!(_i >= 0)) {
                _context.next = 28;
                break;
              }

              if (this.isStarted) {
                _context.next = 22;
                break;
              }

              return _context.abrupt("return");

            case 22:
              this.sortStatus[_i] = NOT_SORTED;
              _context.next = 25;
              return regeneratorRuntime.awrap(_sleep(1));

            case 25:
              _i--;
              _context.next = 19;
              break;

            case 28:
              // finish
              this.isStarted = false;

            case 29:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "visit",
    value: function visit() {
      var _len,
          toVisit,
          _key,
          prev,
          i,
          _i2,
          _args2 = arguments;

      return regeneratorRuntime.async(function visit$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              for (_len = _args2.length, toVisit = new Array(_len), _key = 0; _key < _len; _key++) {
                toVisit[_key] = _args2[_key];
              }

              prev = new Array(toVisit.length);

              for (i = 0; i < toVisit.length; ++i) {
                prev[i] = this.sortStatus[toVisit[i]];
                this.sortStatus[toVisit[i]] = VISITED;
              }

              _context2.next = 5;
              return regeneratorRuntime.awrap(this.sleep());

            case 5:
              for (_i2 = 0; _i2 < toVisit.length; ++_i2) {
                this.sortStatus[toVisit[_i2]] = prev[_i2];
              }

            case 6:
            case "end":
              return _context2.stop();
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
  }, {
    key: "isFinished",
    value: function isFinished() {
      return !this.isStarted;
    }
  }, {
    key: "sleep",
    value: function sleep() {
      return regeneratorRuntime.async(function sleep$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(_sleep(this.ms));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }]);

  return SortTask;
}();

function initP5SortDrawer(sortId, sortLabel, sort) {
  new p5(function (sketch) {
    var arraySize = document.getElementById("".concat(sortId, "-elements-range"));
    var s = Math.min(parseInt(arraySize.value), w);
    var elementsScale = w > s ? w / s : 1;
    var rangePercent = 0; // 1 / 100

    var maxNumber = h - h * rangePercent;
    var minNumber = h * rangePercent;
    var elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);

    var toSort = _toConsumableArray(elements); // array size


    arraySize.oninput = function _callee() {
      return regeneratorRuntime.async(function _callee$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              s = Math.min(parseInt(arraySize.value), w);
              elementsScale = w > s ? w / s : 1;
              sortTask.isStarted = false;
              elements = getRandomElementsWithZero(s, -minNumber, maxNumber * 0.90);
              setTimeout(function () {
                var _toSort;

                toSort.length = 0;

                (_toSort = toSort).push.apply(_toSort, _toConsumableArray(elements));

                sortTask.sortStatus.length = elements.length;
                sortTask.sortStatus.fill(0);
                sortTask.operations = 0;
              }, 100);

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      });
    }; // millis to sleep for 'animation' effect


    var millis = document.getElementById("".concat(sortId, "-millis-range"));
    var msMax = parseInt(millis.max);
    var ms = msMax - parseInt(millis.value);
    var sortTask = new SortTask(sortLabel, sort, ms, s);

    millis.oninput = function () {
      sortTask.ms = msMax - parseInt(millis.value);
    }; // reset


    document.getElementById("reset-".concat(sortId, "-btn")).addEventListener('click', function () {
      sortTask.isStarted = false;
      setTimeout(function () {
        toSort = _toConsumableArray(elements);
        sortTask.sortStatus.fill(0);
        sortTask.operations = 0;
      }, 100);
    }); // sort

    document.getElementById("sort-".concat(sortId, "-btn")).addEventListener('click', function _callee2() {
      return regeneratorRuntime.async(function _callee2$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(sortTask.doSort(toSort, sortTask));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      });
    }); // see numbers

    document.getElementById("tgl-numbers-".concat(sortId, "-btn")).addEventListener('click', function _callee3() {
      return regeneratorRuntime.async(function _callee3$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              sortTask.seeNumbers = !sortTask.seeNumbers;

            case 1:
            case "end":
              return _context6.stop();
          }
        }
      });
    }); // numbers range

    var range = document.getElementById("".concat(sortId, "-range"));

    range.oninput = function () {
      maxNumber = updateElementsRange(parseInt(range.value) / 100, toSort, elements, sortTask);
    };

    sketch.setup = function () {
      sketch.createCanvas(w, h);
    };

    sketch.draw = function () {
      drawElements(sketch, toSort, elementsScale, maxNumber, sortTask);
    };
  }, "".concat(sortId, "-sort"));
}

function updateElementsRange(m, toSort, elements, sortTask) {
  sortTask.isStarted = false;
  var high = h - h * m;
  var low = h * m;
  var size = elements.length;
  elements.length = 0;
  elements.push.apply(elements, _toConsumableArray(getRandomElementsWithZero(size, -low, high * 0.90)));
  setTimeout(function () {
    toSort.length = 0;
    toSort.push.apply(toSort, _toConsumableArray(elements));
    sortTask.sortStatus.fill(0);
  }, 25);
  return high;
}

function drawElements(sketch, elements, elementsScale, maxNumber, sortTask) {
  sketch.background(0);
  sketch.push();
  sketch.translate(0, maxNumber);
  sketch.scale(1, -1);
  sketch.strokeWeight(1 * elementsScale);

  for (var x = 0; x < elements.length; x++) {
    var y = elements[x];
    sketch.stroke(COLOURS[sortTask.sortStatus[x]]);
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

    if (sortTask.seeNumbers) {
      sketch.strokeWeight(1);
      sketch.textSize(1.3 * elementsScale);
      sketch.fill(255);
      sketch.text(_y, -offset + Math.max(_y, _y - _y * adjust), _xS + elementsScale);
    }
  }

  sketch.pop();
  sketch.stroke(50);
  sketch.strokeWeight(1);
  sketch.textSize(12);
  sketch.fill(255);
  sketch.text("".concat(sortTask.sortLabel, ": ").concat(sortTask.operations, " operations to sort ").concat(elements.length, " elements."), w * 0.005, h * 0.03);
}
/*
    SORT ALORITHMS START
 */
// QUICK SORT


function quickSort(toSort, sortTask) {
  return regeneratorRuntime.async(function quickSort$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(quickSortRec(toSort, 0, toSort.length - 1, sortTask));

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function quickSortRec(toSort, low, high, sortTask) {
  var pi;
  return regeneratorRuntime.async(function quickSortRec$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (!sortTask.isFinished()) {
            _context8.next = 2;
            break;
          }

          return _context8.abrupt("return");

        case 2:
          if (!(low < high)) {
            _context8.next = 21;
            break;
          }

          _context8.next = 5;
          return regeneratorRuntime.awrap(sortTask.visit(low, high));

        case 5:
          sortTask.increment();
          _context8.next = 8;
          return regeneratorRuntime.awrap(partition(toSort, low, high, sortTask));

        case 8:
          pi = _context8.sent;
          sortTask.sortStatus[pi] = SORTED;
          _context8.next = 12;
          return regeneratorRuntime.awrap(quickSortRec(toSort, low, pi - 1, sortTask));

        case 12:
          _context8.next = 14;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 14:
          sortTask.sortStatus[pi - 1] = SORTED;
          _context8.next = 17;
          return regeneratorRuntime.awrap(quickSortRec(toSort, pi + 1, high, sortTask));

        case 17:
          _context8.next = 19;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 19:
          sortTask.sortStatus[high] = SORTED;
          sortTask.sortStatus[low] = SORTED;

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  });
}

function partition(toSort, low, high, sortTask) {
  var pivot, i, j;
  return regeneratorRuntime.async(function partition$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          if (!sortTask.isFinished()) {
            _context9.next = 2;
            break;
          }

          return _context9.abrupt("return");

        case 2:
          _context9.next = 4;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 4:
          pivot = toSort[high];
          i = low - 1;
          j = low;

        case 7:
          if (!(j <= high - 1)) {
            _context9.next = 17;
            break;
          }

          if (!sortTask.isFinished()) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return");

        case 10:
          sortTask.increment();
          _context9.next = 13;
          return regeneratorRuntime.awrap(sortTask.visit(i, j));

        case 13:
          if (toSort[j] < pivot) {
            i++;
            swap(toSort, i, j);
          }

        case 14:
          j++;
          _context9.next = 7;
          break;

        case 17:
          swap(toSort, i + 1, high);
          return _context9.abrupt("return", i + 1);

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  });
} // SLEEP SORT


function sleepSort(toSort, sortTask) {
  var result, i, j;
  return regeneratorRuntime.async(function sleepSort$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          result = new Array();
          i = 0;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Promise.all(toSort.map(function _callee4(n) {
            return regeneratorRuntime.async(function _callee4$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    if (!sortTask.isFinished()) {
                      _context10.next = 2;
                      break;
                    }

                    return _context10.abrupt("return");

                  case 2:
                    sortTask.increment();
                    _context10.next = 5;
                    return regeneratorRuntime.awrap(new Promise(function (res) {
                      return setTimeout(res, n);
                    }));

                  case 5:
                    _context10.next = 7;
                    return regeneratorRuntime.awrap(sortTask.visit(i++));

                  case 7:
                    result.push(n);

                  case 8:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })));

        case 4:
          j = 0;

        case 5:
          if (!(j < result.length)) {
            _context11.next = 16;
            break;
          }

          if (!sortTask.isFinished()) {
            _context11.next = 8;
            break;
          }

          return _context11.abrupt("return");

        case 8:
          sortTask.increment();
          toSort[j] = result[j];
          _context11.next = 12;
          return regeneratorRuntime.awrap(sortTask.visit(j));

        case 12:
          sortTask.sortStatus[j] = SORTED;

        case 13:
          j++;
          _context11.next = 5;
          break;

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  });
} // HEAP SORT


function heapSort(toSort, sortTask) {
  var n, i, _i3, heapify;

  return regeneratorRuntime.async(function heapSort$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          heapify = function _ref(arr, n, i, sortTask) {
            var largest, left, right;
            return regeneratorRuntime.async(function heapify$(_context12) {
              while (1) {
                switch (_context12.prev = _context12.next) {
                  case 0:
                    if (!sortTask.isFinished()) {
                      _context12.next = 2;
                      break;
                    }

                    return _context12.abrupt("return");

                  case 2:
                    _context12.next = 4;
                    return regeneratorRuntime.awrap(sortTask.visit(i));

                  case 4:
                    largest = i;
                    left = 2 * i + 1;
                    right = 2 * i + 2;

                    if (left < n && arr[left] > arr[largest]) {
                      largest = left;
                    }

                    if (right < n && arr[right] > arr[largest]) {
                      largest = right;
                    }

                    if (!(largest !== i)) {
                      _context12.next = 16;
                      break;
                    }

                    swap(arr, i, largest);
                    sortTask.sortStatus[largest] = LESSER;
                    sortTask.sortStatus[i] = GREATER;
                    sortTask.increment();
                    _context12.next = 16;
                    return regeneratorRuntime.awrap(heapify(arr, n, largest, sortTask));

                  case 16:
                  case "end":
                    return _context12.stop();
                }
              }
            });
          };

          n = toSort.length; // make a max heap starting from the last non-leaf node

          i = Math.floor(n / 2) - 1;

        case 3:
          if (!(i >= 0)) {
            _context13.next = 12;
            break;
          }

          if (!sortTask.isFinished()) {
            _context13.next = 6;
            break;
          }

          return _context13.abrupt("return");

        case 6:
          sortTask.increment();
          _context13.next = 9;
          return regeneratorRuntime.awrap(heapify(toSort, n, i, sortTask));

        case 9:
          i--;
          _context13.next = 3;
          break;

        case 12:
          _i3 = n - 1;

        case 13:
          if (!(_i3 > 0)) {
            _context13.next = 24;
            break;
          }

          if (!sortTask.isFinished()) {
            _context13.next = 16;
            break;
          }

          return _context13.abrupt("return");

        case 16:
          sortTask.increment();
          sortTask.sortStatus[_i3] = SORTED;
          swap(toSort, 0, _i3); // restore the max heap property for the remaining elements

          _context13.next = 21;
          return regeneratorRuntime.awrap(heapify(toSort, _i3, 0, sortTask));

        case 21:
          _i3--;
          _context13.next = 13;
          break;

        case 24:
          sortTask.sortStatus[0] = SORTED;

        case 25:
        case "end":
          return _context13.stop();
      }
    }
  });
} // BUBBLE SORT


function bubbleSort(toSort, sortTask) {
  var i, j, m, p, swapped;
  return regeneratorRuntime.async(function bubbleSort$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < toSort.length - 1)) {
            _context14.next = 26;
            break;
          }

          if (!sortTask.isFinished()) {
            _context14.next = 4;
            break;
          }

          return _context14.abrupt("return");

        case 4:
          swapped = false;
          sortTask.increment();
          j = 0;

        case 7:
          if (!(j < toSort.length - i - 1)) {
            _context14.next = 17;
            break;
          }

          if (!sortTask.isFinished()) {
            _context14.next = 10;
            break;
          }

          return _context14.abrupt("return");

        case 10:
          sortTask.increment();
          _context14.next = 13;
          return regeneratorRuntime.awrap(sortTask.visit(j));

        case 13:
          if (toSort[j] > toSort[j + 1]) {
            m = j + 1;
            p = m;
            swap(toSort, j, j + 1);
            swapped = true;
          }

        case 14:
          j++;
          _context14.next = 7;
          break;

        case 17:
          if (!(swapped == false)) {
            _context14.next = 22;
            break;
          }

          for (k = 0; k < toSort.length - 1; k++) {
            sortTask.sortStatus[k] = SORTED;
          }

          return _context14.abrupt("break", 26);

        case 22:
          sortTask.sortStatus[j] = SORTED;

        case 23:
          i++;
          _context14.next = 1;
          break;

        case 26:
          sortTask.sortStatus[0] = SORTED;

        case 27:
        case "end":
          return _context14.stop();
      }
    }
  });
} // INSERTION SORT


function insertionSort(toSort, sortTask) {
  var i, key, j, n;
  return regeneratorRuntime.async(function insertionSort$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          n = toSort.length;
          i = 1;

        case 2:
          if (!(i < n)) {
            _context15.next = 25;
            break;
          }

          if (!sortTask.isFinished()) {
            _context15.next = 5;
            break;
          }

          return _context15.abrupt("return");

        case 5:
          sortTask.increment();
          _context15.next = 8;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 8:
          key = toSort[i];
          j = i - 1;

        case 10:
          if (!(j >= 0 && toSort[j] > key)) {
            _context15.next = 21;
            break;
          }

          if (!sortTask.isFinished()) {
            _context15.next = 13;
            break;
          }

          return _context15.abrupt("return");

        case 13:
          sortTask.increment();
          toSort[j + 1] = toSort[j];
          _context15.next = 17;
          return regeneratorRuntime.awrap(sortTask.visit(j));

        case 17:
          sortTask.sortStatus[j - 1] = SORTED;
          j = j - 1;
          _context15.next = 10;
          break;

        case 21:
          toSort[j + 1] = key;

        case 22:
          i++;
          _context15.next = 2;
          break;

        case 25:
        case "end":
          return _context15.stop();
      }
    }
  });
} // COMB SORT


function combSort(toSort, sortTask) {
  var n, comb, swapped, i, getNextComb;
  return regeneratorRuntime.async(function combSort$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          getNextComb = function _ref2(comb) {
            // shrink comb
            comb = parseInt(comb / 1.3, 10);
            if (comb < 1) return 1;
            return comb;
          };

          n = toSort.length;
          comb = n;
          swapped = true;

        case 4:
          if (!(comb != 1 || swapped == true)) {
            _context16.next = 25;
            break;
          }

          if (!sortTask.isFinished()) {
            _context16.next = 7;
            break;
          }

          return _context16.abrupt("return");

        case 7:
          sortTask.increment();
          _context16.next = 10;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 10:
          comb = getNextComb(comb);
          swapped = false;
          i = 0;

        case 13:
          if (!(i < n - comb)) {
            _context16.next = 23;
            break;
          }

          if (!sortTask.isFinished()) {
            _context16.next = 16;
            break;
          }

          return _context16.abrupt("return");

        case 16:
          sortTask.increment();
          _context16.next = 19;
          return regeneratorRuntime.awrap(sortTask.visit(i, i + comb));

        case 19:
          if (toSort[i] > toSort[i + comb]) {
            swap(toSort, i, i + comb);
            swapped = true;
          }

        case 20:
          i++;
          _context16.next = 13;
          break;

        case 23:
          _context16.next = 4;
          break;

        case 25:
        case "end":
          return _context16.stop();
      }
    }
  });
} // SELECTION SORT


function selectionSort(toSort, sortTask) {
  var min_idx, j, n, i;
  return regeneratorRuntime.async(function selectionSort$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          n = toSort.length;
          i = 0;

        case 2:
          if (!(i < n - 1)) {
            _context17.next = 30;
            break;
          }

          if (!sortTask.isFinished()) {
            _context17.next = 5;
            break;
          }

          return _context17.abrupt("return");

        case 5:
          sortTask.increment();
          _context17.next = 8;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 8:
          min_idx = i;
          j = i + 1;

        case 10:
          if (!(j < n)) {
            _context17.next = 23;
            break;
          }

          if (!sortTask.isFinished()) {
            _context17.next = 13;
            break;
          }

          return _context17.abrupt("return");

        case 13:
          _context17.next = 15;
          return regeneratorRuntime.awrap(sortTask.sleep());

        case 15:
          sortTask.increment();
          _context17.next = 18;
          return regeneratorRuntime.awrap(sortTask.visit(j));

        case 18:
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

        case 20:
          j++;
          _context17.next = 10;
          break;

        case 23:
          sortTask.sortStatus[i] = SORTED;
          sortTask.sortStatus[i + 1] = SORTED;

          if (sortTask.sortStatus[min_idx] != SORTED) {
            sortTask.sortStatus[min_idx] = NOT_SORTED;
          }

          swap(toSort, min_idx, i);

        case 27:
          i++;
          _context17.next = 2;
          break;

        case 30:
        case "end":
          return _context17.stop();
      }
    }
  });
} // MERGE SORT


function mergeSort(toSort, sortTask) {
  return regeneratorRuntime.async(function mergeSort$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, 0, toSort.length - 1, sortTask));

        case 2:
        case "end":
          return _context18.stop();
      }
    }
  });
}

function mergeSortRec(toSort, leftI, rightI, sortTask) {
  var m;
  return regeneratorRuntime.async(function mergeSortRec$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          if (!sortTask.isFinished()) {
            _context19.next = 2;
            break;
          }

          return _context19.abrupt("return");

        case 2:
          if (!(leftI >= rightI)) {
            _context19.next = 4;
            break;
          }

          return _context19.abrupt("return");

        case 4:
          m = leftI + parseInt((rightI - leftI) / 2);
          _context19.next = 7;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, leftI, m, sortTask));

        case 7:
          _context19.next = 9;
          return regeneratorRuntime.awrap(mergeSortRec(toSort, m + 1, rightI, sortTask));

        case 9:
          _context19.next = 11;
          return regeneratorRuntime.awrap(merge(toSort, leftI, m, rightI, sortTask));

        case 11:
        case "end":
          return _context19.stop();
      }
    }
  });
}

function merge(toSort, leftI, middle, rightI, sortTask) {
  var leftSize, rightSize, left, right, _i4, _j, i, j, k;

  return regeneratorRuntime.async(function merge$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          if (!sortTask.isFinished()) {
            _context20.next = 2;
            break;
          }

          return _context20.abrupt("return");

        case 2:
          leftSize = middle - leftI + 1;
          rightSize = rightI - middle;
          left = new Array(leftSize);
          right = new Array(rightSize);
          _i4 = 0;

        case 7:
          if (!(_i4 < leftSize && sortTask.isStarted)) {
            _context20.next = 14;
            break;
          }

          left[_i4] = toSort[leftI + _i4];
          _context20.next = 11;
          return regeneratorRuntime.awrap(sortTask.visit(_i4));

        case 11:
          _i4++;
          _context20.next = 7;
          break;

        case 14:
          _j = 0;

        case 15:
          if (!(_j < rightSize && sortTask.isStarted)) {
            _context20.next = 22;
            break;
          }

          right[_j] = toSort[middle + 1 + _j];
          _context20.next = 19;
          return regeneratorRuntime.awrap(sortTask.visit(_j));

        case 19:
          _j++;
          _context20.next = 15;
          break;

        case 22:
          i = 0;
          j = 0;
          k = leftI;

        case 25:
          if (!(i < leftSize && j < rightSize && sortTask.isStarted)) {
            _context20.next = 33;
            break;
          }

          if (left[i] <= right[j]) {
            toSort[k] = left[i];
            i++;
            sortTask.sortStatus[k] = SORTED;
          } else {
            toSort[k] = right[j];
            j++;
            sortTask.sortStatus[k] = SORTED;
          }

          _context20.next = 29;
          return regeneratorRuntime.awrap(sortTask.visit(k));

        case 29:
          sortTask.increment();
          k++;
          _context20.next = 25;
          break;

        case 33:
          if (!(i < leftSize && sortTask.isStarted)) {
            _context20.next = 43;
            break;
          }

          toSort[k] = left[i];
          sortTask.sortStatus[k] = SORTED;
          _context20.next = 38;
          return regeneratorRuntime.awrap(sortTask.visit(k));

        case 38:
          i++;
          k++;
          sortTask.increment();
          _context20.next = 33;
          break;

        case 43:
          if (!(j < rightSize && sortTask.isStarted)) {
            _context20.next = 53;
            break;
          }

          toSort[k] = right[j];
          sortTask.sortStatus[k] = SORTED;
          _context20.next = 48;
          return regeneratorRuntime.awrap(sortTask.visit(k));

        case 48:
          j++;
          k++;
          sortTask.increment();
          _context20.next = 43;
          break;

        case 53:
        case "end":
          return _context20.stop();
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

function _sleep(ms) {
  return regeneratorRuntime.async(function _sleep$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, ms);
          }));

        case 2:
        case "end":
          return _context21.stop();
      }
    }
  });
}

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}