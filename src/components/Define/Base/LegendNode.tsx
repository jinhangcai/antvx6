import React from 'react';
import ReactNode from '@/components/Define/Base/ReactNode';
import { NODE_SIZE } from '@/components/Define/Base/PortsReactShape';
import { Node } from '@antv/x6';

const legendNodes = {};

/**
 * 注册图例
 * @param type
 * @param Comp
 */
const registerLegendNode = (type: string, Comp: typeof ReactNode) => {
  legendNodes[type] = {
    component(node) {
      return <Comp node={node} className={'legend-node'} isLegend />;
    },
  };
};

/**
 * 创建图例
 * @param type
 * @param label
 * @param level
 */
export const createLegendNode = (type: string, label: string, level: string): Node => {
  if (!legendNodes[type]) {
    throw new Error('图例未注册');
  }
  return {
    ...NODE_SIZE,
    ...legendNodes[type],
    shape: 'react-shape',
    data: { label, type, level },
  };
};

/**
 * 图例装饰器
 * @constructor
 */
export default function LegendNode() {
  return (RC: typeof ReactNode) => {
    registerLegendNode(RC.COMP, RC);
  };
}
