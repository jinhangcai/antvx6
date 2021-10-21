import React, { KeyboardEvent, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, Select, ServCheckbox, ServTree, Tabs, types, utils } from 'syfed-ui';
import classnames from 'classnames';
import { GT, GTE, LT, LTE, NEQ } from '@/components/Condition/Base/LogicalElement';
import './index.less';
import ConditionItem from '@/components/Condition/ConditionItem';
import ElementSelector from '@/components/ElementSelector';

const { localStorage } = utils;

interface RuleProps {
  key: string;

  [key: string]: any;
}

interface ConditionProps {
  key: string;
  relation: string;
  hidden?: boolean;
  rules: RuleProps[];

  [key: string]: any;
}

interface ValueProps {
  relation: string;
  conditions: ConditionProps[];
}

interface ServConditionProps {
  className?: string;
  style?: React.CSSProperties;
  /**
   * 值
   */
  value?: ValueProps;
  /**
   * 回调
   * @param data
   */
  onChange?: (data: ValueProps | undefined) => void;
  /**
   * 可选关系
   */
  relations?: { label: string; value: string }[];
  /**
   * 逻辑关系配置
   */
  relation?: {
    /**
     * 默认条件关系
     */
    defaultConditionRelation?: string;
    /**
     * 条件关系可编辑
     */
    conditionRelationEditable?: boolean;
    /**
     * 默认规则关系
     */
    defaultRuleRelation?: string;
    /**
     * 规则关系可编辑
     */
    ruleRelationEditable?: boolean;
  };
  /**
   * 条件必填字段
   */
  requiredItemKeys?: string[];
  /**
   * 条件规则必填字段
   */
  requiredRuleKeys: string[];
  /**
   * 不可编辑状态
   */
  disabled?: boolean;
}

const RelationSwitch = (props: { value?: string; onChange: (val: string) => void; options: any[]; disabled: boolean }) => {
  const { value, onChange, options, disabled } = props;

  return disabled ? <span
    className={classnames('switch', 'disabled')}
  >{options?.find(({ value: val }) => val === value)?.label}</span> : <Select
    className={'switch'} size={'small'} dropdownClassName={'serv-condition-switch-dropdown'}
    options={options} value={value}
    onChange={onChange} />;
};

const FormulaCondition: React.FC<ServConditionProps> = (props: ServConditionProps) => {

  const {
    className, style,
    value, onChange, relations = [], disabled = false,
    requiredItemKeys = [], requiredRuleKeys = [], relation: rel,
  } = props;

  const relOps = useMemo(() => ({
    defaultConditionRelation: relations?.[0]?.value || 'AND',
    conditionRelationEditable: true,
    defaultRuleRelation: relations?.[0]?.value || 'AND',
    ruleRelationEditable: true,
    ...rel,
  }), [rel, relations]);

  // 条件规则
  const genItemRule = useCallback(() => ({
    key: `rule-${Math.random().toString(36).substr(2)}`,
  }), []);

  // 条件
  const genItem = useCallback((): ConditionProps => ({
    key: `item-${Math.random().toString(36).substr(2)}`,
    rules: [genItemRule()],
    relation: relOps.defaultRuleRelation,
    hidden: false,
  }), []);

  const [relation, setRelation] = useState<string>(value?.relation || relOps.defaultConditionRelation);

  const [items, setItems] = useState<ConditionProps[]>(value?.conditions?.length ? value.conditions.map(con => ({
    ...genItem(),
    ...con,
    rules: con.rules?.map(rule => ({ ...genItemRule(), ...rule })) || [genItemRule()],
  })) : [genItem(), genItem()]);

  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (
      types.isEmptyObject(items)
      || items.some(item => requiredItemKeys.some(key => types.isEmptyObject(item[key])))
      || items.some(({ rules }) => rules.some((rule) => requiredRuleKeys.some(key => types.isEmptyObject(rule[key]))))
    ) {
      onChange?.(undefined);
    } else {
      onChange?.({
        relation,
        conditions: items,
      });
    }
  }, [items, relation]);

  const handleChangeItem = useCallback((index: number, key: keyof ConditionProps, value: any) => {
    const newItems = [...items];
    const newItem = { ...newItems[index], [key]: value };
    newItems.splice(index, 1, newItem);
    setItems(newItems);
  }, [items]);

  const handleChangeRule = useCallback((itemIndex, ruleIndex, key, value) => {
    const newRules = [...items[itemIndex].rules];
    const newRule = { ...newRules[ruleIndex], [key]: value };
    newRules.splice(ruleIndex, 1, newRule);
    handleChangeItem(itemIndex, 'rules', newRules);
  }, [items]);

  const handleRuleKeyDown = useCallback((e: KeyboardEvent, itemIndex, ruleIndex) => {
    const { key } = e;
    if (key === 'Backspace') {
      const newItems = [...items];
      const newItem = { ...newItems[itemIndex] };
      if (newItem.rules.length === 1 && ruleIndex === 0) {
        newItems.splice(itemIndex, 1);
      } else {
        const newRules = [...newItem.rules];
        newRules.splice(ruleIndex, 1);
        newItem.rules = newRules;
        newItems.splice(itemIndex, 1, newItem);
      }
      setItems(newItems);
    } else if (key === 'Enter') {
      const newRules = [...items[itemIndex].rules];
      newRules.splice(ruleIndex + 1, 0, genItemRule());
      handleChangeItem(itemIndex, 'rules', newRules);
    }
    console.log(key);
    e.preventDefault();
    e.stopPropagation();
  }, [items]);

  const leftPanelRef = useRef<any>();

  const positionRef = useRef<{
    width: number;
    start: any;
    expanded: boolean;
  }>({ width: Number(localStorage.getItem('left-panel-width')) || 301, start: null, expanded: true });

  const [resizable, setResizable] = useState<boolean>(false);

  const handleSliderBtnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { width, expanded } = positionRef.current;
    leftPanelRef.current.style.cssText += `transition: width 0.3s ease-in-out; width: ${expanded ? '8px' : `${width}px`}`;
    positionRef.current.expanded = !expanded;
  };

  const handleSliderBarClick = (e: MouseEvent) => {
    // @ts-ignore
    if (e.target?.className.includes('slider-btn')) return;
    setResizable(true);
    const { screenX } = e;
    positionRef.current.start = { screenX, width: positionRef.current.width };
  };

  const handleSliderBarMove = useCallback((e: MouseEvent) => {
    if (!positionRef.current.start) return;
    const { screenX: start, width } = positionRef.current.start;
    const { screenX } = e || {};
    if (!isNaN(screenX - start)) {
      const w = Math.min(Math.max(301, width + screenX - start), 520);
      if (isNaN(w)) return;
      positionRef.current.width = w;
      leftPanelRef.current.style.cssText += `transition: unset; width: ${w}px`;
      localStorage.setItem('left-panel-width', w);
    }
  }, []);

  const handleSliderBarMoveEnd = useCallback(() => {
    setResizable(false);
    positionRef.current.start = null;
  }, []);

  const renderItemRules = (item: ConditionProps, itemIndex: number) => {
    const rLen = item.rules.length;
    return item.rules.map((rule, index) => {
      const cn = classnames('item-wrapper', 'rule-item-wrapper', rLen > 1 && 'multi', index === 0 && 'first-item', index === rLen - 1 && 'last-item');
      return <div key={rule.key} className={cn}>
        <div className={'rule-item'} onClick={e => {
          e.preventDefault();
          e.stopPropagation();
        }}>
          <div style={{ margin: '0 4px' }} contentEditable={false}>
            <ConditionItem focus onFocus={console.log} onNext={() => {
              const newRules = [...item.rules];
              newRules.splice(index + 1, 0, genItemRule());
              handleChangeItem(itemIndex, 'rules', newRules);
            }} />
          </div>
        </div>
        <input style={{ border: 'none', boxShadow: 'none', outline: 'none', width: 5 }} />
      </div>;
    });
  };

  const renderItems = () => {
    const iLen = items.length;
    return items.map((item, index) => {
      return <div
        key={item.key}
        className={classnames('item-wrapper', iLen > 1 && 'multi', index === 0 && 'first-item', index === iLen - 1 && 'last-item')}>
        <div className={'condition-item'} style={item.hidden ? { paddingBottom: 0 } : {}}>
          <div className={classnames('rule-items', item.hidden && 'rule-items-hidden', item.rules?.length > 1 && 'has-switch')}>
            {renderItemRules(item, index)}
            <RelationSwitch
              onChange={val => handleChangeItem(index, 'relation', val)} value={item.relation}
              options={relations} disabled={disabled || !relOps.ruleRelationEditable} />
          </div>
        </div>
      </div>;
    });
  };

  return <div className={'formula-wrapper'}>
    <div className={'left-panel'} ref={leftPanelRef} style={{ width: positionRef.current.width }}>
      <ElementSelector onElementClick={console.log} />
    </div>
    <div className={'right-panel'}>
      <div className={'slider-bar'} onMouseDown={handleSliderBarClick} onMouseMove={handleSliderBarMove}>
        <div className={'slider-btn'} onClick={handleSliderBtnClick} />
      </div>
      <div className={'content-header'}>
        <div style={{ display: 'flex' }}>
          {[NEQ, GT, LT, GTE, LTE].map((item, i) => <div key={i} className={'element-item'}>{item.content}</div>)}
        </div>
        <Button type={'primary'} ghost>添加条件组</Button>
      </div>
      <div className={classnames('formula-condition', disabled && 'readonly', className)} style={style}>
        <div className={classnames('condition-items', items.length > 1 && 'has-switch')}>
          {renderItems()}
          <RelationSwitch
            onChange={relation => setRelation(relation)} value={relation}
            options={relations} disabled={disabled || !relOps.conditionRelationEditable} />
        </div>
      </div>
    </div>
    {resizable && <div
      className={'slider-mask'}
      onMouseMove={handleSliderBarMove}
      onMouseLeave={handleSliderBarMoveEnd}
      onMouseUp={handleSliderBarMoveEnd}
    />}
  </div>;
};

FormulaCondition.defaultProps = {
  relations: [{ label: '且', value: 'AND' }, { label: '或', value: 'OR' }, { label: '非', value: 'NOT' }],
};

export default FormulaCondition;
