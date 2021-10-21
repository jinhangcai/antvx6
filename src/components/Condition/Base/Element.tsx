import React from 'react';

export type ElementType = 'logical' | 'relational' | 'number' | 'readonly' | 'normal' | 'bracket' | 'text';

/**
 * 元素接口
 */
export default interface Element {
  type: ElementType;
  content: any;
  isValid: () => (boolean | Promise<boolean>);
  editable: boolean;
  renderContent: (index: number) => React.ReactNode;
  setData: (data: Record<string, any>) => void;
  getData: () => Record<string, any>;
}

export type ReactElementProps = {
  _key: string;
  className?: string;
  editable: boolean;
  content: any;
  index: number | string;
};

export class ReactElement extends React.PureComponent<ReactElementProps, {}> {

  protected getContent = (): any => {
    return this.props.content;
  };

  render() {
    const { _key, className, editable, content, index } = this.props;
    return <span
      id={_key}
      data-index={index}
      className={`condition-element ${className}`}
      contentEditable={editable}
      onContextMenu={e => {
        e.stopPropagation();
        e.preventDefault();
      }}
      suppressContentEditableWarning
    >{content}</span>;
  }
}

/**
 * 基本元素
 */
export class BaseElement implements Element {

  static index = 0;

  editable = false;

  isValid = () => true;

  type: ElementType;

  content: any;

  protected className: string;

  private _key: string;

  private re: any;

  private data: Record<string, any>;

  constructor(content: any) {
    BaseElement.index += 1;
    this._key = `el-${Math.random().toString(36).substr(2)}`;
    this.content = content;
  }

  setData = (data: Record<string, any>) => {
    console.log('setData', data);
    this.data = data;
    if ('content' in data) {
      this.content = data.content;
    }
  };

  getData = () => {
    return { content: this.re?.getContent(), ...this.data };
  };

  renderContent = (i: number | string) => {
    const { _key, content, className, editable } = this;
    const key = `${_key}-${i}`;
    const props = { _key: key, content, className, editable, index: i, element: this };
    return <ReactElement ref={re => {
      this.re = re;
    }} key={key} {...props} />;
  };

}

/**
 * 只读元素
 */
export class ReadonlyElement extends BaseElement {
  type = 'readonly' as ElementType;
  className = 'readonly-element';
}

/**
 * 数字元素
 */
export class NumberElement extends BaseElement {
  editable = true;
  isValid = () => {
    return true;
  };
  type = 'number' as ElementType;
  className = 'number-element';

  constructor(content) {
    super(Number(content));
  }
}

export class TextElement extends BaseElement {
  editable = true;
  isValid = () => {
    return true;
  };
  type = 'text' as ElementType;
  className = 'text-element';

  constructor(content) {
    super(Number(content));
  }
}
