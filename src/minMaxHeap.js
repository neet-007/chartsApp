// EVEN levels are min
// ODD levels are max
var MinMaxHeap = /** @class */ (function () {
    function MinMaxHeap() {
        this.heap = [];
        this.heapMap = new Map();
    }
    MinMaxHeap.prototype.isMinLevel = function (index) {
        return Math.floor(Math.log2(index + 1)) % 2 === 0;
    };
    MinMaxHeap.prototype.parent = function (index) {
        return Math.floor((index - 1) / 2);
    };
    MinMaxHeap.prototype.grandparent = function (index) {
        return this.parent(this.parent(index));
    };
    MinMaxHeap.prototype.children = function (index) {
        var _this = this;
        var leftChild = 2 * index + 1;
        var rightChild = 2 * index + 2;
        return [leftChild, rightChild].filter(function (child) { return child < _this.heap.length; });
    };
    MinMaxHeap.prototype.grandchildren = function (index) {
        var _this = this;
        return this.children(index).flatMap(function (child) { return _this.children(child); });
    };
    MinMaxHeap.prototype.smallestChildOrGrandchild = function (index) {
        var children = this.children(index);
        var grandchildren = this.grandchildren(index);
        var candidates = children.concat(grandchildren);
        var smallestIndex = index;
        for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
            var i = candidates_1[_i];
            if (this.heap[i] < this.heap[smallestIndex]) {
                smallestIndex = i;
            }
        }
        return smallestIndex;
    };
    MinMaxHeap.prototype.largestChildOrGrandchild = function (index) {
        var children = this.children(index);
        var grandchildren = this.grandchildren(index);
        var candidates = children.concat(grandchildren);
        var largestIndex = index;
        for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
            var i = candidates_2[_i];
            if (this.heap[i] > this.heap[largestIndex]) {
                largestIndex = i;
            }
        }
        return largestIndex;
    };
    MinMaxHeap.prototype.pushDownIter = function (index) {
        while (true) {
            var targetIndex = index;
            if (this.isMinLevel(index)) {
                targetIndex = this.smallestChildOrGrandchild(index);
                if (this.heap[targetIndex] < this.heap[index]) {
                    this.swap(index, targetIndex);
                    if (this.isGrandchild(index, targetIndex) && this.heap[targetIndex] > this.heap[this.parent(targetIndex)]) {
                        this.swap(targetIndex, this.parent(targetIndex));
                    }
                    index = targetIndex;
                }
                else {
                    break;
                }
            }
            else {
                targetIndex = this.largestChildOrGrandchild(index);
                if (this.heap[targetIndex] > this.heap[index]) {
                    this.swap(index, targetIndex);
                    if (this.isGrandchild(index, targetIndex) && this.heap[targetIndex] < this.heap[this.parent(targetIndex)]) {
                        this.swap(targetIndex, this.parent(targetIndex));
                    }
                    index = targetIndex;
                }
                else {
                    break;
                }
            }
        }
    };
    MinMaxHeap.prototype.pushUpIter = function (index) {
        while (index > 0) {
            var parentIndex = this.parent(index);
            if (this.isMinLevel(index)) {
                if (this.heap[index] > this.heap[parentIndex]) {
                    this.swap(index, parentIndex);
                    index = parentIndex;
                }
                else {
                    this.pushUpMinIter(index);
                    break;
                }
            }
            else {
                if (this.heap[index] < this.heap[parentIndex]) {
                    this.swap(index, parentIndex);
                    index = parentIndex;
                }
                else {
                    this.pushUpMaxIter(index);
                    break;
                }
            }
        }
    };
    MinMaxHeap.prototype.pushUpMinIter = function (index) {
        while (index > 2 && this.heap[index] < this.heap[this.grandparent(index)]) {
            this.swap(index, this.grandparent(index));
            index = this.grandparent(index);
        }
    };
    MinMaxHeap.prototype.pushUpMaxIter = function (index) {
        while (index > 2 && this.heap[index] > this.heap[this.grandparent(index)]) {
            this.swap(index, this.grandparent(index));
            index = this.grandparent(index);
        }
    };
    MinMaxHeap.prototype.isGrandchild = function (index, targetIndex) {
        return Math.floor(Math.log2(targetIndex + 1)) === Math.floor(Math.log2(index + 1)) + 2;
    };
    MinMaxHeap.prototype.swap = function (i, j) {
        var _a;
        // Directly update indices in the heapMap without filtering
        var listI = this.heapMap.get(this.heap[i]);
        var listJ = this.heapMap.get(this.heap[j]);
        listI[listI.indexOf(i)] = j;
        listJ[listJ.indexOf(j)] = i;
        // Perform the swap in the heap
        _a = [this.heap[j], this.heap[i]], this.heap[i] = _a[0], this.heap[j] = _a[1];
        // No need to set lists back into the map since we directly modified them
    };
    MinMaxHeap.prototype.insert = function (value) {
        this.heap.push(value);
        this.pushUpIter(this.heap.length - 1);
    };
    MinMaxHeap.prototype.extractMin = function () {
        if (this.heap.length === 0)
            return null;
        var min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.pushDownIter(0);
        return min;
    };
    MinMaxHeap.prototype.extractMax = function () {
        if (this.heap.length <= 1)
            return this.extractMin();
        var maxIndex = this.heap.length === 2 ? 1 : (this.heap[1] > this.heap[2] ? 1 : 2);
        var max = this.heap[maxIndex];
        this.heap[maxIndex] = this.heap.pop();
        this.pushDownIter(maxIndex);
        return max;
    };
    MinMaxHeap.prototype.buildHeap = function (array) {
        this.heap = array.slice();
        for (var i = 0; i < this.heap.length; i++) {
            var list = this.heapMap.get(this.heap[i]);
            if (list) {
                list.push(i);
            }
            else {
                this.heapMap.set(this.heap[i], [i]);
            }
        }
        for (var i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.pushDownIter(i);
        }
    };
    return MinMaxHeap;
}());
var arr = Array.from({ length: 10 }).map(function () { return Math.floor(Math.random() * 100); });
var heap = new MinMaxHeap();
heap.buildHeap(arr);
console.log(heap.heap);
console.log(heap.heapMap);
/*
for (let k = 0; k < 10; k++) {
  const arrLength = Math.floor(Math.random() * 15);
  const arr = Array.from({ length: arrLength }).map(() => Math.floor(Math.random() * 100));

  const heap = new MinMaxHeap();
  heap.buildHeap([...arr]);

  if (heap.heap.length === 0) {
    console.log("Heap is empty.");
    continue;
  }

  const q = [0];
  let toPrint = [];
  let level = 0;
  let nodesInLevel = Math.pow(2, level);

  console.log("Array Length:", arrLength);
  console.log("Heap:");

  while (q.length) {
    const currIndex = q.shift()!;
    const currValue = heap.heap[currIndex];
    toPrint.push(currValue);

    const leftChild = 2 * currIndex + 1;
    const rightChild = 2 * currIndex + 2;

    if (leftChild < heap.heap.length) q.push(leftChild);
    if (rightChild < heap.heap.length) q.push(rightChild);

    if (toPrint.length === nodesInLevel) {
      console.log(toPrint.join(" "));
      toPrint = [];
      level++;
      nodesInLevel = Math.pow(2, level);
    }
  }

  if (toPrint.length > 0) {
    console.log(toPrint.join(" "));
  }

  console.log("\n\n");
}
*/
