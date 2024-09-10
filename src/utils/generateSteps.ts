export function generateSteps(minVal: number, maxVal: number, cap: number) {
  const range = maxVal - minVal;

  const numSteps = Math.min(cap, range);

  return Math.ceil(range / numSteps);
}
