import { BaseElement, ElementType } from './Element';

class BracketElement extends BaseElement {
  editable = false;

  isValid = () => true;

  type = 'bracket' as ElementType;

  className = 'bracket-element';
}

/**
 * 左括号
 */
export const LEFT = new BracketElement('(');

/**
 * 右括号
 */
export const RIGHT = new BracketElement(')');
