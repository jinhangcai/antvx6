import { BaseElement, ElementType } from './Element';

export class LogicalElement extends BaseElement {
  type = 'logical' as ElementType;
  className = 'logical-element';
}

/**
 * 且
 */
export const AND = new LogicalElement('且');

/**
 * 或
 */
export const OR = new LogicalElement('或');

/**
 * 非
 */
export const NOT = new LogicalElement('非');

/**
 * 大于
 */
export const GT = new LogicalElement('>');

/**
 * 大于等于
 */
export const GTE = new LogicalElement('≥');

/**
 * 小于
 */
export const LT = new LogicalElement('<');

/**
 * 小于等于
 */
export const LTE = new LogicalElement('≤');

/**
 * 等于
 */
export const EQ = new LogicalElement('=');

/**
 * 不等于
 */
export const NEQ = new LogicalElement('≠');
