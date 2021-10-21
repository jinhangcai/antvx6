/**
 * 获取 Selection 对象
 */
export const getSelection = (): Selection => {
  const selection = window.getSelection?.() || {};
  return selection as Selection;
};

/**
 * 获取当前获得焦点的节点
 */
export const getFocusElement = (selection?: Selection): (HTMLElement | null) => {
  const { focusNode } = selection || getSelection();
  // 文本节点
  if (focusNode?.nodeType === Node.TEXT_NODE) {
    return focusNode.parentElement;
  }
  // 元素节点
  if (focusNode?.nodeType === Node.ELEMENT_NODE) {
    return focusNode as HTMLElement;
  }
  return null;
};

export type SelectionInfo = Selection & { focusElement: HTMLElement | null }

/**
 * 获取 Selection 对象 及 当前获得焦点的元素
 */
export const getSelectionInfo = (): SelectionInfo => {
  const selection = getSelection();
  // @ts-ignore
  selection.focusElement = getFocusElement(selection);
  return selection as SelectionInfo;
};
