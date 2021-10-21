import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';
import { DagreLayout } from '@antv/layout';
import { Addon, Cell, Graph, Markup, Node, NodeView, Shape } from '@antv/x6';
import { Dnd } from '@antv/x6/lib/addon';
import '@antv/x6-react-shape/lib/index';
import { Definition, ReactShape } from '@antv/x6-react-shape';
import { useAntVisible } from '@/utils/hooks';
import { Button, Input, message, Modal, Space } from 'syfed-ui';
import IndicatorNode from '@/components/Define/NodeComponents/IndicatorNode';
import PortsReactShape from '@/components/Define/Base/PortsReactShape';
import ReactNode from '@/components/Define/Base/ReactNode';
import OutputItemNode from '@/components/Define/NodeComponents/OutputItemNode';
import AggregationNode from '@/components/Define/NodeComponents/AggregationNode';
import { createReactNodeShape, getReactComponent } from '@/components/Define/constant';
import FilterButton from '@/components/Define/EdgeComponents/FilterButton';
import FilterButtonDashed from '@/components/Define/EdgeComponents/FilterButtonDashed';
import { createEdge, ReactEdge } from '@/components/Define/Base/ReactEdge';
import { createLegendNode } from '@/components/Define/Base/LegendNode';
import './index.less';
import GetDropNodeOptions = Dnd.GetDropNodeOptions;
import ValidateNodeOptions = Dnd.ValidateNodeOptions;
import ConditionSetting from '@/components/Define/ConditionSetting';
import {ConfigProvider} from "efg-design-rth";
// 判断是否能拆分逻辑  合并时 给合并的source添加字段 判断依据是

// source target节点 数据运算集  鼠标移上去  看是否有备注信息 有则展示 没有则没效果
// 点击 source节点 会出现修改备注 和  删除节点 操作
// 点击 target节点 会出现 数据集输出项节点  添加备注    设置为结束节点
// 点击数据运算集 可进行设置数据集运算、设置数据集输出项  备注  拆分  操作
const Define = () => {
  // 节点模板 dom
  const addonRef = useRef<any>();
  // 语义图画布 dom
  const containerRef = useRef<any>();
  // 画布实例
  const graphRef = useRef<Graph>();
  // 当前设置的边实例
  const edgeRef = useRef<ReactEdge>();
  // 设置条件弹窗
  const modal = useAntVisible();
  // x6布局
  const dagreLayout = useMemo(() => new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    align: 'UL',
    ranksep: 30,
    nodesep: 15,
    controlPoints: true,
  }), []);
  let ref: any = '';
  const [reply, setreply] = React.useState('');
  const [visibleHint, setvisibleHintsettingData] = React.useState(false);
  const [checkable, setcheckable] = React.useState(false);
  const [settingData, setsettingData] = React.useState({});
  const [ModalVisible, setModalVisible] = React.useState(false);
  const getOutputItems = useCallback(() => {
    return graphRef.current?.getCells().filter((cell) => cell.isNode() && (cell as ReactShape).getComponent() === OutputItemNode.COMP) || [];
  }, []);
  const separate = useCallback((node) => {
    // 拆分时 拿到 左右2个 source的id 然后重新画一个target 然后重新把边指向这个target
    // 拿到当前节点的id 再去找他的下一个节点是否存在   存在则不可拆分  不存在则可以拆分
    // return;
    const isRef = graphRef.current?.getCellById(`${node?.getData()?.id}-output`);
    const isRef1 = graphRef.current?.getCellById(`${node?.getData()?.id1}-output`);
    if (!isRef && !isRef1) {
      message.error('请按照层级结构，从下到上拆分！');
      return
    }
    // 拿到拆分需要删除的 上下节点
    const removeId = graphRef.current?.getCellById(node?.getData()?.id);
    const removeId1 = graphRef.current?.getCellById(`${node?.getData()?.id}-output`);
    // 生成 左右2边的 target节点
    const add = createReactNodeShape('output-item-node', node?.getData().cellsData.x, node?.getData().cellsData.y, node?.getData().cellsData);
    const add1 = createReactNodeShape('output-item-node', node?.getData().cellsData1.x, node?.getData().cellsData1.y, node?.getData().cellsData1);
    // 获取左右2边的边id
    const nodeid1 = node?.getData().cellsData.id.substring(0, node?.getData().cellsData.id.length - 7);
    const nodeid2 = node?.getData().cellsData1.id.substring(0, node?.getData().cellsData1.id.length - 7);
    // 获取左边2边数据
    const edge1 = graphRef.current?.getCellById(`${nodeid1}-to-${node?.getData().cellsData.id}`);
    const edge2 = graphRef.current?.getCellById(`${nodeid2}-to-${node?.getData().cellsData1.id}`);
    // 往画布上添加节点
    graphRef.current?.addCell(add).addCell(add1);
    // 往画布上添加边到节点的指向
    edge1.setTarget(add)
    edge2.setTarget(add1)
    // source1.setTarget(graphRef.current?.getCellById(`${id}`))
    // console.log('拆分集合useCallback1', edge1, edge2, removeId, graphRef.current?.getCells(), add[0].getData())
    graphRef.current?.removeCells([removeId, removeId1]);
  }, []);
  useEffect(() => {
    sessionStorage.removeItem('copyCondition');
  }, [])
  const deleteNode = useCallback((node) => {
    // 拿到当前节点id
    // 1：通过id获取target节点是否存在  如果不存在则证明有合并节点 拿到合并节点 进行拆分
    // 3：然后在判断合并节点的target节点是否存在 存在则表示链条到末端了 把这一链条进行删除
    // 4：如果不存在则证明 则证明存在合并节点 拿到合并节点 进行拆分
    // return;
    const id = node.id;
    const affId = node.getData().affId;
    // 寻找id对应的target节点
    const isRef = graphRef.current?.getCellById(`${id}-output`);
    const MeargeRef = graphRef.current?.getCellById(`${affId}-output-mearge`);
    if (!!isRef) {
      // 存在target节点 进行节点删除
      graphRef.current?.removeCells([node, isRef]);
    } else if (!!MeargeRef) {
      // 不存在target节点 进行递归节点删除
      recursionNode(node, MeargeRef)

    }
  }, [])
  const recursionNode = useCallback((Node, MeargeRef) => {
    // 判断需要删除节点是左还是右 然后拿到相反的节点 删除对应的节点
    const outputId = Node.id + '-output';
    const cellsData = MeargeRef.getData().cellsData.id === outputId ? MeargeRef.getData().cellsData1 : MeargeRef.getData().cellsData;
    const cellsData1 = MeargeRef.getData().cellsData.id === outputId ? MeargeRef.getData().cellsData : MeargeRef.getData().cellsData1;
    // 生成target节点
    const add = createReactNodeShape('output-item-node', cellsData.x, cellsData.y, cellsData);
    // 获取target节点对应的边
    const nodeid1 = cellsData.id.substring(0, cellsData.id.length - 7);
    // 获取边的数据
    const edge1 = graphRef.current?.getCellById(`${nodeid1}-to-${cellsData.id}`);
    // 往画布上添加节点
    graphRef.current?.addCell(add);
    // 往画布上添加边到节点的指向
    edge1.setTarget(add);
    graphRef.current?.removeCells([Node, cellsData1]);
    deleteNode(MeargeRef)
  }, [])
  const checkOutputItems = useCallback((type, e) => {
    // 2个点连线
    const outputItems = getOutputItems();
    // @ts-ignore
    const checkedItems: Node[] = outputItems.filter((node) => node.getData().checked);
    if (checkedItems.length >= 2) {
      const typeBool = checkedItems[0].id.indexOf('mearge') > 0 || checkedItems[1].id.indexOf('mearge') > 0;
      const line1 = graphRef.current?.getCellById(checkedItems[0].id);
      const line2 = graphRef.current?.getCellById(checkedItems[1].id);
      graphRef.current?.addCell([
        createEdge(line1, line2, true, typeBool),
      ]);
      // graphRef.current?.removeCells(checkedItems);
      // 把所有的节点 isopt设置为false
      outputItems.forEach((cell) => cell?.setData({ checkable: false, checked: false, isopt: false }));
      // 当前2个节点设置为true
      checkedItems.forEach((cell) => cell?.setData({ isopt: true }));
      setcheckable(false)
    }
  }, []);

  const checkButtonItems = useCallback((type, e) => {
    // 2个点连线
    const outputItems = getOutputItems();
    // @ts-ignore
    const checkedItems: Node[] = outputItems.filter((node) => {
      return node.getData().isopt;
    });
    if (checkedItems.length >= 2) {
      const [node1, node2] = checkedItems;
      const [pos1, pos2] = [node1.getPosition(), node2.getPosition()];
      const x = (pos1.x + pos2.x) / 2;
      const y = (pos1.y + pos2.y) / 2;
      const id = `${node1.id}-mearge`;
      const id1 = `${node2.id}-mearge`;
      const copyId1 = node1.id.substring(0, node1.id.length - 7);
      const copyId2 = node2.id.substring(0, node2.id.length - 7);
      const copyedge1 = graphRef?.current?.getCellById(`${copyId1}`);
      const copyedge2 = graphRef?.current?.getCellById(`${copyId2}`);
      copyedge1?.setData(Object.assign({}, copyedge1.getData(), { affId: copyedge1?.id }))
      copyedge2?.setData(Object.assign({}, copyedge2.getData(), { affId: copyedge1?.id }))
      // @ts-ignore
      const cells: Cell[] = createReactNodeShape(AggregationNode.COMP, x, y, {
        id,
        id1,
        label: '数据运算集',
        ops: true,
        level: node1.getData().level,
        level1: node2.getData().level,
        mearge: true,
        cellsData: Object.assign({}, checkedItems[0].getData(), { x: pos1.x, y: pos1.y }),
        cellsData1: Object.assign({}, checkedItems[1].getData(), { x: pos2.x, y: pos2.y }),
        data: {
          text: 2,
        },
      });
      // graphRef.current?.addCell(cells)
      graphRef.current?.addCell(cells)
      // graphRef.current?.addCell(cells).addCell([
      //   createEdge(graphRef.current?.getCellById(node1.id.slice(0, -7)), cells[0]),
      //   createEdge(graphRef.current?.getCellById(node2.id.slice(0, -7)), cells[0]),
      // ]);
      // 获取 2个socure的节点  然后通过setTarget使边重新指向目标节点 最后删除 target节点
      // ps：这样做的目的是因为如果直接删除target节点 会连带对应的边也删除 那么边上的数据也跟着被删除
      const nodeid1 = node1.id.substring(0, node1.id.length - 7);
      const nodeid2 = node2.id.substring(0, node2.id.length - 7);
      const edge1 = graphRef.current?.getCellById(`${nodeid1}-to-${node1.id}`);
      const edge2 = graphRef.current?.getCellById(`${nodeid2}-to-${node2.id}`);
      edge1?.setTarget(graphRef.current?.getCellById(`${id}`))
      edge2?.setTarget(graphRef.current?.getCellById(`${id}`))
      graphRef.current?.removeCells(checkedItems);
      outputItems.forEach(cell => cell?.setData({ checkable: false }));
    }
  }, []);
  const onOk = (data, formula) => {
    setModalVisible(false)
    setsettingData(data)
    ref.current?.setState({ FilterData: data });
    ref.current?.setData({ FilterData: data })
  }
  useEffect(() => {
    // 高亮
    const magnetAvailabilityHighlighter = {
      name: 'stroke',
      args: {
        attrs: {
          fill: '#fff',
          stroke: '#47C769',
        },
      },
    };
    // 画布实例
    const graph = new Graph({
      container: containerRef.current,
      autoResize: true,
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      background: {
        color: '#eceff2',
      },
      selecting: true,
      // scroller: {
      //   enabled: true,
      //   pannable: true,
      //   pageVisible: true,
      //   pageBreak: false,
      // },
      // mousewheel: {
      //   enabled: true,
      //   modifiers: ['ctrl', 'meta'],
      // },
      history: true,
      grid: {
        size: 10,
        visible: true,
        type: 'mesh', // 'dot' | 'fixedDot' | 'mesh'
        args: {
          color: '#f2f2f2',
          thickness: 1,
        },
      },
      getReactComponent(node: ReactShape): Definition {
        // 拖拽完成  拿到上下2个节点 进行渲染dom节点  根据前面第二步渲染出的2个节点  这里会进入2次
        const Component = getReactComponent(node.getComponent());
        if (Component) {
          return <Component getReactComponent={true} deleteNode={deleteNode} separate={separate} node={node} onCheck={checkOutputItems} onDoubleClick={modal.show} />;
        }
        return <ReactNode node={node} />;
      },
      highlighting: {
        // magnetAvailable: magnetAvailabilityHighlighter,
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false, // 是否允许连接到画布空白位置的点
        allowMulti: false, // 是否允许在相同的起始节点和终止之间创建多条边
        allowLoop: false, // 是否允许创建循环连线
        allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
        allowEdge: false, // 是否允许边链接到另一个边
        highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点
        connectionPoint: 'boundary',
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#9297A1',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
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
          });
        },
        validateConnection({ sourceView, targetView, sourceMagnet, targetMagnet }) {
          if (!targetMagnet
            || targetMagnet.getAttribute('port-group') !== 'in'
            || targetMagnet.getAttribute('port-group') === sourceMagnet?.getAttribute('port-group')
          ) {
            return false;
          }

          // if (targetView) {
          //   const node = targetView.cell;
          //   if (node instanceof PortsReactShape) {
          //     const portId = targetMagnet.getAttribute('port');
          //     const usedInPorts = node.getUsedInPorts(graph);
          //     if (usedInPorts.find((port) => port && port.id === portId)) {
          //       return false;
          //     }
          //   }
          // }

          return true;
        },
      },
      embedding: {
        // enabled: true,
        enabled: false,
        validate({ child, parent }) {
          return [child, parent].every(({
            id, children,
          }) => id.endsWith('-to-end') && !children?.length) && !parent.parent;
        },
      },
      onEdgeLabelRendered: (args) => {
        // 当边的文本标签渲染完成时触发的回调。
        const { selectors, edge } = args;
        const { bool } = edge;
        const content = selectors.foContent as HTMLDivElement;
        if (content) {
          content.style.display = 'flex';
          content.style.alignItems = 'center';
          content.style.justifyContent = 'center';
          ReactDOM.render(bool ? <FilterButtonDashed  edge={edge as ReactEdge}
            onClick={() => {
              checkButtonItems()
            }}
          /> : <FilterButton edge={edge as ReactEdge} onClick={(value) => {
            edgeRef.current = edge as ReactEdge;
            const mearge = graphRef.current?.getCellById(edgeRef.current?.target?.cell)?.getData();
            graphRef.current?.getCellById(edgeRef.current?.target?.cell)?.setData({text: 123});
            // 设置数据集输出项
            if (value) {
              edgeRef.current?.setState(value);
              edge.setData(value)
              // graphRef.current?.getCellById(edgeRef.current?.target?.cell)?.setData(value);
            }
            // modal.show();
          }} onChangePop={() => {
            setModalVisible(true)
            edgeRef.current = edge as ReactEdge;
            ref = edgeRef;
            // onChangePop()
          }} />, content);
        }
      },
    });
    function update(view: NodeView) {
      const { cell } = view;
      if (cell instanceof PortsReactShape) {
        cell.getInPorts().forEach((port) => {
          const portNode = view.findPortElem(port.id!, 'portBody');
          view.unhighlight(portNode, {
            highlighter: magnetAvailabilityHighlighter,
          });
        });
        cell.updateInPorts(graph);
      }
    }

    graph.on('edge:connected', ({ previousView, currentView }) => {
      if (previousView) {
        update(previousView as NodeView);
      }
      if (currentView) {
        update(currentView as NodeView);
      }
    });

    graph.on('edge:removed', ({ edge, options }) => {
      if (!options.ui) {
        return;
      }

      const target = edge.getTargetCell();
      if (target instanceof PortsReactShape) {
        target.updateInPorts(graph);
      }
    });

    graph.on('edge:mouseenter', ({ edge }) => {
      // edge.addTools([
      //   // 'source-arrowhead',
      //   // 'target-arrowhead',
      //   {
      //     name: 'button-remove',
      //     args: {
      //       distance: -40,
      //     },
      //   },
      // ]);
    });

    graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools();
    });
    // 控制连接桩显示/隐藏
    // const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    //   for (let i = 0, len = ports.length; i < len; i = i + 1) {
    //     ports[i].style.visibility = show ? 'visible' : 'hidden';
    //   }
    // };

    // graph.on('node:mouseenter', ({ node }) => {
    //   console.log(node);
    //   const container = containerRef.current;
    //   const ports = container.querySelectorAll(
    //     '.x6-port-body',
    //   ) as NodeListOf<SVGElement>;
    //   showPorts(ports, true);
    // });
    //
    // graph.on('node:mouseleave', ({ node }) => {
    //   const container = containerRef.current;
    //   const ports = container.querySelectorAll(
    //     '.x6-port-body',
    //   ) as NodeListOf<SVGElement>;
    //   showPorts(ports, false);
    // });

    graphRef.current = graph;

    let index = 0;

    // 节点模板实例
    const stencil = new Addon.Stencil({
      title: undefined,
      target: graph,
      stencilGraphWidth: 72,
      stencilGraphHeight: 500,
      stencilGraphPadding: 10,
      // collapsable: true,
      // groups: [
      //   {
      //     title: '基础流程图',
      //     name: 'group1',
      //   },
      //   {
      //     title: '系统设计图',
      //     name: 'group2',
      //     graphHeight: 250,
      //     layoutOptions: {
      //       rowHeight: 70,
      //     },
      //   },
      // ],
      layoutOptions: {
        columns: 1,
        columnWidth: 72,
        rowHeight: 77,
        dx: 0,
        dy: 0,
      },
      getDropNode: (draggingNode: Node, options: GetDropNodeOptions) => {
        // 拖拽结束时，获取放置到目标画布的节点，默认克隆代理节点。  会把当前return出的数据 暴露给validateNode  这是第一步
        const compType = draggingNode.getData().type;
        const level = draggingNode.getData().level;
        const data = createReactNodeShape(ReactNode.COMP, 0, 0, {
          label: draggingNode.getData().label, level, data: {
            compType,
            level,
          }, id: `xxx-${Date.now()}`,
        }) as Node;
        return data;
      },
      validateNode: (droppingNode: Node, options: ValidateNodeOptions) => {
        // 拖拽结束时，验证节点是否可以放置到目标画布中。  拿到getDropNodereturn回的数据 行进验证  这是第二步
        const { compType, level } = droppingNode.getData();
        const { x, y } = droppingNode.position();
        if (compType === AggregationNode.COMP) {
          const outputNodes = getOutputItems();
          message.destroy();
          if (outputNodes.length < 2) {
            message.error('当前无可组合的节点');
          } else {
            message.info('请选择需要组合的节点');
            outputNodes.forEach((cell) => cell.setData({ checkable: true }));
          }
          return false;
        }
        graph.addCell(createReactNodeShape(compType, x, y, { id: `node-${index++}`, level, label: droppingNode.getData().label }));
        return false;
      },
    });
    addonRef.current.appendChild(stencil.container);

    const r1 = createLegendNode(IndicatorNode.COMP, '企业法人', 'legal');
    const r2 = createLegendNode(IndicatorNode.COMP, '自然人', 'sole');
    const r3 = createLegendNode(IndicatorNode.COMP, '税务机关', 'tax');
    const r4 = createLegendNode(IndicatorNode.COMP, '发票', 'invoice');
    // const r5 = createLegendNode(AggregationNode.COMP, '数据集运算', 'gather');
    // const r6 = createLegendNode(AggregationNode.COMP, '参数个性化', 'parameter');
    // stencil.load([r1, r2, r3, r4, r5, r6]);
    stencil.load([r1, r2, r3, r4]);
  }, []);

  const json = useRef<any>({});
  const replyData = () => {
    graphRef.current?.fromJSON(reply)
  }
  const handleSave = () => {
    json.current = graphRef.current?.toJSON();
    setreply(json.current)
    console.log(json.current);
  };

  const handleReset = () => {
    const _json: any = {
      edges: [],
      nodes: [],
    };
    json.current?.cells?.forEach((cell: Cell) => {
      cell = {};
      if (cell.shape === 'react-edge') {
        // _json.edges.push({ ...cell });
      } else {
        // _json.nodes.push({ ...cell });
      }
    });
    json.current = {};
    const formatJson = dagreLayout.layout(_json);
    console.log('formatJson', formatJson, json.current);
    graphRef.current?.fromJSON(json.current);
  };
  const AddonChange = () => {
    const outputNodes = getOutputItems();
    const list = outputNodes.filter((item) => {
      const id = item.id.substring(0, item.id.length - 7);
      return !!graphRef.current?.getCellById(`${id}-to-${item.id}`)?.getData()?.FilterData && !item.getData().isRight && graphRef.current?.getCellById(`${id}-to-${item.id}`)
    })
    console.log('list', outputNodes, list)
    message.destroy();
    // 临时测试  实际代码以下面注释为准
    const some = outputNodes.some((cell) => cell.getData().checkable);
    setcheckable(!some)
    outputNodes.forEach((cell) => cell.setData({ checkable: !some }));
    // 以这里为准
    // if (outputNodes.length >= 2 && list.length < 2) {
    //   message.error('请先进行条件设置且数量大于2');
    // } else if (list.length < 2) {
    //   message.error('当前无可组合的节点');
    // } else {
    //   const some = list.some((cell) => cell.getData().checkable);
    //   if (!some) {
    //     message.info('请选择需要组合的节点');
    //     list.forEach((cell) => cell.setData({ checkable: true }));
    //   } else {
    //     list.forEach((cell) => cell.setData({ checkable: false, checked: false }));
    //   }
    //   setcheckable(!some)
    // }
  };

  return <div className={'model-define'}>
    {/* 操作栏 */}
    <div className={'action-bar'}>
      <div />
      <Space>
        <Button onClick={handleSave} type={'primary'}>保存</Button>
        <Button onClick={replyData} type={'primary'}>恢复</Button>
        <Button onClick={handleReset} type={'primary'} ghost>取消</Button>
      </Space>
    </div>
    <div className={'graph'}>
      <div className={'addon-bar'}>
        <div className={'addon-title'}>业务对象</div>
        <div className={'addon-stencil'} ref={addonRef} >
          <ul
            className={'addon-list-btn'}
          >
            <li onClick={() => { AddonChange() }}>
              <img draggable={false} src={require('../../assets/imgs/split.png')} style={{ width: 24, height: 24 }} />
              <p>{!checkable ? '数据集运算' : '取消运算'}</p>
            </li>
            <li>
              <img draggable={false} src={require('../../assets/imgs/parameter.png')} style={{ width: 24, height: 24 }} />
              <p>参数个性化</p>
            </li>
          </ul>;
          {
            visibleHint && <div className={'addon-hint'}>
              <div className={'addon-hint-hole'}>
                <p />请将对象节点拖拽到画布上，<span onClick={() => { setvisibleHint(false); }}>不再提示</span>
              </div>
            </div>
          }
        </div>
      </div>
      <div className={'operations-area'} ref={containerRef} />
    </div>
    <ConditionSetting
      visible={ModalVisible}
      data={settingData}
      onOk={onOk}
      onClose={() => { setModalVisible(false)}}
    />
  </div>;
};

export default Define;
