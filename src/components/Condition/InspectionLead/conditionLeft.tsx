import React, { useEffect } from 'react';
import { Anchor, Checkbox, Collapse, Input, List, Select, ServCheckbox, ServIcon, ServTree, Tabs, Tooltip } from 'syfed-ui';
import { useSetState, useThrottleFn } from 'ahooks';
import ToolTop from './ToolTop';
import './index1.scss';

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const { Link } = Anchor;
const CheckboxGroup = Checkbox.Group;

const { TabPane } = Tabs;

interface MessageListStates {
  tabKey?: string;
  activeUuid?: string | null;
  treeData?: any;
  recommend?: any;
  Num?: Number;

  [key: string]: any;
}

const ConditionLeft = (props) => {
  const defaultCheckedList = [1, 2, 3, 4, 5, 6];
  const [searchValue, setsearchValue] = React.useState('');
  const [state, setState] = useSetState<MessageListStates>({ tabKey: '01' });
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [checkAll, setCheckAll] = React.useState(true);
  const [searchShow, setsearchShow] = React.useState(false);
  const [treeDataList, settreeData] = React.useState([]);

  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
  ];
  const treeData = [
    {
      key: 1,
      title: '一级节点',
      children: [
        {
          key: 2,
          pKey: 1,
          title: '二级节点1',
          tag: true,
          children: [
            { key: 4, pKey: 2, title: '三级节点' },
          ],
        },
        { key: 3, pKey: 1, title: '二级节点2' },
      ],
    },
  ];
  const plainOptions = [{ label: '指标元', value: 1 }, { label: '指标', value: 2 },
    { label: '标签', value: 3 }, { label: '纬度', value: 4 }, { label: '参数', value: 5 }, { label: '函数', value: 6 }];
  useEffect(() => {
    settreeData(treeData);
  }, []);
  // tab切换
  const tabChange = (key) => {
    const { tabKey } = state;

    if (tabKey !== key) {
      // 点击table切换不是当前table时
      setsearchShow(false);
      // setsearchValue('');
      setState({ tabKey: key });
    }
  };
  const searchChange = (e) => {
    // 搜索选择
    console.log('searchChange', e.target.value);
    setsearchValue(e.target.value || '');
    run(e.target.value);
  };
  const { run } = useThrottleFn(
    (e) => {
      // 节流
      // console.log(searchValue, args, args.target.value)
      console.log('searchChange1', searchValue, e);

      setsearchShow(!!e);
    },
    { wait: 1000 },
  );
  const catalog = (type, value) => {
    // 01 tree节点选择
    if (value?.node?.children) return;
    console.log('catalog', type, value);
  };
  const reg = (content, keyword, tagName = 'span') => {
    const a = content.toLowerCase();
    const b = keyword.toLowerCase();
    const indexof = a.indexOf(b);
    const c = indexof > -1 ? content.substr(indexof, keyword.length) : '';
    const val = `<${tagName} style="color:#FF6600;">${c}</${tagName}>`;
    const regS = new RegExp(keyword, 'gi');
    return content.replace(regS, val);
  };
  const listItemMeta = () => {
    // 弹窗后点击
    console.log(123);
    setsearchShow(false);
    setsearchValue('');
  };
  return <div>
    <Tabs activeKey={state.tabKey} onChange={(tabKey) => {
      tabChange(tabKey);
    }}>
      <TabPane tab='目录' key='01' />
      <TabPane tab='名称' key='02' />
      <TabPane tab='推荐' key='03' />
      <TabPane tab='收藏' key='04' />
    </Tabs>
    <div className={'condition-left-search'}>
      <div className={'condition-left-label'}>
        <ServCheckbox
          showCheckAll={checkAll}
          defaultValue={checkedList}
          options={plainOptions}
          // onChange={(e) => {ChangeServCheckbox(e)}}
        />
      </div>
      <Search placeholder='请输入名称' value={searchValue} onChange={(e) => {
        searchChange(e);
      }} />
      {/*<div contentEditable='true' suppressContentEditableWarning='true' onKeyDown={(e) => { onKeyDown(e); }}>123</div>*/}
    </div>
    <div>
      {
        state.tabKey === '01' && !searchShow &&
        <ServTree treeData={treeDataList}
                  titleRender={(nodeData: any) => {
                    return <div className={'treeW'}>
                      <div
                        // onClick={(e) => { catalog(nodeData); }}
                      >
                        {
                          !nodeData.children && <ServIcon type='icon-ziduanicon' className={'icon'} />
                        }
                        <span className={'treeW-title'}>
                       <Tooltip color={'#fff'} title={<ToolTop title={123} type={2} name={456} />}>
                         {nodeData.title}
                      </Tooltip>
                     </span>
                      </div>
                    </div>;
                  }}
                  height={465}
                  defaultExpandAll treeDataSimpleMode={false} onSelect={(e, value) => {
          catalog('01', value);
        }} />
      }
      {
        state.tabKey === '02' && !searchShow && <div className={'popList tabkey2'}>
          <List
            // header={<div>Header</div>}
            // footer={<div>Footer</div>}
            bordered
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                      <span className={'popList-type'} onClick={() => {
                        catalog('02', item);
                      }}>
                        <ServIcon type='icon-ziduanicon' className={'icon'} />
                        {item}
                      </span>
                <ServIcon onClick={(e) => {
                  console.log(e, '点击icon');
                }} type='icon-jia' className={'iconfont'} />
              </List.Item>
            )}
          />
        </div>
      }
      {
        (state.tabKey === '03' || state.tabKey === '04') && !searchShow && <div className={'popList tabkey2 tabkey3'}>
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header='This is panel header 1' key='1'>
              <List
                // header={<div>Header</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={data}
                renderItem={(item) => (
                  <List.Item>
                    <span className={'popList-type'} onClick={() => {
                      catalog('03', item);
                    }}> {item}</span>
                    <ServIcon onClick={(e) => {
                      console.log(e, '点击icon');
                    }} type='icon-jia' className={'iconfont'} />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header='This is panel header 1' key='2'>
              <List
                itemLayout='horizontal'
                dataSource={data}
                split={false}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<div dangerouslySetInnerHTML={{ __html: reg(item, searchValue, 'span') }} />}
                      description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                    />
                  </List.Item>
                )}
              />
            </Panel>

          </Collapse>
        </div>
      }
      {
        searchShow && <div className={'popList'}>
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header='This is panel header 1' key='1'>
              <List
                itemLayout='horizontal'
                dataSource={data}
                split={false}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      className={'listItemMeta'}
                      onClick={() => {
                        listItemMeta();
                      }}
                      title={<div dangerouslySetInnerHTML={{ __html: reg(item, searchValue, 'span') }} />}
                      description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                    />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header='This is panel header 1' key='1'>
              <List
                itemLayout='horizontal'
                dataSource={data}
                split={false}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<div dangerouslySetInnerHTML={{ __html: reg(item, searchValue, 'span') }} />}
                      description='Ant Design, a design language for background applications, is refined by Ant UED Team'
                    />
                  </List.Item>
                )}
              />
            </Panel>

          </Collapse>
        </div>
      }
    </div>
  </div>;
};

export default ConditionLeft;
