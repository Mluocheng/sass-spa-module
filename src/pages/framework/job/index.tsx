
import PageLayout from 'components/layouts/pageLayout';
import { Job } from 'api/interface/employee';
import Select from 'components/common/select';
import React from 'react';
import css from './index.less';

export interface Props {}

const { Option } = Select;

const Job: React.FC<Props> = React.memo<Props>(() => {

  React.useEffect(() => {
  }, []);


  return (
    <PageLayout render={(minHeight) => {
      return <div className={css.tableBox}>555</div>;
    }}
    />
  );
});

Job.defaultProps = {};

export default Job;

