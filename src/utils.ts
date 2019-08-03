"use strict";

/**
 * Remove duplicate values from array.
 *
 * @param {T[]} arr - An array to deduplicate.
 * @returns {T[]} - The deduplicated array.
 * @template T
 */
export function deduplicate<T>(arr: T[]): T[] {
  return arr.filter((el, i) => arr.indexOf(el) === i);
}
