import React from 'react';
import { runApp, IAppConfig, config } from 'ice';
import { ConfigProvider, message } from 'efg-design-rth';
import routes from './routes';

/**
 * 获取html元素祖先节点
 * @param node
 * @param selector
 */
export const parents = (node: HTMLElement, selector: string) => {
  const id = selector.startsWith('#') && selector.substr(1);
  const className = selector.startsWith('.') && selector.substr(1);

  // id选择器元素
  if (id) {
    return document.querySelector(selector) || document.body;
  }

  // class选择器元素
  if (className) {
    let parentElement = node?.parentElement;
    while (parentElement && !parentElement?.className.split(' ').includes(className)) {
      parentElement = parentElement.parentElement;
    }
    return parentElement || document.body;
  }

  return document.body;
};

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => <ConfigProvider
      componentSize={'middle'}
      // 根据实际情况启用，考虑性能问题，最好使用固定的节点
      // getPopupContainer={el => parents(el, '.popup-container')}
    >
      {children}
    </ConfigProvider>,
  },
  router: {
    type: 'hash',
    basename: '',
    // fallback: <div>loading...</div>,
    modifyRoutes: (routes) => {
      return routes;
    },
    routes,
  },
  request: [
    {
      withFullResponse: false,
      // 配置 request 实例名称，如果不配默认使用内置的 request 实例
      // instanceName: 'request',
      baseURL: config.baseURL || '',
      headers: {},
      // 拦截器
      interceptors: {
        request: {
          onConfig: (conf) => {
            // 发送请求前：可以对 RequestConfig 做一些统一处理
            conf.headers = {
              'X-Requested-With': 'XMLHttpRequest',
            };
            return conf;
          },
          onError: (error) => {
            return Promise.reject(error);
          },
        },
        response: {
          onConfig: (response) => {
            // 请求成功：可以做全局的 toast 展示，或者对 response 做一些格式化
            if (Number(response?.data?.code) !== 1) {
              message.error(response.data.msg);
            }
            return response;
          },
          onError: (error) => {
            // 请求出错：服务端返回错误状态码
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            return Promise.reject(error);
          },
        },
      },
    },
  ],
  logger: {
    // @ts-ignore
    smartLoglevel: true,
  },
};

runApp(appConfig);
