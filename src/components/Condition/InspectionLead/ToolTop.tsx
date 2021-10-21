import React, { useEffect, useRef } from 'react';
import index1 from './index1.scss'
import {
  Tooltip,
} from 'syfed-ui';
const ToolTop = (props) => {
  console.log('props', props)
  const { type } = props;
  return <div className={'ToolTop'}>
    {
      type === 1 && <div>
        <h3 className={'ToolTop-title'}>123</h3>
        <h3 className={'ToolTop-title ToolTop-describe'}>[指标描述]：</h3>
        <div className={'ToolTop-desc'}>这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一一段描述信息这是一段描述信息这是一段描述信息</div>
      </div>
    }
    {
      type === 2 && <div>
        <h3>[函数描述]：</h3>
        <div className={'ToolTop-desc'}>
          用法：这是一段描述信息这是一段描述信息
        </div>
        <div  className={'ToolTop-desc'}>
          说明：这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息
        </div>
        <div  className={'ToolTop-desc'}>
          示例：这是一段描述信息这是一段描述信息
        </div>
      </div>
    }
  </div>
};

export default ToolTop;
