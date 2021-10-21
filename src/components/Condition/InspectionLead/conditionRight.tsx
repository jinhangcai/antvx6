import React, { useContext } from 'react';
import './index1.scss';
import { Collapse, Input, Select, ServButton, ServCondition, ServIcon } from 'syfed-ui';
import { MyContext } from './index';

const { Option } = Select;
const { Panel } = Collapse;
const ToolTop = (props) => {
  const { type } = props;
  const { initalState, SetinitalState } = useContext(MyContext);
  console.log('count', initalState, SetinitalState);
  return <div>
    <div className={'condition-right-Top'}>
      <ServButton type='primary' ghost>≠</ServButton>
      <ServButton type='primary' ghost>＞</ServButton>
      <ServButton type='primary' ghost>＜</ServButton>
      <ServButton type='primary' ghost>≥</ServButton>
      <ServButton type='primary' ghost>≤</ServButton>
      <Select defaultValue='lucy' style={{ width: 58 }}>
        <Option value='jack'>且</Option>
        <Option value='lucy'>或</Option>
      </Select>
      <ServButton className={'addType'} type='primary' ghost>添加条件组</ServButton>
    </div>
    <div className={'condition-right-min'}>
      <ServCondition
        onChange={console.log}
        requiredRuleKeys={['con']}
        renderRuleContent={(rule, index, changeRule) => <Input
          value={rule.con} onChange={e => changeRule('con', e.target.value)} size={'middle'} />} />
    </div>
    <div className={'condition-right-bottom'}>
      {
        false && <div className={'condition-right-bottom-illegal'}>
          <ServIcon type='icon-gou' className={'iconfont'} />
          公式合法
        </div>
      }
      {
        true && <div className={'condition-right-bottom-legal'}>
          <Collapse
            ghost
            expandIconPosition={'right'}
            defaultActiveKey={['1']}
          >
            <Panel header={<div><ServIcon type='icon-gou' className={'iconfont'} />公式不合法</div>} key='1'>
              <p>12 第<span className={'Num'}>6</span>行xxxxx信息描述错误</p>
              <p>34 第<span>6</span>行xxxxx信息描述错误</p>
            </Panel>
          </Collapse>
        </div>
      }
    </div>
  </div>;
};

export default ToolTop;
