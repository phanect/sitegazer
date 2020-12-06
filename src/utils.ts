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

/**
 * Check if given string is URL string.
 *
 * @param {string} urlStr - string to check
 * @returns {boolean} true if given string is URL. False if not.
 */
export function isURL(urlStr: string): boolean {
  try {
    new URL(urlStr);
    return true;
  } catch (err) {
    if (err instanceof TypeError) {
      return false;
    } else {
      throw err;
    }
  }
}

/**
 * Sleep for the specified time.
 *
 * @param {number} ms - The time to wait (in milliseconds).
 * @returns {Promise<void>} A promise object.
 */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
