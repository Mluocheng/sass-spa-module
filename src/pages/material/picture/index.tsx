import PageLayout from 'components/layouts/pageLayout';
import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import { provideStore, useConnect } from '../model/index';
import css from './index.less';

export interface Props extends RouteComponentProps { }

const Picture: React.FC<Props> = React.memo<Props>(({ history, location: { pathname }}) => {
  const [store, dispatch] = useConnect();

  React.useEffect(() => {
  }, []);


  return (
    <PageLayout
      render={(minHeight) => {
        return (
          <div>
            333
          </div>
        );
      }}
    />

  );
});

Picture.defaultProps = {};

export default provideStore(Picture);
