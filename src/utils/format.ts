/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Format a number as Colombian Pesos (COP).
 * Example: 36000 -> "$ 36.000"
 */
export function formatCOP(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$ 0';
  }
  const rounded = Math.round(amount);
  return `$ ${rounded.toLocaleString('es-CO')}`;
}

/**
 * Formatter with COP suffix for clarity when needed
 * Example: 36000 -> "$ 36.000 COP"
 */
export function formatCOPSuffix(amount: number): string {
  return `${formatCOP(amount)} COP`;
}
