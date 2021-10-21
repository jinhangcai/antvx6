import React, { useEffect } from 'react';
import { ServModal, useServModal } from 'syfed-ui';

interface ConditionSettingProps {
  visible?: boolean;
  data?: any;
  onOk?: (data?) => void;
  onClose?: () => void;
}

export default function ConditionSetting({
  visible,
  data = {}, // formula.getData()的对象数据
  onOk,
  onClose,
}: ConditionSettingProps) {
  const modal = useServModal();

  useEffect(() => {
    const options = {
      yxbz: 'Y',
      sjlx: '0',
      hslx: '',
      showWlbdLink: true,
      createYcgzFlag: true,
      required: true,
      showCySelect: true,
    };

    /** @ts-ignore */
    window.GsDefine = {
      afterSave: () => {
        /** @ts-ignore */
        const gs = formula.getData();
        modal.close();
        /** @ts-ignore */
        onOk && onOk(gs, formula);
      },
      afterClose: () => {
        modal.close();
        onClose && onClose();
      },
      afterInit: (formula) => {
        /** @ts-ignore */
        window.formula = formula;
      },
      config: {
        element: () => { },
        data,
        type: options.sjlx,
        options,
      },
    };
  }, []);

  useEffect(() => {
    /** @ts-ignore */
    window.GsDefine.config.data = data;
  }, [data]);

  useEffect(() => {
    visible ? modal.open() : modal.close();
  }, [visible]);

  return <ServModal
    modal={modal}
    width={1200}
    title={'条件设置'}
    footer={null}
    centered
    onCancel={() => onClose && onClose()}
  >
    <div style={{ width: '100%', height: 500 }}>
      <iframe width="100%" height="100%" frameBorder={0} src={'/zbmxWeb/zbgl/pages/common/borad/zbborad.html'} />
    </div>
  </ServModal>;
}
