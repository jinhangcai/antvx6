import { BaseElement, ElementType } from './Element';

class RelationalElement extends BaseElement {
  type = 'relational' as ElementType;
  className = 'relational-element';
}

/**
 * 加
 */
export const PLUS = new RelationalElement('+');
/**
 * 减
 */
export const SUBSTRACT = new RelationalElement('-');
/**
 * 乘
 */
export const MULTIPLY = new RelationalElement('*');
/**
 * 除
 */
export const DIVIDE = new RelationalElement('/');
