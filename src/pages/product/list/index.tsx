import PageLayout from 'components/layouts/pageLayout';
import { RouteComponentProps } from 'react-router';
import React from 'react';
// 自写
import { Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import css from './index.less';

const size = 10;

export interface Props extends RouteComponentProps, FormComponentProps {}
const { Item: FormItem, create: createFrom } = Form;

const List: React.FC<Props> = React.memo<Props>(({ location, form }) => {
  // 自写
  const { getFieldDecorator } = form;
  const { pathname } = location;

  /**
   * 初始化商品列表数据
   */
  React.useEffect(() => {
  }, []);


  return (
    <PageLayout
      render={minHeight => {
        return (
          <div className={css.tableBox}>
            111
          </div>
        );
      }}
    />
  );
});

List.defaultProps = {};

export default createFrom()(List);
