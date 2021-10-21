import React from 'react';
import ReactNode, { ReactNodeLabel } from '@/components/Define/Base/ReactNode';
import PortsReactShape, { PortsReactShapeConfig } from '@/components/Define/Base/PortsReactShape';
import {Checkbox, ConfigProvider, Tooltip, Modal, Radio, Select, Input, Button, Space, message} from 'efg-design-rth';
import LegendNode from '@/components/Define/Base/LegendNode';
// import './index.less'
import { classnames } from 'syfed-ui';

const { Option } = Select;
@LegendNode()
// eslint-disable-next-line @typescript-eslint/typedef
export default class AddRemarks extends ReactNode<{ value: Number;String; explain: string; isRight: Boolean;InputValue: String }> {
  static COMP = 'Add-Remarks-node';

  constructor(props) {
    super(props);
    this.state = { value: 1, explain: '', isRight: false, InputValue: '' };
  }
  componentDidMount(){
    const value = this.props.node.getData()?.AddRemarks?.value || 1;
    const explain = this.props.node.getData()?.AddRemarks?.explain || '';
    const InputValue = this.props.node.getData()?.AddRemarks?.InputValue || '';
    this.setState({
      value,
      explain,
      InputValue,
    });
  }
  Tool() {
    this.setState({
      isTool: !this.state.isTool,
    });
  }
  osNode() {
    this.setState({
      isRight: !this.state.isRight,
    }, () => {
      this.addData();
    });
  }
  addData() {
    const { isRight } = this.state;
    this.props.node?.setData({ isRight });
  }
  changeRadio(e) {
    this.setState({
      value: e.target.value
    })
  }
  changeInput(e){
    this.setState({
      InputValue: e.target.value
    })
  }
  changeOptions(e) {
    this.setState({
      explain: e,
    })
  }
  handleOk() {
    // 确定
    const { onClick } = this.props;
    const {value, explain, InputValue} = this.state;
    if (value === 1) {
      this.props.node?.setData({AddRemarks: {value, explain, InputValue: '' }})
    } else {
      this.props.node?.setData({AddRemarks: {value, explain: '', InputValue }})
    }
    onClick();
    message.info('保存成功！');

  }
  handleCancel() {
    // 取消
    const { onClick } = this.props;
    const value = this.props.node.getData()?.AddRemarks?.value || 1;
    const explain = this.props.node.getData()?.AddRemarks?.explain || '';
    const InputValue = this.props.node.getData()?.AddRemarks?.InputValue || '';
    this.props.node?.setData({AddRemarks: {value, explain, InputValue }})
    message.info('取消成功！');
    onClick();
  }
  render() {
    const { value, explain, InputValue } = this.state;
    return <div className={classnames('react-node Remarks')}>
      <div style={{ width: 386 }}>
        <div className={'Remarks-Top'}>
          <div className={'Remarks-Top-title'}>
            <span className={'Remarks-message'}>修改备注信息：</span>
            <div className={'Remarks-space'}>
              <span className={'Remarks-title'}>录入方式:</span>
              <Radio.Group onChange={(e) => { this.changeRadio(e) }} value={value}>
                <Radio value={1}>选择</Radio>
                <Radio value={2}>手工录入</Radio>
              </Radio.Group>
            </div>
            <div className={'Remarks-space'}>
              <span className={'Remarks-title'}>备注说明:</span>
              {
                value === 1 && <Select defaultValue={explain} value={explain} style={{ width: 300 }} onChange={(e) => { this.changeOptions(e) }}>
                  <Option value="">请选择</Option>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              }
              {
                value === 2 && <Input style={{width:300}} value={InputValue} placeholder="Basic usage" onChange={(e) => {this.changeInput(e)}} />
              }
              <div className={'Remarks-footer'}>
                <Button type={'primary'} ghost onClick={() => { this.handleCancel(); }}>取消</Button>
                <Button type={'primary'} onClick={() => { this.handleOk() }} >确定</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfigProvider />
      {/*<ReactNodeLabel label={this.label} mearge={mearge} text={text} node={this.props.node} />*/}
    </div>;
  }
}

@PortsReactShapeConfig(AddRemarks.COMP, {
  ports: {
    items: [
      { group: 'in' },
      { group: 'out' },
    ],
  },
})
export class OutputItemNodeShape extends PortsReactShape {

}
