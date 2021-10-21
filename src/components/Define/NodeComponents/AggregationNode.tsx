import React from 'react';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import LegendNode from '@/components/Define/Base/LegendNode';
import { classnames } from 'syfed-ui';
import {ConfigProvider, Tooltip} from "efg-design-rth";
import AddRemarks from "@/components/Remarks/AddRemarks";
import Remarks from "@/components/Remarks";

@LegendNode()
export default class AggregationNode extends ReactNode<any> {
  static COMP = 'aggregation-node';
  constructor(props) {
    super(props);
    this.state = {isTool: false,AddRemarksShow:false,AddSplitShow: false,}
  }
  remarks() {
    console.log('remarks')
  }
  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    })
  }
  changeRemakrs(bool) {
    this.setState({AddRemarksShow: bool, isTool: bool})
  }
  separate() {
    const { separate, node } = this.props;
    this.setState({AddSplitShow: false})
    separate(node)
  }
  render() {
    const { node } = this.props;
    const { isTool, AddRemarksShow, AddSplitShow } = this.state;
    const name = node?.getData().level;
    const mearge = node?.getData().mearge;
    const explain = node.getData()?.AddRemarks?.explain || '';
    const InputValue = node.getData()?.AddRemarks?.InputValue || '';
    return <ConfigProvider>
    <div
      className={classnames('react-node aggregation-node')}
      title={this.label}>
      {
        name && mearge && (explain || InputValue) &&
        <Tooltip
          title={<Remarks node={node} onClick={() => { this.remarks() }} />} placement={'top'}
          color={'#fff'}
        >
          <div className={'abcdef'} style={{marginLeft:-36, marginTop:-42}} onClick={() => { this.Tool() } }>
            <div className={'aggregation-item backend'} />
            <div className={'aggregation-item center'} />
            <div className={'aggregation-item front'} />
          </div>
        </Tooltip>
      }
      {
        (mearge && !explain && !InputValue) && <div  style={{marginLeft:-36, marginTop:-42}}  onClick={() => { this.Tool() } }>
          <div className={'aggregation-item backend'} />
          <div className={'aggregation-item center'} />
          <div className={'aggregation-item front'} />
        </div>
      }
      {
        isTool && <div className={'Filter-Button-Tool'}>
          <div className={'node-icon'} style={{ left: -13, top: -30 }}
               title={'设置数据运算集'}
               onClick={() => { this.setState({ ModalVisible: true }) }}
          >
            <div className={'SetOperation Imgs'} />
          </div>
          <div className={'node-icon'} style={{ left: 10, top: -42 }}
               title={'数据集输出项节点'}
               onClick={() => { this.setState({ ModalVisible: true }) }}
          >
            <div className={'output Imgs'} />
          </div>
          <Tooltip
            title={<AddRemarks onClick={() => {this.changeRemakrs(false)}} node={node} />} placement={'top'}
            color={'#fff'}
            trigger={'click'}
            visible={AddRemarksShow}

          >
            <div className={'node-icon'} style={{ top: -42, left: 36 }}
                 title={'添加备注'}
                 onClick={() => {this.changeRemakrs(true)}}
            >
              <div className={' copy Imgs'} />
            </div>
          </Tooltip>
          <Tooltip
            title={<span style={{ color: '#333' }}>{'拆分集合'}</span>} placement={'top'}
            color={'#fff'}
            visible={AddSplitShow}
          >
            <div className={'node-icon'} title={'拆分集合'} style={{ right: -18, top: -30 }} onClick={() => { this.separate() }}>
              <div className={' splitGather Imgs'} />
            </div>
          </Tooltip>
        </div>
      }
      {
        name && !mearge && <img draggable={false} src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 24, height: 24 }} />
      }
      <ReactNodeLabel type={ mearge ? 'Agg' : 'Agg1'} LabelBottom={true} label={this.label} node={this.props.node} />
    </div>
    </ConfigProvider>
  }
}

@PortsReactShapeConfig(AggregationNode.COMP, {
  ports: {
    items: [
      { group: 'in' },
      { group: 'out' },
    ],
  },
})
export class AggregationNodeShape extends PortsReactShape {
}
