import React, { useEffect, useRef, createContext } from 'react';
import { useSetState, useMount, useThrottleFn } from 'ahooks';
import {
  ServButton, ServForm, ServIcon, Tabs, Tree, classnames, ServTree,Select,Tooltip,ServCondition,
  useServModal, ServModal, message, Modal, ServEmpty, Select, Input, Checkbox, Divider, List, Typography, Collapse, Anchor, ServCheckbox,
} from 'syfed-ui';
import { CommonBtnBar, CloseBtn, CommonBox } from '@/components';
import ToolTop from './ToolTop'
// import { ContentEdit, NameSetting } from '@/components/HeadlinesTemp';
import ConditionLeft from './conditionLeft';
import ConditionRight from './conditionRight';
import pageStore from '@/store';
import { FunctionUtil, UrlUtil } from '@/utils';
import '@/global.scss';
import styles from './index.module.scss';
import './index1.scss';


const { throttle } = FunctionUtil;

const { Search } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const { Link } = Anchor;
const CheckboxGroup = Checkbox.Group;

const urlQuery = UrlUtil.getQuery();
const { TabPane } = Tabs;
interface MessageListStates {
  tabKey?: string;
  activeUuid?: string | null;
  treeData?: any;
  recommend?: any;
  Num?: Number;
  [key: string]: any;
}
export const { Provider, Consumer } = createContext()
const HeadlinesTemp = () => {
  const modal = useServModal();
  const [jbxxForm] = ServForm.useForm();
  const [, commonDispatchers] = pageStore.useModel('common');
  const [, SetQueryPageTree] = pageStore.useModel('checkTabManage');
  // const { mbuuid = '', readOnly = '' } = headStates;
  const { ttlbid, ttuuid, scrq, ttmc, sjsj, readOnly, sfscz } = urlQuery;
  const typeModule = [
    { value: '01', label: '稽查工作当期概况' },
    { value: '02', label: '区域性重大事项' },
    { value: '03', label: '领导关切事项进展' },
    { value: '04', label: '重大案件案情简报' },
    { value: '05', label: '重要风险事件提醒' },
    { value: '06', label: '预测类信息' },
  ];
  const plainOptions = [{ label: '指标元', value: 1 }, { label: '指标', value: 2 },
    { label: '标签', value: 3 }, { label: '纬度', value: 4 }, { label: '参数', value: 5 }, { label: '函数', value: 6 }];
  const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const defaultCheckedList = [1, 2, 3, 4, 5, 6];
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(true);
  const [searchShow, setsearchShow] = React.useState(false);
  const [searchValue, setsearchValue] = React.useState('');
  const [initalState, SetinitalState] = React.useState({});
  const contentRef = useRef();
  const leftDomRef = useRef();
  const rightDomRef = useRef();
  const rightDragRef = useRef();

  const [NumList, SetNumList] = useSetState<MessageListStates>({ Num: 0 });
  const [tabDisbled, settabDisbled] = useSetState<MessageListStates>({
    type: '',
    loading1: false,
    loading2: false,
    loading3: false,
    loading4: false,
  });
  const [profit, setProfit] = useSetState<MessageListStates>({ tab: [] });
  const [state, setState] = useSetState<MessageListStates>({ tabKey: '01' });
  const [treeDataList, settreeData] = useSetState<MessageListStates>({ treeData: [] });
  const [treerecommend, setrecommend] = useSetState<MessageListStates>({ treeData: [] });
  const [ModalData, setModalData] = useSetState<MessageListStates>({ treeData: [] });
  const [CheckedKeys, setCheckedKeys] = useSetState<MessageListStates>({ defaultKeys: [] });
  const [visible, setvisible] = useSetState<MessageListStates>({ visible: false, visibleTitle: '', type: false });
  // tab切换 做数据重新请求
  useEffect(() => {
    rightDragRef.current.click = (e) => {
      let _e = e;
      const dir = 'horizontal'; // 设置好方向 可通过变量控制默认水平方向 horizontal | vertical
      const firstX = _e.clientX; // 获取第一次点击的横坐标
      const width = rightDomRef.current.offsetWidth; // 获取到元素的宽度
      console.log('1111',firstX, width)
      document.onmousemove = (_event) => {
        _e = _event;
        leftDomRef.current.style.width =  `${contentRef.current.offsetWidth - width + (_e.clientX - firstX)}px`

      };
      // 在左侧和右侧元素父容器上绑定松开鼠标解绑拖拽事件
      contentRef.current.onmouseup = () => {
        document.onmousemove = null;
      };
      return false;
    }
    settabDisbled({ loading3: true });
    if (NumList.Num === 0) {
      init('');
      SetNumList({ Num: 10 });
    } else {
      savenodeData('');
    }
  }, [state.tabKey]);
  // tree树点击 做保存当前选择树的key值
  useEffect(() => {
    if (profit.tab && profit.tab.length > 0) {
      formData(profit.tab);
    }
    if (tabDisbled.loading3) {
      settabDisbled({ loading3: false });
    }
  }, [profit.tab]);
  useMount(() => {
    // init('');
    // loadPop();
    queryPushInquire();
  });
  const loadPop = () => {
    if (sfscz) {
      setvisible({ visible: true, type: false, visibleTitle: sfscz === 'bj' ? ' 因模板状态有变动，正在重新生成报告，请稍后…' : '头条重新生成中，请稍后来查询结果…' });
    }
  };
  // 初始化页面 左侧tree菜单
  const init = (v, c = '') => {
    const type = state.tabKey;
    SetQueryPageTree[type === '03' ? 'queryEditTree' : 'queryrecommendTree']({ ttuuid }).then((res) => {
      const treeData = res.data;
      ModalTreeTranaform(treeData, 'init', v, c);
    });
  };
  // 右侧form表单内容
  const formData = (value) => {
    SetQueryPageTree.queryFormEdit({ bgbh: Object.prototype.toString.call(value) === '[object String]' ? value : value[0] }).then((res) => {
      jbxxForm.setFieldsValue(res.data);
    });
  };
  // 上方按钮
  const queryPushInquire = () => {
    SetQueryPageTree.queryPushInquire({ ttuuid }).then((res) => {
      const data = res.tszt;
      settabDisbled({ type: data });
    });
  };
  // 撤回 or 保存
  const handleSave = async (type) => {
    settabDisbled({ [type === 'call' ? 'loading1' : 'loading2']: true });
    await SetQueryPageTree[type === 'call' ? 'queryCallEdit' : 'queryPushEdit']({ ttuuid });
    await queryPushInquire();
    settabDisbled({ [type === 'call' ? 'loading1' : 'loading2']: false });
  };
  // 重新生成
  const rebuild = async () => {
    settabDisbled({ loading4: true });
    const res = await SetQueryPageTree.queryRebuildEdit({ sjsj, ttlbid, ttuuid });
    setvisible({ visible: true, type: !res.sfcxsc, visibleTitle: res.message });
    settabDisbled({ loading4: false });
  };
  // tree删除列表
  const TreeDel = (data) => {
    if (readOnly) return;
    const { bgbh } = data;
    const id = Object.prototype.toString.call(profit.tab) === '[object String]' ? profit.tab : profit.tab[0];
    SetQueryPageTree.queryDeleteEdit({ ttuuid, bgbh }).then((res) => {
      if (bgbh === id) {
        settabDisbled({ loading3: true });
      }
      init(bgbh, bgbh === id ? '' : bgbh);
    });
  };
  // tree树上下移动
  const TreeAdd = (value, type) => {
    if (readOnly) return;
    const bol = (ttlbid === '01' || state.tabKey === '03');
    const treedata = JSON.parse(JSON.stringify((bol ? treeDataList : treerecommend)));
    treedata.treeData.forEach((item, index) => {
      item.children.forEach((item1, index1) => {
        if ((value.ssmkid === item.ssmkid || item.ssmkid === 'tjmk') && value.bgbh === item1.bgbh) {
          let data = '';
          if (type === 'up') {
            data = swapArray(item.children, index1, index1 - 1, 'up');
          } else if (type === 'down') {
            data = swapArray(item.children, index1, index1 + 1, 'down');
          }
          item.children = data;
        }
      });
    });
    bol ? settreeData({ treeData: treedata.treeData }) : setrecommend({ treeData: treedata.treeData });
  };
  const swapArray = (arr, index1, index2, type) => {
    const data = JSON.parse(JSON.stringify(arr));
    data[index1] = data.splice(index2, 1, data[index1])[0];
    [data[index1].index, data[index2].index] = [data[index2].index, data[index1].index];
    return data;
  };
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
  // 预览
  const goback = (type) => {
    if (type === 'reverse') {
      commonDispatchers.closePage();
    }
    if (type === 'preview') {
      const id = 'headlines';
      let url = '/aygl/jcajjkgl/pages/dist/index.jsp#/Headlines';
      url = UrlUtil.addQuery(url, {
        ttmc, ttuuid, ttlbid, sjsj,
      });
      try {
        window.top.CommonHandle.addIframe(id, url);
      } catch {
        commonDispatchers.openTab({
          title: '头条展示', url, id,
        });
      }
    }
  };
  // tree树切换保存
  const savenodeData = (data, type = '') => {
    const key = data.key || profit.tab[0];
    const { tabKey } = state;
    const list = tabKey === '03' ? treeDataList.treeData : treerecommend.treeData;
    const bgList = list.map((item) => {
      return item.children.map((item1) => {
        return { bgbh: item1.bgbh, mkszsx: item1.index === 'down' ? item.children.length - 1 : (item1.index === '' ? 0 : item1.index) };
      });
    });
    jbxxForm.validateFields().then((res) => {
      saveLoad(res, true, key, bgList, tabKey, data, type);
    }).catch((err) => {
      saveLoad(err.values, false, key, bgList, tabKey, data, type);
    });
  };
  const saveLoad = ((value, flag, key, bgList, tabKey, data, type) => {
    let ssmkmc = '';
    const bgbh = Object.prototype.toString.call(profit.tab) === '[object String]' ? profit.tab : profit.tab[0];
    typeModule.forEach((item) => {
      if (item.value === value.ssmkid) {
        ssmkmc = item.ssmkmc;
      }
    });
    const obj = {
      bgList,
      ttuuid,
      mkFlag: tabKey === '03' ? 'mksz' : 'tjsz',
      bgNr: Object.assign(value, { ssmkmc, bgbh }),
    };
    // 保存成功后 重新请求数据
    if (flag) {
      if (readOnly) {
        init(key, data === 'downSave' ? true : data);
        return;
      }
      SetQueryPageTree.querySaveEdit({ ...obj }).then((res) => {
        if (!res.isSucces) {
          message.error(res.message, 5);
        }
        if (res.isSucces && type === 'downloadSuccess') {
          message.success('保存成功！', 3);
        }
        init(key, data === 'downSave' ? true : data);
      });
    } else {
      message.warning('上一份报告中有必填项未填写，保存失败。', 5);
      if (data) {
        setProfit({ tab: key });
      } else {
        init('', '');
      }
    }
  });
  // 点击新增按钮
  const addModel = () => {
    if (readOnly) return;
    SetQueryPageTree.queryPageTree({ ttuuid, scrq, ttlbid }).then((res) => {
      ModalTreeTranaform(res.data, '', '', '');
    });
  };
  const ModalTreeTranaform = (value, type, v, c) => {
    const { tabKey } = state;
    const data = value.map((item) => {
      return {
        ...item,
        key: item.ssmkid,
        label: item.ssmkmc,
        checkable: false,
        children: item.children.map((item1, index1, input1) => {
          return { ...item1, label: item1.bgmc, key: item1.bgbh, index: input1.length === 1 ? '' : (index1 < input1.length - 1 ? index1 : 'down') };
        }),
      };
    });
    if (type === 'init') {
      // 从左侧tree树列表的判断
      tabKey === '03' ? settreeData({ treeData: data }) : setrecommend({ treeData: data });
      // 如果是tree树切换 则不重置高亮选项 如果是tab切换则重置
      if (c) {
        setProfit({ tab: v || [data[0]?.children[0]?.key || ''] });
      } else {
        setProfit({ tab: [data[0]?.children[0]?.key || ''] });
      }
      return;
    }
    const defaultKeys = value.map((item, index, input) => {
      return item.children.map((item1) => {
        return item1.sfyxz === 'Y' && item1.bgbh;
      }).filter((item1) => !!item1);
    });
    setModalData({ treeData: data });
    setCheckedKeys({ defaultKeys: defaultKeys.flat() });
    modal.open();
  };
  // 点击cheched复选框 选中内容
  const onCheck = (checkedKeys: React.Key[], info: any) => {
    setCheckedKeys({ defaultKeys: checkedKeys });
  };
  // 提交新增表单
  const ModalSuccess = async () => {
    await SetQueryPageTree.AddTreeBtn({ ttuuid, xzbgs: CheckedKeys.defaultKeys });
    settabDisbled({ loading3: true });
    init('', '');
  };

  const onPressEnter = (e) => {
    // setsearchValue(e.target.value);
    setsearchShow(!!searchValue);
    console.log('input内容', e, searchValue);
  };
  const catalog = (type, value) => {
    // 01 tree节点选择
    if (value?.node?.children) return;
    console.log('catalog', type, value);
  };
  const onKeyDown = (e) => {
    if (e.which === 13) {
      console.log('敲下回车', e, e.which);
    }
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
  const searchChange = (e) => {
    // 搜索选择
    console.log('searchChange', e.target.value);
    setsearchValue(e.target.value || '');
    run(e.target.value);
  };

  const ChangeServCheckbox = (e) => {
    // checked 切换选择
    console.log('ChangeServCheckbox', e)
  }
  const listItemMeta = () => {
    // 弹窗后点击
    console.log(123);
    setsearchShow(false);
    setsearchValue('');
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
  return <div className={styles.InspectionLead} >
    <div className={styles.flexMin}>
      <div className={styles.flexLeft} >
        <Tabs activeKey={state.tabKey} onChange={(tabKey) => { tabChange(tabKey); }} >
          <TabPane tab="按模块设置" key="03" />
          {
            ttlbid !== '01' && <TabPane tab="按推荐设置" key="01" />
          }
        </Tabs>
        {
          (state.tabKey === '03' && ttlbid !== '01') &&
          <div className={styles.add} onClick={() => { addModel(); }}>
            <ServIcon type='icon-jia' style={{ marginRight: '8px' }} />
            新增
          </div>
        }
      </div>
    </div>
    <Modal
      visible={visible.visible}
      maskClosable={false}
      title={visible.type ? '提示' : ''}
      footer={visible.type ? [
        <ServButton type="primary" size="middle" onClick={() => { setvisible({ visible: false, type: false }); }}>确认</ServButton>,
      ] : null}
      closable={visible.type}
      onCancel={() => { setvisible({ visible: false, type: false }); }}
    >
      <ServEmpty type='审核中' description={visible?.visibleTitle} />
    </Modal>
    <Modal
      visible
      title={'条件设置'}
      width={1272}
      style={{ top: 0 }}
      onCancel={() => { setvisible({ visible: false, type: false }); }}
    >
      <div className={'condition'}  ref={contentRef}>
        <Provider value={initalState}>
          <div className={'condition-left'} ref={leftDomRef}>
            <ConditionLeft />
          </div>
          <div className={'condition-line'}  ref={rightDragRef}>
            <div className={'locker'} />
          </div>
          <div className={'condition-right'} ref={rightDomRef}>
            <ConditionRight />
          </div>
        </Provider>

      </div>
    </Modal>
  </div>;
};

export default HeadlinesTemp;
