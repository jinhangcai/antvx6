import { Cell, Graph } from '@antv/x6';
import { ReactShape } from '@antv/x6-react-shape';
import Properties = Cell.Properties;

export const PortGroups = {
  in: {
    position: {
      name: 'top',
    },
    attrs: {
      portBody: {
        magnet: 'passive',
        r: 0,
        // stroke: '#ffa940',
        stroke: 'transparent',
        fill: 'transparent',
        strokeWidth: 0,
      },
    },
  },
  out: {
    position: {
      name: 'bottom',
    },
    attrs: {
      portBody: {
        // magnet: true,
        r: 0,
        // stroke: '#3199FF',
        stroke: 'transparent',
        fill: 'transparent',
        strokeWidth: 0,
      },
    },
  },
};

export const NODE_WIDTH = 60;

export const NODE_HEIGHT = 40;

export const NODE_SIZE = {
  width: NODE_WIDTH,
  height: NODE_HEIGHT,
};

class PortsReactShape extends ReactShape {

  allowIn = 2;

  allowMultiIn = false;

  allowOut = 1;

  allowMultiOut = false;

  getInPorts() {
    return this.getPortsByGroup('in');
  }

  getOutPorts() {
    return this.getPortsByGroup('out');
  }

  // getUsedInPorts(graph: Graph) {
  //   const incomingEdges = graph.getIncomingEdges(this) || [];
  //
  //   return incomingEdges.map((edge: Edge) => {
  //     const portId = edge.getTargetPortId();
  //     return this.getPort(portId!);
  //   });
  // }

  getNewInPorts(length: number) {
    return Array.from(
      {
        length,
      },
      () => {
        return {
          group: 'in',
        };
      },
    );
  }

  updateInPorts(graph: Graph) {
    // const minNumberOfPorts = 2;
    // const ports = this.getInPorts();
    // const usedPorts = this.getUsedInPorts(graph);
    // const newPorts = this.getNewInPorts(
    //   1,
    // );
    //
    // if (
    //   ports.length === minNumberOfPorts &&
    //   ports.length - usedPorts.length > 0
    // ) {
    //   // noop
    // } else if (ports.length === usedPorts.length) {
    //   this.addPorts(newPorts);
    // } else if (ports.length + 1 > usedPorts.length) {
    //   this.prop(
    //     ['ports', 'items'],
    //     this.getOutPorts().concat(usedPorts).concat(newPorts),
    //     {
    //       rewrite: true,
    //     },
    //   );
    // }

    return this;
  }
}

PortsReactShape.config({
  component: 'ports-react-shape',
  attrs: {
    root: {
      magnet: false,
    },
  },
  ports: {
    groups: PortGroups,
  },
  portMarkup: [
    {
      tagName: 'circle',
      selector: 'portBody',
    },
  ],
  zIndex: 99,
  ...NODE_SIZE,
  className: 'custom-react-shape',
});

/**
 * 连接桩装饰器
 * @param component
 * @param config
 * @constructor
 */
export const PortsReactShapeConfig = (component: string, config: Properties) => (PRS: typeof PortsReactShape) => {
  PRS.config({
    ...config,
    component,
  });
};

export default PortsReactShape;
