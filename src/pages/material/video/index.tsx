import PageLayout from 'components/layouts/pageLayout';
import { RouteComponentProps } from 'react-router-dom';
import React from 'react';
import { provideStore, useConnect } from '../model/index';
import css from './index.less';

export interface Props extends RouteComponentProps { }

const Picture: React.FC<Props> = React.memo<Props>(({ location: { pathname }}) => {

  const [store, dispatch] = useConnect();



  return (
    <PageLayout render={(minHeight) => {
      return (
        <div>
          444
        </div>
      );
    }}
    />
  );
});

Picture.defaultProps = {};

export default provideStore(Picture);

