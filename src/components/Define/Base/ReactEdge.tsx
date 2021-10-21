import React from 'react';
import { Cell, Graph, Markup, Node, Shape } from '@antv/x6';
import Properties = Node.Properties;

/**
 * 可以控制 React 组件状态的边
 */
export class ReactEdge extends Shape.Edge {
  constructor(options, bool) {
    super(options);
    this.bool = bool;
  }
  private components: React.Component[] = [];

  /**
   * 注册 React 组件实例
   * @param comp
   */
  public registerComp(comp: React.Component) {
    this.components.push(comp);
  }

  /**
   * 销毁 React 组件实例
   * @param comp
   */
  public destroyComp(comp: React.Component) {
    this.components = this.components.filter(c => c !== comp);
  }

  /**
   * 强制更新 React 组件
   */
  public forceUpdate() {
    this.components.forEach((comp: React.Component) => {
      comp.forceUpdate?.();
    });
  }

  /**
   * 更新 data 并触发 React 组件更新
   * @param data
   * @param options
   */
  public setState<T = Properties['data']>(data: T, options?: Cell.SetDataOptions): this {
    this.setData(data, options);
    this.forceUpdate();
    return this;
  }
}

// 注册 react-edge
Graph.registerEdge('react-edge', ReactEdge, true);

/**
 * 创建连接边
 * @param source
 * @param target
 */
export const createEdge = (source: Cell, target: Cell, bool= false, typeBool) => {
  const args = bool ? (typeBool ? {
    // offset: 32,
    excludeTerminals: ['source', 'target'],
    startDirections: ['bottom'],
    endDirections: ['bottom'],
  } : {
    excludeTerminals: ['source', 'target'],
    // startDirections: ['bottom'],
    // endDirections: ['bottom'],
  }) : '';
  return new ReactEdge({
    shape: 'react-edge',
    id: `${source.id}-to-${target.id}`,
    source: {
      cell: source,
      port: `${source.id}-out`,
    },
    target: {
      cell: target,
      port: `${target.id}-in`,
    },
    router: {
      name: 'manhattan',
      args,
    },
    attrs: {
      line: {
        stroke: '#9297A1',
        strokeWidth: 1,
        strokeDasharray: bool ? '5 5' : '',
        sourceMarker: bool ? 'block' : '',
        targetMarker: 'block',
      },
    },
    label: {
      markup: Markup.getForeignObjectMarkup(),
      attrs: {
        fo: {
          width: 120,
          height: 30,
          x: -60,
          y: -15,
        },
      },
    },
    zIndex: 10,
  }, bool);
};
