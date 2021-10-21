import { useCallback, useState } from 'react';

export const useAntVisible = (defaultVisible = false) => {
  const [visible, setVisible] = useState<boolean>(defaultVisible);
  const show = useCallback(() => {
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
  }, []);

  return {
    show,
    hide,
    visible,
  };
};
