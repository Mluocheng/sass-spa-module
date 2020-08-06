import css from './index.less';
import React from 'react';
import { Link } from 'react-router-dom';
// import Button from 'components/common/button';

const Page404: React.FunctionComponent = () => (
  <div className={css.container404}>
    <div className={css.left}>
      <div className={css.leftContent} >
        <img src="https://img.alicdn.com/imgextra/i4/4074958541/O1CN01Cy1lQG2CxpNlYFOqT_!!4074958541.png" alt="" />
      </div>
    </div>
  </div>
);

export default Page404;
