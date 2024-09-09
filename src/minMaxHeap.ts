// EVEN levels are min
// ODD levels are max

class MinMaxHeap {
  heap: number[] = [];
  heapMap: Map<number, number[]> = new Map();


  private isMinLevel(index: number): boolean {
    return Math.floor(Math.log2(index + 1)) % 2 === 0;
  }

  private parent(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private grandparent(index: number): number {
    return this.parent(this.parent(index));
  }

  private children(index: number): number[] {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    return [leftChild, rightChild].filter(child => child < this.heap.length);
  }

  private grandchildren(index: number): number[] {
    return this.children(index).flatMap(child => this.children(child));
  }

  private smallestChildOrGrandchild(index: number): number {
    const children = this.children(index);
    const grandchildren = this.grandchildren(index);
    const candidates = children.concat(grandchildren);
    let smallestIndex = index;

    for (let i of candidates) {
      if (this.heap[i] < this.heap[smallestIndex]) {
        smallestIndex = i;
      }
    }

    return smallestIndex;
  }

  private largestChildOrGrandchild(index: number): number {
    const children = this.children(index);
    const grandchildren = this.grandchildren(index);
    const candidates = children.concat(grandchildren);
    let largestIndex = index;

    for (let i of candidates) {
      if (this.heap[i] > this.heap[largestIndex]) {
        largestIndex = i;
      }
    }

    return largestIndex;
  }

  private pushDownIter(index: number): void {
    while (true) {
      let targetIndex = index;
      if (this.isMinLevel(index)) {
        targetIndex = this.smallestChildOrGrandchild(index);
        if (this.heap[targetIndex] < this.heap[index]) {
          this.swap(index, targetIndex);
          if (this.isGrandchild(index, targetIndex) && this.heap[targetIndex] > this.heap[this.parent(targetIndex)]) {
            this.swap(targetIndex, this.parent(targetIndex));
          }
          index = targetIndex;
        } else {
          break;
        }
      } else {
        targetIndex = this.largestChildOrGrandchild(index);
        if (this.heap[targetIndex] > this.heap[index]) {
          this.swap(index, targetIndex);
          if (this.isGrandchild(index, targetIndex) && this.heap[targetIndex] < this.heap[this.parent(targetIndex)]) {
            this.swap(targetIndex, this.parent(targetIndex));
          }
          index = targetIndex;
        } else {
          break;
        }
      }
    }
  }

  private pushUpIter(index: number): void {
    while (index > 0) {
      const parentIndex = this.parent(index);
      if (this.isMinLevel(index)) {
        if (this.heap[index] > this.heap[parentIndex]) {
          this.swap(index, parentIndex);
          index = parentIndex;
        } else {
          this.pushUpMinIter(index);
          break;
        }
      } else {
        if (this.heap[index] < this.heap[parentIndex]) {
          this.swap(index, parentIndex);
          index = parentIndex;
        } else {
          this.pushUpMaxIter(index);
          break;
        }
      }
    }
  }

  private pushUpMinIter(index: number): void {
    while (index > 2 && this.heap[index] < this.heap[this.grandparent(index)]) {
      this.swap(index, this.grandparent(index));
      index = this.grandparent(index);
    }
  }

  private pushUpMaxIter(index: number): void {
    while (index > 2 && this.heap[index] > this.heap[this.grandparent(index)]) {
      this.swap(index, this.grandparent(index));
      index = this.grandparent(index);
    }
  }

  private isGrandchild(index: number, targetIndex: number): boolean {
    return Math.floor(Math.log2(targetIndex + 1)) === Math.floor(Math.log2(index + 1)) + 2;
  }

  private swap(i: number, j: number): void {
    const listI = this.heapMap.get(this.heap[i])!;
    const listJ = this.heapMap.get(this.heap[j])!;

    listI[listI.indexOf(i)] = j;
    listJ[listJ.indexOf(j)] = i;

    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];

  }

  public insert(value: number): void {
    this.heap.push(value);
    this.pushUpIter(this.heap.length - 1);
  }

  public extractMin(): number | null {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.pushDownIter(0);
    return min;
  }

  public extractMax(): number | null {
    if (this.heap.length <= 1) return this.extractMin();
    const maxIndex = this.heap.length === 2 ? 1 : (this.heap[1] > this.heap[2] ? 1 : 2);
    const max = this.heap[maxIndex];
    this.heap[maxIndex] = this.heap.pop()!;
    this.pushDownIter(maxIndex);
    return max;
  }

  public update(oldValue: number, newValue: number, count: number): void {
    const indices = this.heapMap.get(oldValue);

    if (!indices || indices.length === 0) return;

    for (const index of indices) {
      if (count <= 0) {
        break
      }
      this.heap[index] = newValue;

      let list = this.heapMap.get(oldValue)!;
      list = list.filter(i => i !== index);
      if (list.length === 0) {
        this.heapMap.delete(oldValue);
      } else {
        this.heapMap.set(oldValue, list);
      }

      if (this.heapMap.has(newValue)) {
        this.heapMap.get(newValue)!.push(index);
      } else {
        this.heapMap.set(newValue, [index]);
      }

      if (index > 0 && this.heap[index] < this.heap[this.grandparent(index)]) {
        this.pushUpIter(index);
      } else {
        this.pushDownIter(index);
      }
      count--;
    }
  }

  public delete(value: number, count: number): void {
    const indices = this.heapMap.get(value);

    if (!indices || indices.length === 0) return;

    while (indices.length > 0 && count > 0) {
      const index = indices.pop()!;

      if (index === this.heap.length - 1) {
        this.heap.pop();
      } else {
        const lastElement = this.heap.pop()!;
        this.heap[index] = lastElement;

        const lastElementIndices = this.heapMap.get(lastElement)!;
        lastElementIndices.pop();
        lastElementIndices.push(index);

        if (index > 0 && this.heap[index] < this.heap[this.parent(index)]) {
          this.pushUpIter(index);
        } else {
          this.pushDownIter(index);
        }
      }

      if (indices.length === 0) {
        this.heapMap.delete(value);
      }
      count--;
    }
  }

  public bulkInsert(values: number[]) {
    for (let i = 0; i < values.length; i++) {
      this.heap.push(values[i]);
      if (this.heapMap.has(values[i])) {
        this.heapMap.get(values[i])!.push(this.heap.length - 1);
      } else {
        this.heapMap.set(values[i], [this.heap.length - 1]);
      }
    }

    for (let i = Math.floor(this.heap.length / 2) - 1; i > -1; i--) {
      this.pushDownIter(i);
    }

  }

  public bulkDelete(values: [number, number][]): void {
    const indicesToRemove: number[] = [];

    for (const value of values) {
      const indices = this.heapMap.get(value[0]);
      if (indices) {
        indices.sort((a, b) => b - a);
        indicesToRemove.push(...[...indices].splice(0, value[1]));

        if (indices.length > value[1]) {
          for (let j = 0; j < value[1]; j++) {
            indices.pop();
          }
        } else {
          this.heapMap.delete(value[0]);
        }
      }
    }

    indicesToRemove.sort((a, b) => b - a);

    for (const index of indicesToRemove) {
      if (index === this.heap.length - 1) {
        this.heap.pop();
      } else {
        const lastElement = this.heap.pop()!;
        this.heap[index] = lastElement;

        const lastElementIndices = this.heapMap.get(lastElement)!;
        lastElementIndices.pop();
        lastElementIndices.push(index);
      }
    }

    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.pushDownIter(i);
    }
  }

  public bulkUpdate(oldValues: number[], newValues: number[]): void {
    for (let i = 0; i < oldValues.length; i++) {
      const indices = this.heapMap.get(oldValues[i]);
      if (indices) {
        for (let j = 0; j < indices.length; j++) {
          this.heap[indices[j]] = newValues[i];
        }
        this.heapMap.delete(oldValues[i]);
        const newVal = this.heapMap.get(newValues[i]);
        if (!newVal) {
          this.heapMap.set(newValues[i], indices);
        } else {
          this.heapMap.set(newValues[i], newVal.concat(indices))
        }
      }
    }

    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.pushDownIter(i);
    }
  }

  public buildHeap(array: number[]): void {
    this.heap = array.slice();

    for (let i = 0; i < this.heap.length; i++) {
      const list = this.heapMap.get(this.heap[i]);
      if (list) {
        list.push(i);
      } else {
        this.heapMap.set(this.heap[i], [i]);
      }
    }

    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.pushDownIter(i);
    }
  }
}

let arr = Array.from({ length: 20 }).map(() => Math.floor(Math.random() * 100));
arr = arr.filter(x => x !== 4);
arr.push(4);
arr.push(4)
const heap = new MinMaxHeap();
heap.buildHeap(arr);
console.log(heap.heap);
console.log(heap.heapMap);
const deleteVals = arr.filter((_, i) => i % 5 === 0).map(x => x === 4 ? [x, 0] as [number, number] : [x, 0] as [number, number]);
console.log("delete, count: ", deleteVals.join(" "));
heap.bulkDelete(deleteVals);
console.log(heap.heap)
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
