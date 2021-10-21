import React from 'react';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import {Checkbox, ConfigProvider, message, Tooltip} from 'efg-design-rth';
import LegendNode from '@/components/Define/Base/LegendNode';
import Remarks from "@/components/Remarks";
// import ModalRemarks from "@/components/Remarks/ModalRemarks";
import AddRemarks from "@/components/Remarks/AddRemarks";
import { classnames } from 'syfed-ui';

@LegendNode()
export default class OutputItemNode extends ReactNode<{ hovered: boolean;isTool: boolean, isRight: Boolean }> {
  static COMP = 'output-item-node';

  constructor(props) {
    super(props);
    this.state = { hovered: false, isTool: false, isRight: false, AddRemarksShow: false};
  }
  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    })
  }
  osNode() {
    const { node } = this.props;
    if (node?.getData()?.checkable) {
      message.error('请先选择需要连接的节点');
      return;
    }
    this.setState({
      isRight: !this.state.isRight,
    }, () => {
      this.addData()
    })
  }
  addData() {
    const { isRight } = this.state;
    this.props.node?.setData({ isRight })
  }
  remarks() {
    console.log('remarks')
  }
  changeRemakrs(bool) {
    this.setState({AddRemarksShow: bool, isTool: bool})
  }
  render() {
    const checkAble = this.nodeData.checkable || this.nodeData.checked;
    const { onCheck, node } = this.props;
    const { isTool, isRight, AddRemarksShow } = this.state;
    const text = this.props.node?.getData().text;
    const name = this.props.node?.getData().level;
    const mearge = this.props.node?.getData().mearge;
    const explain = this.props.node.getData()?.AddRemarks?.explain || '';
    const InputValue = this.props.node.getData()?.AddRemarks?.InputValue || '';
    return <div className={classnames('react-node output-item-node')}>
      <ConfigProvider>
        {
          name && <div className={'output-item-node-Img'}>
            {
              (explain || InputValue) && <Tooltip
                title={<Remarks node={node} onClick={() => { this.remarks() }} />} placement={'top'}
                color={'#fff'}
              >
                <img onClick={() => { this.Tool() } } draggable={false} src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 21, height: 21 }} />
              </Tooltip>
            }
            {
              (!explain && !InputValue) && <img onClick={() => { this.Tool() } } draggable={false} src={require(`../../../assets/imgs/${name}.png`)} style={{ width: 21, height: 21 }} />
            }
            {
              isRight && <div className={'output-item-node-pitch'} />
            }
          </div>
        }
        {checkAble && <Checkbox className={'node-selectable'} onChange={e => {
          node.setData({ checked: e.target.checked });
          onCheck?.('select-output', e);
        }} />}
        {
          isTool && <div className={'Filter-Button-Tool'}>
            <Tooltip
              title={<span style={{ color: '#333' }}>数据集输出项节点</span>} placement={'top'}
              color={'#fff'}
            >
              <div className={'node-icon'} style={{ left: -26, top: -10 }}
                   onClick={() => { this.setState({ ModalVisible: true }) }}
              >
                <div className={'change Imgs'} />
              </div>
            </Tooltip>
            <Tooltip
              title={<AddRemarks onClick={() => {this.changeRemakrs(false)}} node={node} />} placement={'top'}
              color={'#fff'}
              trigger={'click'}
              visible={AddRemarksShow}

            >
              <div className={'node-icon'} style={{ top: -28, left: 8 }}
                   title={'添加备注'}
                   onClick={() => {this.changeRemakrs(true)}}
              >
                <div className={' copy Imgs'} />
              </div>
            </Tooltip>
            <Tooltip
              title={<span style={{ color: '#333' }}>{isRight ? '撤销结束节点' : '设置为结束节点'}</span>} placement={'top'}
              color={'#fff'}
            >
              <div className={'node-icon'} style={{ right: -26, top: -10 }} onClick={() => { this.osNode() }}>
                {
                  !isRight ? <div className={' remark Imgs'} /> : <div className={' restore Imgs'} />
                }
              </div>
            </Tooltip>
          </div>
        }
      </ConfigProvider>
      <ReactNodeLabel label={this.label} mearge={mearge} text={true} node={this.props.node} />
    </div>;
  }
}

@PortsReactShapeConfig(OutputItemNode.COMP, {
  ports: {
    items: [
      { group: 'in' },
      { group: 'out' },
    ],
  },
})
export class OutputItemNodeShape extends PortsReactShape {

}
