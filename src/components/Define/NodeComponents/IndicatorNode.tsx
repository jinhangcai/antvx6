import React from 'react';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import {ConfigProvider, Input, Tooltip} from 'efg-design-rth';
import LegendNode from '@/components/Define/Base/LegendNode';
import Remarks from "@/components/Remarks";
import AddRemarks from "@/components/Remarks/AddRemarks";

/**
 * 指标节点
 */
@LegendNode()
export default class IndicatorNode extends ReactNode<{ hover: boolean }> {
  /**
   * 节点类型
   */
  static COMP = 'indicator-node';

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      AddRemarksShow: false,
      isTool: false,
    };
  }
  changeRemakrs(bool) {
    this.setState({AddRemarksShow: bool, isTool: bool})
  }
  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    })
  }
  remarks() {
    console.log('remarks')
  }
  deleteNode() {
    const { deleteNode } = this.props;
    deleteNode(this.props.node);
  }
  render() {
    const { props } = this;
    const { getReactComponent } = props;
    const { AddRemarksShow, isTool } = this.state;
    let bgClass = '';
    const name = this.props.node?.getData().level;
    switch (name) {
      case 'legal':
        bgClass = '#33AED0';
        break;
      case 'sole':
        bgClass = '#3CC4B9';
        break;
      case 'tax':
        bgClass = '#897CBD';
        break;
      case 'invoice':
        bgClass = '#897CBD';
        break;
    }
    const explain = this.props.node.getData()?.AddRemarks?.explain || '';
    const InputValue = this.props.node.getData()?.AddRemarks?.InputValue || '';
    return <div className={'react-node indicator-node output-item-node'} style={{ background: bgClass }} title={this.label}>
      {/*<Tooltip*/}
      {/*  title={<Remarks node={node} onClick={() => { this.remarks() }} />} placement={'top'}*/}
      {/*  color={'#fff'}*/}
      {/*>*/}
      {/*  <img draggable={false} src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 21, height: 21 }} />*/}
      {/*</Tooltip>*/}

      <ConfigProvider>
        {
          (explain || InputValue) && <Tooltip
            title={<Remarks node={this.props.node} onClick={() => { this.remarks() }} />} placement={'top'}
            color={'#fff'}
          >
            <img draggable={false} onClick={() => { this.Tool() } } src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 21, height: 21 }} />
          </Tooltip>
        }
        {
          (!explain && !InputValue) && <img onClick={() => { this.Tool() } } draggable={false} src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 21, height: 21 }} />
        }
        {
          isTool && <div className={'Filter-Button-Tool'}>

            <Tooltip
              title={'删除'} placement={'top'}
              trigger={'click'}
            >
              <div className={'node-icon'} style={{ left: -5, top: -24 }}
                   title={'删除'}
                   onClick={() => { this.deleteNode() }}
              >
                <div className={'delete Imgs'} />
              </div>
            </Tooltip>
            <Tooltip
              title={<AddRemarks node={this.props.node} onClick={() => {this.changeRemakrs(false)}} />} placement={'top'}
              trigger={'click'}
              color={'#fff'}
              visible={AddRemarksShow}
            >
              <div className={'node-icon'} style={{ right: -3, top: -24 }}
                   title={'添加备注'}
                   onClick={() => {this.changeRemakrs(true)}}
              >
                <div className={' remark Imgs'} />
              </div>
            </Tooltip>
          </div>
        }
      </ConfigProvider>
      <ReactNodeLabel editable={!props.isLegend} text={!!getReactComponent} label={this.label} node={this.props.node} />
    </div>;
  }
}

@PortsReactShapeConfig(IndicatorNode.COMP, {
  ports: {
    items: [
      { group: 'in' },
      { group: 'out' },
    ],
  },
})
export class IndicatorNodeShape extends PortsReactShape {

}
