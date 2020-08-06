import PageLayout from 'components/layouts/pageLayout';
import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import { provideStore, useConnect } from './model';
import css from './index.less';

export interface Props extends RouteComponentProps {

}

const Category: React.FC<Props> = ({
  location: { pathname }
}) => {
  const [store, dispatch] = useConnect();

  /* 初始化 分类列表数据 */
  React.useEffect(() => {
  }, []);

  return (
    <PageLayout render={(minHeight) => {
      return (
        <div className={css.content}>
          222
        </div>
      );
    }}
    />
  );
};

Category.defaultProps = {};

export default provideStore(Category);

