import React from 'react';
import ReactDom from 'react-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Router from './router';
import './index.less';


console.log(React);
console.log('process.env.', process.env);
console.log('process.env.3333', process.env.NODE_ENV);
// console.log(ROLE_INFO);
ReactDom.render(
  <ConfigProvider locale={zhCN}>
    <Router />
  </ConfigProvider>,
  document.getElementById('root') as HTMLDivElement,
);
