/**
 * Utility function to conditionally join classnames together
 * @param classes - Array of class names or conditional objects
 * @returns Combined class name string
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Merge tailwind classes with proper precedence
 * @param base - Base classes
 * @param override - Override classes
 * @returns Merged class name string
 */
export function mergeClasses(base: string, override?: string): string {
  if (!override) return base;
  return `${base} ${override}`;
}
