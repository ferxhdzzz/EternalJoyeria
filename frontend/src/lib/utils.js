import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string.
 * This is useful for conditionally applying classes in JSX.
 * 
 * @param {...string} inputs - Class names to be combined
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
