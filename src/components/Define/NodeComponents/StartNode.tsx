import React from 'react';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import LegendNode from '@/components/Define/Base/LegendNode';

@LegendNode()
export default class StartNode extends ReactNode<any> {
  /**
   * 节点类型
   */
  static COMP = 'start-node';

  render() {
    return <div className={'react-node start-node'}>
      <ReactNodeLabel label={this.label ?? '开始节点'} node={this.props.node} editable={false} />
    </div>;
  }
}

@PortsReactShapeConfig(StartNode.COMP, {
  ports: {
    items: [
      { group: 'out' },
    ],
  },
})
export class StartNodeShape extends PortsReactShape {

}
