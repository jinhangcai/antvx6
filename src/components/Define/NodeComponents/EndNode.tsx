import React from 'react';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import ReactNode, { EventType, ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import LegendNode from '@/components/Define/Base/LegendNode';

/**
 * 结束节点
 */
@LegendNode()
export default class EndNode extends ReactNode<any> {

  static COMP = 'end-node';

  handleDoubleClick = (t: EventType) => (e: any) => {
    this.props.onDoubleClick?.(t, e);
  };

  handleContextMenu = (t: EventType) => (e: any) => {
    this.props.onContextMenu?.(t, e);
  };

  render() {
    return <div
      className={'react-node end-node'}
      onDoubleClick={this.handleDoubleClick('end-node')}
      onContextMenu={this.handleContextMenu('end-node')}
    >
      <ReactNodeLabel label={this.label} node={this.props.node} editable={false} />
    </div>;
  }
}

@PortsReactShapeConfig(EndNode.COMP, {
  ports: {
    items: [
      { group: 'in' },
    ],
  },
})
export class EndNodeShape extends PortsReactShape {

}
