import React from 'react';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import {Checkbox, ConfigProvider, Tooltip, Modal} from 'efg-design-rth';
import LegendNode from '@/components/Define/Base/LegendNode';
import AddRemarks from "@/components/Remarks/AddRemarks";
// import './index.less'
import { classnames } from 'syfed-ui';

@LegendNode()
export default class Remarks extends ReactNode<{ hovered: boolean;isTool: boolean, isRight: Boolean }> {
  static COMP = 'Remarks-item-node';

  constructor(props) {
    super(props);
    this.state = { hovered: false, isTool: false, isRight: false, AddRemarksShow: false,};
  }
  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    })
  }
  osNode() {
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
  handleOk() {
    // 确定
    this.props.node?.setData({})

  }
  handleCancel() {
    // 取消
  }
  changeRemakrs(bool) {
    this.setState({AddRemarksShow: bool})
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
    return <div className={classnames('react-node Remarks')}>
      <div style={{width:386,}}>
        <div className={'Remarks-Top'}>
          <div  className={'Remarks-Top-title'}>
            <span className={'Remarks-message'}>备注信息：</span>
            <Tooltip
              destroyTooltipOnHide={true}
              title={<AddRemarks node={node} onClick={() => {this.changeRemakrs(false)}} />}
              color={'#fff'}
              visible={AddRemarksShow}
              trigger={'click'}
            >
              <span className={'Remarks-Img'} onClick={() => {this.changeRemakrs(true)}}>
                <img draggable={false} src={require('../../assets/imgs/remark.png')} style={{ width: 24, height: 24 }} />修改备注
              </span>
            </Tooltip>
          </div>
          <div className={'main'}>
            {
              explain || InputValue || ''
            }
          </div>
        </div>
      </div>
      <ConfigProvider>

      </ConfigProvider>
      {/*<ReactNodeLabel label={this.label} mearge={mearge} text={text} node={this.props.node} />*/}
    </div>;
  }
}

@PortsReactShapeConfig(Remarks.COMP, {
  ports: {
    items: [
      { group: 'in' },
      { group: 'out' },
    ],
  },
})
export class OutputItemNodeShape extends PortsReactShape {

}
