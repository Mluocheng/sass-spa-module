import PageLayout from 'components/layouts/pageLayout';
import { StoreTag as TagStore, StoreTag } from 'api/interface/store/index';
import React from 'react';
import css from './index.less';

export interface Props { }

const StoreTag: React.FC<Props> = React.memo<Props>(() => {

  React.useEffect(() => {
  }, []);

  

  return (
    <PageLayout render={(minHeight) => {
      return (
        <div>888</div>
      );
    }}
    />
  );
});

StoreTag.defaultProps = {};

export default StoreTag;
