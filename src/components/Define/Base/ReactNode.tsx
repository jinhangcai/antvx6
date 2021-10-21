import React from 'react';
import { ReactShape } from '@antv/x6-react-shape';
import { ConfigProvider, Input } from 'efg-design-rth';

import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import { classnames } from 'syfed-ui';

export type EventType = 'start-node' | 'indicator-node' | 'end-node' | string;

export interface ReactNodeProps {
  node: ReactShape;
  onClick?: (t: EventType, e: any) => void;
  onDoubleClick?: (t: EventType, e: any) => void;
  onContextMenu?: (t: EventType, e: any) => void;
  onCheck?: (t: EventType, e) => void;
  nodeData?: any;
  className?: string;
  isLegend?: boolean;
}

export class ReactNodeLabel extends React.Component<{
  label: string;
  node: ReactShape;
  editable?: boolean;
  style?: React.CSSProperties;
  maxLength?: number;
  editabletype?: string;
  edit?: string;
  text?: any;
  mearge: string;
}, { editable: boolean }> {
  private hover: boolean;
  private $input: any;

  constructor(props) {
    super(props);
    this.state = { editable: false, flag: false };
  }

  handleBlur = (e) => {
    if (!this.hover && this.props.editable !== false) {
      this.$input?.blur();
    }
  };

  componentDidMount() {
    document.body.addEventListener('click', this.handleBlur, true);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBlur, true);
  }

  render() {
    const { node, label, style, maxLength, type, text, mearge } = this.props;
    const { editable, flag } = this.state;
    console.log('editable', editable)
    return <div
      className={classnames('react-node-label', type === 'Agg' ? 'react-node-btn' : 'react-node-btn1')}
      style={{ ...style, cursor: this.props.editable !== false ? 'text' : 'inherit' }}
      onClick={() => this.setState({ editable: this.props.editable !== false })}
      onMouseEnter={(e) => {
        this.hover = true;
      }}
      onMouseLeave={() => {
        this.hover = false;
        this.setState({ flag: false })
      }}
      onMouseOver={() => {
       this.setState({ flag: true })
      }}
    >
      {(!editable) ? <span>{mearge ? '数据集输出项目' : label}{
        text && flag ? <img draggable={false} src={require('../../../assets/imgs/change.png')} style={{ width: 14, height: 14, verticalAlign:'revert' }} />
          : ''
      }</span> : <ConfigProvider>
        <Input
          ref={i => {
            this.$input = i;
          }}
          style={{ width: 140 }}
          defaultValue={label}
          onChange={e => node?.setData({ label: e.target.value, text: '' })}
          onBlur={(e) => {
            this.setState({ editable: false });
          }}
          size={'small'}
          maxLength={maxLength ?? 20}
          autoFocus
        />
      </ConfigProvider>}
    </div>;
  }
}

// eslint-disable-next-line react/no-multi-comp
export default class ReactNode<S extends Record<string, any>> extends React.Component<ReactNodeProps, S> {
  /**
   * 节点类型
   */
  static COMP = 'react-node';

  static defaultProps = {
    label: 'React Node',
  };

  get nodeData() {
    return this.props.node?.getData() || {};
  }

  get label() {
    return (this.props.node?.getData() || {}).label;
  }

  protected getLabel = () => {
    return (this.props.node?.getData() || {}).label;
  };

  protected getNodeData = () => {
    return this.props.node?.getData() || {};
  };

  shouldComponentUpdate(nextProps: Readonly<ReactNodeProps>, nextState: Readonly<S>, nextContext: any) {
    const node = this.props.node;
    if (nextState !== this.state || node?.hasChanged('data')) {
      // console.log('to update', nextState !== this.state, node?.getData());
      return true;
    }

    return false;
  }

  render() {
    return <div className={'react-node'}>
      <ReactNodeLabel label={this.label} node={this.props.node} editable={false} />
    </div>;
  }
}

@PortsReactShapeConfig(ReactNode.COMP, {})
export class ReactNodeShape extends PortsReactShape {
}
