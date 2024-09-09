// EVEN levels are min
// ODD levels are max
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var MinMaxHeap = /** @class */ (function () {
    function MinMaxHeap() {
        this.heap = [];
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
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
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
        for (var i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.pushDownIter(i);
        }
    };
    return MinMaxHeap;
}());
for (var k = 0; k < 10; k++) {
    var arrLength = Math.floor(Math.random() * 15);
    var arr = Array.from({ length: arrLength }).map(function () { return Math.floor(Math.random() * 100); });
    var heap = new MinMaxHeap();
    heap.buildHeap(__spreadArray([], arr, true));
    if (heap.heap.length === 0) {
        console.log("Heap is empty.");
        continue;
    }
    var q = [0];
    var toPrint = [];
    var level = 0;
    var nodesInLevel = Math.pow(2, level);
    console.log("Array Length:", arrLength);
    console.log("Heap:");
    while (q.length) {
        var currIndex = q.shift();
        var currValue = heap.heap[currIndex];
        toPrint.push(currValue);
        var leftChild = 2 * currIndex + 1;
        var rightChild = 2 * currIndex + 2;
        if (leftChild < heap.heap.length)
            q.push(leftChild);
        if (rightChild < heap.heap.length)
            q.push(rightChild);
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
