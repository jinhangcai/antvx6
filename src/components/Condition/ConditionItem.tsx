import React from 'react';
import Element, { NumberElement, ReadonlyElement } from './Base/Element';
import { DIVIDE, MULTIPLY, PLUS, SUBSTRACT } from './Base/RelationalElement';
import { AND, EQ, GT, GTE, LT, NEQ } from './Base/LogicalElement';
import { LEFT, RIGHT } from './Base/BracketElement';
import './condition-item.less';
import './Base/element.less';
import { FunctionUtil } from '@dafe/web-utils';
import { getSelection, getSelectionInfo } from './InputHandler';

interface ConditionItemProps {
  focus: boolean;
  onFocus: () => void;
  onNext: () => void;
}

/**
 * 可输入的特定元素
 */
const ENTERABLE_ELEMENTS = [LT, GT, LEFT, RIGHT, EQ, NEQ, PLUS, SUBSTRACT, MULTIPLY, DIVIDE];

export default class ConditionItem extends React.PureComponent<ConditionItemProps, { elements: Element[] }> {

  $root: HTMLDivElement | null;

  focus: boolean;

  private $elements: any;
  private focusElement: HTMLElement | null;
  private focusOffset: number;
  private focusTimeoutId: number;

  constructor(props) {
    super(props);
    this.state = {
      elements: [
        LEFT,
        new ReadonlyElement('测试元素1'),
        PLUS,
        new ReadonlyElement('测试元素2'),
        RIGHT,
        GTE,
        new NumberElement(10100),
        AND,
        new ReadonlyElement('测试元素3'),
        NEQ,
        new NumberElement(0),
      ],
    };
  }

  /**
   * 忽略键盘事件的元素
   * @param focusNode
   * @param focusElement
   */
  isIgnoreNode = (focusNode: Node | null, focusElement: HTMLElement | null) => {
    // 不是当前可编辑的根节点
    return !focusNode?.isEqualNode(this.$root)
      // 不是数字节点
      && !focusElement?.className.includes('number-element')
      // 不是文本节点
      && !focusElement?.className.includes('text-element');
  };

  /**
   * 处理键盘按下事件
   * @param e
   */
  handleKeyDown = (e) => {
    // console.log('keydown', e);
    // 焦点元素
    const { focusNode, focusOffset, focusElement, anchorNode, anchorOffset } = getSelectionInfo();

    // 忽略键盘事件的元素
    if (!focusNode || this.isIgnoreNode(focusNode, focusElement)) {
      return;
    }

    // 阻止事件
    const stopEvent = () => {
      e.preventDefault();
      e.stopPropagation();
      return undefined;
    };

    const { key, ctrlKey, metaKey } = e;

    // 禁用功能健，例如复制之类的操作
    if (ctrlKey || metaKey) {
      return stopEvent();
    }

    // 回车键
    if (key === 'Enter') {
      const newEles = [...this.state.elements];
      if (focusNode.isEqualNode(this.$root)) {
        if (focusOffset && focusOffset === newEles.length) {
          this.props.onNext?.();
          return stopEvent();
        }
      } else if (focusNode.nodeType === Node.TEXT_NODE
        && (focusElement?.className.includes('number-element')
          || focusElement?.className.includes('text-element'))) {
        if (focusOffset && focusNode.textContent?.length === focusOffset) {
          this.props.onNext?.();
          return stopEvent();
        }
      }
    }

    // 非有效健，除数字、小数点、括号，大于、小于、等于、四则运算符、左、右、删除以外全部禁用
    if (!/[0-9]/.test(e.key) && !['(', ')', '<', '>', '+', '-', '*', '/', '=', '.', 'ArrowLeft', 'ArrowRight', 'Backspace'].includes(key)) {
      return stopEvent();
    }

    // 左右箭头
    // if (focusOffset !== undefined && focusNode && ['ArrowLeft', 'ArrowRight'].includes(key)) {
    //   const prev = Math.max(0, focusOffset - 1);
    //   if (focusNode !== this.$root) {
    //     selection?.setPosition(focusNode, key === 'ArrowLeft' ? prev : Math.min(focusNode.textContent?.length || 0, focusOffset + 1));
    //   } else {
    //     selection?.setPosition(focusNode, key === 'ArrowLeft' ? prev : Math.min(this.state.elements.length, focusOffset + 1));
    //   }
    // }

    // 删除键
    if (key === 'Backspace') {
      const newEles = [...this.state.elements];
      // 选择的文本跨元素
      if (anchorNode?.nodeType === Node.TEXT_NODE && focusNode.nodeType === Node.TEXT_NODE && anchorNode !== focusNode) {
        return stopEvent();
      }
      const delElement = (delIndex) => {
        newEles.splice(delIndex, 1);
        this.setState({ elements: newEles });
      };
      // 删除数字或者文本
      if (focusElement?.className.includes('number-element')
        || focusElement?.className.includes('text-element')) {
        // 光标在第一个位置（删除前一个元素） 或者 只剩一个数字（删除数字元素）
        if (focusOffset === 0 || (focusOffset === 1 && focusNode.textContent?.length === 1)) {
          // 元素位置
          const eleIndex = Number(focusElement?.dataset.index);
          // 删除位置
          const delIndex = focusOffset === 1 ? eleIndex : eleIndex - 1;
          eleIndex >= 0 && delIndex >= 0 && delElement(delIndex);
          return stopEvent();
        }
        // 元素全选
        if (anchorOffset !== focusOffset && anchorOffset === 0 && focusOffset === focusNode.textContent?.length) {
          const eleIndex = Number(focusElement?.dataset.index);
          eleIndex >= 0 && delElement(eleIndex);
          return stopEvent();
        }
      } else if (focusNode.isEqualNode(this.$root)) {
        // 删除元素
        if (focusOffset && !isNaN(focusOffset)) {
          delElement(focusOffset - 1);
        }
        return stopEvent();
      }
      // 当前无元素
      if (!this.state.elements.length) {
        return stopEvent();
      }
    }

    return undefined;
  };

  /**
   * 处理文本输入
   */
  handleTextNode = () => {
    const elements = this.state.elements;
    // 实时获取子节点
    this.$root?.childNodes?.forEach((childNode, i) => {

      // 文本节点 TEXT_NODE
      if (childNode.nodeType === Node.TEXT_NODE) {
        const textContent = childNode.textContent;
        if (!textContent) return;

        const ele = ENTERABLE_ELEMENTS.find(el => el.content === textContent);

        const setPosition = (childNode: ChildNode, offset: number) => () => {
          // const parentNode = childNode.parentNode;
          try {
            this.$root?.removeChild(childNode);
            const selection = window.getSelection();
            selection && selection.focusNode && selection.setPosition(selection.focusNode, offset);
          } catch (e) {
            // do nothing
          }
        };

        if (ele) {
          const newEles = [...elements];
          newEles.splice(i, 0, ele);
          this.setState({ elements: newEles }, setPosition(childNode, i + 1));
        } else if (/^[0-9.]+$/.test(textContent)) {
          const newEles = [...elements];
          newEles.splice(i, 0, new NumberElement(textContent));
          this.setState({ elements: newEles }, setPosition(childNode, i + 1));
        } else {
          this.$root?.removeChild(childNode);
        }
      }
    });
  };

  /**
   * 处理数字类型的输入
   */
  handleNumberElement = () => {
    const elements = this.state.elements;
    // 删除 number 节点中的非 number 字符
    this.$elements.forEach((childNode, key) => {
      if (!childNode.className.includes('number-element')) return;
      let textContent = childNode.textContent;
      if (textContent) {
        // 更新内容
        const updateContent = () => {
          try {
            this.state.elements[key].content = textContent;
          } catch (e) {
            // do nothing
          }
        };

        // 重新设置光标位置
        const setPosition = () => {
          try {
            updateContent();
            const selection = window.getSelection();
            selection && textContent && selection.focusNode && selection.setPosition(selection.focusNode, textContent.length);
          } catch (e) {
            // do nothing
            console.error(e);
          }
        };

        let index = -1;

        const ele = ENTERABLE_ELEMENTS.find(el => `${textContent}`.split('').some((c, i) => {
          index = i;
          return c === el.content;
        }));

        if (ele && index >= 0) {
          const callback = () => {
            // @ts-ignore
            childNode.textContent = textContent.replace(/[^0-9.]/g, '');
            textContent = childNode.textContent;
            const selection = window.getSelection();
            // @ts-ignore
            selection.setPosition(childNode.parentNode, index === 0 ? key + 1 : key + 2);
          };
          if (index === 0 || index === textContent.length - 1) {
            const newEles = [...elements];
            newEles.splice(index === 0 ? key : key + 1, 0, ele);
            this.setState({ elements: newEles }, callback);
          } else {
            const newEles = [...elements];
            newEles.splice(index === 0 ? key : key + 1, 0, ele, new NumberElement(textContent.substr(index + 1)));
            textContent = textContent.substring(0, index);
            this.setState({ elements: newEles }, callback);
          }
        } else {
          if (!/^[0-9.]+$/.test(textContent)) {
            childNode.textContent = textContent.replace(/[^0-9.]/g, '');
            textContent = childNode.textContent;
            setPosition();
          }
          if (textContent.startsWith('.') || textContent.replace(/[0-9]/g, '').length > 1) {
            const [n1, ...ns] = textContent.split('.');
            childNode.textContent = [n1 || 0, ns.join('')].join('.');
            textContent = childNode.textContent;
            setPosition();
          } else {
            updateContent();
          }
        }
      }
    });
  };

  handleKeyUp = FunctionUtil.debounce(() => {
    // 焦点元素
    const { focusNode, focusElement } = getSelectionInfo();

    focusNode?.nodeType === Node.TEXT_NODE && !focusElement?.className.includes('number-element') && this.handleTextNode();
    focusElement?.className.includes('number-element') && this.handleNumberElement();
  }, 50);

  setFocusInfo = () => {
    const { focusElement, focusOffset } = getSelectionInfo();
    this.focusElement = focusElement;
    this.focusOffset = focusOffset;
  };

  handleFocus = () => {
    // @ts-ignore
    this.focusTimeoutId = setTimeout(() => {
      this.setFocusInfo();
    }, 0);
  };

  handleBlur = () => {
    this.focusTimeoutId && clearTimeout(this.focusTimeoutId);
    this.setFocusInfo();
  };

  appendElement = (el: Element) => {
    const newEles = [...this.state.elements];
    const setPosition = () => {
      try {
        getSelection().setPosition?.(this.$root, this.focusOffset);
      } catch (e) {
        // do nothing
      }
    };
    if (this.focusElement === this.$root || !this.focusElement) {
      const index = this.focusOffset ?? newEles.length;
      newEles.splice(index, 0, el);
      this.focusOffset = index + 1;
      this.setState({ elements: newEles }, setPosition);
    } else if (this.focusElement?.className.includes('number-element')
      || this.focusElement?.className.includes('text-element')) {
      // do nothing
      const index = Number(this.focusElement.dataset.index);
      const textContent = this.focusElement.textContent;
      if (textContent && index >= 0) {
        const newEle = new NumberElement(textContent?.substr(this.focusOffset));
        newEles[index].content = textContent.substr(0, this.focusOffset);
        newEles.splice(index + 1, 0, el, newEle);
        this.focusOffset = index + 2;
        this.setState({ elements: newEles }, setPosition);
      }
    }
    this.focusElement = this.$root;
  };

  updateProperties = () => {
    this.$elements = this.$root?.querySelectorAll('span.condition-element') || [];
  };

  componentDidMount() {
    this.updateProperties();
  }

  componentDidUpdate() {
    this.updateProperties();
  }

  render() {

    const { elements = [] } = this.state;
    return <div
      className={'condition-item'}
      ref={el => {
        this.$root = el;
      }}
      onKeyDown={this.handleKeyDown}
      onKeyUp={this.handleKeyUp}
      onFocus={this.handleFocus}
      onBlur={this.handleBlur}
      onContextMenu={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
      suppressContentEditableWarning
      contentEditable>
      {elements.map((ele, i) => ele.renderContent(i))}
    </div>;
  }
}
