import React from 'react';
import classNames from 'classnames';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RoleEnum } from 'api/interface/employee/enums';
import ROUTES, { Route as IRoute } from 'common/const/routes';
import Page404 from 'pages/errorPage/404';
import MainLayout from 'components/layouts/mainLayout';
import { provideStore, useConnect } from 'model';
import css from './index.less';

const Routers: React.FC = () => {

  const [isEntering, setIsEntering] = React.useState(false);
  const [{ user }, dispatch] = useConnect();

  React.useEffect(() => {
  }, []);

  function renderRoutes(list: IRoute[] = ROUTES) {

    return list.map(item => {
      // 未获取到用户角色信息，且只有管理员等进入的路由，暂不渲染
      if (!user && !item.roles.includes(RoleEnum.Admin)) return null;

      const props = {
        path: item.path,
        component: item.component,
        exact: true,
      };

      // 权限不通过，不渲染路由，以及其子路由
      if (item.roles && user && !item.roles.includes(user.job.role)) return null;

      // 有子节点
      if (item.children && item.children.length) {
        return [
          ...renderRoutes(item.children),
          <Route key={item.path} {...props} />
        ];
      }

      return (
        <Route key={item.path} {...props} />
      );
    });
  }

  return (
    <Router>
      <Route
        render={({ location }) => (
          <MainLayout>
            <TransitionGroup className={classNames(css.transitionGroup, { [css.entering]: isEntering })}>
              <CSSTransition enter exit
                key={location.pathname}
                timeout={300}
                onEntering={() => setIsEntering(true)}
                onEntered={() => setIsEntering(false)}
                classNames={{
                  enter: css.routeTransitionEnter,
                  enterActive: css.routeTransitionEnterActive,
                  exit: css.routeTransitionExit,
                  exitActive: css.routeTransitionExitActive,
                }}
              >
                <Switch location={location}>
                  {
                    !!ROUTES[0].children && !!ROUTES[0].children.length &&
                    <Route exact path={['/', '/basic']} render={() => <Redirect to="/basic/product/saleList" />} />
                  }
                  {renderRoutes()}
                  <Route component={Page404} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
          </MainLayout>
        )}
      />
    </Router>
  );
};

export default provideStore(Routers);
