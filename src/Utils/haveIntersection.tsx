export const haveIntersection = (arr1: string[], arr2: string[]) => {
  return arr1.some(item => arr2.includes(item));
};
