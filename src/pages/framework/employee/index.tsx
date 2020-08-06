import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'components/common/button';
import PageLayout from 'components/layouts/pageLayout';
import { Employee } from 'api/interface/employee';
import { provideStore, useConnect } from './model';
import css from './index.less';

export interface Props {}

const Employee: React.FC<Props> = React.memo<Props>(() => {
  const [store, dispatch] = useConnect();

  React.useEffect(() => {
  }, []);


  return (
    <PageLayout
      render={minHeight => {
        return (
          <div className={css.tableBox}>
            <Link to="/basic/framework/employee/insert">
              <Button type="primary">新增员工</Button>
            </Link>
          </div>
        );
      }}
    />
  );
});

Employee.defaultProps = {};

export default provideStore(Employee);
