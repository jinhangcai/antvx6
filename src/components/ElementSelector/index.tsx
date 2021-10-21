import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { classnames, Divider, Input, ServCheckbox, ServIcon, ServTree, Tabs, useObjectState } from 'syfed-ui';

/**
 * 元素接口（以后端字段为准）
 */
export interface ElementInterface {
  name: string;
  type: string;
  content: string;
  code: string;
}

/**
 * 组件props
 */
interface ElementSelectorProps {
  minWidth?: number;
  onElementClick?: (element: ElementInterface) => void;
}

/**
 * 元素项
 * @param props
 * @constructor
 */
const ElementItem: React.FC<{
  // 元素名称
  name: string;
  // 是否收藏
  collected?: boolean;
  // 收藏/取消
  onCollect?: (collected: boolean) => void;
  onSelect?: () => void;
  // 锚点
  anchor?: string;
}> = (props) => {
  const { name, collected, onCollect, onSelect, anchor } = props;

  return <div className={classnames('element-item', anchor && `anchor_${anchor}`)} onClick={() => onSelect?.()} data-anchor={anchor}>
    <span className={'element-name'}>{name}</span>
    <span
      className={classnames('element-collect', collected && 'element-collected')}
      style={{ color: collected ? '#428DF5' : '#ccc' }}
      onClick={(e) => {
        onCollect?.(!collected);
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <ServIcon type={collected ? 'icon-s-shoucang-mian' : 'icon-s-shoucang-xian'} />
    </span>
  </div>;
};

/**
 * 折叠面板
 * @param props
 * @constructor
 */
const CollapsePanel: React.FC<{ title: ReactNode }> = (props) => {
  const { title, children } = props;
  const contentRef = useRef<any>();
  const [collapse, setCollapse] = useState<boolean>(false);

  const handleToggleCollapse = () => {
    if (!collapse) {

    }
    setCollapse(!collapse);
  };

  return <div className={'collapse-panel'}>
    <div className={'panel-header'} onClick={handleToggleCollapse}>
      <span>{title}</span>
      <ServIcon type={collapse ? 'icon-icon-select-up' : 'icon-icon-select-down'} />
    </div>
    <Divider style={{ margin: '8px 12px' }} />
    <div className={'panel-content'} ref={contentRef} style={{ height: collapse ? 0 : 'auto' }}>
      {children}
    </div>
  </div>;
};

/**
 * 字母锚点
 * @param props
 * @constructor
 */
const LetterAnchor: React.FC<{
  itemHeight: number;
  wrapper?: (self: HTMLElement) => HTMLElement;
}> = (props) => {

  const [active, setActive] = useState<string>('a');
  const { itemHeight, wrapper } = props;
  const rootRef = useRef<any>();
  const wrapperRef = useRef<HTMLElement>();

  useEffect(() => {
    const $wrapper = wrapper ? wrapper(rootRef.current) : rootRef.current.parentElement;
    wrapperRef.current = $wrapper;
    const handleScroll = () => {
      const { scrollTop } = $wrapper;
      const index = Math.floor(scrollTop / itemHeight);
      const el = $wrapper.childNodes[index];
      el && el.dataset.anchor && setActive(el.dataset.anchor);
    };
    $wrapper.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      $wrapper.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (c: string) => {
    const wrapper = wrapperRef.current as HTMLElement;
    const target = wrapper.querySelector(`[data-anchor="${c}"]`);
    if (target) {
      const wt = wrapper.getBoundingClientRect().top;
      const tt = target.getBoundingClientRect().top + wrapper.scrollTop;
      wrapper.scrollTop = tt - wt;
    }
    setTimeout(() => setActive(c), 100);
  };

  return <div ref={rootRef} className={'letter-anchor'}>
    {'abcdefghijklmnopqrstuvwxyz#'.split('').map(c => <div
      className={classnames('letter-anchor-item', active === c && 'letter-anchor-item-active')} key={c}
      onClick={() => handleClick(c)}>{c}</div>)}
  </div>;
};

/**
 * 元素选择器
 * @param props
 * @constructor
 */
const ElementSelector: React.FC<ElementSelectorProps> = (props) => {
  const { minWidth = 300, onElementClick } = props;
  const [{ activeKey, keyword }, upFilter] = useObjectState<{
    keyword: string;
    activeKey: string;
  }>({ activeKey: 'mc', keyword: '' });

  const items = useMemo(() => {
    const arr: any[] = [];
    'abcdefghijklmnopqrstuvwxyz#'.split('').forEach(a => {
      Array.from({ length: Math.ceil(Math.random() * 10) }).forEach((_, i) => {
        arr.push({
          name: `【测试元素】${a}-${i + 1}`,
          collected: Math.random() > 0.5,
          anchor: a,
        });
      });
    });
    return arr;
  }, []);

  const renderElementItems = () => {
    return items.map(({ name, collected, anchor }, i) => <ElementItem
      key={i} name={name} collected={collected} anchor={anchor}
      onSelect={() => onElementClick?.({ name })}
    />);
  };

  return <div className={'element-selector'} style={{ minWidth }}>
    <div className={'element-header'} style={{ boxShadow: '0px 4px 6px 0px rgba(0,0,0,0.1)' }}>
      <Tabs
        size={'small'} className={'element-tabs'} activeKey={activeKey}
        onTabClick={k => upFilter({ activeKey: k })}>
        <Tabs.TabPane tab={'目录'} key={'ml'} />
        <Tabs.TabPane tab={'名称'} key={'mc'} />
        <Tabs.TabPane tab={'推荐'} key={'tj'} />
        <Tabs.TabPane tab={'收藏'} key={'sc'} />
      </Tabs>
      <div>
        <ServCheckbox className={'element-types'} options={[
          { label: '指标元', value: 'zby' },
          { label: '指标', value: 'zb' },
          { label: '标签', value: 'bq' },
          { label: '纬度', value: 'wd' },
          { label: '参数', value: 'cs' },
          { label: '函数', value: 'hs' },
        ]} showCheckAll checkAllText={'全部'} />
      </div>
      <div style={{ padding: 12 }}>
        <Input.Search onSearch={v => upFilter({ keyword: v })} allowClear />
      </div>
    </div>
    <div className={classnames('element-content')}>
      {activeKey === 'ml' && !keyword && <ServTree treeData={[
        { key: 1, title: '指标目录' },
        { key: 2, title: '标签目录' },
        { key: 3, title: '分析纬度' },
        { key: 4, title: '函数目录' },
        { key: 5, pKey: 1, title: '【指标】' },
        { key: 6, pKey: 2, title: '【标签】' },
        { key: 7, pKey: 3, title: '【纬度】' },
        { key: 8, pKey: 4, title: '【函数】' },
      ]} onClick={(e, node) => {
        onElementClick?.(node as ElementInterface);
      }} treeDataSimpleMode defaultExpandAll />}
      {activeKey === 'mc' && <>
        <div className={'mc-tab-content'}>
          {renderElementItems()}
        </div>
        <LetterAnchor itemHeight={28} wrapper={self => (self.parentElement as HTMLElement).childNodes[0] as HTMLElement} />
      </>}
      {['tj', 'sc'].includes(activeKey) && <div key={activeKey}>
        <CollapsePanel title={'分析元素'}>
          {renderElementItems()}
        </CollapsePanel>
        <CollapsePanel title={'函数'}>
          {renderElementItems()}
        </CollapsePanel>
      </div>}
    </div>
  </div>;
};

ElementSelector.defaultProps = {
  // minWidth: 300,
};

export default ElementSelector;
