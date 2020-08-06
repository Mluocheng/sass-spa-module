import React from 'react';
import PageLayout from 'components/layouts/pageLayout';
import { provideStore, useConnect } from './model';
import css from './index.less';

export interface Props {}

const StoreList: React.FC<Props> = React.memo<Props>(() => {
  const [store, dispatch] = useConnect();


  return (
    <PageLayout
      render={minHeight => {
        return (
          <div style={{ minHeight: minHeight }}>
          777
          </div>
        );
      }}
    />
  );
});

StoreList.defaultProps = {};

export default provideStore(StoreList);
