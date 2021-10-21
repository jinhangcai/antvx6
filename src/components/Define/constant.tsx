import { Cell, Graph } from '@antv/x6';
import ReactNode, { ReactNodeShape } from '@/components/Define/Base/ReactNode';
import StartNode, { StartNodeShape } from '@/components/Define/NodeComponents/StartNode';
import IndicatorNode, { IndicatorNodeShape } from '@/components/Define/NodeComponents/IndicatorNode';
import EndNode, { EndNodeShape } from '@/components/Define/NodeComponents/EndNode';
import OutputItemNode, { OutputItemNodeShape } from '@/components/Define/NodeComponents/OutputItemNode';
import AggregationNode, { AggregationNodeShape } from '@/components/Define/NodeComponents/AggregationNode';
import { createEdge } from '@/components/Define/Base/ReactEdge';

export const getReactComponent = (comp: any): typeof ReactNode => [
  StartNode,
  IndicatorNode,
  EndNode,
  OutputItemNode,
  AggregationNode,
].find(Comp => Comp.COMP === comp) || ReactNode;

export type ShapeProps = {
  id: string;
  label: string;
  data?: Record<string, any>;
  [key: string]: any;
}

export const createReactNodeShape = (type: string, x: number, y: number, options: ShapeProps, origin: any): Cell | Cell[] => {
  const { data, label, level, graphRef, ops, ...others } = options;
  const props = {
    data: { ...data, label, level, ...others },
    ...others,
  };
  if (type === StartNode.COMP) {
    return new StartNodeShape({
      ...props,
      ports: {
        items: [{
          group: 'out',
          id: `${props.id}-out`,
        }],
      },
    }).position(x, y);
  }
  if (type === IndicatorNode.COMP || type === AggregationNode.COMP) {
    const source = new (type === IndicatorNode.COMP ? IndicatorNodeShape : AggregationNodeShape)({
      ...props,
      ports: {
        items: [{
          group: 'out',
          id: `${props.id}-out`,
        }, {
          group: 'in',
          id: `${props.id}-in`,
        }],
      },
    }).position(x, y);

    const target = new OutputItemNodeShape({
      id: `${props.id}-output`,
      data: {
        label: `${options.label}`,
        level,
        graphRef,
        ...props,
        id: `${props.id}-output`,
      },
      ports: {
        items: [{
          group: 'in',
          id: `${props.id}-output-in`,
        }],
      },
    }).position(x, y + 200);

    return [
      source,
      target,
      createEdge(source, target),
    ];
  }
  if (type === OutputItemNode.COMP) {
    // 单独生成 target节点
    const target = new OutputItemNodeShape({
      id: `${props.id}`,
      data: {
        label: `${options.label}`,
        level,
        graphRef,
        ...props,
      },
      ports: {
        items: [{
          group: 'in',
          id: `${props.id}-output-in`,
        }],
      },
    }).position(x, y);
    return target
    // return [origin, target, createEdge(origin, target)]
  }
  if (type === EndNode.COMP) {
    return new EndNodeShape({
      ...props,
      ports: {
        items: [{
          group: 'in',
          id: `${props.id}-in`,
        }],
      },
    }).position(x, y);
  }

  return new ReactNodeShape({ ...props }).position(x, y);
};

export const appendCell = (graph: Graph, cell: Cell | Cell[]) => {

};
