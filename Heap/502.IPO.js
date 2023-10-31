// 502. IPO
// Suppose LeetCode will start its IPO soon. In order to sell a good price of its shares to Venture Capital, LeetCode would like to work on some projects to increase its capital before the IPO. Since it has limited resources, it can only finish at most k distinct projects before the IPO. Help LeetCode design the best way to maximize its total capital after finishing at most k distinct projects.
// You are given n projects where the ith project has a pure profit profits[i] and a minimum capital of capital[i] is needed to start it.
// Initially, you have w capital. When you finish a project, you will obtain its pure profit and the profit will be added to your total capital.
// Pick a list of at most k distinct projects from given projects to maximize your final capital, and return the final maximized capital.
// The answer is guaranteed to fit in a 32-bit signed integer.


// Solution: Sorting & Priority Queue

// 1. Collect each [profits[i], capital[i]] into an array and sort by capital[i].
// 2. Use a priority queue that keeps each profit where the capital is <= the current w.
  // a. Add each profit where the capital <= the current w.
  // b. Get the maximum profit from the priority queue.
  // c. Add the profit to w.

// Time Complexity: O(n log(n)) 317ms
// Space Complexity: O(n) 92.4MB
var findMaximizedCapital = function(k, w, profits, capital) {
  let projects = [], n = profits.length;
  for (let i = 0; i < n; i++) {
    projects.push([profits[i], capital[i]]);
  }
  projects.sort((a, b) => a[1] - b[1]);
  
  let heap = new Heap((a, b) => b - a);
  let i = 0;
  while (k > 0) {
    while (i < n && projects[i][1] <= w) heap.add(projects[i++][0]);
    if (heap.isEmpty()) break;
    let profit = heap.remove();
    w += profit;
    k--;
  }
  return w;
};

class Heap {
  constructor(comparator = ((a, b) => a - b)) {
    this.values = [];
    this.comparator = comparator;
    this.size = 0;
  }
  add(val) {
    this.size++;
    this.values.push(val);
    let idx = this.size - 1, parentIdx = Math.floor((idx - 1) / 2);
    while (parentIdx >= 0 && this.comparator(this.values[parentIdx], this.values[idx]) > 0) {
      [this.values[parentIdx], this.values[idx]] = [this.values[idx], this.values[parentIdx]];
      idx = parentIdx;
      parentIdx = Math.floor((idx - 1) / 2);
    }
  }
  remove() {
    if (this.size === 0) return -1;
    this.size--;
    if (this.size === 0) return this.values.pop();
    let removedVal = this.values[0];
    this.values[0] = this.values.pop();
    let idx = 0;
    while (idx < this.size && idx < Math.floor(this.size / 2)) {
      let leftIdx = idx * 2 + 1, rightIdx = idx * 2 + 2;
      if (rightIdx === this.size) {
        if (this.comparator(this.values[leftIdx], this.values[idx]) > 0) break;
        [this.values[leftIdx], this.values[idx]] = [this.values[idx], this.values[leftIdx]];
        idx = leftIdx;
      } else if (this.comparator(this.values[leftIdx], this.values[idx]) < 0 || this.comparator(this.values[rightIdx], this.values[idx]) < 0) {
        if (this.comparator(this.values[leftIdx], this.values[rightIdx]) <= 0) {
          [this.values[leftIdx], this.values[idx]] = [this.values[idx], this.values[leftIdx]];
          idx = leftIdx;
        } else {
          [this.values[rightIdx], this.values[idx]] = [this.values[idx], this.values[rightIdx]];
          idx = rightIdx;
        }
      } else {
        break;
      }
    }
    return removedVal;
  }
  top() {
    return this.values[0];
  }
  isEmpty() {
    return this.size === 0;
  }
}

// Two test cases
console.log(findMaximizedCapital(2, 0, [1,2,3], [0,1,1])) // 4
console.log(findMaximizedCapital(3, 0, [1,2,3], [0,1,2])) // 6